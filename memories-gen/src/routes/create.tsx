import { For, createEffect, Show } from "solid-js";
import { useRouteData, createRouteData } from "solid-start";
import ClientVideoPlayer from "~/components/video-player/client-player";
import { client } from "~/lib/trpc-client";


export function routeData() {
  return createRouteData(async () => {
    return await client.generateNewMemory.query();
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
                <ClientVideoPlayer memory={memory} debug={true} />
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
