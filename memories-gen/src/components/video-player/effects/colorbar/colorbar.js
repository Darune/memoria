import vertexShader from "./colorbar.vert?raw&inline";
import fragmentShader from "./colorbar.frag?raw&inline";

let ColorBar = {
    title: "Add Color bar effect",
    description:
        "UnExplainable colorbar effect",
    vertexShader,
    fragmentShader,
    properties: {},
    inputs: ["u_image_a"]
};

export default ColorBar;