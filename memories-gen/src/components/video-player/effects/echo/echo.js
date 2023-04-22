import vertexShader from "./echo.vert?raw&inline";
import fragmentShader from "./echo.frag?raw&inline";

let Echo = {
    title: "Add echo style effect",
    description:
        "An effect that adds a type of echo to the video",
    vertexShader,
    fragmentShader,
    properties: {},
    inputs: ["u_image_a"]
};

export default Echo;