import * as THREE from 'three';
import Block from './Block.js';

export default class Terrain extends THREE.Group {
    constructor(blocksize, size, heightChange, height, matLoader) {
        super();
        this.size = size;
        this.heightChange = heightChange;
        this.blockSize = blocksize;
        this.matLoader = matLoader;
        this.height = height;

        this.yMatrix = [];

        noise.seed(Math.random());

        for (var i = 0; i < this.size; i++) {
            this.yMatrix.push([]);
            for (var j = 0; j < this.size; j++) {
                var y = noise.perlin2(i / 20, j / 20) * this.heightChange + this.height;
                this.yMatrix[i].push(y);
            }
        }

        this.createTerrain();

    }

    createTerrain() {
        // Loop to get to every part of the terrain
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                for (var k = 0; k < this.yMatrix[i][j]; k++) {

                    // Check if the block is at the edge of the terrain
                    if (k >= this.yMatrix[i][j] - 1 ||
                        i == 0 || i == this.size - 1 ||
                        j == 0 || j == this.size - 1) 
                    {
                        var block = new Block(k, this.yMatrix[i][j], this.matLoader);
                        block.position.set(i - (this.size/2), k - (this.height/2), j- (this.size/2));
                        this.add(block);
                    }

                    console.log("Block created at: " + i + ", " + k + ", " + j);

                }
            }
        }
    }

    update() {
        
    }
}