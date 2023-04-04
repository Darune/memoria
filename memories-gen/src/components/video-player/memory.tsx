import { createEffect, createSignal, onMount } from "solid-js";
import { Memory } from "~/data/model";
import VideoContext from 'videocontext';

var combineDecription ={
  title:"Combine",
  description: "A basic effect which renders the input to the output, Typically used as a combine node for layering up media with alpha transparency.",
  vertexShader : `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    void main() {
      gl_Position = vec4(vec2(2.0,2.0)*a_position-vec2(1.0, 1.0), 0.0, 1.0);
      v_texCoord = a_texCoord;
    }`,
  fragmentShader : `
    precision mediump float;
    uniform sampler2D u_image;
    varying vec2 v_texCoord;
    varying float v_mix;
    void main(){
      vec4 color = texture2D(u_image, v_texCoord);
      gl_FragColor = color;
    }`,
  properties:{
  },
  inputs:["u_image"]
};

export default function MemoryPlayer(props) {
  onMount(() => {
    console.log('onMount');
    const canvasRef = document.getElementById('video-canvas');
    const videoContext = new VideoContext(canvasRef);
    const videoNodes = []
    let idx = 0 ;
    let currentDuration = 0;
    const combineEffect = videoContext.compositor(combineDecription);
    for (const clip of props.memory.clips) {
      videoNodes[idx] = videoContext.video(`/api/clip/${clip.name}`, clip.start, clip.stop);
      videoNodes[idx].startAt(currentDuration);
      videoNodes[idx].stopAt(currentDuration + clip.duration);
      videoNodes[idx].connect(combineEffect);
      currentDuration += clip.duration;
      idx += 1;
    }
    combineEffect.connect(videoContext.destination);
    videoContext.play();
  });
  return (
    <div>
      <canvas id="video-canvas" width="1000px" height="800px">
      </canvas>
    </div>
  );
}
