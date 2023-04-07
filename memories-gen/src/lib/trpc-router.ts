import { initTRPC } from '@trpc/server';
import { getAllClips } from "~/data/utils";
import generate from "~/generator/memory";

const t = initTRPC.create();

export const appRouter = t.router({
  generateNewMemory: t.procedure.query(async () => {
    const dbClips = await getAllClips();
    return generate(dbClips);
  }),

});
export type AppRouter = typeof appRouter;