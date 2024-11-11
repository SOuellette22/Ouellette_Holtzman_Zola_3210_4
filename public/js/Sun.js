import * as THREE from 'three';

export default class Sun extends THREE.DirectionalLight{
    constructor(block) {
        super(0xffffff, 0.5);

        this.distance = 500 * block;

        this.position.set(Math.cos(Math.PI/6) * this.distance, Math.sin(Math.PI/6) * this.distance, 0);
        // this.position.set(this.distance, 0, 0);
        this.castShadow = true;
        this.helper = new THREE.DirectionalLightHelper(this, 5);

        this.geometry = new THREE.BoxGeometry(10,10,10);
        this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(Math.cos(Math.PI/6) * this.distance, Math.sin(Math.PI/6) * this.distance, 0);
        // this.mesh.position.set(this.distance, 0, 0);

        this.speed = Math.PI / 120;
    }

    update(d) {

        const x = this.position.x;

        if (this.position.y >= 0) {

            // From 0 to Pi/18
            if (x <= this.distance && x > Math.cos(Math.PI/18) * this.distance) {
                var cp = this.distance;
                var np = Math.cos(Math.PI/18) * this.distance;
                this.color.r = this.findColor(cp, np, 238, 251, x);
                this.color.g = this.findColor(cp, np, 93, 144, x);
                this.color.b = this.findColor(cp, np, 108, 98, x);
            } 

            // From Pi/18 to Pi/9
            else if (x <= Math.cos(Math.PI/18) * this.distance && x > Math.cos(Math.PI/9) * this.distance) {
                var cp = Math.cos(Math.PI/18) * this.distance;
                var np = Math.cos(Math.PI/9) * this.distance;
                this.color.r = this.findColor(cp, np, 251, 238, x);
                this.color.g = this.findColor(cp, np, 144, 175, x);
                this.color.b = this.findColor(cp, np, 98, 97, x);
            }

            // From Pi/9 to Pi/6
            else if (x <= Math.cos(Math.PI/9) * this.distance && x > Math.cos(Math.PI/6) * this.distance) {
                var cp = Math.cos(Math.PI/9) * this.distance;
                var np = Math.cos(Math.PI/6) * this.distance;
                this.color.r = this.findColor(cp, np, 238, 255, x);
                this.color.g = this.findColor(cp, np, 175, 255, x);
                this.color.b = this.findColor(cp, np, 97, 255, x);
            }

            // From Pi*5/6 to Pi*8/9
            else if (x<= Math.cos(Math.PI*5/6) * this.distance && x > Math.cos(Math.PI*8/9) * this.distance) {
                var cp = Math.cos(Math.PI*5/6) * this.distance;
                var np = Math.cos(Math.PI*8/9) * this.distance;
                this.color.r = this.findColor(cp, np, 255, 238, x);
                this.color.g = this.findColor(cp, np, 255, 175, x);
                this.color.b = this.findColor(cp, np, 255, 97, x);
            }

            // From Pi*8/9 to Pi*17/18
            else if (x <= Math.cos(Math.PI*8/9) * this.distance && x > Math.cos(Math.PI*17/18) * this.distance) {
                var cp = Math.cos(Math.PI*8/9) * this.distance;
                var np = Math.cos(Math.PI*17/18) * this.distance;
                this.color.r = this.findColor(cp, np, 238, 251, x);
                this.color.g = this.findColor(cp, np, 175, 144, x);
                this.color.b = this.findColor(cp, np, 97, 98, x);
            }

            // From Pi*17/18 to Pi
            else if (x <= Math.cos(Math.PI*17/18) * this.distance && x > -this.distance) {
                var cp = Math.cos(Math.PI*17/18) * this.distance;
                var np = -this.distance;
                this.color.r = this.findColor(cp, np, 251, 238, x);
                this.color.g = this.findColor(cp, np, 144, 93, x);
                this.color.b = this.findColor(cp, np, 98, 108, x);
            }
        }   

        if (x <= this.distance && x >= Math.cos(Math.PI/18) * this.distance) {
            var cp = this.distance;
            var np = Math.cos(Math.PI/18) * this.distance;
            this.intensity = this.findIntensity(cp, np, 0, 0.5, x);
        }

        if (x <= Math.cos(Math.PI*17/18) * this.distance && x >= -this.distance) {
            var cp = Math.cos(Math.PI*17/18) * this.distance;
            var np = -this.distance;
            this.intensity = this.findIntensity(cp, np, 0.5, 0, x);
        }

        if (this.position.y < 0) {
            this.intensity = 0;
        }

        this.mesh.material.color.setRGB(this.color.r, this.color.g, this.color.b);

        this.rotateAboutWorldAxis(this, new THREE.Vector3(0, 0, 1), this.speed * d);
        this.rotateAboutWorldAxis(this.mesh, new THREE.Vector3(0, 0, 1), this.speed * d);
        this.mesh.lookAt(0,0,0);

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

    findColor(cp, np, cc, nc, p) {
        var color = 0;

        color = cc + (nc - cc) * (p - cp) / (np - cp);

        return color / 255;
    }

    findIntensity(cp, np, ci, ni, p) {
        var intensity = 0;

        intensity = ci + (ni - ci) * (p - cp) / (np - cp);

        return intensity;
    }


}