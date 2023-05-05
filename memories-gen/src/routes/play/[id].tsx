import { For, createEffect, Show } from "solid-js";
import { useRouteData, createRouteData, useNavigate, useParams } from "solid-start";
import ClientVideoPlayer from "~/components/video-player/client-player";
import { MemoryType } from "~/data/model";
import { client } from "~/lib/trpc-client";


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
                    navigate(`/archives/${parseInt(params.id) - 1}`)
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
