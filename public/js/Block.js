import * as THREE from 'three';
import MaterialLoader from './MaterialLoader';

export default class Block extends THREE.Mesh {
    /**
     * This class is the block object for the terrain
     * 
     * @param {Number} y this it the y value of the block
     * @param {Number} maxY this is the max y value of the terrain
     * @param {MaterialLoader} loader this is the object that preloads the materials for the blocks
     */
    constructor(y, maxY, loader) {
        super();
        this.loader = loader;
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = this.getMaterial(y, maxY);
        this.material = material;
        this.geometry = geometry;

        this.receiveShadow = true;
        this.isGrass = false;

        this.isBlock = true;
        this.castShadow = true;
    }

    /**
     * This function will make the block glow
     */
    glow() {
        this.material.emissive = new THREE.Color(0x505050)
    }

    /**
     * This function will make the block stop glowing
     */
    unglow() {
        this.material.emissive = new THREE.Color(0x000000);
    }

    /**
     * This function will return the material for the block based on the y value
     * 
     * @param {Number} y this is the y value of the block
     * @param {Number} maxY this is the max y value of the terrain
     */
    getMaterial(y, maxY) {
        if (y == 0) {
            this.isBedrock = true;
            return this.loader.getBedrock();
        } else if (y > 0 && y <= 2) {
            var r = Math.round(Math.random());
            if (r == 0) {
                this.isBedrock = true;
                return this.loader.getBedrock();
                
            } else {
                return this.loader.getStone();
            }
        } else if (y < maxY - 5) {
            var r = Math.floor(Math.random() * 99);
            if (y >= 3 && y < 7 && r == 0) {
                return this.loader.getDiamond();
            } else if (y >= 3 && y < 12 && r <= 1) {
                return this.loader.getGold();
            } else if (y >= 3 && y < 15 && r <= 3) {
                return this.loader.getIron();
            } else if (y >= 8 && y < 20 && r <= 5) {
                return this.loader.getCoal();
            }
            return this.loader.getStone();
        } else if (y >= maxY - 5 && y < maxY - 3) {
            var r = Math.round(Math.random());
            if (r == 0) {
                return this.loader.getDirt();
            } else {
                return this.loader.getStone();
            }
        } else if (y < maxY - 1) {
            return this.loader.getDirt();
        } else {
            this.isGrass = true;
            return this.loader.getGrass();
        }
    }
}