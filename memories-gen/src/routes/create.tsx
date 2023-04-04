import { For, Suspense, createEffect, Show } from "solid-js";
import solidStart, { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { getAllClips, getRandomInt } from "~/data/utils";
import { Clip, MemoryType } from '~/data/model';
import generate from "~/generator/memory";

export function routeData() {
  return createServerData$(async () => {
    const dbClips = await getAllClips();
    const memory = generate(dbClips);
    return memory;
  });
}

export default function CreatePage() {
  const data = useRouteData<typeof routeData>();
  createEffect(() => {
    if (data.state !== 'ready') return;
  });
  return (
    <Suspense>
      <Show when={ data() } keyed>
        {(data) => (
          <ul>
            <For each={data.clips}>
              {(clip) => (<li>{clip.uid}</ li>)}
            </For>
          </ul>
        )}
      </Show>
    </Suspense>
  );
}
