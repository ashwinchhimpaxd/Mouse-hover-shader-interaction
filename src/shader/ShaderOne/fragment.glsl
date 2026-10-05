precision highp float;

uniform sampler2D uTexture;

uniform vec2 uMouse;
uniform float uMouseEnter;
uniform float uStrength;
uniform float uAspect;

varying vec2 vUv;


vec2 invertedBulge(vec2 uv) {

    vec2 mouse = uMouse;

    vec2 position = uv - mouse;

    // Keep the distortion circular even if the image is not square
    position.x *= uAspect;

    float distanceFromMouse = length(position);

    float strength =
        min(distanceFromMouse, 2.0) * uStrength;

    float inverseStrength =
        1.0 / (1.0 + strength);

    position *= inverseStrength;

    position.x /= uAspect;

    return position + mouse;
}


void main() {

    vec2 distortedUV =
        invertedBulge(vUv);

    vec2 finalUV =
        mix(
            vUv,
            distortedUV,
            uMouseEnter
        );

    vec4 color =
        texture2D(
            uTexture,
            finalUV
        );

    gl_FragColor = color;
}