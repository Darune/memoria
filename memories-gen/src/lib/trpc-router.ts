import { z } from 'zod';
import { initTRPC } from '@trpc/server';
import { getAllClips, getAllMusics, archiveMemory, getAllMemories, getMemory, getWords } from "~/data/utils";
import generate from "~/generator/generate";
import { memoryTypeSchema } from "~/data/zod-schema";
import { MemoryType } from '~/data/model';
import { videoFileToWord, soundFileToWord } from '~/utils';

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
      return archiveMemory(finalMemory as MemoryType );
    }
  ),
  listMemories: t.procedure.query(() => {
    return {memories: getAllMemories()};
  }),
  getMemory: t.procedure.input(z.string()).query((opts) => {
    const { input } = opts;
    return getMemory(input);
  }),
  getWords: t.procedure.query(() => {
    const rowWords = getWords();
    return {
      soundWords: rowWords.soundWords.map(soundFileToWord),
      videoWords: rowWords.videoWords.map(videoFileToWord),
    }
  })
});
export type AppRouter = typeof appRouter;