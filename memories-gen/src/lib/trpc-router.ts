import { initTRPC } from '@trpc/server';
import { getAllClips, getAllMusics } from "~/data/utils";
import generate from "~/generator/generate";

const t = initTRPC.create();

export const appRouter = t.router({
  generateNewMemory: t.procedure.query(() => {
    const dbClips = getAllClips();
    const dbMusics = getAllMusics();
    return generate(dbClips, dbMusics);
  }),

});
export type AppRouter = typeof appRouter;