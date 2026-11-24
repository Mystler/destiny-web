import * as v from "valibot";
import { command, form, query } from "$app/server";
import {
  createSequencePrefix,
  deleteSequencePrefix,
  getAllPlayers,
  getOnlineAvatars,
  setFanAgeLink,
} from "#lib/server/db.js";
import { execSync } from "node:child_process";

import { AGES_DIR, AGEUPLOAD_DIR, DIRTSAND_LOG_FILE, DIRTSAND_RESTART_COMMAND, SDL_DIR } from "$app/env/private";

import { copyFileSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, extname } from "node:path";
import { requireAdmin } from "#lib/server/authcheck.js";

export const getOnlineList = query.live(async function* () {
  requireAdmin();
  while (true) {
    yield await getOnlineAvatars();
    await new Promise((f) => setTimeout(f, 5000));
  }
});

export const getServerStatus = query.live(async function* () {
  requireAdmin();
  while (true) {
    try {
      const cmdOut = execSync("ps -C dirtsand -o comm,etime").toString();
      const match = cmdOut.match(/dirtsand\W+([\d:\-+]+)/);
      const online = match ? true : false;
      const uptime = match?.at(1);
      yield {
        online,
        uptime,
      };
    } catch {
      yield {
        online: false,
        uptime: undefined,
      };
    }
    await new Promise((f) => setTimeout(f, 5000));
  }
});

export const getServerLogs = query(async () => {
  requireAdmin();

  try {
    // Log file via .env
    const logs = [["Latest", readFileSync(DIRTSAND_LOG_FILE).toString("utf-8").trim()]];
    // Special hackery for pm2-logrotate variants here. Look away.
    const dir = dirname(DIRTSAND_LOG_FILE);
    const ext = extname(DIRTSAND_LOG_FILE);
    const base = basename(DIRTSAND_LOG_FILE, ext);
    for (const file of readdirSync(dir).reverse()) {
      if (file.startsWith(`${base}__`) && file.endsWith(ext)) {
        logs.push([file, readFileSync(`${dir}/${file}`).toString("utf-8").trim()]);
      }
    }
    return logs;
  } catch {
    return null;
  }
});

export const getPlayerList = query(async () => {
  requireAdmin();
  return await getAllPlayers();
});

export const viewAgeUpload = form(
  v.object({
    ageName: v.pipe(v.string(), v.nonEmpty()),
  }),
  async ({ ageName }) => {
    requireAdmin();

    // Get files
    let age, sdl, liveAge, liveSdl: string;
    try {
      age = readFileSync(`${AGEUPLOAD_DIR}/${ageName}.age`).toString("utf-8");
    } catch {
      age = "---";
    }
    try {
      sdl = readFileSync(`${AGEUPLOAD_DIR}/${ageName}.sdl`).toString("utf-8");
    } catch {
      sdl = "---";
    }
    try {
      liveAge = readFileSync(`${AGES_DIR}/${ageName}.age`).toString("utf-8");
    } catch {
      liveAge = "---";
    }
    try {
      liveSdl = readFileSync(`${SDL_DIR}/${ageName}.sdl`).toString("utf-8");
    } catch {
      liveSdl = "---";
    }

    return {
      ageName,
      age,
      sdl,
      liveAge,
      liveSdl,
    };
  },
);

export const copyAgeFile = command(v.string(), async (ageName) => {
  requireAdmin();
  copyFileSync(`${AGEUPLOAD_DIR}/${ageName}.age`, `${AGES_DIR}/${ageName}.age`);
});

export const copySdlFile = command(v.string(), async (ageName) => {
  requireAdmin();
  copyFileSync(`${AGEUPLOAD_DIR}/${ageName}.sdl`, `${SDL_DIR}/${ageName}.sdl`);
});

export const restartDirtsand = command(async () => {
  requireAdmin();
  console.log("Got command to restart dirtsand.");
  execSync(DIRTSAND_RESTART_COMMAND);
});

export const addSequencePrefix = form(
  v.object({
    seqPrefix: v.pipe(v.number(), v.integer("Sequence Prefix must be an integer!")),
    ageName: v.pipe(v.string(), v.nonEmpty("Missing age name!")),
  }),
  async ({ seqPrefix, ageName }) => {
    requireAdmin();
    if (!createSequencePrefix(seqPrefix, ageName))
      return { error: "Failed to add sequence prefix. This one may already exist." };
    return { success: "Age added." };
  },
);

export const removeSequencePrefix = form(
  v.object({
    seqPrefix: v.pipe(v.number(), v.integer("Sequence Prefix must be an integer!")),
  }),
  async ({ seqPrefix }) => {
    requireAdmin();
    if (!deleteSequencePrefix(seqPrefix)) return { error: "Failed to remove sequence prefix." };
    return { success: "Age removed." };
  },
);

export const updateFanAgeLink = form(
  v.object({
    seqPrefix: v.pipe(v.number(), v.integer("Sequence Prefix must be an integer!")),
    link: v.union([v.literal(""), v.pipe(v.string(), v.url("Not a valid URL!"))]),
  }),
  async ({ seqPrefix, link }) => {
    requireAdmin();
    if (!setFanAgeLink(seqPrefix, link)) return { error: "Failed to change URL." };
    return { success: "URL set." };
  },
);
