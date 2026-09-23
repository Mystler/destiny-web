import * as v from "valibot";
import { command, form, getRequestEvent, query } from "$app/server";
import { createSequencePrefix, deleteSequencePrefix, getAllPlayers, getOnlineAvatars } from "$lib/server/db";
import { error } from "@sveltejs/kit";
import { execSync } from "node:child_process";
import { AGES_DIR, AGEUPLOAD_DIR, DIRTSAND_LOG_FILE, DIRTSAND_RESTART_COMMAND, SDL_DIR } from "$env/static/private";
import { copyFileSync, readFileSync } from "node:fs";

export const getOnlineList = query.live(async function* () {
  const event = getRequestEvent();
  if (!event.locals.user?.admin) return error(401, "Unauthorized");
  while (true) {
    yield await getOnlineAvatars();
    await new Promise((f) => setTimeout(f, 5000));
  }
});

export const getServerStatus = query.live(async function* () {
  const event = getRequestEvent();
  if (!event.locals.user?.admin) return error(401, "Unauthorized");
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

export const getServerLog = query(async () => {
  const event = getRequestEvent();
  if (!event.locals.user?.admin) return error(401, "Unauthorized");

  try {
    const log = readFileSync(DIRTSAND_LOG_FILE).toString("utf-8").trim();
    return log;
  } catch {
    return null;
  }
});

export const getPlayerList = query(async () => {
  const event = getRequestEvent();
  if (!event.locals.user?.admin) return error(401, "Unauthorized");
  return await getAllPlayers();
});

export const viewAgeUpload = form(
  v.object({
    ageName: v.pipe(v.string(), v.nonEmpty()),
  }),
  async ({ ageName }) => {
    const event = getRequestEvent();
    if (!event.locals.user?.admin) return error(401, "Unauthorized");

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
  const event = getRequestEvent();
  if (!event.locals.user?.admin) return error(401, "Unauthorized");

  copyFileSync(`${AGEUPLOAD_DIR}/${ageName}.age`, `${AGES_DIR}/${ageName}.age`);
});

export const copySdlFile = command(v.string(), async (ageName) => {
  const event = getRequestEvent();
  if (!event.locals.user?.admin) return error(401, "Unauthorized");

  copyFileSync(`${AGEUPLOAD_DIR}/${ageName}.sdl`, `${SDL_DIR}/${ageName}.sdl`);
});

export const restartDirtsand = command(async () => {
  const event = getRequestEvent();
  if (!event.locals.user?.admin) return error(401, "Unauthorized");

  console.log("Got command to restart dirtsand.");
  execSync(DIRTSAND_RESTART_COMMAND);
});

export const addSequencePrefix = form(
  v.object({
    seqPrefix: v.pipe(v.number(), v.integer("Sequence Prefix must be an integer!")),
    ageName: v.pipe(v.string(), v.nonEmpty("Missing age name!")),
  }),
  async ({ seqPrefix, ageName }) => {
    const event = getRequestEvent();
    if (!event.locals.user?.admin) return error(401, "Unauthorized");

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
    const event = getRequestEvent();
    if (!event.locals.user?.admin) return error(401, "Unauthorized");

    if (!deleteSequencePrefix(seqPrefix)) return { error: "Failed to remove sequence prefix." };
    return { success: "Age removed." };
  },
);
