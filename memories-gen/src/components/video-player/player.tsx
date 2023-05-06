import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { MemoryType, EffectType } from "~/data/model";
import VideoContext from 'videocontext';
import Tree from '~/assets/tree.svg?component-solid';
import KeyboardNav from "../keyboard-nav";
import { Combine } from "./compositor/combine";
import getTransitionNode from "./transitions";
import getEffectNode from "./effects";
import { useNavigate } from "solid-start";


function InitVisualisations(videoCtx, graphCanvasID, visualisationCanvasID){
	/****************************
        * GUI setup
        *****************************/
        /*
        * Create an interactive visualisation canvas.
        */
        var visualisationCanvas = document.getElementById(visualisationCanvasID);
		    //RefreshGraph(videoCtx, graphCanvasID);


        //visualisationCanvas.height = 20;
        //visualisationCanvas.width = 390;
        //Setup up a render function so we can update the playhead position.
        function render () {
            // VideoCompositor.renderPlaylist(playlist, visualisationCanvas, videoCompositor.currentTime);
            VideoContext.visualiseVideoContextTimeline(videoCtx, visualisationCanvas, videoCtx.currentTime);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
        //catch mouse events to we can scrub through the timeline.
        visualisationCanvas.addEventListener("mousedown", function(evt){
            var x;
            if (evt.x!== undefined){
                x = evt.x - visualisationCanvas.offsetLeft;
            }else{
                //Fix for firefox
                x = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            }
            var secondsPerPixel = videoCtx.duration / visualisationCanvas.width;
            if(secondsPerPixel*x !== Infinity) videoCtx.currentTime = secondsPerPixel*x;
        }, false);
}


function RefreshGraph(videoCtx, graphCanvasID){
	var graphCanvas = document.getElementById(graphCanvasID);
    VideoContext.visualiseVideoContextGraph(videoCtx, graphCanvas);
}


function buildPlaybackGraph(videoContext, memory: MemoryType) {
  const videoNodes = []
  let idx = 0 ;
  let currentDuration = 0;
  let combine = Combine(videoContext);
  let globalOutput = combine;
  let inTransition = null;
  for (const clip of memory.clips) {
    const videoNode = videoContext.video(clip.clip.url, clip.start);
    videoNode.startAt(currentDuration);
    videoNode.stopAt(currentDuration + clip.duration);
    if (inTransition) {
      videoNode.connect(inTransition);
      inTransition.connect(globalOutput);
      inTransition = null;
    } else if (!clip.transition) {
      videoNode.startAt(currentDuration);
      videoNode.stopAt(currentDuration + clip.duration);
      videoNode.connect(globalOutput);
      videoNodes[idx] = videoNode;
    } else if (clip.transition) {
      const inTransitionDefinition = clip.transition
      inTransition = getTransitionNode(videoContext, inTransitionDefinition);
      currentDuration -= inTransitionDefinition.duration;
      videoNode.connect(inTransition);
      videoNode[idx] = inTransition;
    }
    idx += 1;
    currentDuration += clip.duration;
  }
  if (memory.fadeIn) {
    const fadeInEffect = getEffectNode(videoContext, memory.fadeIn);
    globalOutput.connect(fadeInEffect);
    fadeInEffect.connect(videoContext.destination);
    globalOutput = fadeInEffect;
  }
  if (memory.fadeOut) {
    const fadeOutEffect = getEffectNode(videoContext, memory.fadeOut);
    globalOutput.connect(fadeOutEffect);
    fadeOutEffect.connect(videoContext.destination);
    globalOutput = fadeOutEffect;
  }

  if (memory.audio) {
    const audioNode = videoContext.audio(`/api/music/${memory.audio.name}`)
    audioNode.startAt(0);
    audioNode.stopAt(memory.duration);
    audioNode.connect(combine);
  }
  return globalOutput;
}

const AVAILABLE_INTERACTIVE_EFFECTS = [
  'echo', 'colorbar', 'crt', 'monochrome',
];


class EffectHandler {
  videoContext : any;
  effectsNodes : any;
  effectStack : Array<string>;
  effectsTimeline : Array<EffectType>;
  effectsDefinitions : Record<string, EffectType>;
  rootNode: any;

  constructor(videoContext: any, rootNode: any) {
    this.videoContext = videoContext
    this.rootNode = rootNode
    this.effectsNodes = {};
    for (const effectType of AVAILABLE_INTERACTIVE_EFFECTS) {
      this.effectsNodes[effectType] = getEffectNode(videoContext, {type: effectType, start: 0});
    }
    this.effectStack = [];
    this.effectsTimeline = [];
    this.effectsDefinitions = {};
  }

  activateEffect(effectType: string) {
    const nbEffects = this.effectStack.length;
    let previousNode = this.rootNode
    if (nbEffects > 0) {
      previousNode = this.effectsNodes[this.effectStack[nbEffects - 1]];
    }
    previousNode.disconnect()
    previousNode.connect(this.effectsNodes[effectType]);
    this.effectsNodes[effectType].connect(this.videoContext.destination);
    this.effectStack.push(effectType);
    this.effectsDefinitions[effectType] = {
      type: effectType,
      start: this.videoContext.currentTime,
    }
    this.effectsTimeline.push(this.effectsDefinitions[effectType])
  }

  deactivateEffect(effectType: string) {
    const nbEffects = this.effectStack.length;
    const effectIdx = this.effectStack.indexOf(effectType);
    this.effectsNodes[effectType].disconnect();
    if (effectIdx == 0) {
      let nextTarget = this.videoContext.destination;
      if (nbEffects > 1) {
        nextTarget = this.effectsNodes[this.effectStack[effectIdx + 1]];
      }
      this.rootNode.disconnect();
      this.rootNode.connect(nextTarget);
    } else if (effectIdx == nbEffects - 1) {
      const previousEffect = this.effectsNodes[this.effectStack[effectIdx - 1]];
      previousEffect.disconnect()
      previousEffect.connect(this.videoContext.destination);
    } else {
      const previousEffect = this.effectsNodes[this.effectStack[effectIdx - 1]];
      const nextEffect = this.effectsNodes[this.effectStack[effectIdx + 1]];
      previousEffect.disconnect();
      previousEffect.connect(nextEffect);
    }
    this.effectStack.splice(effectIdx, 1);
    this.effectsDefinitions[effectType].stop = this.videoContext.currentTime
    delete this.effectsDefinitions[effectType];
  }

  toggleEffect(effectType: string) {
    if (this.effectStack.includes(effectType)) {
      this.deactivateEffect(effectType);
    } else {
      this.activateEffect(effectType);
    }
  }

  getEffectsTimeLine() {
    Object.values(this.effectsDefinitions).forEach((remainingEffect) => {
      remainingEffect.stop = this.videoContext.currentTime;
    })
    return this.effectsTimeline;
  }

  replayEffectTimeline(effectsTimeline: Array<EffectType>) {
    for (const effect of effectsTimeline) {
      this.videoContext.registerTimelineCallback(effect.start, () => {
        this.toggleEffect(effect.type);
      });
      this.videoContext.registerTimelineCallback(effect.stop, () => {
        this.toggleEffect(effect.type);
      });
    }
  }
}

export default function MemoryPlayer(props: {memory: MemoryType, debug: boolean, onEnded: CallableFunction, isEditing: boolean}) {
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = createSignal<string>(null);
  let effectHandler : EffectHandler | null = null;

  const applyEffect = (effectType) => {
    if (!effectHandler || !props.isEditing) {
      return
    }
    effectHandler.toggleEffect(effectType);
    // RefreshGraph(videoContext, 'graph-canvas');
  }
  let videoContext : any;
  onMount(() => {
    const canvasRef: HTMLCanvasElement = document.getElementById('video-canvas') as HTMLCanvasElement;
    const canvasThumbnail: HTMLCanvasElement = document.getElementById('thumbnail-preview') as HTMLCanvasElement;
    canvasRef.width = canvasRef.clientWidth + 100 * 4/3;
    canvasRef.height = canvasRef.clientHeight - 100;
    videoContext = new VideoContext(canvasRef);
    let globalOutput = buildPlaybackGraph(videoContext, props.memory);
    effectHandler = new EffectHandler(videoContext, globalOutput);
    globalOutput.connect(videoContext.destination);
    videoContext.play();
    if (props.debug) {
      const timeLineCanvas: HTMLCanvasElement = document.getElementById('visualisation-canvas') as HTMLCanvasElement;
      timeLineCanvas.width = canvasRef.clientWidth;
      InitVisualisations(videoContext, 'graph-canvas', 'visualisation-canvas');
    }

      // capture the canvas as an image


    if (props.isEditing) {
      videoContext.registerTimelineCallback(props.memory.thumbnailTime, () => {
        var resizedContext = canvasThumbnail.getContext("2d");
        resizedContext?.drawImage(canvasRef, 0, 0, 208, 156);
        var img = canvasThumbnail.toDataURL("image/png", 1.0);
        setThumbnail(img);
        canvasThumbnail.classList.remove('hidden');
      });
    } else if (props.memory.effectsTimeline) {
      effectHandler.replayEffectTimeline(props.memory.effectsTimeline);
    }

    videoContext.registerCallback(
      VideoContext.EVENTS.ENDED,
      () => {
        const finalMemory = {
          ...props.memory,
          effectsTimeline: effectHandler.getEffectsTimeLine(),
          thumbnailImage: thumbnail(),
        }
        props.onEnded(finalMemory);
      }
    );
  });
  onCleanup(()=> {
    if (videoContext) {
      videoContext.pause();
      videoContext.reset();
      videoContext = null;
    }
  });
  let helpText = {
    red: 'echo',
    green: 'colorbar',
    blue: 'CRT',
    yellow: 'B&W',
  }
  let availableColors = ['red', 'green', 'blue', 'yellow']
  if (!props.isEditing) {
    helpText['square'] = 'Archives'
    availableColors = ['square']
  }
  return (
    <div class="flex flex-grow flex-col w-full items-centera">
      <canvas id="video-canvas" class="w-4/3-canvas-edit h-4/3-canvas-edit aspect-4/3-canvas w-full" ></canvas>
      <Show when={props.debug}>
        <div class="pt-5">
          <canvas id="visualisation-canvas" height={50}></canvas>
        </div>
      </Show>
      <KeyboardNav
        onRedClicked={() => {applyEffect('echo');}}
        onGreenClicked={() => {applyEffect('colorbar');}}
        onBlueClicked={() => {applyEffect('crt');}}
        onYellowClicked={() => {applyEffect('monochrome');}}
        onTriangleClicked={() => (null)}
        onSquareClicked={() => {if (props.isEditing) navigate('/'); else props.onEnded();}}
        helpTexts={helpText}
        availableColors={availableColors}
        showHelp
      />
      <div class="absolute right-20 bottom-20">
        <canvas id="thumbnail-preview" class="h-thumbnail w-thumbnail hidden" width={208} height={156} />
          {/* <img width={128} height={128} src={thumbnail()} /> */}
      </div>
      {/* <canvas class="hidden" id="thumnail-canvas" /> */}
    </div>
  );
}
