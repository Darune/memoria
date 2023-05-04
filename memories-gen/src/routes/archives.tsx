import { For, createEffect, Show, createSignal, onMount, onCleanup } from "solid-js";
import { useRouteData, createRouteData, useNavigate } from "solid-start";
import Tree from '~/assets/tree.svg?component-solid';
import KeyboardNav from "~/components/keyboard-nav";
import { client } from "~/lib/trpc-client";

export function routeData() {
  return createRouteData(async () => {
    return await client.listMemories.query();
  });
}

export default function CreatePage() {
  const navigate = useNavigate();
  const data = useRouteData<typeof routeData>();
  const [ selectedIdx, setSelectedIdx ] = createSignal(0);
  const [ itemsPerRow, setItemsPerRow ] = createSignal(0);
  const computeItemsArray = () => {
    const grid = Array.from(document.querySelectorAll("div.archive"));
    const baseOffset = grid[0].offsetTop;
    const breakIndex = grid.findIndex(item => item.offsetTop > baseOffset);
    const numPerRow = (breakIndex === -1 ? grid.length : breakIndex);
    setItemsPerRow(numPerRow);
  };
  createEffect(() => {
    computeItemsArray();
    addEventListener('resize', computeItemsArray);
    onCleanup(() => removeEventListener('resize', computeItemsArray));
  })
  createEffect(() => {
    const selectedEl = document.querySelector(`#archive-${selectedIdx()}`);
    if (!selectedEl) {
      return;
    }
    const container = selectedEl.parentElement;
    if (!container) {
      return;
    }
       //Determine container top and bottom
    let cTop = container.scrollTop;
    let cBottom = cTop + container.clientHeight;

    //Determine element top and bottom
    let eTop = selectedEl.offsetTop;
    let eBottom = eTop + selectedEl.clientHeight;
    console.log(eTop, eBottom, cTop, cBottom);
    //Check if out of view
    if (eTop < cTop) {
      container.scrollTop -= (cTop - eTop);
    }
    else if (eBottom > cBottom) {
      container.scrollTop += (eBottom - cBottom);
    }
  });
  createEffect(() => {
    if (data.state !== 'ready') return;
  });
  return (
    <div class="h-screen flex flex-col">
      <div class="flex-grow content-start flex-wrap flex gap-6 px-4 py-4 overflow-y-scroll" id="archives">
        <Show when={ data() } keyed>
          {(allmemories) => {
            const { memories } = allmemories;
            return (
              <For each={memories}>
                {(memory, idx) => (
                  <div id={`archive-${idx()}`} class={`${selectedIdx() != idx() ? "blur-sm": undefined} hover:blur-none archive`}>
                      <a href={`/play/${memory.id}`}>
                        <div class="flex w-full justify-center">
                          <span class={`${selectedIdx() == idx() ? "font-bold" : undefined} dark:text-slate-400 font-mono capitalize`}>{memory.name}</span>
                        </div>
                        <div class={`${selectedIdx() == idx() ? "border-rose-600 border-2" : undefined} rounded-lg h-46 w-52 overflow-hidden`}>
                          <img class={`${selectedIdx() == idx() ? "scale-125" : undefined } object-cover h-full w-auto  transition-transform`} style="backface-visibility: hidden" src={`/api/memory/${memory.id}/thumbnail`} />
                        </div>
                      </a>
                  </div>
                )}
              </For>
            )
          }}
        </Show>
      </div>
      <KeyboardNav
        onRedClicked={() => {setSelectedIdx(Math.max(selectedIdx() - 1, 0 ));}}
        onGreenClicked={() => {setSelectedIdx(Math.max(selectedIdx() - itemsPerRow(), 0 ));}}
        onBlueClicked={() => {setSelectedIdx(Math.min(selectedIdx() + itemsPerRow(), data()?.memories.length - 1));}}
        onYellowClicked={() => {setSelectedIdx(Math.min(selectedIdx() + 1, data()?.memories.length - 1));}}
        onTriangleClicked={() => (navigate(`/play/${data()?.memories[selectedIdx()].id}`))}
        onSquareClicked={() => (navigate('/'))}
        helpTexts={{red: '←', green: '↑', blue: '↓', yellow: '→', triangle: 'play', square: (<Tree width={36} height={36}/>)}}
        availableColors={['red', 'green', 'blue', 'yellow', 'square', 'triangle']}
        showHelp
      />
    </div>
  );
}