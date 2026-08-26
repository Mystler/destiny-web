import postgres from "postgres";
import { building } from "$app/env";
import { hash, randomBytes } from "node:crypto";
import { DATABASE_DB, DATABASE_HOST, DATABASE_PASSWORD, DATABASE_USER } from "$env/static/private";

let sql: postgres.Sql | undefined;

if (!building) {
  sql = postgres({
    host: DATABASE_HOST,
    user: DATABASE_USER,
    pass: DATABASE_PASSWORD,
    database: DATABASE_DB,
  });
}

function generateToken() {
  return randomBytes(16).toString("base64url");
}

/**
 * Register a new user.
 */
export async function createUser(user: string, email: string, password: string): Promise<boolean> {
  if (!sql) return false;
  password = hash("sha1", password);
  try {
    await sql.begin((sql) => [
      sql`INSERT INTO web."Accounts" ("name", "email") VALUES (${user}, ${email})`,
      sql`INSERT INTO auth."Accounts" ("AcctUuid", "PassHash", "Login", "AcctFlags", "BillingType")
          VALUES (uuid_generate_v4(), ${password}, ${user.toLowerCase()}, '0', '1')`,
    ]);
  } catch {
    return false;
  }
  return true;
}

/**
 * Login a user.
 * Returns session token on success, "BANNED" if the user is banned, and null otherwise.
 */
export async function loginUser(user: string, password: string): Promise<string | null> {
  if (!sql) return null;
  password = hash("sha1", password);
  const acc = await sql`SELECT w."id", w."session_token", a."AcctFlags"
        FROM web."Accounts" w JOIN auth."Accounts" a ON lower(w."name") = lower(a."Login")
        WHERE lower(a."Login") = ${user.toLowerCase()} AND a."PassHash" = ${password}`;
  if (!acc[0]) return null;
  // Special handling if the user is banned.
  if (acc[0].AcctFlags & 0x10000) return "BANNED";
  // Login valid, now either grab the existing session or generate a new one.
  if (acc[0].session_token) return acc[0].session_token;
  const token = generateToken();
  await sql`UPDATE web."Accounts" SET "session_token" = ${token} WHERE "id" = ${acc[0].id}`;
  return token;
}

export async function logoutUser(id: number): Promise<boolean> {
  if (!sql) return false;
  await sql`UPDATE web."Accounts" SET "session_token" = NULL WHERE "id" = ${id}`;
  return true;
}

export interface User {
  username: string;
  email: string;
  webId: number;
  authId: number;
  admin: boolean;
  banned: boolean;
}
/**
 * Return some profile info for the session.
 */
export async function getUserData(session: string): Promise<User | null> {
  if (!sql) return null;
  const user = await sql`SELECT w."name", w."email", w."id", a."idx", a."AcctFlags" FROM web."Accounts" w
      JOIN auth."Accounts" a ON lower(w."name") = lower(a."Login")
      WHERE "session_token" = ${session}`;
  if (user[0]) {
    return {
      username: user[0].name,
      email: user[0].email,
      webId: user[0].id,
      authId: user[0].idx,
      admin: user[0].AcctFlags & 0x1 ? true : false,
      banned: user[0].AcctFlags & 0x10000 ? true : false,
    };
  }
  return null;
}

/**
 * Initiate forgotten password for e-mail.
 * Returns token for the new password e-mail.
 */
export async function forgotPasswordToken(email: string): Promise<string | null> {
  if (!sql) return null;
  const user = await sql`SELECT * FROM web."Accounts" WHERE lower("email") = ${email.toLowerCase()}`;
  if (user[0]) {
    const verify_token = generateToken();
    await sql`UPDATE web."Accounts" SET "verify_token" = ${verify_token} WHERE "id" = ${user[0].id}`;
    return verify_token;
  }
  return null;
}

/**
 * Check if the given token exists for resetting a password.
 */
export async function forgotPasswordTokenCheck(token: string): Promise<boolean> {
  if (!sql) return false;
  const user = await sql`SELECT * FROM web."Accounts" WHERE "verify_token" = ${token}`;
  if (user[0]) return true;
  return false;
}

/**
 * Update the password by token.
 * Returns whether the operation was a success.
 */
export async function resetPassword(token: string, password: string): Promise<boolean> {
  if (!sql) return false;
  const user = await sql`SELECT * FROM web."Accounts" WHERE "verify_token" = ${token}`;
  if (user[0]) {
    password = hash("sha1", password);
    await sql.begin((sql) => [
      sql`UPDATE web."Accounts" SET "verify_token" = NULL AND "session_token" = NULL WHERE "id" = ${user[0].id}`,
      sql`UPDATE auth."Accounts" SET "PassHash" = ${password} WHERE "Login" = ${user[0].name.toLowerCase()}`,
    ]);
    return true;
  }
  return false;
}

