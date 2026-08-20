import { getUserData } from "$lib/server/db";
import { type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get("session");
  if (session) {
    const user = await getUserData(session);
    if (user) {
      if (user.banned) {
        event.cookies.delete("session", { path: "/" });
      } else {
        event.locals.user = user;
      }
    } else {
      event.cookies.delete("session", { path: "/" });
    }
  }

  return await resolve(event);
};
