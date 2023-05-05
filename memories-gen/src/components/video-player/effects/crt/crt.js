import vertexShader from "./crt.vert?raw&inline";
import fragmentShader from "./crt.frag?raw&inline";

let Crt = {
    title: "Add crt effect ",
    description:
        "An effect that adds a crt effect to the video",
    vertexShader,
    fragmentShader,
    properties: {},
    inputs: ["u_image_a"]
};

export default Crt;