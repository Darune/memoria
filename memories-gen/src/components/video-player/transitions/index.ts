import crossFade from './crossfade';

export default function getTransitionNode(videoContext, transitionDefinition) {
  switch (transitionDefinition.type) {
    case 'crossfade':
      return crossFade(videoContext, transitionDefinition.start, transitionDefinition.stop);
      break;

    default:
      return null
      break;
  }
}