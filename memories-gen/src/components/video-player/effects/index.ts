import { EffectType } from "~/data/model";
import { default as fadeDenifinition, OPERAND_TYPE_MULT,  OPERAND_TYPE_DIVIDE } from './fade/fade';
import { default as echoDefinition } from './echo/echo';
import { default as colorbarDefinition } from './colorbar/colorbar';
import { default as crtDefinition } from './crt/crt';
import VideoContext from 'videocontext';


function fadeTransitionNode(definition, transitionParameter, operand) {
  return (videoContext, start, stop) => {
    const node = videoContext.transition(definition)
    node.transition(start, stop, transitionParameter.from, transitionParameter.to);
    node.destination = transitionParameter.to;
    node.operand = operand;
    return node;
  }
}

function basicEffectNode(definition) {
  return (videoContext) => {
    const node = videoContext.effect(definition)
    return node;
  }
}

const effects = {
  'fade_flash_to_norm': fadeTransitionNode(fadeDenifinition, {from: 0.0, to: 1.0}, OPERAND_TYPE_DIVIDE),
  'fade_norm_to_flash': fadeTransitionNode(fadeDenifinition, {from: 1.0, to: 0.0}, OPERAND_TYPE_DIVIDE),
  'fade_black_to_norm': fadeTransitionNode(fadeDenifinition, {from: 0.0, to: 1.0}, OPERAND_TYPE_MULT),
  'fade_norm_to_black': fadeTransitionNode(fadeDenifinition, {from: 1.0, to: 0.0}, OPERAND_TYPE_MULT),
  'echo': basicEffectNode(echoDefinition),
  'colorbar': basicEffectNode(colorbarDefinition),
  'crt': basicEffectNode(crtDefinition),
  'monochrome': basicEffectNode(VideoContext.DEFINITIONS.MONOCHROME)
};

export default function getEffectNode(videoContext, EffectDefinition: EffectType) {
  const effect = effects[EffectDefinition.type];
  if (!effect) {
    return;
  }
  return effect(videoContext, EffectDefinition.start, EffectDefinition.stop);
}