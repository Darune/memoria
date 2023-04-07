import crossFade from './crossfade';
import horizontalBlur from './horizontalblur';
import VideoContext from 'videocontext';

function basicTransition(definition) {
  return (videoContext, start, stop) => {
    const node = videoContext.transition(definition);
    node.transition(start, stop, 0.0, 1.0);
    return node;
  }
}
const transitions = {
  'crossfade': basicTransition(VideoContext.DEFINITIONS.CROSSFADE),
  'horizontal_wipe': basicTransition(VideoContext.DEFINITIONS.HORIZONTAL_WIPE),
}

export default function getTransitionNode(videoContext, transitionDefinition) {
  const transition = transitions[transitionDefinition.type];
  if (!transition) {
    return;
  }
  return transition(
    videoContext, transitionDefinition.start, transitionDefinition.stop
  );
}