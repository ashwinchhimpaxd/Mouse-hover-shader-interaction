import * as THREE from "three";

import vertexShader from "./shader/ShaderOne/vertex.glsl?raw";
import fragmentShader from "./shader/ShaderOne/fragment.glsl?raw";


/* ---------------------------------------
   Renderer
--------------------------------------- */

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.setSize(window.innerWidth, window.innerHeight);


document.body.appendChild(renderer.domElement);

// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.OrthographicCamera(
    -window.innerWidth / 2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    -window.innerHeight / 2,
    0.1,
    1000
);

camera.position.z = 10;

/* ---------------------------------------
   Texture
--------------------------------------- */

const textureLoader = new THREE.TextureLoader();

const texture = textureLoader.load("../public/building.jpg");

texture.minFilter = THREE.LinearMipmapLinearFilter;

texture.magFilter = THREE.LinearFilter;

texture.generateMipmaps = true;

texture.anisotropy = renderer.capabilities.getMaxAnisotropy();


/* ---------------------------------------
   Image / Plane Settings
--------------------------------------- */
let imageWidth = Math.round((window.innerWidth / 2) * 0.5);
let imageHeight = Math.round((window.innerHeight / 2) * 1);

/* ---------------------------------------
   Shader
--------------------------------------- */

const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        uTexture: { value: texture },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uMouseEnter: { value: 0 },
        uStrength: { value: 0.4 },
        uAspect: { value: imageWidth / imageHeight }
    }
});

/* ---------------------------------------
   Plane
--------------------------------------- */
const geometry = new THREE.PlaneGeometry(imageWidth, imageHeight, 1, 1);
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);


//   Center Plane
function centerPlane() {
    plane.position.x = 0;
    plane.position.y = 0;
}
centerPlane();

//    Mouse + Raycaster
const mouse = new THREE.Vector2(0.5, 0.5);
const targetMouse = new THREE.Vector2(0.5, 0.5);

let targetEnter = 0;

const raycaster = new THREE.Raycaster();

const pointer = new THREE.Vector2();

let isFullscreen = false;

function updatePointer(event) {

    const rect = renderer.domElement.getBoundingClientRect();

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;

    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    /* Check whether mouse is actually over the image plane.*/
    const intersections = raycaster.intersectObject(plane, false);

    if (intersections.length > 0) {
        /* Mouse is INSIDE the image. Enable shader. */
        targetEnter = 1;
        const uv = intersections[0].uv;

        if (uv) {
            targetMouse.set(uv.x, uv.y);
        }
    } else {
        //   Mouse is outside the image.  Disable shader.
        targetEnter = 0;
    }
}

// mouse event raised here 
renderer.domElement.addEventListener("pointermove", updatePointer);

//  Animation
function animate() {
    requestAnimationFrame(animate);
    /*  Smooth mouse movement */
    mouse.lerp(targetMouse, 0.08);
    /*  Smooth enter / leave */
    material.uniforms.uMouseEnter.value += (targetEnter - material.uniforms.uMouseEnter.value) * 0.08;
    /*  Send mouse position to shader */
    material.uniforms.uMouse.value.copy(mouse);
    renderer.render(scene, camera);
}
animate();

//   Resize
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.left = -window.innerWidth / 2;
    camera.right = window.innerWidth / 2;
    camera.top = window.innerHeight / 2;
    camera.bottom = -window.innerHeight / 2;
    camera.updateProjectionMatrix();
    centerPlane();

    if (isFullscreen) {
        plane.scale.set(window.innerWidth / imageWidth, window.innerHeight / imageHeight, 1);
        material.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
    }
}
);