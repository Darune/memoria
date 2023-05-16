import { onMount, onCleanup, For, Show, createEffect,  } from "solid-js";
import redButton from '~/assets/red.png';
import greenButton from '~/assets/green.png';
import blueButton from '~/assets/blue.png';
import whiteButton from '~/assets/white.png';
import squareButtom from '~/assets/square.png';
import triangleButtom from '~/assets/triangle.png';
import yellowButton from '~/assets/yellow.png';

const noop = () => null;

export default function(props: {
  onRedClicked?: CallableFunction, onGreenClicked?: CallableFunction,
  onBlueClicked?: CallableFunction, onYellowClicked?: CallableFunction,
  onTriangleClicked?: CallableFunction, onSquareClicked?: CallableFunction,
  showHelp: boolean,
  helpTexts: {
    triangle?: string | Element, square?: string | Element,
    red?: string | Element, green?: string | Element, blue?: string | Element, yellow?: string | Element,
}
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
    action: props.onYellowClicked || noop,
    name: 'yellow',
    img: yellowButton,
  }, {
    action: props.onSquareClicked || noop,
    name: 'square',
    img: squareButtom
  }, {
    action: props.onTriangleClicked || noop,
    name: 'triangle',
    img: triangleButtom
  }]
  const keyUp = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'h':
        (props.onRedClicked || noop)();
        break;
      case 'j':
        (props.onGreenClicked || noop)();
        break;
      case 'k':
        (props.onBlueClicked || noop)();
        break;
      case 'l':
        (props.onYellowClicked || noop)();
        break;
      case 'u':
        (props.onTriangleClicked || noop)();
        break;
      case 'i':
        (props.onSquareClicked || noop)();
        break;
      default:
        break;
    }
  };

  createEffect(() => {
    document.addEventListener('keyup', keyUp);
    onCleanup(() => document.removeEventListener('keyup', keyUp));
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