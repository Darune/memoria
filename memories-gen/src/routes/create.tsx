import { For, Show } from "solid-js";
import { useNavigate, useRouteData, createRouteData } from "solid-start";
import Chip from "~/components/chip/chip";
import ClientVideoPlayer from "~/components/video-player/client-player";
import { editingMemory } from "~/stores/memory";
import { MemoryType } from "~/data/model";
import { client } from "~/lib/trpc-client";
import { soundFileToWord, videoFileToWord } from "~/utils";


export function routeData() {
  return createRouteData(async () => {
    return await client.generateNewMemory.query();
  });
}

export default function CreatePage() {
  const navigate = useNavigate();
  const fetchData = useRouteData<typeof routeData>();
  const data = () => editingMemory() || fetchData();
  // createEffect(() => {
  //   if (data.state !== 'ready') return;
  // });
  return (
    <div class="w-screen h-screen">
      <Show when={ data() } keyed>
        {(memory) => {
          return (
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
                  debug={true}
                  isEditing={true}
                  onEnded={async (finalMemory: MemoryType) => {
                    const archiveId = await client.archiveMemory.mutate(finalMemory);
                    setTimeout(() => navigate(`/archives/${archiveId - 1}`), 300);
                  }}/>
              </div>
              {/* <div>
                duration: {memory.duration}, thumbnailTime: {memory.thumbnailTime}, music: {memory.audio?.name}
              </div> */}
            </div>
          );
        }}
      </Show>
    </div>
  );
}
