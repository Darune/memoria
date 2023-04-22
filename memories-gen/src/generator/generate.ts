import {
  Clip, MemoryClip, Memory, MemoryClipTransitionType, EffectType, Audio
} from "~/data/model";
import { getRandomInt } from '~/data/utils';
import  genSettings, { AVAILABLE_FADE_INS, AVAILABLE_FADE_OUTS } from "./generation-settings";


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

function tryFindFade(
  currentDuration: number, fade_proba: number, fades
) : EffectType | undefined {
  if (isRandomlyElected(fade_proba)) {
    for (const fade of fades) {
      if (isRandomlyElected(fade.proba)) {
        let duration = fade.minDuration + getRandomInt(fade.maxDuration - fade.minDuration);
        let start = currentDuration - duration;
        if (currentDuration == 0) {
          start = 0;
        }
        let stop = start + duration;
        return {
          type: fade.type,
          start,
          stop,
          duration
        } as EffectType
      }
    }
  }
}

function isOver(currentDuration: number, expectedDurationS: number) {
  return currentDuration >= (expectedDurationS - 5);
}

export default function generate(
  availableClips: Array<Clip>, availableMusics: Array<Audio>,
  expectedDurationS: number = genSettings.EXPECTED_MEMORY_DURATION,
): Memory {

  const memory = new Memory();
  let previousClip = null;
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
    if (memory.canAdd(memoryClip)) {
      if (!previousClip || !previousClip.transition) {
        let possibleTransition = tryFindTransition(endClipDuration)
        if (!isOver(endClipDuration, expectedDurationS)) {
          memoryClip.addTransition(possibleTransition)
        }
      }
      previousClip = memoryClip
      memory.pushClip(memoryClip);
    }
    const fadeIn = tryFindFade(0, genSettings.PROBA_MEMORY_FADE_IN, AVAILABLE_FADE_INS)
    const fadeOut = tryFindFade(memory.duration, genSettings.PROBA_MEMORY_FADE_OUT, AVAILABLE_FADE_OUTS)
    memory.setFadeIn(fadeIn);
    memory.setFadeOut(fadeOut)
  }
  const audioIdx = getRandomInt(availableMusics.length);
  memory.setAudio(availableMusics[audioIdx]);
  memory.setThumbnailTime(getRandomInt(memory.duration));
  return memory;
}
