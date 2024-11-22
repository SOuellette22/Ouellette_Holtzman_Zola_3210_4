import * as THREE from 'three';
import Sun from './Sun.js';
import Moon from './Moon.js';
import Terrain from "./Terrain.js";
import MaterialLoader from './MaterialLoader.js';
import { Tree } from "./Tree.js"
import Stats from 'https://unpkg.com/three@0.141.0/examples/jsm/libs/stats.module.js';

const block = 1;
const blockNumber = 50;
const padding = 3;
const walkSpeed = 5; 
const lookSpeed = 0.002; 

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(0,0);

let isMovingForward = false;
let isMovingBackward = false;
let isMovingLeft = false;
let isMovingRight = false;

const velocity = new THREE.Vector3();
const trees = [];

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
camera.position.set(0, 1.7, 5);
camera.lookAt(0, 1.7, 0);

//const controls = new OrbitControls(camera, renderer.domElement);
//controls.update();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

const matLoader = new MaterialLoader();
const terrain = new Terrain(block, blockNumber, 5, 10, matLoader);
scene.add(terrain);


//create forest 
for (let i = -(blockNumber / 2) + padding; i < blockNumber / 2 - padding; i += 5) {
    for (let j = -(blockNumber / 2) + padding; j < blockNumber / 2 - padding; j += 5) {
        let tree = new Tree(block, matLoader);
        let rand = Math.random();
        if (rand < 0.3) {
            tree.fractalTreeGenerate(4);
        }
        else if (rand < 0.6) {
            tree.randTree(THREE.MathUtils.randInt(3, 4))
        }
        else {
            tree.barnsleyFern(3)
        }

        let x = i + THREE.MathUtils.randInt(-padding, padding);
        let z = j + THREE.MathUtils.randInt(-padding, padding);
        let y = terrain.yMatrix[x + blockNumber / 2][z + blockNumber / 2]

        tree.group.position.set(x, Math.floor(y) - 10, z)

        //rotate tree randomly 
        tree.group.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / THREE.MathUtils.randFloatSpread(2))
        tree.computBoundingBox();

        scene.add(tree.group);
        trees.push(tree);

    }
}

const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

var sun = new Sun(block, blockNumber);

var moon = new Moon(block, blockNumber);

var clock = new THREE.Clock();

scene.add(sun);
scene.add(sun.mesh);
scene.add(moon);
scene.add(moon.mesh);

// Stats
const stats = new Stats();
document.body.appendChild(stats.dom);

// Enable pointer lock on click
document.body.addEventListener("click", () => {
    if (document.pointerLockElement === renderer.domElement) {
        selectedObject.parent.remove(selectedObject)
    }else {
        renderer.domElement.requestPointerLock();
    }
    
});

// Log pointer lock state changes
document.addEventListener("pointerlockchange", () => {
    if (document.pointerLockElement === renderer.domElement) {
        console.log("Pointer locked.");
    } else {
        console.log("Pointer unlocked.");
    }
});

// Variables to track rotation
let yaw = 0; // Left/right rotation
let pitch = 0; // Up/down rotation

document.addEventListener("mousemove", (event) => {
    if (document.pointerLockElement === renderer.domElement) {
        // Update yaw (horizontal rotation) and pitch (vertical rotation)
        yaw += event.movementX * lookSpeed;
        pitch += event.movementY * lookSpeed;

        // Clamp pitch to avoid unnatural head movement (look up/down limit)
       pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, pitch));

        // Apply rotations to the camera
        camera.rotation.set(pitch, yaw, 0);
    }
});

// Keydown and keyup events
window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "w": isMovingForward = true; break;
        case "s": isMovingBackward = true; break;
        case "a": isMovingLeft = true; break;
        case "d": isMovingRight = true; break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "w": isMovingForward = false; break;
        case "s": isMovingBackward = false; break;
        case "a": isMovingLeft = false; break;
        case "d": isMovingRight = false; break;
    }
});

