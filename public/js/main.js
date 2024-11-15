import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.141.0/examples/jsm/controls/OrbitControls.js';
import Sun from './Sun.js';
import Moon from './Moon.js';
import { Tree } from "./Tree.js"

const block = 1;

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


//orbit controls to make tree test easier 
var controls = new OrbitControls( camera, renderer.domElement );
controls.update();


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

let tree = new Tree(4);
tree.fractalTreeGenerate(5);
scene.add(tree.tree_group)

let tree2 = new Tree(3);
tree2.barnsleyFern(5);
tree2.tree_group.translateZ(15);
tree2.tree_group.translateX(15);
scene.add(tree2.tree_group);


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

// Create terrain mesh
const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
terrain.rotation.x = -Math.PI / 2;
scene.add(terrain);

const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

// Camera settings and movement
const speed = 0.5; // Walking speed
let isMovingForward = false;
let isMovingBackward = false;
let isMovingLeft = false;
let isMovingRight = false;
camera.position.set(0, 10, 30);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Get terrain height at given camera position
function getTerrainHeight(x, z) {
  const noiseX = x / noiseScale;
  const noiseZ = z / noiseScale;
  return noise.perlin2(noiseX, noiseZ) * heightMultiplier;
}

// Update camera height to match terrain height
function updateCameraPosition() {
  if (isMovingForward) camera.position.z -= speed;
  if (isMovingBackward) camera.position.z += speed;
  if (isMovingLeft) camera.position.x -= speed;
  if (isMovingRight) camera.position.x += speed;

  // Update camera's y-position based on terrain height
  const terrainHeight = getTerrainHeight(camera.position.x, camera.position.z);
  camera.position.y = terrainHeight + 5; // Adjusted to keep camera above the terrain
}

// Update terrain offsets for infinite scrolling effect
function updateOffsets() {
  // Adjust the offset when the camera moves beyond the threshold
  if (Math.abs(camera.position.x) > movementThreshold) {
    offsetX += (camera.position.x > 0 ? 1 : -1) * movementThreshold;
    camera.position.x = camera.position.x > 0 ? -movementThreshold : movementThreshold;
  }

  if (Math.abs(camera.position.z) > movementThreshold) {
    offsetY += (camera.position.z > 0 ? 1 : -1) * movementThreshold;
    camera.position.z = camera.position.z > 0 ? -movementThreshold : movementThreshold;
  }
}

var sun = new Sun(block);
var moon = new Moon(block);

var clock = new THREE.Clock();

scene.add(sun);
scene.add(sun.helper);
scene.add(sun.mesh);
scene.add(moon);
scene.add(moon.helper);
scene.add(moon.mesh);

updateTerrain();
// Render loop
function animate() {
    requestAnimationFrame(animate);

    var d = clock.getDelta();

    sun.update(d);
    sun.helper.update();

    moon.update(d);
    moon.helper.update();

    updateOffsets();
    //updateCameraPosition();

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
            console.log("sun shadow cast: ", sun.castShadow)
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
    }
}

document.addEventListener( "keydown", keyHandler, false );
