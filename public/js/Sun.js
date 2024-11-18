import * as THREE from 'three';

export default class Sun extends THREE.DirectionalLight{
    /**
     * Constucts the sun object for the scene
     * 
     * @param {Number} block makes sure sizing is correct throughout the scene
     */
    constructor(block) {
        super(0xffffff, 1);

        this.distance = 500 * block;

        this.colors = {
            white: [255,255,255],
            yellow: [255,167,0],
            yellrange: [255,103,0],
            orange: [255,0,0]
        }

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

    /**
     * Updates the suns position and color based on its position in space
     * 
     * @param {Number} d is the delta time between frames
     */
    update(d) {

        const x = this.position.x;

        if (this.position.y >= 0) {

            // From 0 to Pi/18
            if (x <= this.distance && x > Math.cos(Math.PI/18) * this.distance) {
                var cp = this.distance;
                var np = Math.cos(Math.PI/18) * this.distance;
                this.color.r = this.findColor(cp, np, this.colors.orange.at(0), this.colors.yellrange.at(0), x);
                this.color.g = this.findColor(cp, np, this.colors.orange.at(1), this.colors.yellrange.at(1), x);
                this.color.b = this.findColor(cp, np, this.colors.orange.at(2), this.colors.yellrange.at(2), x);
            } 

            // From Pi/18 to Pi/9
            else if (x <= Math.cos(Math.PI/18) * this.distance && x > Math.cos(Math.PI/9) * this.distance) {
                var cp = Math.cos(Math.PI/18) * this.distance;
                var np = Math.cos(Math.PI/9) * this.distance;
                this.color.r = this.findColor(cp, np, this.colors.yellrange.at(0), this.colors.yellow.at(0), x);
                this.color.g = this.findColor(cp, np, this.colors.yellrange.at(1), this.colors.yellow.at(1), x);
                this.color.b = this.findColor(cp, np, this.colors.yellrange.at(2), this.colors.yellow.at(2), x);
            }

            // From Pi/9 to Pi/6
            else if (x <= Math.cos(Math.PI/9) * this.distance && x > Math.cos(Math.PI/6) * this.distance) {
                var cp = Math.cos(Math.PI/9) * this.distance;
                var np = Math.cos(Math.PI/6) * this.distance;
                this.color.r = this.findColor(cp, np, this.colors.yellow.at(0), this.colors.white.at(0), x);
                this.color.g = this.findColor(cp, np, this.colors.yellow.at(1), this.colors.white.at(1), x);
                this.color.b = this.findColor(cp, np, this.colors.yellow.at(2), this.colors.white.at(2), x);
            }

            // From Pi*5/6 to Pi*8/9
            else if (x<= Math.cos(Math.PI*5/6) * this.distance && x > Math.cos(Math.PI*8/9) * this.distance) {
                var cp = Math.cos(Math.PI*5/6) * this.distance;
                var np = Math.cos(Math.PI*8/9) * this.distance;
                this.color.r = this.findColor(cp, np, this.colors.white.at(0), this.colors.yellow.at(0), x);
                this.color.g = this.findColor(cp, np, this.colors.white.at(1), this.colors.yellow.at(1), x);
                this.color.b = this.findColor(cp, np, this.colors.white.at(2), this.colors.yellow.at(2), x);
            }

            // From Pi*8/9 to Pi*17/18
            else if (x <= Math.cos(Math.PI*8/9) * this.distance && x > Math.cos(Math.PI*17/18) * this.distance) {
                var cp = Math.cos(Math.PI*8/9) * this.distance;
                var np = Math.cos(Math.PI*17/18) * this.distance;
                this.color.r = this.findColor(cp, np, this.colors.yellow.at(0), this.colors.yellrange.at(0), x);
                this.color.g = this.findColor(cp, np, this.colors.yellow.at(1), this.colors.yellrange.at(1), x);
                this.color.b = this.findColor(cp, np, this.colors.yellow.at(2), this.colors.yellrange.at(2), x);
            }

            // From Pi*17/18 to Pi
            else if (x <= Math.cos(Math.PI*17/18) * this.distance && x > -this.distance) {
                var cp = Math.cos(Math.PI*17/18) * this.distance;
                var np = -this.distance;
                this.color.r = this.findColor(cp, np, this.colors.yellrange.at(0), this.colors.orange.at(0), x);
                this.color.g = this.findColor(cp, np, this.colors.yellrange.at(1), this.colors.orange.at(1), x);
                this.color.b = this.findColor(cp, np, this.colors.yellrange.at(2), this.colors.orange.at(2), x);
            }
        }   

        if (x <= this.distance && x >= Math.cos(Math.PI/18) * this.distance) {
            var cp = this.distance;
            var np = Math.cos(Math.PI/18) * this.distance;
            this.intensity = this.findIntensity(cp, np, 0, 1, x);
        }

        if (x <= Math.cos(Math.PI*17/18) * this.distance && x >= -this.distance) {
            var cp = Math.cos(Math.PI*17/18) * this.distance;
            var np = -this.distance;
            this.intensity = this.findIntensity(cp, np, 1, 0, x);
        }

        if (this.position.y < 0) {
            this.intensity = 0;
        }

        this.mesh.material.color.setRGB(this.color.r, this.color.g, this.color.b);

        this.rotateAboutWorldAxis(this, new THREE.Vector3(0, 0, 10), this.speed * d);
        this.rotateAboutWorldAxis(this.mesh, new THREE.Vector3(0, 0, 10), this.speed * d);
        this.mesh.lookAt(0,0,0);

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
     * This function finds the percent of a color based on the position of the object
     * 
     * @param {Number} cp current position you passed with a color
     * @param {Number} np next position you get to with a color
     * @param {Number} cc current color you passed
     * @param {Number} nc next color you will get to
     * @param {Number} p position of the object in space (x value)
     * @returns the proportion of the color you should be at
     */
    findColor(cp, np, cc, nc, p) {
        var color = 0;

        color = cc + (nc - cc) * (p - cp) / (np - cp);

        return color / 255;
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