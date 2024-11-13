import * as THREE from 'three';

export default class MaterialLoader {
    constructor() {
        this.loader = new THREE.TextureLoader();
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
    }

    getDirt() {
        return this.dirt;
    }

    getGrass() {
        return this.grass;
    }

    getStone() {
        return this.stone;
    }

    getBedrock() {
        return this.bedrock;
    }

    getDiamond() {
        return this.diamond;
    }

    getIron() {
        return this.iron;
    }

    getGold() {
        return this.gold;
    }

    getCoal() {
        return this.coal;
    }
}