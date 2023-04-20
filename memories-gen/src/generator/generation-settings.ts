
// temps maximum de clip
export const MAX_DURATION_PER_CLIP_SECONDS = 13;
// temps maximum de clip
export const MIN_DURATION_PER_CLIP_SECONDS = 10;

// duree attendu d'un spectre
export const EXPECTED_MEMORY_DURATION = 60;

// 0 to 1 probability
// Definition des probalite
// Chanque probalite est entre 0 et 1
// 1 represente 100% et 0 0%

export const PROBA_TRY_TRANSITION = 0.4; // chance de tentative de transition 40%
// chance de tentative de transition de type cross fade 40%
// combinason: 40% x 40% ~ 16%
export const PROBA_CROSS_FADE =  0.4;
// chance de trancition de transition de type cross fade vers noir 0%
export const PROBA_TO_COLOR_AND_BACK = 0;
// chance de tenative de fondu au debut de spectre 70%
// combinason: 40% x 70% ~ 28%
export const PROBA_MEMORY_FADE_IN = 0.7;
// chance de tentative de fondu a la fin de spectre 70%
export const PROBA_MEMORY_FADE_OUT = 0.7;
// chance de selection de fondu de blanc vers la couleur 40%
export const PROBA_FADE_FLASH_TO_NORM = 0.4;
// chance de selection de fondu de la couleur vers le blanc 10%
// combinason: 70% x 10% ~ 4%
export const PROBA_FADE_NORM_TO_FLASH = 0.1;
// chance de selection de fondu de noir vers la couleur 40%
// combinason: 70% x 40% ~ 28%
export const PROBA_FADE_BLACK_TO_NORM = 0.4;
// chance de selection de fondu de la couleur vers le noir 10%
// combinason: 70% x 10% ~ 4%
export const PROBA_FADE_NORM_TO_BLACK = 0.1;




export const AVAILABLE_TRANSITIONS = [
  {
    type: 'crossfade',
    minDuration: 2, // temps en seconde minimum d'un cross fade si choisi
    maxDuration: 5, // temps en seconde maximum d'un cross fade si choisi
    proba: PROBA_CROSS_FADE,
  },
  {
    type: 'to_color_and_back',
    minDuration: 1, // temps en seconde minimum d'un cross fade vers noir si choisi
    maxDuration: 2, // temps en seconde maximum d'un cross fade vers noir si choisi
    proba: PROBA_TO_COLOR_AND_BACK,
  }
];



export const AVAILABLE_FADE_INS = [
  {
    type: 'fade_flash_to_norm',
    minDuration: 2, // temps en seconde minimum d'un cross fade vers noir si choisi
    maxDuration: 4, // temps en seconde maximum d'un cross fade vers noir si choisi
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