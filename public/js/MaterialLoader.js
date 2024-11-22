import * as THREE from 'three';

export default class MaterialLoader {
    /**
     * This class is used to preload the materials for the blocks
     */
    constructor() {
        this.loader = new THREE.TextureLoader();
        this.load();
    }

    /**
     * This function will load the materials for the blocks
     */
    async load() {
        this.dirt = new THREE.MeshPhongMaterial({ map: this.loader.load('./public/textures/Dirt_Block.png') });
        this.grass = [
            new THREE.MeshPhongMaterial({ map: this.loader.load('./public/textures/Grass_Block_Side.png') }),
            new THREE.MeshPhongMaterial({ map: this.loader.load('./public/textures/Grass_Block_Side.png') }),
            new THREE.MeshPhongMaterial({ map: this.loader.load('./public/textures/Grass_Block_Top.png'),}),
            new THREE.MeshPhongMaterial({ map: this.loader.load('./public/textures/Dirt_Block.png') }),
            new THREE.MeshPhongMaterial({ map: this.loader.load('./public/textures/Grass_Block_Side.png') }),
            new THREE.MeshPhongMaterial({ map: this.loader.load('./public/textures/Grass_Block_Side.png') })
        ]
        this.stone = new THREE.MeshPhongMaterial({ map: this.loader.load('./public/textures/Stone_Block.png') });
        this.bedrock = new THREE.MeshPhongMaterial({ map: this.loader.load('./public/textures/Bedrock_Block.png') });
        this.diamond = new THREE.MeshPhongMaterial({ map: this.loader.load('./public/textures/Diamond_Ore_Block.png') });
        this.iron = new THREE.MeshPhongMaterial({ map: this.loader.load('./public/textures/Iron_Ore_Block.png') });
        this.gold = new THREE.MeshPhongMaterial({ map: this.loader.load('./public/textures/Gold_Ore_Block.png') });
        this.coal = new THREE.MeshPhongMaterial({ map: this.loader.load('./public/textures/Coal_Ore_Block.png') });

        this.bark = new THREE.MeshPhongMaterial({
            map: this.loader.load("textures/Bark014_4K-PNG_Color.png"),
            normalMap: this.loader.load("textures/Bark014_4K-PNG_NormalGL.png"),
            color: 0xeb7f1a
        })

        this.leaf = this.leafMat = new THREE.MeshPhongMaterial({
            map: this.loader.load("textures/Grass001_4K-JPG_Color.jpg"),
            normalMap: this.loader.load("textures/Grass001_4K-JPG_NormalGL.jpg"),
            color: 0x36eb1a
        })

    }

    /**
     * 
     * @returns {THREE.MeshPhongMaterial} returns the dirt material
     */
    getDirt() {
        var mat = this.dirt;
        return mat.clone();
    }

    /**
     * 
     * @returns {THREE.MeshPhongMaterial} returns the grass material
     */
    getGrass() {
        var mat = [];
        for (var i = 0; i < this.grass.length; i++) {
            mat[i] = this.grass[i].clone();
        }
        return mat;
    }

    /**
     * 
     * @returns {THREE.MeshPhongMaterial} returns the stone material
     */
    getStone() {
        var mat = this.stone;
        return mat.clone();
    }

    /**
     * 
     * @returns {THREE.MeshPhongMaterial} returns the bedrock material
     */
    getBedrock() {
        var mat = this.bedrock;
        return mat.clone();
    }

    /**
     * 
     * @returns {THREE.MeshPhongMaterial} returns the diamond material
     */
    getDiamond() {
        var mat = this.diamond;
        return mat.clone();
    }

    /**
     * 
     * @returns {THREE.MeshPhongMaterial} returns the iron material
     */
    getIron() {
        var mat = this.iron;
        return mat.clone();
    }

    /**
     * 
     * @returns {THREE.MeshPhongMaterial} returns the gold material
     */
    getGold() {
        var mat = this.gold;
        return mat.clone();
    }

    /**
     * 
     * @returns {THREE.MeshPhongMaterial} returns the coal material
     */
    getCoal() {
        var mat = this.coal;
        return mat.clone();
    }

    getBark() {
        return this.bark;
    }

    getLeaf() {
        return this.leaf;
    }
}