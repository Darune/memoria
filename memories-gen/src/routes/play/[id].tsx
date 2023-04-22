import { For, createEffect, Show } from "solid-js";
import { useRouteData, createRouteData } from "solid-start";
import ClientVideoPlayer from "~/components/video-player/client-player";
import { MemoryType } from "~/data/model";
import { client } from "~/lib/trpc-client";


export function routeData({ params }) {
  console.log(params);
  return createRouteData(async (key) => {
    return await client.getMemory.query(key[0]);
  }, {
    key: () => [params.id]
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
          return (
            <>
              <div>
                <ClientVideoPlayer
                  memory={memory}
                  debug={true}
                  isEditing={false}
                  onEnded={(finalMemory: MemoryType) => {
                  }}/>
              </div>
              <ul>
                <For each={memory.clips}>
                  {(clip) => (<li>{clip.uid}</ li>)}
                </For>
              </ul>
              <div>
                duration: {memory.duration}, thumbnailTime: {memory.thumbnailTime}, music: {memory.audio?.name}
              </div>
            </>
          );
        }}
      </Show>
    </>
  );
}
