import { forgotPasswordTokenCheck } from "$lib/server/db";
import { error, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ params }) => {
  if (params.token && (await forgotPasswordTokenCheck(params.token))) {
    return;
  }
  error(404, { message: "Invalid token!" });
};
