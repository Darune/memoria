
export const MAX_DURATION_PER_CLIP_SECONDS = 23;
export const MIN_DURATION_PER_CLIP_SECONDS = 15;

export const EXPECTED_MEMORY_DURATION = 60;

// 0 to 1 probability
export const PROBA_TRY_TRANSITION = 0.3;
export const PROBA_CROSS_FADE =  0.2;
export const PROBA_TO_COLOR_AND_BACK = 0;
export const AVAILABLE_TRANSITIONS = [
  {
    'type': 'crossfade',
    'minDuration': 2,
    'maxDuration': 5,
    'proba': PROBA_CROSS_FADE,
  },
  {
    'type': 'to_color_and_back',
    'minDuration': 1,
    'maxDuration': 2,
    'proba': PROBA_TO_COLOR_AND_BACK,
  }
];

export const PROBA_MEMORY_FADE_IN = 0.7;
export const PROBA_MEMORY_FADE_OUT = 0.7;
export const PROBA_FADE_FLASH_TO_NORM = 0.4
export const PROBA_FADE_NORM_TO_FLASH = 0.1
export const PROBA_FADE_BLACK_TO_NORM = 0.4
export const PROBA_FADE_NORM_TO_BLACK = 0.1

export const AVAILABLE_FADE_INS = [
  {
    type: 'fade_flash_to_norm',
    minDuration: 2,
    maxDuration: 4,
    proba: PROBA_FADE_FLASH_TO_NORM,
  },
  {
    type: 'fade_black_to_norm',
    minDuration: 1,
    maxDuration: 2,
    proba: PROBA_FADE_BLACK_TO_NORM,
  },

]

export const AVAILABLE_FADE_OUTS = [
  {
    type: 'fade_norm_to_black',
    minDuration: 2,
    maxDuration: 4,
    proba: PROBA_FADE_NORM_TO_BLACK,
  },
  {
    type: 'fade_norm_to_flash',
    minDuration: 2,
    maxDuration: 4,
    proba: PROBA_FADE_NORM_TO_FLASH,
  },
]

export default {
  MAX_DURATION_PER_CLIP_SECONDS,
  MIN_DURATION_PER_CLIP_SECONDS,
  EXPECTED_MEMORY_DURATION,
  PROBA_TRY_TRANSITION,
  PROBA_CROSS_FADE,
  AVAILABLE_TRANSITIONS,
  PROBA_MEMORY_FADE_IN,
  PROBA_MEMORY_FADE_OUT,
  AVAILABLE_FADE_INS,
  AVAILABLE_FADE_OUTS,
  PROBA_FADE_FLASH_TO_NORM,
  PROBA_FADE_NORM_TO_FLASH,
  PROBA_FADE_BLACK_TO_NORM,
  PROBA_FADE_NORM_TO_BLACK,
}