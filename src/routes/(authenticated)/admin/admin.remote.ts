import { getRequestEvent, query } from "$app/server";
import { getOnlineAvatars } from "$lib/server/db";
import { error } from "@sveltejs/kit";

export const getOnlineList = query.live(async function* () {
  const event = getRequestEvent();
  if (!event.locals.user?.admin) return error(401, "Unauthorized");
  while (true) {
    yield await getOnlineAvatars();
    await new Promise((f) => setTimeout(f, 5000));
  }
});
