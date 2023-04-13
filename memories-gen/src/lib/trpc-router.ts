import { initTRPC } from '@trpc/server';
import { getAllClips, getAllMusics } from "~/data/utils";
import generate from "~/generator/generate";

const t = initTRPC.create();

export const appRouter = t.router({
  generateNewMemory: t.procedure.query(async () => {
    const dbClips = await getAllClips();
    const dbMusics = await getAllMusics();
    console.log(dbClips, dbMusics);
    return generate(dbClips, dbMusics);
  }),

});
export type AppRouter = typeof appRouter;