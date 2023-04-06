import { Clip, MemoryClip, Memory } from "~/data/model";
import { getRandomInt } from '~/data/utils';
import { MAX_DURATION_PER_CLIP_SECONDS, MIN_DURATION_PER_CLIP_SECONDS, EXPECTED_MEMORY_DURATION } from "./settings";


const DURATION_DIFF = MAX_DURATION_PER_CLIP_SECONDS - MIN_DURATION_PER_CLIP_SECONDS

export default function generate(
  availableClips: Array<Clip>, expectedDurationS: number = EXPECTED_MEMORY_DURATION,
): Memory {

  const memory = new Memory();
  while (memory.duration < (expectedDurationS - 5)) {
    const randomClipIdx = getRandomInt(availableClips.length);
    const clip = availableClips[randomClipIdx];
    const nbBucket = Math.floor(clip.duration / 7);
    const clipStart = Math.round(getRandomInt(
      (Math.floor(clip.duration) - MIN_DURATION_PER_CLIP_SECONDS) / nbBucket
    ) * (clip.duration / nbBucket));
    const clipStop = clipStart + (
      MIN_DURATION_PER_CLIP_SECONDS + Math.min(
        getRandomInt(DURATION_DIFF),
        clip.duration - MIN_DURATION_PER_CLIP_SECONDS
      )
    );
    const memoryClip = new MemoryClip(
      clip, clipStart, clipStop
    );
    // if (memory.canAdd(memoryClip)) {
    memory.pushClip(memoryClip);
    // }

  }
  return memory;
}
