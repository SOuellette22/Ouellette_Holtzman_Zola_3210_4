import * as THREE from 'three';
import { GrammerEngine } from "./GrammerEngine.js"

class Tree {
    constructor(branchLength) {
        //example of grammer engine remove later
        

        this.branchLength = branchLength;

        this.stack = [];
        
        this.tree_group = new THREE.Group();
        this.textureLoader = new THREE.TextureLoader();

        this.branchMat = new THREE.MeshPhongMaterial({
            map: this.textureLoader.load("textures/Bark014_4K-PNG_Color.png"),
            normalMap: this.textureLoader.load("textures/Bark014_4K-PNG_NormalGL.png"),
            color: 0xeb7f1a
        })

        this.leafMat = new THREE.MeshPhongMaterial({
            map: this.textureLoader.load("textures/Bark014_4K-PNG_Color.png"),
            normalMap: this.textureLoader.load("textures/Bark014_4K-PNG_NormalGL.png"),
            color: 0x36eb1a
        })

    }

    fractalTreeGenerate(iterations) {
        let engine = new GrammerEngine();

        engine.addRule("1", "11");
        engine.addRule("0", "1[0]0");

        let tree_string = engine.generate("0", iterations);
        console.log(tree_string)

        let offsets = new Element(0,this.branchLength, 0)

        for (let curr_char of tree_string ) {
            console.log("y_offset", offsets.x, "angle: ", offsets.y)
            switch(curr_char) {
                case "1": 
                    this._drawBranch(offsets);
                    offsets.y += this.branchLength * 0.15;

                    break;
                case "0": 
                    this._drawLeaf(offsets);
                    offsets.y += this.branchLength * 0.15;
                    break;
                case "[":
                    this.stack.push(new Element(offsets.x, offsets.y, offsets.angle));
                    offsets.angle += 45;
                    offsets.x += this.branchLength * 0.5;
                    break;
                case "]":
                    offsets = this.stack.pop();

                    offsets.angle -= 45;
                    offsets.x -= this.branchLength * 0.5 ;
                    break;

            }
        }

        let treeGroup2 = this.tree_group.clone();

        treeGroup2.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI/2)
        this.tree_group.add(treeGroup2)

        
    }

    barnsleyFern() {
        let engine = new GrammerEngine();

        engine.addRule("X", " F+[[X]-X]-F[-FX]+X");
        engine.addRule("F", "FF");

        let tree_string = engine.generate("X", 3);
        console.log(tree_string)

        let offsets = new Element(0,this.branchLength, 0)

        for (let curr_char of tree_string) {
            switch(curr_char) {
                case "F":
                    this._drawBranch(offsets);
                    break;
                case "-":
                    offsets.angle += 25;
                    offsets.x -= this.branchLength * 0.4;
                    break;
                case "+":
                    offsets.angle -= 25;
                    offsets.x += this.branchLength * 0.4;
                    break;
                case "[":
                    this.stack.push(new Element(offsets.x, offsets.y, offsets.angle));
                    break;
                case "]":
                    offsets = this.stack.pop();
                
            }
            offsets.y += this.branchLength * 0.15;
        }
    }

    _drawBranch(offsets) {
        let geom = new THREE.CylinderGeometry( 0.5, 0.5, this.branchLength, 32 );

        let new_branch = new THREE.Mesh(geom,this.branchMat);
        new_branch.castShadow = true;
        new_branch.receiveShadow = true;
        new_branch.rotateZ(THREE.MathUtils.degToRad(offsets.angle));
        new_branch.position.set(offsets.x, offsets.y,0);

        this.tree_group.add(new_branch);
        
    }
    
    _drawLeaf(offsets) {
        let geom = new THREE.CylinderGeometry( 0.5, 0.5, this.branchLength, 32 );

        let new_branch = new THREE.Mesh(geom,this.leafMat);
        new_branch.castShadow = true;
        new_branch.receiveShadow = true;

        new_branch.rotateZ(THREE.MathUtils.degToRad(offsets.angle));
        new_branch.position.set(offsets.x,offsets.y,0);

        this.tree_group.add(new_branch);
        let nextLeaf = new_branch.clone();
        nextLeaf.rotateX(Math.PI/4);
        this.tree_group.add(nextLeaf)

        this.tree_group.add(new_branch);
        nextLeaf = new_branch.clone();
        nextLeaf.rotateX(-Math.PI/2);
        this.tree_group.add(nextLeaf)
    }

    _rotateAboutWorldAxis(object, axis, angle) {
        var rotationMatrix = new THREE.Matrix4() ;
        rotationMatrix.makeRotationAxis( axis.normalize() ,angle) ;
        var currentPos = new THREE.Vector4(object.position.x, object.position.y, object.position.z, 1) ;
        var newPos = currentPos.applyMatrix4( rotationMatrix );
        object.position.x = newPos.x ;
        object.position.y = newPos.y ;
        object.position.z = newPos.z ;
    }
}

class Element {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
    }
}
export { Tree }