import type { Handle } from "@sveltejs/kit/hooks";
import { getUserData } from "#lib/server/db.js";

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get("session");
  if (session) {
    const user = await getUserData(session);
    if (!user || user.banned) {
      event.cookies.delete("session", { path: "/" });
      event.locals.user = undefined;
    } else {
      event.locals.user = user;
    }
  }

  return await resolve(event);
};
