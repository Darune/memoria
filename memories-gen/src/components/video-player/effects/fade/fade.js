import vertexShader from "./fade.vert?raw&inline";
import fragmentShader from "./fade.frag?raw&inline";


export const OPERAND_TYPE_MULT = 1.0;
export const OPERAND_TYPE_DIVIDE = 0.0;


let FadeIn = {
    title: "To Color And Back Fade",
    description:
        "A fade in transition.",
    vertexShader,
    fragmentShader,
    properties: {
        mix: { type: "uniform", value: 0.0 },
        operand: { type: "uniform", value: OPERAND_TYPE_MULT },
        destination: { type: "uniform", value: 1.0 },
    },
    inputs: ["u_image_a"]
};

export default FadeIn;