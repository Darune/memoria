precision mediump float;
uniform sampler2D u_image_a;
varying vec2 v_texCoord;
uniform float currentTime;

vec2 curve(vec2 uv)
{
	uv = (uv - 0.5) * 2.0;
	uv *= 1.1;
	uv.x *= 1.0 + pow((abs(uv.y) / 5.0), 2.0);
	uv.y *= 1.0 + pow((abs(uv.x) / 4.0), 2.0);
	uv  = (uv / 2.0) + 0.5;
	uv =  uv *0.92 + 0.04;
	return uv;
}

void main( )
{
    //Curve
    // vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 uv = curve( v_texCoord );

    vec3 col;

    // Chromatic
    col.r = texture2D(u_image_a,vec2(uv.x+0.003,uv.y)).x;
    col.g = texture2D(u_image_a,vec2(uv.x+0.000,uv.y)).y;
    col.b = texture2D(u_image_a,vec2(uv.x-0.003,uv.y)).z;

    col *= step(0.0, uv.x) * step(0.0, uv.y);
    col *= 1.0 - step(1.0, uv.x) * 1.0 - step(1.0, uv.y);

    col *= 0.5 + 0.5*16.0*uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y);
    col *= vec3(0.95,1.05,0.95);

    col *= 0.9+0.1*sin(10.0*currentTime+uv.y*700.0);

    col *= 0.99+0.01*sin(110.0*currentTime);

    gl_FragColor = vec4(col,1.0);
}