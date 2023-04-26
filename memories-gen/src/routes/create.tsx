import { For, createEffect, Show } from "solid-js";
import { useNavigate, useRouteData, createRouteData } from "solid-start";

import ClientVideoPlayer from "~/components/video-player/client-player";

import { MemoryType } from "~/data/model";
import { client } from "~/lib/trpc-client";


export function routeData() {
  return createRouteData(async () => {
    return await client.generateNewMemory.query();
  });
}
export default function CreatePage() {
  const navigate = useNavigate();
  const data = useRouteData<typeof routeData>();
  createEffect(() => {
    if (data.state !== 'ready') return;
  });
  return (
    <div class="container mx-auto">
      <Show when={ data() } keyed>
        {(memory) => {
          return (
            <div class="container mx-auto">
              <div>
                <ClientVideoPlayer
                  memory={memory}
                  debug={true}
                  isEditing={true}
                  onEnded={(finalMemory: MemoryType) => {
                    client.archiveMemory.mutate(finalMemory);
                    setTimeout(() => navigate("/archives"), 200);
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
            </div>
          );
        }}
      </Show>
    </div>
  );
}
