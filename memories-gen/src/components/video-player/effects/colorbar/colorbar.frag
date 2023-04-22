precision mediump float;
uniform sampler2D u_image_a;
varying vec2 v_texCoord;
uniform float currentTime;

void main(){
  vec4 color_a = texture2D(u_image_a, v_texCoord);

  // Desaturate
  // if(v_texCoord.x < .25) {
	// 	color_a = vec4( (color_a.r+color_a.g+color_a.b)/3. );
	// }
	// Invert
	// else if (v_texCoord.x < .5) {
	// 	color_a = vec4(1.) - texture2D(u_image_a, v_texCoord);
  //   color_a.a = 1.;
	// }
	// Chromatic aberration
	if (v_texCoord.x < .50) {
		vec2 offset = vec2(.01,.0);
		color_a.r = texture2D(u_image_a, v_texCoord + offset.xy).r;
		color_a.g = texture2D(u_image_a, v_texCoord            ).g;
		color_a.b = texture2D(u_image_a, v_texCoord + offset.yx).b;
	}
	// color switching
	else {
		color_a.rgb = texture2D(u_image_a, v_texCoord).brg;
	}


	//Line
	// if( mod(abs(v_texCoord.x + .5/iResolution.y),.25) < 1./iResolution.y )
	// 	color_a = vec4(1.);


  gl_FragColor = color_a;
}