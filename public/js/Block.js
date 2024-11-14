import * as THREE from 'three';

export default class Block extends THREE.Mesh {
    constructor(y, maxY, loader) {
        super();
        this.loader = loader;
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = this.getMaterial(y, maxY);
        this.material = material;
        this.geometry = geometry;
    }

    getMaterial(y, maxY) {
        if (y == 0) {
            return this.loader.getBedrock();
        } else if (y > 0 && y <= 2) {
            var r = Math.round(Math.random());
            if (r == 0) {
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
            return this.loader.getGrass();
        }
    }
}