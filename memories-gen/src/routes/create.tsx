import { For, Suspense, createEffect, Show, lazy, createSignal, } from "solid-js";
import { useRouteData, unstable_clientOnly, createRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { getAllClips } from "~/data/utils";
import ClientVideoPlayer from "~/components/video-player/client-player";
import generate from "~/generator/memory";


export function routeData() {
  return createRouteData(async () => {
    const response = await fetch('/api/memories/generate')
    return response.json();
  });
}

export default function CreatePage() {
  const data = useRouteData<typeof routeData>();
  createEffect(() => {
    if (data.state !== 'ready') return;
    console.log('data is ready ');
  });
  return (
    <>
      <Show when={ data() } keyed>
        {(memory) => {
          return (
            <>
              <div>
                <ClientVideoPlayer memory={memory} fallback={<div>Hello</div>}/>
              </div>
              <ul>
                <For each={memory.clips}>
                  {(clip) => (<li>{clip.uid}</ li>)}
                </For>
              </ul>
              <div>
                duration: {memory.duration}
              </div>
            </>
          );
        }}
      </Show>
    </>
  );
}
