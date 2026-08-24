import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getServerStats } from "$lib/server/db";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user?.admin) return error(401, "Unauthorized");

  return {
    stats: await getServerStats(),
  };
};
