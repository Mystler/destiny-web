import * as v from "valibot";
import { command, form, getRequestEvent, query } from "$app/server";
import { getAllPlayers, getOnlineAvatars } from "$lib/server/db";
import { error } from "@sveltejs/kit";
import { execSync } from "node:child_process";
import { AGES_DIR, AGEUPLOAD_DIR, DIRTSAND_RESTART_COMMAND, SDL_DIR } from "$env/static/private";
import { copyFileSync, readFileSync } from "node:fs";

export const getOnlineList = query.live(async function* () {
  const event = getRequestEvent();
  if (!event.locals.user?.admin) return error(401, "Unauthorized");
  while (true) {
    yield await getOnlineAvatars();
    await new Promise((f) => setTimeout(f, 5000));
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

    // Get diffs
    let diffAge: string;
    try {
      // HAX time: Git diff returns a non-zero exit code on changes, so our actual diff output will be in the catch block
      // Reroute error into stdout
      diffAge =
        execSync(`git diff --no-index "${AGES_DIR}/${ageName}.age" "${AGEUPLOAD_DIR}/${ageName}.age" 2>&1`)
          .toString()
          .trim() || "No changes in .age";
    } catch (error) {
      diffAge = (error as { stdout: Buffer | string }).stdout.toString();
    }
    let diffSdl: string;
    try {
      diffSdl =
        execSync(`git diff --no-index "${SDL_DIR}/${ageName}.sdl" "${AGEUPLOAD_DIR}/${ageName}.sdl" 2>&1`)
          .toString()
          .trim() || "No changes in .sdl";
    } catch (error) {
      diffSdl = (error as { stdout: Buffer | string }).stdout.toString();
    }

    // Get file components
    let age: string;
    let sdl: string;
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

    return {
      ageName,
      diffAge,
      diffSdl,
      age,
      sdl,
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
