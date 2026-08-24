import { form, getRequestEvent } from "$app/server";
import { AGES_DIR, AGEUPLOAD_DIR, MAIL_ADMIN, MAIL_TEST_MODE, SDL_DIR } from "$env/static/private";
import { sendMail } from "$lib/server/mailer";
import { error } from "@sveltejs/kit";
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import * as v from "valibot";

export const uploadAge = form(
  v.object({
    agefile: v.pipe(v.file(), v.maxSize(100_000, "Age file too large!")),
    sdlfile: v.optional(v.pipe(v.file(), v.maxSize(100_000, "SDL file too large!"))),
  }),
  async ({ agefile, sdlfile }) => {
    const { locals } = getRequestEvent();
    if (!locals.user) return error(401, "Unauthorized");

    // Store files
    writeFileSync(`${AGEUPLOAD_DIR}/${agefile.name}`, Buffer.from(await agefile.arrayBuffer()));
    if (sdlfile && sdlfile.name)
      writeFileSync(`${AGEUPLOAD_DIR}/${sdlfile.name}`, Buffer.from(await sdlfile.arrayBuffer()));

    // Send mail to admin
    let diffAge: string;
    try {
      diffAge =
        execSync(`git diff --no-index "${AGES_DIR}/${agefile.name}" "${AGEUPLOAD_DIR}/${agefile.name}" 2>&1`)
          .toString()
          .trim() || "No changes in .age";
    } catch {
      diffAge = "Coudln't diff .age, probably not on server.";
    }
    let diffSdl: string;
    try {
      diffSdl =
        sdlfile && sdlfile.name
          ? execSync(`git diff --no-index "${SDL_DIR}/${sdlfile.name}" "${AGEUPLOAD_DIR}/${sdlfile.name}" 2>&1`)
              .toString()
              .trim() || "No changes in .sdl, probably not on server."
          : "";
    } catch {
      diffSdl = "Couldn't diff .sdl";
    }
    const message = `${locals.user.username} (${locals.user.email}) uploaded ${agefile.name} with ${sdlfile?.name || "no SDL"}.\n\n${diffAge}\n\n${diffSdl}`;
    if (MAIL_TEST_MODE === "true") {
      console.log(message);
    } else {
      sendMail(MAIL_ADMIN, "[DestinyURU] Age Uploaded", message);
    }

    return {
      success: "Thanks! Your files have been uploaded and your submission will be manually reviewed now.",
    };
  },
);
