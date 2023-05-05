import { For, createEffect, Show } from "solid-js";
import { useRouteData, createRouteData, useNavigate, useParams } from "solid-start";
import Chip from "~/components/chip/chip";
import ClientVideoPlayer from "~/components/video-player/client-player";
import { MemoryType } from "~/data/model";
import { client } from "~/lib/trpc-client";
import { soundFileToWord, videoFileToWord } from "~/utils";

export function routeData({ params } : { params: { id: string}}) {
  return createRouteData(async (key) => {
    return await client.getMemory.query(key[0]);
  }, {
    key: () => [params.id]
  });
}
export default function CreatePage() {
  const navigate = useNavigate();
  const params = useParams();
  const data = useRouteData<typeof routeData>();
  createEffect(() => {
    if (data.state !== 'ready') return;
  });
  return (
    <Show when={ data() } keyed>
      {(memory) => {
        return (
          <div class="w-screen h-screen">
            <div class="container mx-auto h-full flex flex-col">
              <div class="flex flex-row gap-4 pb-5 pt-5 flex-wrap justify-evenly">
                <For each={memory.clips}>
                  {(clip) => (<Chip text={videoFileToWord(clip.name)} />)}
                </For>
                <Chip text={soundFileToWord(memory.audio.name)} />
              </div>
              <div class="flex flex-col flex-grow">
                <ClientVideoPlayer
                  memory={memory}
                  debug={false}
                  isEditing={false}
                  onEnded={(finalMemory: MemoryType) => {
                    navigate(`/archives/${parseInt(params.id) - 1}`)
                  }}/>
              </div>
            </div>
          </div>
        );
      }}
    </Show>
  );
}
