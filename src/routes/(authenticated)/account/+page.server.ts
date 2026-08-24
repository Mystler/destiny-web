import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) return;
  return {
    email: event.locals.user.email,
    admin: event.locals.user.admin,
  };
};
