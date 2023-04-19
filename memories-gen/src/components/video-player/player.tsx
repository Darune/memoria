import { onMount, Show } from "solid-js";
import { MemoryType } from "~/data/model";
import VideoContext from 'videocontext';
import { Combine } from "./compositor/combine";
import getTransitionNode from "./transitions";
import getEffectNode from "./effects";


function InitVisualisations(videoCtx, graphCanvasID, visualisationCanvasID){
	/****************************
        * GUI setup
        *****************************/
        /*
        * Create an interactive visualisation canvas.
        */
        var visualisationCanvas = document.getElementById(visualisationCanvasID);
		RefreshGraph(videoCtx, graphCanvasID);


        //visualisationCanvas.height = 20;
        //visualisationCanvas.width = 390;
        //Setup up a render function so we can update the playhead position.
        function render () {
            //VideoCompositor.renderPlaylist(playlist, visualisationCanvas, videoCompositor.currentTime);
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
    }
    if (clip.transition) {
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
    globalOutput = fadeInEffect;
  }
  if (memory.fadeOut) {
    const fadeOutEffect = getEffectNode(videoContext, memory.fadeOut);
    globalOutput.connect(fadeOutEffect);
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

export default function MemoryPlayer(props: {memory: MemoryType, debug: boolean}) {
  onMount(() => {
    const canvasRef = document.getElementById('video-canvas');
    const videoContext = new VideoContext(canvasRef);

    const globalOutput = buildPlaybackGraph(videoContext, props.memory);
    globalOutput.connect(videoContext.destination);
    videoContext.play();
    if (props.debug) {
      InitVisualisations(videoContext, 'graph-canvas', 'visualisation-canvas');
    }
  });
  return (
    <div>
      <canvas id="video-canvas" width="1000px" height="800px"></canvas>
      <Show when={props.debug}>
        <div>
          <canvas id="visualisation-canvas" width="1000px" height="80"></canvas>
        </div>
        <div>
          <canvas id="graph-canvas" width="1000px" height="300"></canvas>
        </div>
      </Show>
    </div>
  );
}
