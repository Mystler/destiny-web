import { resolve } from "$app/paths";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { logoutUser } from "$lib/server/db";

export const GET: RequestHandler = ({ cookies, locals }) => {
  if (locals.user) logoutUser(locals.user.webId);
  cookies.delete("session", { path: "/" });
  locals.user = undefined;
  redirect(303, resolve("/"));
};
