precision mediump float;
uniform sampler2D u_image_a;
varying vec2 v_texCoord;
uniform float currentTime;

float noise( in vec3 x)
{
  vec3 p = floor(x);
  vec3 f = fract(x);
	f = f*f*(3.0-2.0*f);
	vec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
	vec2 rg = texture2D(u_image_a, (uv+ 0.5)/256.0, 0.0 ).yx;
	return 1. - 0.82*mix( rg.x, rg.y, f.z );
}

void main(){
  vec4 color_a = texture2D(u_image_a, v_texCoord);
  for (float i = 0.; i < 1.; i+=.3)
  {
    vec2 coord = v_texCoord * i + noise(vec3(i + currentTime))/10.;
    vec4 d = texture2D(u_image_a, coord );
    color_a += pow(d, vec4(2.5));
  }
	gl_FragColor = color_a * .80;
}