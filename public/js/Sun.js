import * as THREE from 'three';

export default class Sun extends THREE.DirectionalLight{
    constructor(block) {
        super(0xffffff, 0.50);

        this.distance = 500 * block;

        this.position.set(Math.cos(Math.PI/6) * this.distance, Math.sin(Math.PI/6) * this.distance, 0);
        this.castShadow = true;
        this.helper = new THREE.DirectionalLightHelper(this, 5);

        this.geometry = new THREE.BoxGeometry(10,10,10);
        this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(Math.cos(Math.PI/6) * this.distance, Math.sin(Math.PI/6) * this.distance, 0);

        this.speed = Math.PI / 120;
    }

    update(d) {

        const x = this.position.x;

        if (this.position.y >=0) {

            // PI/9 to PI/6
            if (x >= Math.cos(Math.PI/6) * this.distance && x <= Math.cos(Math.PI/9) * this.distance) {
                this.color.r += 0.0003;
                this.color.g += 0.001;
                this.color.b += 0.0017;
                if (this.color.r >= 1) {
                    this.color.r = 1;
                }
                if (this.color.g >= 1) {
                    this.color.g = 1;
                }
                if (this.color.b >= 1) {
                    this.color.b = 1;
                }
                this.mesh.material.color.setRGB(this.color.r, this.color.g, this.color.b);
            }
            // PI/18 to PI/9 
            else if (x >= Math.cos(Math.PI/9) * this.distance && x <= Math.cos(Math.PI/18) * this.distance) {
                this.color.r -= 0.00009;
                this.color.g += 0.00035;
                this.color.b += 0;
                this.mesh.material.color.setRGB(this.color.r, this.color.g, this.color.b);
            } 
            // 0 to PI/18
            else if (x >= Math.cos(Math.PI/18) * this.distance) {
                this.color.r += 0.0003;
                this.color.g += 0.0012;
                this.color.b += 0.00058;
                this.mesh.material.color.setRGB(this.color.r, this.color.g, this.color.b);
            }
            // PI/9 to PI/6
            else if (x <= Math.cos(Math.PI*5/6) * this.distance && x >= Math.cos(Math.PI*8/9) * this.distance) {
                this.color.r -= 0.0003;
                this.color.g -= 0.001;
                this.color.b -= 0.0017;
                this.mesh.material.color.setRGB(this.color.r, this.color.g, this.color.b);
            }
            // PI/18 to PI/9 
            else if (x <= Math.cos(Math.PI*8/9) * this.distance && x >= Math.cos(Math.PI*17/18) * this.distance) {
                this.color.r += 0.00009;
                this.color.g -= 0.00035;
                this.color.b -= 0;
                this.mesh.material.color.setRGB(this.color.r, this.color.g, this.color.b);
            } 
            // 0 to PI/18
            else if (x <= Math.cos(Math.PI*17/18) * this.distance) {
                this.color.r -= 0.0003;
                this.color.g -= 0.0012;
                this.color.b -= 0.00058;
                this.mesh.material.color.setRGB(this.color.r, this.color.g, this.color.b);
            }
            else {
                this.color.setRGB(1,1,1);
                this.mesh.material.color.setRGB(1,1,1);
            }

        } else {
            this.color.setHex(0xee5d6c);
        }

        if (this.position.y <= 10 && this.intensity > 0) {
            this.intensity -= 0.003;
        }

        if (this.position.y >= 20 && this.intensity < 0.5) {
            this.intensity += 0.005;
        }

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


}