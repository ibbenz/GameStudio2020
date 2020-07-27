---
type: fragment
uniform.iChannel0: { "type": "sampler2D", "value": null, "textureData": { "repeat": true } }
---

precision mediump float;

uniform vec2 resolution;
uniform float time;
uniform sampler2D iChannel0;

varying vec2 fragCoord;

void main() {
    vec2 uv = -1.0 + 2.0 * fragCoord.xy / resolution.xy;

    if (length(uv) > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        return;
    }
    
    vec4 color = vec4(0.37, 0.35, 1, 1);
    vec3 normal = vec3(uv, sqrt(1.0 - uv.x * uv.x - uv.y * uv.y));
    vec4 c = texture2D(iChannel0, uv + time);
    float val = 1.0 - abs(dot(vec3(0.0, 0.0, 1.0), normal));


    gl_FragColor = color * c * val * val;
}