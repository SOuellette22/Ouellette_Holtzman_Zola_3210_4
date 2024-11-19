import * as THREE from 'three';

export default class Moon extends THREE.DirectionalLight{
    /**
     * Constucts the moon object for the scene
     * 
     * @param {Number} block makes sure sizing is correct throughout the scene
     */
    constructor(block, blockNumber) {
        super(0x98c1fa, 0.1);

        this.distance = blockNumber * block;

        this.position.set(-Math.cos(Math.PI/6) * this.distance, -Math.sin(Math.PI/6) * this.distance, 0);
        this.castShadow = true;
        this.helper = new THREE.DirectionalLightHelper(this, 5);

        this.geometry = new THREE.SphereGeometry(block * (blockNumber/10), 32, 32);
        const loader = new THREE.TextureLoader();
        this.material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: loader.load("public/textures/moonmap.jpg") });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(-Math.cos(Math.PI/6) * this.distance, -Math.sin(Math.PI/6) * this.distance, 0);

        this.speed = Math.PI / 120;
    }

    /**
     * Updates the moons position in space
     * 
     * @param {Number} d is the delta time between frames
     */
    update(d) {
        const x = this.position.x;

        this.rotateAboutWorldAxis(this, new THREE.Vector3(0, 0, 10), this.speed * d);
        this.rotateAboutWorldAxis(this.mesh, new THREE.Vector3(0, 0, 10), this.speed * d);
        this.mesh.lookAt(0,0,0);
        
        if (x <= this.distance && x >= Math.cos(Math.PI/18) * this.distance) {
            var cp = this.distance;
            var np = Math.cos(Math.PI/18) * this.distance;
            this.intensity = this.findIntensity(cp, np, 0, 0.1, x);
        }

        if (x <= Math.cos(Math.PI*17/18) * this.distance && x >= -this.distance) {
            var cp = Math.cos(Math.PI*17/18) * this.distance;
            var np = -this.distance;
            this.intensity = this.findIntensity(cp, np, 0.1, 0, x);
        }

        if (this.position.y < 0) {
            this.intensity = 0;
        }

    }

    /**
     * This function rotates an object about a given axis
     * 
     * @param {THREE.Object3D} object 3D object you want to rotate
     * @param {THREE.Vector3} axis Axis you want to rotate the object about
     * @param {Number} angle How fast you want the object to rotate in radians
     */
    rotateAboutWorldAxis(object, axis, angle) {
        var rotationMatrix = new THREE.Matrix4() ;
        rotationMatrix.makeRotationAxis( axis.normalize() ,angle) ;
        var currentPos = new THREE.Vector4(object.position.x, object.position.y, object.position.z, 1) ;
        var newPos = currentPos.applyMatrix4( rotationMatrix );
        object.position.x = newPos.x ;
        object.position.y = newPos.y ;
        object.position.z = newPos.z ;
    }

    /**
     * This funciton finds the intensity of the light based on the position of the object
     * 
     * @param {Number} cp current position you passed with a intensity
     * @param {Number} np next position you get to with a intensity
     * @param {Number} ci current intensity you passed
     * @param {Number} ni next intensity you will get to
     * @param {Number} p position of the object in space (x value)
     * @returns the proportion of the intensity you should be at
     */
    findIntensity(cp, np, ci, ni, p) {
        var intensity = 0;

        intensity = ci + (ni - ci) * (p - cp) / (np - cp);

        return intensity;
    }

}