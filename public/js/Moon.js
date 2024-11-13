import * as THREE from 'three';

export default class Moon extends THREE.DirectionalLight{
    constructor(block) {
        super(0x98c1fa, 0.1);

        this.distance = 500 * block;

        this.position.set(-Math.cos(Math.PI/6) * this.distance, -Math.sin(Math.PI/6) * this.distance, 0);
        this.castShadow = true;
        this.helper = new THREE.DirectionalLightHelper(this, 5);

        this.geometry = new THREE.BoxGeometry(10,10,10);
        this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(-Math.cos(Math.PI/6) * this.distance, -Math.sin(Math.PI/6) * this.distance, 0);

        this.speed = Math.PI / 120;
    }

    update(d) {
        const x = this.position.x;

        this.rotateAboutWorldAxis(this, new THREE.Vector3(0, 0, 1), this.speed * d);
        this.rotateAboutWorldAxis(this.mesh, new THREE.Vector3(0, 0, 1), this.speed * d);
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

    rotateAboutWorldAxis(object, axis, angle) {
        var rotationMatrix = new THREE.Matrix4() ;
        rotationMatrix.makeRotationAxis( axis.normalize() ,angle) ;
        var currentPos = new THREE.Vector4(object.position.x, object.position.y, object.position.z, 1) ;
        var newPos = currentPos.applyMatrix4( rotationMatrix );
        object.position.x = newPos.x ;
        object.position.y = newPos.y ;
        object.position.z = newPos.z ;
    }

    findIntensity(cp, np, ci, ni, p) {
        var intensity = 0;

        intensity = ci + (ni - ci) * (p - cp) / (np - cp);

        return intensity;
    }

}