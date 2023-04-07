

export interface ClipType {
  name: string;
  duration: number;
  path?: string;
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

export interface MemoryType {
  clips: Array<MemoryClipType>;
  duration: number;
}


export class Clip implements ClipType {
  name: string;
  duration: number;
  path: string;

  constructor(name: string, duration: number, path: string) {
    this.name = name;
    this.duration = duration;
    this.path = path;
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
  clips: Array<MemoryClipType>;
  duration: number;

  constructor() {
    this.clips = new Array<MemoryClip>();
    this.duration = 0;
  }

  pushClip(memoryClip: MemoryClip) {
    this.clips.push(memoryClip)
    this.duration += memoryClip.duration;
    // if (memoryClip.transition) {
    //   this.duration -= memoryClip.transition.duration / 2;
    // }
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
};
