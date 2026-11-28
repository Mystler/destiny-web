import { form } from "$app/server";
import { AGES_DIR, AGEUPLOAD_DIR, MAIL_ADMIN, MAIL_TEST_MODE, SDL_DIR } from "$app/env/private";
import { sendMail } from "#lib/server/mailer.js";
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import * as v from "valibot";
import { requireLogin } from "#lib/server/authcheck.js";

export const uploadAge = form(
  v.object({
    agefile: v.pipe(
      v.file(),
      v.maxSize(100_000, "Age file too large!"),
      v.check((x) => !x.name.includes('"'), "WTF!?"),
    ),
    sdlfile: v.optional(
      v.pipe(
        v.file(),
        v.maxSize(100_000, "SDL file too large!"),
        v.check((x) => !x.name.includes('"'), "WTF!?"),
      ),
    ),
    dlLink: v.optional(v.union([v.literal(""), v.pipe(v.string(), v.url("Not a valid URL!"))])),
  }),
  async ({ agefile, sdlfile, dlLink }) => {
    const user = requireLogin();

    // Store files
    writeFileSync(`${AGEUPLOAD_DIR}/${agefile.name}`, Buffer.from(await agefile.arrayBuffer()));
    if (sdlfile && sdlfile.name)
      writeFileSync(`${AGEUPLOAD_DIR}/${sdlfile.name}`, Buffer.from(await sdlfile.arrayBuffer()));

    // Send mail to admin
    let diffAge: string;
    try {
      // HAX time: Git diff returns a non-zero exit code on changes, so our actual diff output will be in the catch block
      // Reroute error into stdout
      diffAge =
        execSync(`git diff --no-index "${AGES_DIR}/${agefile.name}" "${AGEUPLOAD_DIR}/${agefile.name}" 2>&1`)
          .toString()
          .trim() || "No changes in .age";
    } catch (error) {
      diffAge = (error as { stdout: Buffer | string }).stdout.toString();
    }
    let diffSdl: string;
    try {
      diffSdl =
        sdlfile && sdlfile.name
          ? execSync(`git diff --no-index "${SDL_DIR}/${sdlfile.name}" "${AGEUPLOAD_DIR}/${sdlfile.name}" 2>&1`)
              .toString()
              .trim() || "No changes in .sdl"
          : "";
    } catch (error) {
      diffSdl = (error as { stdout: Buffer | string }).stdout.toString();
    }
    const message =
      `${user.username} (${user.email}) uploaded ${agefile.name} with ${sdlfile?.name || "no SDL"}.\n\n` +
      `${dlLink ? dlLink : "No download link provided"}\n\n${diffAge}\n\n${diffSdl}`;
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
