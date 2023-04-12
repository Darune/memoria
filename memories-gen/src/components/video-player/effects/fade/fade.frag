precision mediump float;
uniform sampler2D u_image_a;
uniform float mix;
uniform float destination;
uniform float operand;
varying vec2 v_texCoord;
varying float v_mix;

void main(){
    vec4 color_a = texture2D(u_image_a, v_texCoord);
    float mix_amount = mix * 1.0;
    if (mix_amount == destination) {
        gl_FragColor = color_a;
    } else {
        if (operand == 1.0) {
            gl_FragColor =  color_a * abs(mix_amount);
        } else {
            gl_FragColor =  color_a / abs(mix_amount);
        }
    }
}