import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { resolve } from "$app/paths";
import { writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { sendMail } from "$lib/server/mailer";
import { AGES_DIR, AGEUPLOAD_DIR, MAIL_ADMIN, MAIL_TEST_MODE, SDL_DIR } from "$env/static/private";

export const actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) return redirect(303, resolve("/login"));

    const data = await request.formData();
    const agefile = data.get("agefile") as File;
    const sdlfile = data.get("sdlfile") as File;
    if (!agefile || !agefile.name) {
      return fail(400, {
        error: "Missing age file!",
      });
    }

    if (agefile.size > 100_000) {
      return fail(400, {
        error: "Your Age file is too big!",
      });
    }
    if (sdlfile && sdlfile.name && sdlfile.size > 100_000) {
      return fail(400, {
        error: "Your SDL file is too big!",
      });
    }

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
      diffSdl = sdlfile.name
        ? execSync(`git diff --no-index "${SDL_DIR}/${sdlfile.name}" "${AGEUPLOAD_DIR}/${sdlfile.name}" 2>&1`)
            .toString()
            .trim() || "No changes in .sdl, probably not on server."
        : "";
    } catch {
      diffSdl = "Couldn't diff .sdl";
    }
    const message = `${locals.user.username} (${locals.user.email}) uploaded ${agefile.name} with ${sdlfile.name || "no SDL"}.\n\n${diffAge}\n\n${diffSdl}`;
    if (MAIL_TEST_MODE === "true") {
      console.log(message);
    } else {
      sendMail(MAIL_ADMIN, "[DestinyURU] Age Uploaded", message);
    }

    return {
      success: "Thanks! Your files have been uploaded and your submission will be manually reviewed now.",
    };
  },
} satisfies Actions;
