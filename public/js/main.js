import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.141.0/examples/jsm/controls/OrbitControls.js';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';
import Sun from './Sun.js';
import Moon from './Moon.js';

const block = 1;

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, .1, 3000 );
camera.position.z = 100;  
camera.position.set(0, 150, 300);
camera.lookAt(scene.position);
scene.add( camera );

var renderer = new THREE.WebGLRenderer({canvas: myCanvas, antialias: true});
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var controls = new OrbitControls( camera, renderer.domElement );
controls.update();

// Geometry TEMP
var geometry = new THREE.PlaneGeometry(500, 500, 50, 50);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
var terrain = new THREE.Mesh(geometry, material);
terrain.rotation.x = -0.5 * Math.PI;
scene.add(terrain);

// Apply Perlin noise to the terrain
var noise = new ImprovedNoise();
var vertices = terrain.geometry.attributes.position.array;
var size = 500, segments = 50, halfSize = size / 2, maxHeight = 50;

// Generates the vertices and added the perlin noise to the y value
for (var i = 0; i <= segments; i++) {
    for (var j = 0; j <= segments; j++) {
        var x = i / segments * size - halfSize;
        var z = j / segments * size - halfSize;
        var y = noise.noise(x / 100, z / 100, 0) * maxHeight;
        vertices[(i * (segments + 1) + j) * 3 + 2] = y;
    }
}

terrain.geometry.attributes.position.needsUpdate = true;
terrain.geometry.computeVertexNormals();

// Load texture
var textureLoader = new THREE.TextureLoader();
var terrainTexture = textureLoader.load('./textures/coast_sand_rocks_02_diff_4k.jpg');
terrainTexture.wrapS = terrainTexture.wrapT = THREE.RepeatWrapping;
terrainTexture.repeat.set(5, 5);

// Update material to use the texture
material = new THREE.MeshPhongMaterial({ map: terrainTexture });
terrain.material = material;

// Add lighting
var ambientLight = new THREE.AmbientLight(0x404040,0.2); // soft white light
scene.add(ambientLight);

var sun = new Sun(block);
var moon = new Moon(block);

var clock = new THREE.Clock();

scene.add(sun);
scene.add(sun.helper);
scene.add(sun.mesh);
scene.add(moon);
scene.add(moon.helper);
scene.add(moon.mesh);

function animate() {
    var d = clock.getDelta();

    controls.update();

    sun.update(d);
    sun.helper.update();

    moon.update(d);
    moon.helper.update();

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
animate();

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
    }
}

document.addEventListener( "keydown", keyHandler, false );
