import { useNavigate, useRouteData, createRouteData, refetchRouteData } from 'solid-start';

import TreeAndWords from '~/components/tree';
import KeyboardNav from '~/components/keyboard-nav';
import { setEditingMemory } from '~/stores/memory';
import { client } from "~/lib/trpc-client";
import { createEffect, createSignal } from 'solid-js';
import './index.css';
import { ClipType } from '~/data/model';

export function routeData() : any {
  return createRouteData(async () => {
    const results = await Promise.all([
      client.getWords.query(), client.generateNewMemory.query()
    ]);
    return {words: results[0], memory: results[1]};
  });
}

export default function Home() {
  const fetchedData = useRouteData<typeof routeData>();
  const [ shouldEdit, setShouldEdit ] = createSignal(false);
  const [ isAnimating, setIsAnimating ] = createSignal(false);
  const [ animateConfig, setAnimateConfig ] = createSignal<any>(null);
  const [ words, setWords ] = createSignal<any>(null);
  const navigate = useNavigate();

  const runGeneration = () => {
    if (!isAnimating()) {
      refetchRouteData();
      setIsAnimating(true);
    }
  };
  createEffect(() => {
    if (fetchedData.state == 'refreshing') setShouldEdit(true);
    if (fetchedData.state !== 'ready') return;
    if (words() == null) {
      const { fwords } = fetchedData();
      setWords(({...fetchedData().words}));
    }
    if (shouldEdit()) {
      const { memory } = fetchedData();
      setEditingMemory({...memory});
      setAnimateConfig({
        clipNames: memory.clips.map(
          (clip: ClipType) => clip.name
        ),
        sound: memory.audio?.name,
        timeout: 8000,
      });
      setShouldEdit(false);
    }
  });
  const onTreeAnimateEnded = () => {
    navigate('/create');
    setIsAnimating(false);
  }
  return (
    <main class="h-screen flex justify-center flex-col">
      {/* <img src={tree}/> */}
      {/* <Tree class="flex-grow"/> */}
      <div class="flex-grow">
        <TreeAndWords
          animateTowards={animateConfig()} onAnimateEnd={onTreeAnimateEnded}
          words={words()}
        />
      </div>
      <KeyboardNav
        onTriangleClicked={() => {runGeneration();}}
        onSquareClicked={() => {if (!isAnimating()) {navigate('/archives');}}}
        helpTexts={{triangle: 'Play', square: 'Spectres'}}
        availableColors={['triangle', 'square']}
        showHelp
      />
    </main>
  );
}
