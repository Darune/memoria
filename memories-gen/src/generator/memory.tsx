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
    const clipStart = getRandomInt(Math.floor(clip.duration) - MAX_DURATION_PER_CLIP_SECONDS);
    const clipStop = clipStart + (
      MIN_DURATION_PER_CLIP_SECONDS + Math.min(
        getRandomInt(DURATION_DIFF)
      )
    );
    const memoryClip = new MemoryClip(
      clip, clipStart, clipStop
    );
    memory.pushClip(memoryClip);
  }
  return memory;
}
