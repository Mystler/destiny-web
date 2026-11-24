import { getRequestEvent } from "$app/server";
import { error } from "@sveltejs/kit";

export function requireLogin() {
  const { locals } = getRequestEvent();
  if (!locals.user) error(401, "Unauthorized");
  return locals.user;
}

export function requireAdmin() {
  const { locals } = getRequestEvent();
  if (!locals.user || !locals.user.admin) error(401, "Unauthorized");
  return locals.user;
}
