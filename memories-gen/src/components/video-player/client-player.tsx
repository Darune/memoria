import { createSignal, onMount, Show } from "solid-js";
import { unstable_clientOnly } from "solid-start";
import { MemoryType } from "~/data/model";

let VideoPlayer = unstable_clientOnly(() => import("~/components/video-player/player"));

export default function ClientVideoPlayer(props: { memory: MemoryType, debug: boolean, onEnded: CallableFunction, isEditing: boolean }) {
  const [ isClientSide, setIsClientSide ] = createSignal(false);
  onMount(() => {
    setIsClientSide(true);
  })
  return (
    <Show when={isClientSide()}>
      {() => {
        return (<VideoPlayer {...props} />);
      }}
    </Show>
  )
}