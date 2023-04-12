import { EffectType } from "~/data/model";
import { default as fadeDenifinition, OPERAND_TYPE_MULT,  OPERAND_TYPE_DIVIDE } from './fade/fade';

function fadeTransitionNode(definition, transitionParameter, operand) {
  return (videoContext, start, stop) => {
    const node = videoContext.transition(definition)
    node.transition(start, stop, transitionParameter.from, transitionParameter.to);
    node.destination = transitionParameter.to;
    node.operand = operand;
    return node;
  }
}

const effects = {
  'fade_flash_to_norm': fadeTransitionNode(fadeDenifinition, {from: 0.0, to: 1.0}, OPERAND_TYPE_DIVIDE),
  'fade_norm_to_flash': fadeTransitionNode(fadeDenifinition, {from: 1.0, to: 0.0}, OPERAND_TYPE_DIVIDE),
  'fade_black_to_norm': fadeTransitionNode(fadeDenifinition, {from: 0.0, to: 1.0}, OPERAND_TYPE_MULT),
  'fade_norm_to_black': fadeTransitionNode(fadeDenifinition, {from: 1.0, to: 0.0}, OPERAND_TYPE_MULT),
};

export default function getEffectNode(videoContext, EffectDefinition: EffectType) {
  const effect = effects[EffectDefinition.type];
  if (!effect) {
    return;
  }
  return effect(videoContext, EffectDefinition.start, EffectDefinition.stop);
}