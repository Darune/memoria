
export const MAX_DURATION_PER_CLIP_SECONDS = 23;
export const MIN_DURATION_PER_CLIP_SECONDS = 15;

export const EXPECTED_MEMORY_DURATION = 60;

// 0 to 1 probability
export const PROBA_TRY_TRANSITION = 0.3;
export const PROBA_CROSS_FADE = 0.2;
export const PROBA_TO_COLOR_AND_BACK = 0.2;
export const AVAILABLE_TRANSITIONS = [
  {
    'type': 'crossfade',
    'minDuration': 2,
    'maxDuration': 5,
    'proba': PROBA_CROSS_FADE,
  },
  {
    'type': 'to_color_and_back',
    'minDuration': 2,
    'maxDuration': 4,
    'proba': PROBA_TO_COLOR_AND_BACK,
  }
];

export default {
  MAX_DURATION_PER_CLIP_SECONDS,
  MIN_DURATION_PER_CLIP_SECONDS,
  EXPECTED_MEMORY_DURATION,
  PROBA_TRY_TRANSITION,
  PROBA_CROSS_FADE,
  AVAILABLE_TRANSITIONS,
}