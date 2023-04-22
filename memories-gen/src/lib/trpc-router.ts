import { initTRPC } from '@trpc/server';
import { getAllClips, getAllMusics, archiveMemory } from "~/data/utils";
import generate from "~/generator/generate";
import { memoryTypeSchema } from "~/data/zod-schema";

const t = initTRPC.create();

export const appRouter = t.router({
  generateNewMemory: t.procedure.query(() => {
    const dbClips = getAllClips();
    const dbMusics = getAllMusics();
    return generate(dbClips, dbMusics);
  }),
  archiveMemory: t.procedure.input(memoryTypeSchema).mutation(
    (opts) => {
      const { input: finalMemory } = opts
      console.log(archiveMemory(finalMemory));
    }
  ),
});
export type AppRouter = typeof appRouter;