import { Clip, MemoryClip, Memory, MemoryClipTransitionType } from "~/data/model";
import { getRandomInt } from '~/data/utils';
import  genSettings from "./settings";


const DURATION_DIFF = genSettings.MAX_DURATION_PER_CLIP_SECONDS - genSettings.MIN_DURATION_PER_CLIP_SECONDS


function rollDice() {
  return getRandomInt(1000) / 1000;
}

function isRandomlyElected(proba : number) {
  return rollDice() <= proba;
}

function tryFindTransition(currentDuration: number) : MemoryClipTransitionType | undefined {
  if (isRandomlyElected(genSettings.PROBA_TRY_TRANSITION)) {
    for (const transition of genSettings.AVAILABLE_TRANSITIONS) {
      if (isRandomlyElected(transition.proba)) {
        let duration = transition.minDuration + getRandomInt(transition.maxDuration - transition.minDuration);
        let start = currentDuration - duration;
        if (start < 0) {
          start = 0;
          duration *= 2;  // cancel out the / 2 in this case (start transition)
        }
        return {
          type: transition.type,
          start: start,
          stop: currentDuration,
          duration: duration,
        } as MemoryClipTransitionType
      }
    }
  }
}

function isOver(currentDuration: number, expectedDurationS: number) {
  return currentDuration >= (expectedDurationS - 5);
}

export default function generate(
  availableClips: Array<Clip>, expectedDurationS: number = genSettings.EXPECTED_MEMORY_DURATION,
): Memory {

  const memory = new Memory();
  while (!isOver(memory.duration, expectedDurationS)) {
    const randomClipIdx = getRandomInt(availableClips.length);
    const clip = availableClips[randomClipIdx];
    const clipStart = Math.round(getRandomInt(
      (Math.floor(clip.duration) - genSettings.MIN_DURATION_PER_CLIP_SECONDS)
    ));
    const clipStop = clipStart + (
      genSettings.MIN_DURATION_PER_CLIP_SECONDS + Math.min(
        getRandomInt(DURATION_DIFF),
        clip.duration - genSettings.MIN_DURATION_PER_CLIP_SECONDS
      )
    );
    const memoryClip = new MemoryClip(clip, clipStart, clipStop);
    const endClipDuration = memory.duration + memoryClip.duration
    let possibleTransition = tryFindTransition(endClipDuration)
    if (!isOver(endClipDuration, expectedDurationS)) {
      memoryClip.addTransition(possibleTransition)
    }
    if (memory.canAdd(memoryClip)) {
      memory.pushClip(memoryClip);
    }
  }
  return memory;
}
