import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.141.0/examples/jsm/controls/OrbitControls.js';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';
import Sun from './Sun.js';
import Moon from './Moon.js';
import Block from './Block.js';
import MaterialLoader from './MaterialLoader.js';
import Terrain from './Terrain.js';
import { GrammerEngine } from "./GrammerEngine.js"

const blockSize = 1;

//example of grammer engine remove later
let engine = new GrammerEngine();

var camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, .1, 3000 ); 
camera.position.set(0, 75, 75);
camera.lookAt(scene.position);
scene.add( camera );

engine.addRule("1", "11");
engine.addRule("0", "1[0]0")
//engine.addRule("0", "1[0]0", 0.5);

console.log(engine.generate("0", 5));

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();


renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Terrain parameters
const gridSize = 200;
const terrainGeometry = new THREE.PlaneGeometry(
  gridSize,
  gridSize,
  gridSize,
  gridSize
);

// Set random seed for Perlin noise
const randomSeed = Math.random();
noise.seed(randomSeed);

// Perlin noise parameters
const noiseScale = 10;
const heightMultiplier = 5;
let offsetX = 0;
let offsetY = 0;
const movementThreshold = 100;

// Update terrain based on Perlin noise
function updateTerrain() {
  for (let i = 0; i < terrainGeometry.attributes.position.count; i++) {
    const x = (terrainGeometry.attributes.position.getX(i) / noiseScale) + offsetX;
    const y = (terrainGeometry.attributes.position.getY(i) / noiseScale) + offsetY;
    const height = noise.perlin2(x, y) * heightMultiplier;
    terrainGeometry.attributes.position.setZ(i, height);
  }
  terrainGeometry.attributes.position.needsUpdate = true;
  terrainGeometry.computeVertexNormals();
}

// Load terrain texture
const textureLoader = new THREE.TextureLoader();
const terrainTexture = textureLoader.load("moss.webp");
terrainTexture.wrapS = terrainTexture.wrapT = THREE.RepeatWrapping;
terrainTexture.repeat.set(20, 20);

const terrainMaterial = new THREE.MeshStandardMaterial({
  map: terrainTexture,
  flatShading: true,
});


// Geometry TEMP
// var geometry = new THREE.PlaneGeometry(500, 500, 50, 50);
// var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
// var terrain = new THREE.Mesh(geometry, material);
// terrain.rotation.x = -0.5 * Math.PI;
// scene.add(terrain);

// // Apply Perlin noise to the terrain
// var noise = new ImprovedNoise();
// var vertices = terrain.geometry.attributes.position.array;
// var size = 500, segments = 50, halfSize = size / 2, maxHeight = 50;

// // Generates the vertices and added the perlin noise to the y value
// for (var i = 0; i <= segments; i++) {
//     for (var j = 0; j <= segments; j++) {
//         var x = i / segments * size - halfSize;
//         var z = j / segments * size - halfSize;
//         var y = noise.noise(x / 100, z / 100, 0) * maxHeight;
//         vertices[(i * (segments + 1) + j) * 3 + 2] = y;
//     }
// }

// terrain.geometry.attributes.position.needsUpdate = true;
// terrain.geometry.computeVertexNormals();

// // Load texture
// var textureLoader = new THREE.TextureLoader();
// var terrainTexture = textureLoader.load('./textures/coast_sand_rocks_02_diff_4k.jpg');
// terrainTexture.wrapS = terrainTexture.wrapT = THREE.RepeatWrapping;
// terrainTexture.repeat.set(5, 5);

// // Update material to use the texture
// material = new THREE.MeshPhongMaterial({ map: terrainTexture });
// terrain.material = material;

var matLoader = new MaterialLoader();
// noise.seed(Math.random());

// var world = new THREE.Group();
// scene.add(world);

// var size = 50, maxHeight = 5;
// for (var i = 0; i < size; i++) {
//     for (var j = 0; j < size; j++) {
//         var y = noise.perlin2(i / 20, j / 20) * maxHeight + 8;
//         // console.log(y);

//         for (var k = 0; k < y; k++) {
//             var block = new Block(k, y, matLoader);
//             block.position.set(i - (size/2), k, j- (size/2));
//             world.add(block);
//         }
//     }
// }

// Builds the terrian
var terrain = new Terrain(blockSize, 10, 5, 10, matLoader);
scene.add(terrain);

// Add lighting
var ambientLight = new THREE.AmbientLight(0xffffff,0.2); // soft white light
scene.add(ambientLight);


var sun = new Sun(blockSize);
var moon = new Moon(blockSize);

var clock = new THREE.Clock();

scene.add(sun);
scene.add(sun.helper);
scene.add(sun.mesh);
scene.add(moon);
scene.add(moon.helper);
scene.add(moon.mesh);

// Render loop
function animate() {
    requestAnimationFrame(animate);

    var d = clock.getDelta();

    sun.update(d);
    sun.helper.update();

    moon.update(d);
    moon.helper.update();

    updateTerrain();
    updateOffsets();
    updateCameraPosition();

    renderer.render(scene, camera);
}

animate();

// Keydown and keyup events for camera movement
window.addEventListener("keydown", (event) => {
    if (event.key === "w") isMovingForward = true;
    if (event.key === "s") isMovingBackward = true;
    if (event.key === "a") isMovingLeft = true;
    if (event.key === "d") isMovingRight = true;
});
window.addEventListener("keyup", (event) => {
    if (event.key === "w") isMovingForward = false;
    if (event.key === "s") isMovingBackward = false;
    if (event.key === "a") isMovingLeft = false;
    if (event.key === "d") isMovingRight = false;
});

// Resize handling
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

function keyHandler(e) {
    switch (e.key) {
        case 'm': // Q toggles shadows on and off
            sun.castShadow = !sun.castShadow;
        break;
        case 'p': // p will speed up the speed of the day night cycle up till 4 times speed
            if (sun.speed < Math.PI / 30) {
                sun.speed *= 2;
                moon.speed *= 2;
            }
        break;
        case 'o': // o will slow down the speed of the day night cycle down till 1/4 speed
            if (sun.speed > Math.PI / 480) {
                sun.speed /= 2;
                moon.speed /= 2;
            }
        break;
        case 'h': // h will toggle the visibility of the sun and moon helpers
            sun.helper.visible = !sun.helper.visible;
            moon.helper.visible = !moon.helper.visible;
        break;
    }
}

document.addEventListener( "keydown", keyHandler, false );
