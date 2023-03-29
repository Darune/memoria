import logo from './logo.svg';
import styles from './App.module.css';
import VideoContext from 'videocontext';
import { createSignal, createEffect, onMount  } from 'solid-js';
import gangman from './assets/gangnam.mp4';
import bigbuck from './assets/bigbuck.mp4';

var combineDecription = {
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
      uniform sampler2D u_image_a;
      uniform sampler2D u_image_b;
      varying vec2 v_texCoord;
      uniform float mix;
      varying float v_mix;
      varying float v_progress;
      void main(){
          if (v_texCoord[0] >= 0.5) {
            vec2 pos = vec2(v_texCoord[0]*1.0/0.5 - (1.0/0.5/2.0), v_texCoord[1]*1.0/1.0 - (1.0/1.0/2.0-0.5));
            vec4 color = texture2D(u_image_b, pos);
            color.a = 0.8;
            gl_FragColor = color;
          } else {
            vec2 pos = vec2(v_texCoord[0]*1.0/0.5 - (1.0/0.5/2.0-1.0), v_texCoord[1]*1.0/1.0 - (1.0/1.0/2.0-0.5));
            vec4 color = texture2D(u_image_a, pos);
            color.a = mix;
            gl_FragColor = color;
          }
      }`,
  properties:{
    mix: { type: "uniform", value: 0.0 }
  },
  inputs:["u_image_a", "u_image_b", "v_mix"]
};

function App() {
  const [playPause, setPlayPause] = createSignal(false);
  let videoContext;
  onMount(() => {
    const canvasRef = document.getElementById('canvas');
    videoContext = new VideoContext(canvasRef);
    var videoNode1 = videoContext.video(gangman, 0, 100, { volume: 0, loop: true });
    var videoNode2 = videoContext.video(bigbuck, 0, 100, { volume: 0, loop: true });

    videoNode1.startAt(0);
    videoNode1.stopAt(10);
    videoNode2.startAt(0);
    videoNode2.stopAt(10);
    var combineEffect = videoContext.effect(combineDecription);
    videoNode1.connect(combineEffect);
    videoNode2.connect(combineEffect);
    combineEffect.connect(videoContext.destination);
    combineEffect.transition(3, 8, 0.0, 1.0);
  });

  createEffect((prev) => {
    if (playPause()) {
      videoContext.play();
    } else {
      videoContext.pause();
    }
  });
  // Working only with volume = 0
  setTimeout(() => setPlayPause(true), 10);
  return (
    <div class={styles.App}>
      <canvas id="canvas" width="1280" height="720" style="width: 852px; height: 480px"></canvas>
      <div>
        <button onClick={() => setPlayPause(!playPause())}>{playPause() ? "pause" : "play"}</button>
      </div>
      {/* <img src={logo} class={styles.logo} alt="logo" /> */}
    </div>

  );[]
}

export default App;