/**
 * Regular password change for the given user id.
 * Returns a new session token for the user on success.
 */
export async function changePassword(id: number, old_password: string, new_password: string): Promise<string | null> {
  if (!sql) return null;
  const user = await sql`SELECT w."id", a."idx" FROM web."Accounts" w
      JOIN auth."Accounts" a ON lower(a."Login") = lower(w."name")
      WHERE w."id" = ${id} AND a."PassHash" = ${hash("sha1", old_password)}`;
  if (!user[0]) return null;
  new_password = hash("sha1", new_password);
  const new_session = generateToken();
  await sql`UPDATE auth."Accounts" SET "PassHash" = ${new_password} WHERE "idx" = ${user[0].idx}`;
  await sql`UPDATE web."Accounts" SET "session_token" = ${new_session} WHERE "id" = ${user[0].id}`;
  return new_session;
}

/**
 * Regular email change for the given user id.
 */
export async function changeEmail(id: number, password: string, email: string): Promise<boolean> {
  if (!sql) return false;
  const user = await sql`SELECT w."id", a."idx" FROM web."Accounts" w
      JOIN auth."Accounts" a ON lower(a."Login") = lower(w."name")
      WHERE w."id" = ${id} AND a."PassHash" = ${hash("sha1", password)}`;
  if (user[0]) {
    try {
      await sql`UPDATE web."Accounts" SET "email" = ${email} WHERE "id" = ${user[0].id}`;
    } catch {
      return false;
    }
    return true;
  }
  return false;
}

export async function getUserAvatars(authId: number) {
  if (!sql) return null;
  return await sql<
    {
      PlayerIdx: number;
      PlayerName: string;
      Online: boolean;
      Location: string;
    }[]
  >`SELECT p."PlayerIdx", p."PlayerName", n."Int32_1" as "Online", n."String64_1" as "Location"
      FROM auth."Players" p
      JOIN auth."Accounts" a ON a."AcctUuid" = p."AcctUuid"
      LEFT JOIN vault."Nodes" n ON n."NodeType" = 23 AND n."Uint32_1" = p."PlayerIdx"
      WHERE a."idx" = ${authId}`;
}

export async function getAllPlayers() {
  if (!sql) return null;
  return await sql<
    {
      PlayerIdx: number;
      PlayerName: string;
      Online: boolean;
      Location: string;
      UserName: string;
    }[]
  >`SELECT p."PlayerIdx", p."PlayerName", n."Int32_1" as "Online", n."String64_1" as "Location", wa."name" as "UserName"
      FROM auth."Players" p
      JOIN auth."Accounts" a ON a."AcctUuid" = p."AcctUuid"
      LEFT JOIN web."Accounts" wa ON lower(wa."name") = lower(a."Login")
      LEFT JOIN vault."Nodes" n ON n."NodeType" = 23 AND n."Uint32_1" = p."PlayerIdx"
      ORDER BY "Online" DESC, p."PlayerName"`;
}

export async function getOnlineAvatars() {
  if (!sql) return null;
  return await sql<
    {
      PlayerIdx: number;
      PlayerName: string;
      Location: string;
    }[]
  >`SELECT "Uint32_1" as "PlayerIdx", "IString64_1" as "PlayerName", "String64_1" as "Location"
      FROM vault."Nodes" WHERE "NodeType" = 23 and "Int32_1" = 1`;
}

export async function getServerStats() {
  if (!sql) return null;
  const accounts: number = (await sql`SELECT COUNT(*) AS "Accounts" FROM auth."Accounts"`)[0].Accounts;
  const players: number = (await sql`SELECT COUNT(*) AS "Players" FROM auth."Players"`)[0].Players;
  return {
    accounts,
    players,
  };
}

export async function getSequencePrefixes() {
  if (!sql) return null;
  return await sql<
    {
      seqPrefix: number;
      age: string;
    }[]
  >`SELECT * FROM web."SequencePrefixes" ORDER BY "seqPrefix" ASC`;
}

export async function createSequencePrefix(prefix: number, age: string) {
  if (!sql) return false;
  try {
    await sql`INSERT INTO web."SequencePrefixes" VALUES (${prefix}, ${age})`;
  } catch {
    return false;
  }
  return true;
}

export async function deleteSequencePrefix(prefix: number) {
  if (!sql) return false;
  try {
    await sql`DELETE FROM web."SequencePrefixes" WHERE "seqPrefix" = ${prefix}`;
  } catch {
    return false;
  }
  return true;
}
