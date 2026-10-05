import { getSequencePrefixes } from "#lib/server/db.js";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  return {
    sequencePrefixes: await getSequencePrefixes(),
  };
};
