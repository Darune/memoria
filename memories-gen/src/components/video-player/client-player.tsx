import { createSignal, onMount, Show } from "solid-js";
import { unstable_clientOnly } from "solid-start";

let VideoPlayer = unstable_clientOnly(() => import("~/components/video-player/memory"));

export default function ClientVideoPlayer(props) {
  const [ isClientSide, setIsClientSide ] = createSignal(false);
  onMount(() => {
    setIsClientSide(true);
    console.log('client side video');
  })
  console.log('dfjsljflsdf');
  return (
    <Show when={isClientSide()}>
      {() => {
        console.log('props: ', props);
        return (<VideoPlayer {...props} />);
      }}
    </Show>
  )
}