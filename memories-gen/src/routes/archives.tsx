import { For, createEffect, Show } from "solid-js";
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
    <>
      <Show when={ data() } keyed>
        {(memory) => {
          const { memories } = memory;
          return (
            <For each={memories}>
              {(memory) => (
                <div>
                    <a href={`/play/${memory.id}`}>
                      <div>
                        <img width={256} height={240} src={memory.thumbnailImage} />
                      </div>
                      <span>{memory.name}</span>
                    </a>
                </div>
              )}
            </For>
          )
        }}
      </Show>
    </>
  );
}