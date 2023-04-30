import { onMount, onCleanup, For, Show,  } from "solid-js";
import redButton from '~/assets/red.png';
import greenButton from '~/assets/green.png';
import blueButton from '~/assets/blue.png';
import whiteButton from '~/assets/white.png';
import yellowButton from '~/assets/yellow.png';

const noop = () => null;

export default function(props: {
  onRedClicked?: CallableFunction, onGreenClicked?: CallableFunction,
  onBlueClicked?: CallableFunction, onWhiteClicked?: CallableFunction,
  onYellowClicked?: CallableFunction,
  showHelp: boolean,
  helpTexts: {red?: string, green?: string, blue?: string, white?: string, yellow?: string}
  availableColors: Array<string>,
}) {
  const ColorsDefinition = [{
    action: props.onRedClicked || noop,
    name: 'red',
    img: redButton,
  }, {
    action: props.onGreenClicked || noop,
    name: 'green',
    img: greenButton,
  }, {
    action: props.onBlueClicked || noop,
    name: 'blue',
    img: blueButton,
  }, {
    action: props.onWhiteClicked || noop,
    name: 'white',
    img: whiteButton
  }, {
    action: props.onYellowClicked || noop,
    name: 'yellow',
    img: yellowButton,
  }]
  const keyUp = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'e':
        (props.onRedClicked || noop)();
        break;
      case 'c':
          (props.onGreenClicked || noop)();
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
  if (!props.showHelp) {
    return null;
  } else {
    return (
      <div class="flex flex-row gap-3 justify-center p-3">
        <For each={ColorsDefinition}>
          {
            (colorDefinition) => {
              if (!props.availableColors.includes(colorDefinition.name)) {
                return null;
              } else {
                return (
                  <div class="flex flex-col items-center">
                    <img class="cursor-pointer w-10" onClick={colorDefinition.action} src={colorDefinition.img} />
                    <div>
                      <Show when={props.helpTexts[colorDefinition.name]}>
                        <div class="text-sm dark:text-slate-200">
                          {props.helpTexts[colorDefinition.name]}
                        </div>
                      </Show>
                    </div>
                  </div>
                );
              }
            }
          }
        </For>
      </div>
    );
  }
}