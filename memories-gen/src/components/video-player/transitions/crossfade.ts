import VideoContext from 'videocontext';


export default function CrossFade(videoContext, start, stop) {
  const node = videoContext.transition(VideoContext.DEFINITIONS.CROSSFADE);
  node.transition(start, stop, 0.0, 1.0, 'mix');
  return node;
}