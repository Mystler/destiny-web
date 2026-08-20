import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = (event) => {
  return {
    loggedIn: event.locals.user?.username,
  };
};
