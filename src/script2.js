import * as THREE from "three";

import vertexShader from "./shader/ShaderTwo/vertex2.glsl?raw";
import fragmentShader from "./shader/ShaderTwo/fragment2.glsl?raw";

/* ---------------------------------------
   Renderer
--------------------------------------- */

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

/* ---------------------------------------
   Scene
--------------------------------------- */
const scene = new THREE.Scene();
/* ---------------------------------------
   Camera
--------------------------------------- */
const camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 0.1, 2000);

camera.position.z = 10;

/* ---------------------------------------
   Texture
--------------------------------------- */

const textureLoader = new THREE.TextureLoader();

const texture = textureLoader.load("../public/building.jpg");

// texture.colorSpace = THREE.SRGBColorSpace;

texture.minFilter = THREE.LinearMipmapLinearFilter;

texture.magFilter = THREE.LinearFilter;

texture.generateMipmaps = true;

texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

/* ---------------------------------------
   Image / Plane Settings
--------------------------------------- */

const imageWidth = 500;
const imageHeight = 700;

/* ---------------------------------------
   Shader
--------------------------------------- */

const material = new THREE.ShaderMaterial({
    vertexShader, fragmentShader,

    uniforms: {
        uTexture: { value: texture },

        uMouseOverPos: { value: new THREE.Vector2(0.5, 0.5) },

        uMouseEnter: { value: 0 },

        uAspectRatio: { value: imageWidth / imageHeight },

        uTime: { value: 0 },

        uScrollVelocity: { value: 0 }
    }
});

/* ---------------------------------------
   Plane
--------------------------------------- */

const geometry = new THREE.PlaneGeometry(imageWidth, imageHeight, 1, 1);

const plane = new THREE.Mesh(geometry, material);

scene.add(plane);

/* ---------------------------------------
   Center Plane
--------------------------------------- */

function centerPlane() {
    plane.position.x = 0;
    plane.position.y = 0;
}

centerPlane();

/* ---------------------------------------
   Mouse + Raycaster
--------------------------------------- */

const mouse = new THREE.Vector2(0.5, 0.5);
const targetMouse = new THREE.Vector2(0.5, 0.5);

let targetEnter = 0;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function updatePointer(event) {
    const rect = renderer.domElement.getBoundingClientRect();

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;

    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const intersections = raycaster.intersectObject(plane, false);

    if (intersections.length > 0) {
        targetEnter = 1;

        const uv = intersections[0].uv;

        if (uv) {
            targetMouse.set(uv.x, uv.y);
        }

    } else {
        targetEnter = 0;
    }
}

renderer.domElement.addEventListener("pointermove", updatePointer);

/* ---------------------------------------
   Animation
--------------------------------------- */

const clock = new THREE.Timer();

function animate() {

    const elapsedTime = clock.getElapsed();
    material.uniforms.uTime.value = elapsedTime;
    /*
     * Smooth mouse movement
     */
    mouse.lerp(targetMouse, 0.05);
    // console.log(mouse)
    /*
     * Smooth enter / leave
     */
    material.uniforms.uMouseEnter.value += (targetEnter - material.uniforms.uMouseEnter.value) * 0.08;
    /*
     * Send mouse position to shader
     */
    material.uniforms.uMouseOverPos.value.copy(mouse);

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

animate();

/* ---------------------------------------
   Resize
--------------------------------------- */

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.left = -window.innerWidth / 2;

    camera.right = window.innerWidth / 2;

    camera.top = window.innerHeight / 2;

    camera.bottom = -window.innerHeight / 2;

    camera.updateProjectionMatrix();

    centerPlane();

}
);
