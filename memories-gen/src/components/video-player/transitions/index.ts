import crossFade from './crossfade';
import horizontalBlur from './horizontalblur';
import VideoContext from 'videocontext';

function basicTransition(definition) {
  return (videoContext, start, stop) => {
    const node = videoContext.transition(definition);
    node.transition(start, stop, 0.0, 1.0, 'mix');
    return node;
  }
}
const transitions = {
  'crossfade': basicTransition(VideoContext.DEFINITIONS.CROSSFADE),
  'to_color_and_back': basicTransition(VideoContext.DEFINITIONS.TO_COLOR_AND_BACK),
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