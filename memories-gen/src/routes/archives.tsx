import { For, createEffect, Show, createSignal } from "solid-js";
import { useRouteData, createRouteData } from "solid-start";
import KeyboardNav from "~/components/keyboard-nav";
import { client } from "~/lib/trpc-client";

export function routeData() {
  return createRouteData(async () => {
    return await client.listMemories.query();
  });
}

export default function CreatePage() {
  const data = useRouteData<typeof routeData>();
  const [ selectedIdx, setSelectedIdx ] = createSignal(0);
  createEffect(() => {
    if (data.state !== 'ready') return;
  });
  console.log(selectedIdx())
  return (
    <div class="flex gap-6 container px-4 py-4">
      <KeyboardNav
        onRedClicked={() => {setSelectedIdx(selectedIdx() + 1);}}
        onGreenClicked={() => {setSelectedIdx(selectedIdx() - 1);}}
        onBlueClicked={() => (null)}
        onYellowClicked={() => (null)}
        onWhiteClicked={() => (null)}
      />
      <Show when={ data() } keyed>
        {(allmemories) => {
          const { memories } = allmemories;
          return (
            <For each={memories}>
              {(memory, idx) => (
                <div class={`${selectedIdx() != idx() ? "blur-sm": undefined} hover:blur-none`}>
                    <a href={`/play/${memory.id}`}>
                      <div class="flex w-full justify-center">
                        <span class="font-mono capitalize">{memory.name}</span>
                      </div>
                      <div>
                        <img class="rounded-md object-cover h-48 w-48" width={256} height={240} src={`/api/memory/${memory.id}/thumbnail`} />
                      </div>
                    </a>
                </div>
              )}
            </For>
          )
        }}
      </Show>
    </div>
  );
}