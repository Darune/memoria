

export interface ClipType {
  name: string;
  duration: number;
  path?: string;
  url: string;
}


export interface MemoryClipType {
  uid: string;
  name: string;
  start: number;
  stop: number;
  duration: number;
  clip: ClipType;
  transition?: MemoryClipTransitionType;
}

export interface MemoryClipTransitionType {
  type: string;
  start: number;
  stop: number;
  duration: number;
}

export interface EffectType {
  type: string;
  duration?: number;
  start: number;
  stop?: number;
}

export interface AudioType {
  name: string;
  path: string;
  url: string;
}

export interface MemoryType {
  id?: number;
  name?: string,
  clips: Array<MemoryClipType>;
  duration: number;
  fadeIn?: EffectType;
  fadeOut?: EffectType;
  audio?: AudioType;
  effectsTimeline?: Array<EffectType>;
  thumbnailTime: number;
  thumbnailImage?: string;
}


export class Clip implements ClipType {
  name: string;
  duration: number;
  path: string;
  url: string;

  constructor(name: string, duration: number, path: string, url: string) {
    this.name = name;
    this.duration = duration;
    this.path = path;
    this.url = url;
  }
}
export class MemoryClip implements MemoryClipType {
  uid: string;
  name: string;
  start: number;
  stop: number;
  duration: number;
  clip: ClipType;
  transition?: MemoryClipTransitionType;

  constructor(
    clip: Clip, start: number, stop: number
  ) {
    this.name = clip.name;
    this.start = start;
    this.stop = stop;
    this.duration = stop - start;
    this.clip = clip;
    this.uid = `${this.name}:${this.start}:${this.stop}`;
  }

  addTransition(transition?: MemoryClipTransitionType) {
    this.transition = transition
  }
}

export class Memory implements MemoryType {
  name?: string;
  clips: Array<MemoryClipType>;
  duration: number;
  fadeIn?: EffectType;
  fadeOut?: EffectType;
  audio?: AudioType;
  effectsTimeline?: Array<EffectType>;
  thumbnailTime: number;
  thumbnailImage?: string;

  constructor() {
    this.clips = new Array<MemoryClip>();
    this.duration = 0;
    this.thumbnailTime = 0;
  }

  pushClip(memoryClip: MemoryClip) {
    this.clips.push(memoryClip)
    if (memoryClip.transition) {
      this.duration += memoryClip.duration - memoryClip.transition.duration;
    } else {
      this.duration += memoryClip.duration;
    }
  }

  canAdd(memoryClip: MemoryClip) {
    for (const clip of this.clips) {
      if (clip.name == memoryClip.name) {
        if (Math.abs(clip.start - memoryClip.start) < clip.duration) {
          return false;
        }
      }
    }
    return true;
  }

  summarize() : Array<string> {
    const result = new Array<string>();
    for (const clip of this.clips) {
      result.push(`${clip.uid}`)
    }
    return result;
  }

  setFadeIn(fadeIn?: EffectType) {
    this.fadeIn = fadeIn;
  }

  setFadeOut(fadeOut?: EffectType) {
    this.fadeOut = fadeOut;
  }
  setThumbnailTime(time: number) {
    this.thumbnailTime = time;
  }

  setAudio(audio: AudioType) {
    this.audio = audio;
  }
  setEffectTimeline(effectsTimeline: Array<EffectType>) {
    this.effectsTimeline = effectsTimeline;
  }
};


export class Audio implements AudioType {
  name: string;
  path: string;
  url: string;

  constructor(name: string, path: string) {
    this.name = name;
    this.path = path;
    this.url = 'test';
  }
}