import * as THREE from 'three';
import Block from './Block.js';
import MaterialLoader from './MaterialLoader.js';

export default class Terrain extends THREE.Group {
    /**
     * Constructs the terrain for the scene out of blocks
     * 
     * @param {Number} blocksize is the length, width and height of the blocks
     * @param {Number} size this the sqaure size of the terrain (size x size)
     * @param {Number} heightChange this is the amount of change in height useing perlin noise
     * @param {Number} height this is the height of the terrain without any perlin noise
     * @param {MaterialLoader} matLoader this is the object that preloads the materials for the blocks
     */
    constructor(blocksize, size, heightChange, height, matLoader) {
        super();
        this.size = size;
        this.heightChange = heightChange;
        this.blockSize = blocksize;
        this.matLoader = matLoader;
        this.height = height;

        /**
         * This is the matrix that holds the y values for the terrain
         */
        this.yMatrix = [];

        this.removedBlocks = [];

        noise.seed(Math.random());

        for (var i = 0; i < this.size; i++) {
            this.yMatrix.push([]);
            for (var j = 0; j < this.size; j++) {
                var y = noise.perlin2(i / 20, j / 20) * this.heightChange + this.height;
                this.yMatrix[i].push(Math.floor(y));
            }
        }

        this.createTerrain();

    }

    /**
     * This function controls the loading and creattion of blocks into the scene.
     *  It will only load blocks that are visible to the player this includes blocks that are at the edge of the terrain.
     */
    createTerrain() {
        // Loop to get to every part of the terrain
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                for (var k = 0; k <= this.yMatrix[i][j]; k++) {
                    var block = new Block(k, this.yMatrix[i][j], this.matLoader);
                    block.position.set(i - (this.size/2), k - (this.height), j- (this.size/2));
                    this.add(block);
                }
            }
        }
    }

}