// Resize handling
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Update camera movement logic
function updateCameraMovement(delta) {
    velocity.set(0, 0, 0);

    // Movement input handling
    if (isMovingForward) velocity.z += walkSpeed * delta;
    if (isMovingBackward) velocity.z -= walkSpeed * delta;
    if (isMovingLeft) velocity.x += walkSpeed * delta;
    if (isMovingRight) velocity.x -= walkSpeed * delta;

    // Apply direction to velocity
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    const right = new THREE.Vector3().crossVectors(camera.up, direction).normalize();

    const forward = new THREE.Vector3().copy(direction).setY(0).normalize();
    const strafe = new THREE.Vector3().copy(right).setY(0).normalize();

    // Combine forward and strafe velocity
    const movement = new THREE.Vector3()
        .addScaledVector(forward, velocity.z)
        .addScaledVector(strafe, velocity.x);

    let oldPos = camera.position.clone();
    camera.position.add(movement);

    if(camera.position.x > Math.floor(blockNumber-(blockNumber/2)) - 1.1){
        camera.position.x= Math.floor(blockNumber-(blockNumber/2 )) - 1.1 
    }
    
    if(camera.position.x <-Math.floor(blockNumber/2) + 1){
        camera.position.x= -Math.floor(blockNumber/2) + 1; 
    }

    if(camera.position.z >Math.floor(blockNumber-(blockNumber/2)) - 2){
        camera.position.z= Math.floor(blockNumber-(blockNumber/2)) - 2
    }
    
    if(camera.position.z <-Math.floor(blockNumber/2) + 1){
        camera.position.z= -Math.floor(blockNumber/2) + 1; 
    }

    for (let tree of trees) {
        if (tree.isPointIntersecting(camera.position)) {
            console.error("Hitting tree");
            camera.position.set(oldPos.x, oldPos.y, oldPos.z);
        }
    }

    var x= camera.position.x+(blockNumber/2); 
    var z= camera.position.z+(blockNumber/2); 
    camera.position.y=terrain.yMatrix.at(Math.floor(x)).at(Math.floor(z))- terrain.height+2;
}

// Resize handling
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});


let selectedObject;

//Render loop
function animate() {
    stats.begin();
    var d = clock.getDelta();

    sun.update(d);
    moon.update(d);

    updateCameraMovement(d);

   // controls.update();

    // updateTerrain();
    // updateOffsets();
    // updateCameraPosition();

    // update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );
    let firstIntersected;
    
	// calculate objects intersecting the picking ray
    for (let intersectedObj of raycaster.intersectObjects( scene.children)) {
        if (intersectedObj && intersectedObj.object && intersectedObj.object.isMesh) {
            firstIntersected = intersectedObj;
            break;
        }
    }

    //if intersected object 
    if (firstIntersected && firstIntersected.object && firstIntersected.object.isMesh) {
        if (selectedObject) {
            selectedObject.material.emissive = new THREE.Color(0x000000);
        }
        //console.log(firstIntersected.object)
        if (firstIntersected.object.isBlock && Object.getPrototypeOf(firstIntersected.object.material) === Array.prototype) {
            selectedObject = firstIntersected.object
            for (let mat of selectedObject.material) {
                mat.emissive = new THREE.Color(0xFF0000);
            }
        }
        else if (firstIntersected.object.material) {
            selectedObject = firstIntersected.object;
            //console.log("Highlighting tree")
            firstIntersected.object.material.emissive = new THREE.Color(0xFF0000);
        }
    }
    else {
        if (selectedObject) {
            selectedObject.material.emissive = new THREE.Color(0x000000)
        }
    }
    stats.end();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

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
document.addEventListener("keydown", keyHandler, false);

// Create a center dot element
const centerDot = document.createElement("div");
centerDot.style.position = "absolute";
centerDot.style.width = "8px"; 
centerDot.style.height = "8px"; 
centerDot.style.backgroundColor = "red"; 
centerDot.style.borderRadius = "50%"; 
centerDot.style.top = "50%"; 
centerDot.style.left = "50%";
centerDot.style.transform = "translate(-50%, -50%)"; 
centerDot.style.pointerEvents = "none"; 
document.body.appendChild(centerDot);


