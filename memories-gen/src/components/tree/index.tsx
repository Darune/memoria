import { createEffect, For, onMount, Show } from 'solid-js';
import Tree from '~/assets/tree.svg?component-solid';
import { fillWithRandom } from "~/utils";
import { client } from "~/lib/trpc-client";

import settings from './animation-settings';
import { createRouteData, useRouteData } from 'solid-start';
import Chip from '../chip/chip';


function turnOffElements(indices, type='branch') {
  for (const previousIndex of indices) {
    const elements = document.querySelectorAll(`.${type}-${previousIndex}`)
    for (const element of elements) {
      // element.classList.remove('active');
      element.classList.remove('dark:bg-cyan-50');
      element.classList.remove('dark:text-slate-800');
      element.classList.remove('dark:fill-cyan-50');
    }
  }
}
function lightUpElement(indices, previousIndices, type='branch') {
  turnOffElements(previousIndices, type);
  for (const index of indices) {
    const elements = document.querySelectorAll(`.${type}-${index}`)
    for (const element of elements) {
      element.classList.add('dark:bg-cyan-50');
      element.classList.add('dark:text-slate-800');
      element.classList.add('dark:fill-cyan-50');
    }
  }
}

export default function TreeAndWords(props: {
  animateTowards?: {clipNames: Array<string>, sound: string, timeout: number},
  onAnimateEnd: CallableFunction,
  words: {soundWords: Array<string>, videoWords: Array<string>}
}) {
  const animate = (
    animationConfig: {clipNames: Array<string>, sound: string, timeout: number},
  ) => {
    const { videoWords, soundWords } = props.words;
    const body = document.querySelector('.cls-1.body-tree');
    body?.classList.remove('dark:fill-gray-400');
    body?.classList.add('dark:fill-cyan-50');
    // const selectedVideos = props.animateTowards?.clipNames.map((clipName) => {
    //   const word = clipName.replace('.mp4', '').replaceAll('-', '').replaceAll('_', ' ');
    //   return videoWords.indexOf(word);
    // })
    // const soundName = props.animateTowards.sound.replace('.mp3', '').replaceAll('-', '').replaceAll('_', ' ')
    // const selectedAudio = soundWords.indexOf(soundName);
    let animatedBranches = fillWithRandom(videoWords.length - 1, settings.MAX_BRANCHE_ANIMATED);
    let animatedRoots = fillWithRandom(soundWords.length - 1, settings.MAX_ROOT_ANIMATED);
    lightUpElement(animatedBranches, [], 'branch');
    lightUpElement(animatedRoots, [], 'root');
    const nbIteration = 8;
    const intervalId = setInterval(() => {
      const newBranches = fillWithRandom(videoWords.length - 1, settings.MAX_BRANCHE_ANIMATED);
      const newRoots = fillWithRandom(soundWords.length - 1, settings.MAX_ROOT_ANIMATED);
      lightUpElement(newBranches, animatedBranches, 'branch');
      lightUpElement(newRoots, animatedRoots, 'root');
      console.log(animatedRoots[0], newRoots[0]);
      animatedRoots = newRoots;
      animatedBranches = newBranches;
    }, (animationConfig.timeout - 500 )/ nbIteration)
    setTimeout(() => {
      clearInterval(intervalId);
      // turnOffElements(animatedBranches, 'branch');
      // turnOffElements(animatedRoots, 'root');
      // lightUpElement(selectedVideos, animatedBranches, 'branch');
      // lightUpElement(selectedAudio, animatedRoots, 'root');
      props.onAnimateEnd();
    }, animationConfig.timeout - 500);
  };

  createEffect(() => {
    if (!props.animateTowards) {
      return;
    }
    animate(props.animateTowards);
  });

  return (
    <div class="h-full max-w-full flex flex-row justify-center">
      <div class="flex flex-col max-w-lg p-2 justify-between">
        <Show when={props.words}>
          <div class="flex flex-row flex-wrap gap-6 justify-start">
            <For each={props.words.videoWords.slice(0, props.words.videoWords.length / 2)}>
              {(word, i) => <Chip text={word} className={`branch branch-${i()}`}/>}
            </For>
          </div>
          <div class="flex flex-row flex-wrap gap-6 justify-start">
            <For each={props.words.soundWords.slice(0, props.words.soundWords.length / 2)}>
              {(word, i) => <Chip text={word} className={`root root-${i()}`} />}
            </For>
          </div>
        </Show>
      </div>
      <div class="max-w-fit flex-grow">
        <Tree class="h-full w-full"/>
      </div>
      <div class="flex flex-col max-w-lg p-2 justify-between">
        <Show when={props.words}>
          <div class="flex flex-row flex-wrap gap-6 justify-end">
            <For each={props.words.videoWords.slice(props.words.videoWords.length / 2, props.words.videoWords.length)}>
              {(word, i) => <Chip text={word} className={`branch branch-${i() + props.words.videoWords.length / 2}`}/>}
            </For>
          </div>
          <div class="flex flex-row flex-wrap gap-6 justify-end">
            <For each={props.words.soundWords.slice(props.words.soundWords.length / 2, props.words.soundWords.length)}>
              {(word, i) => <Chip text={word} className={`root root-${i() + props.words.soundWords.length / 2}`}/>}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
}