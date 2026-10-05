precision highp float;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform sampler2D uTexture;

uniform float uAspectRatio;
uniform float uTime;
uniform float uScrollVelocity;
uniform float uMouseEnter;

uniform vec2 uMouseOverPos;

varying vec2 vTextureCoord;


/* ---------------------------------------
   Simplex 2D Noise
--------------------------------------- */

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
    return mod289(
        ((x * 34.0) + 1.0) * x
    );
}

float snoise(vec2 v) {

    const vec4 C =
        vec4(
            0.211324865405187,
            0.366025403784439,
           -0.577350269189626,
            0.024390243902439
        );

    vec2 i =
        floor(
            v +
            dot(
                v,
                C.yy
            )
        );

    vec2 x0 =
        v -
        i +
        dot(
            i,
            C.xx
        );

    vec2 i1;

    if (x0.x > x0.y) {
        i1 = vec2(1.0, 0.0);
    } else {
        i1 = vec2(0.0, 1.0);
    }

    vec4 x12 =
        x0.xyxy +
        C.xxzz;

    x12.xy -= i1;

    i = mod289(i);

    vec3 p =
        permute(
            permute(
                i.y +
                vec3(
                    0.0,
                    i1.y,
                    1.0
                )
            )
            +
            i.x +
            vec3(
                0.0,
                i1.x,
                1.0
            )
        );

    vec3 m =
        max(
            0.5 -
            vec3(
                dot(x0, x0),
                dot(x12.xy, x12.xy),
                dot(x12.zw, x12.zw)
            ),
            0.0
        );

    m = m * m;
    m = m * m;

    vec3 x =
        2.0 *
        fract(
            p * C.www
        ) -
        1.0;

    vec3 h =
        abs(x) -
        0.5;

    vec3 ox =
        floor(
            x +
            0.5
        );

    vec3 a0 =
        x -
        ox;

    m *=
        1.79284291400159 -
        0.85373472095314 *
        (
            a0 * a0 +
            h * h
        );

    vec3 g;

    g.x =
        a0.x * x0.x +
        h.x * x0.y;

    g.yz =
        a0.yz *
        x12.xz +
        h.yz *
        x12.yw;

    return 130.0 *
        dot(
            m,
            g
        );
}


/* ---------------------------------------
   Main
--------------------------------------- */

void main() {

    /*
     * Original shader settings
     */

    float noiseDetails = 500.0;
    float noiseSpread = 10.0;

    float circleRadius = 0.2;

    float falloffWidth = 0.5;


    vec2 textureCoord =
        vTextureCoord;


    /* -----------------------------------
       Mouse position

       JS gives us:
       0 -> 1

       Convert to:
       -1 -> 1
    ----------------------------------- */

    vec2 mousePosition =
        uMouseOverPos * 2.0 - 1.0;


    /* -----------------------------------
       Current texture position

       0 -> 1
       becomes
       -1 -> 1
    ----------------------------------- */

    vec2 centeredUV =
        vTextureCoord * 2.0 - 1.0;


    /* -----------------------------------
       Aspect ratio correction
    ----------------------------------- */

    vec2 mousePositionCorrected =
        vec2(
            mousePosition.x,
            mousePosition.y / uAspectRatio
        );


    vec2 currentPositionCorrected =
        centeredUV;


    /*
     * Distance from cursor
     */

    float distanceFromMouse =
        distance(
            mousePositionCorrected,
            currentPositionCorrected
        );


    /* -----------------------------------
       Circular mask

       Inside circle:
       0

       Outside circle:
       1
    ----------------------------------- */

    float noiseMask =
        smoothstep(
            circleRadius,
            circleRadius + falloffWidth,
            distanceFromMouse
        );


    /* -----------------------------------
       Noise
    ----------------------------------- */

    float noise =
        snoise(
            vTextureCoord *
            noiseDetails
        ) * 0.01;


    /*
     * Optional tiny movement based on time.
     *
     * Keeps original effect subtle.
     */

    float animatedNoise =
        snoise(
            vTextureCoord *
            noiseDetails +
            vec2(
                uTime * 0.15,
                uTime * 0.10
            )
        ) * 0.01;


    /*
     * Blend static + animated noise
     */

    float finalNoise =
        mix(
            noise,
            animatedNoise,
            0.25
        );


    /* -----------------------------------
       Apply distortion
    ----------------------------------- */

    float distortion =
        noiseMask *
        noiseSpread *
        finalNoise *
        uMouseEnter;


    textureCoord.x += distortion;
    textureCoord.y += distortion;


    /* -----------------------------------
       Texture
    ----------------------------------- */

    gl_FragColor =
        texture2D(
            uTexture,
            textureCoord
        );
}