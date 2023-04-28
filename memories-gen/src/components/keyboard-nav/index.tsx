import { onMount, onCleanup } from "solid-js";

export default function(props: {
  onRedClicked: CallableFunction, onGreenClicked: CallableFunction,
  onBlueClicked: CallableFunction, onWhiteClicked: CallableFunction,
  onYellowClicked: CallableFunction
}) {

  const keyUp = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'e':
        props.onRedClicked();
        break;
      case 'c':
          props.onGreenClicked();
          break;
      default:
        break;
    }
  };

  onMount(() => {
    document.addEventListener('keyup', keyUp);
  })
  onCleanup(() => {
    document.removeEventListener('keyup', keyUp);
  })
  return null;
}