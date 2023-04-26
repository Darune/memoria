import { For, createEffect, Show, createSignal } from "solid-js";
import { useRouteData, createRouteData } from "solid-start";
import { client } from "~/lib/trpc-client";

export function routeData() {
  return createRouteData(async () => {
    return await client.listMemories.query();
  });
}

export default function CreatePage() {
  const data = useRouteData<typeof routeData>();
  createEffect(() => {
    if (data.state !== 'ready') return;
  });
  return (
    <div class="flex gap-6 container px-4 py-4">
      <Show when={ data() } keyed>
        {(memory) => {
          const { memories } = memory;
          return (
            <For each={memories}>
              {(memory) => (
                <div>
                    <a href={`/play/${memory.id}`}>
                      <div>
                        <img width={256} height={240} src={`/api/memory/${memory.id}/thumbnail`} />
                      </div>
                      <div class="flex w-full justify-center">
                        <span class="font-mono uppercase">{memory.name}</span>
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