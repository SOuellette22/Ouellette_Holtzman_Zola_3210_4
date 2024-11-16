import * as THREE from 'three';
import { GrammerEngine } from "./GrammerEngine.js"

/**
 * Tree creates a tree 
 * 
 * @param branchLength - length of each branch in the tree 
 * 
 * @example
 * let tree = new Tree(4);
 * //make fractal tree
 * tree.fractalTreeGenerate(5);
 * //to make a bern tree instead
 * tree.barnsleyFern(5);
 * //add to scene
 * scene.add(tree.tree_group)
 */
class Tree {
    constructor(branchLength) {
        //example of grammer engine remove later
        this.branchLength = branchLength;

        this.stack = [];
        
        this.group = new THREE.Group();
        this.textureLoader = new THREE.TextureLoader();

        this.branchMat = new THREE.MeshPhongMaterial({
            //map: this.textureLoader.load("textures/Bark014_4K-PNG_Color.png"),
            //normalMap: this.textureLoader.load("textures/Bark014_4K-PNG_NormalGL.png"),
            color: 0xeb7f1a
        })

        this.leafMat = new THREE.MeshPhongMaterial({
            //map: this.textureLoader.load("textures/Bark014_4K-PNG_Color.png"),
            //normalMap: this.textureLoader.load("textures/Bark014_4K-PNG_NormalGL.png"),
            color: 0x36eb1a
        })

    }

    /**
     * Generates a fractal tree using a classic algorithm 
     * @param {Int} iterations Number of iterations for L-Grammer system
     */
    fractalTreeGenerate(iterations) {
        //create grammer string for tree
        let engine = new GrammerEngine();

        engine.addRule("1", "11");
        engine.addRule("0", "1[0]0");

        let tree_string = engine.generate("0", iterations);
        console.log(tree_string)

        //create offsets 
        let offsets = new Element(0,this.branchLength, 0)
        //loop through our grammer string 
        for (let curr_char of tree_string ) {
            console.log("y_offset", offsets.x, "angle: ", offsets.y)
            switch(curr_char) {
                case "1": 
                    //draw branch and move up 
                    this._drawBranch(offsets);
                    offsets.y += this.branchLength * 0.35;

                    break;
                case "0": 
                    //draw branch and move up
                    this._drawLeaf(offsets);
                    offsets.y += this.branchLength * 0.35;
                    break;
                case "[":
                    //push state to stack
                    this.stack.push(new Element(offsets.x, offsets.y, offsets.angle));
                    offsets.angle += 45;
                    offsets.x += this.branchLength * 0.5;
                    break;
                case "]":
                    //pop state from stack 
                    offsets = this.stack.pop();

                    offsets.angle -= 45;
                    offsets.x -= this.branchLength * 0.5 ;
                    break;
            }
        }

        //clone group to create a copy to rotate so it is more 3D
        
        let treeGroup2 = this.group.clone();
        treeGroup2.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI/2)
        this.group.add(treeGroup2)

        //center tree on block
        this.group.translateX(-0.5);
        this.group.translateZ(-0.5);    
    }

    /**
     * Creates stochastic Barnsley Fern
     * @param {Int} iterations Number of iterations for L-Grammer system
     */
    barnsleyFern(iterations) {
        let engine = new GrammerEngine();

        engine.addRule("X", " F+[[X]-X]-F[-FX]+X", 0.8);
        engine.addRule("F", "FF", 0.8);

        let tree_string = engine.generate("X", iterations);
        console.log(tree_string)

        let offsets = new Element(0,this.branchLength, 0)

        for (let curr_char of tree_string) {
            switch(curr_char) {
                case "F":
                    this._drawBranch(offsets);
                    offsets.y += this.branchLength * 0.45;

                    break;
                case "X":
                    if (Math.random() < 0.25) {
                        this._drawLeaf(offsets);
                    }
                    //this._drawLeaf(offsets);
                    break;
                case "-":
                    offsets.angle += 25;
                    offsets.x -= this.branchLength * 0.6;
                    break;
                case "+":
                    offsets.angle -= 25;
                    offsets.x += this.branchLength * 0.6;
                    break;
                case "[":
                    this.stack.push(new Element(offsets.x, offsets.y, offsets.angle));
                    break;
                case "]":
                    if (Math.random() < 0.25) {
                        this._drawLeaf(offsets);
                    }
                    offsets = this.stack.pop();
                
            }
        }

        let treeGroup2 = this.group.clone();
        
        treeGroup2.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI/2)
        this.group.add(treeGroup2)
        
        //center tree on block
        this.group.translateX(-0.5);
        this.group.translateZ(-0.5); 
    }

    _drawBranch(offsets) {
        let geom = new THREE.CylinderGeometry( this.branchLength/4, this.branchLength/4, this.branchLength, 32 );

        let new_branch = new THREE.Mesh(geom,this.branchMat);
        new_branch.castShadow = true;
        new_branch.receiveShadow = true;
        new_branch.rotateZ(THREE.MathUtils.degToRad(offsets.angle));
        new_branch.position.set(offsets.x, offsets.y,0);

        this.group.add(new_branch);
        
    }
    
    _drawLeaf(offsets) {
        let geom = new THREE.CylinderGeometry( this.branchLength/4, this.branchLength/4, this.branchLength, 32 );

        let new_branch = new THREE.Mesh(geom,this.leafMat);
        new_branch.castShadow = true;
        new_branch.receiveShadow = true;

        new_branch.rotateZ(THREE.MathUtils.degToRad(offsets.angle));
        new_branch.position.set(offsets.x,offsets.y,0);

        this.group.add(new_branch);
        let nextLeaf = new_branch.clone();
        nextLeaf.rotateX(Math.PI/4);
        this.group.add(nextLeaf)

        this.group.add(new_branch);
        nextLeaf = new_branch.clone();
        nextLeaf.rotateX(-Math.PI/2);
        this.group.add(nextLeaf)
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