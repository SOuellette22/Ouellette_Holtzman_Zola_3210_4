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
 * //Give tree outline 
 * tree.glow()
 * //remove tree's outline
 * tree.unglow()
 * //remove tree
 * tree.remove()
 */
class Tree {
    constructor(branchLength, loader) {
        //example of grammer engine remove later
        this.branchLength = branchLength;

        this.stack = [];
        
        this.group = new THREE.Group();

        //load in material
        this.branchMat = loader.getBark();
        this.leafMat = loader.getLeaf();

        this.boundingBox = new THREE.Box3();
        this.boxSize;

        // is not a block
        this.isBlock = false;
        // is a tree
        this.isTree = true;

        this.helper = new THREE.Box3Helper(this.boundingBox, 0xffff00 * Math.random());
    }

    /**
     * Test if a point intersects tree
     * @param {THREE.Vector3} position 
     * @returns True if point is intersecting tree
     */
    isPointIntersecting(position){
        return this.boundingBox.containsPoint(position)
    }

    computBoundingBox () {
        //if it is not visible we should never collide with it 
        if (!this.group.visible) {
            return false;
        }
        this.boundingBox.setFromCenterAndSize(this.group.position, this.boxSize)
    }

    /**
     * Adds outline to tree
     */
    glow() {
        let glowColor = 0x505050;
        this.branchMat.emissive.setHex(glowColor);
        this.leafMat.emissive.setHex(glowColor);
    }

    /**
     * Removes any outline from tree
     */
    unglow() {
        this.branchMat.emissive.setHex(0x000000);
        this.leafMat.emissive.setHex(0x000000);
    }

    /**
     * Remove(KILL!) the tree from the scene  
     */
    remove() {
        this.group.parent.remove(this.group);
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

        //create offsets 
        let offsets = new Element(0,this.branchLength, 0)
        //loop through our grammer string 
        for (let curr_char of tree_string ) {
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

        this.group.castShadow = true;
        this.group.receiveShadow = true;

        this.boxSize = new THREE.Vector3(0.5, 6, 0.5);
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

        this.group.castShadow = true;
        this.group.receiveShadow = true;

        this.boxSize = new THREE.Vector3(1, 6, 1);

    }

    randTree(iterations) {
        let engine = new GrammerEngine();

        engine.addRule("F", "F[+F][-F]F", 0.50);
        engine.addRule("F", "F[-F]F", 0.3);
        engine.addRule("F", "F[+F]F", 0.2)

        let tree_string = engine.generate("F", iterations);

        let offsets = new Element(0,this.branchLength, 0)

        for (let curr_char of tree_string) {
            switch(curr_char) {
                case "F":
                    this._drawBranch(offsets);
                    offsets.y += this.branchLength * 0.65;
                    break;
                case "-":
                    offsets.angle += 22.5;
                    offsets.x -= this.branchLength * 0.7;
                    break;
                case "+":
                    offsets.angle -= 22.5;
                    offsets.x += this.branchLength * 0.68;
                    break;
                case "[":
                    this.stack.push(new Element(offsets.x, offsets.y, offsets.angle));
                    break;
                case "]":
                    offsets.y += this.branchLength * 0.25;
                    if (Math.random() < 0.5) {
                        this._drawLeaf(offsets);
                    }
                    offsets = this.stack.pop();
            }
        }

        let treeGroup2 = this.group.clone();
        
        treeGroup2.rotateOnAxis(new THREE.Vector3(0,1,0), -Math.PI/2)
        this.group.add(treeGroup2)

        //center tree on block
        this.group.translateX(-0.5);
        this.group.translateZ(-0.5); 

        this.group.castShadow = true;
        this.group.receiveShadow = true;

        this.boxSize = new THREE.Vector3(1.5, 6, 1.5);
    }

    _drawBranch(offsets) {
        let geom = new THREE.CylinderGeometry( this.branchLength/4, this.branchLength/4, this.branchLength, 32 );

        let new_branch = new THREE.Mesh(geom,this.branchMat.clone());
        new_branch.castShadow = true;
        new_branch.receiveShadow = true;
        new_branch.rotateZ(THREE.MathUtils.degToRad(offsets.angle));
        new_branch.position.set(offsets.x, offsets.y,0);


        this.group.add(new_branch);
        
    }
    
    _drawLeaf(offsets) {
        let geom = new THREE.CylinderGeometry( this.branchLength/4, this.branchLength/4, this.branchLength, 32 );

        let new_branch = new THREE.Mesh(geom,this.leafMat.clone());

        new_branch.rotateZ(THREE.MathUtils.degToRad(offsets.angle));
        new_branch.position.set(offsets.x,offsets.y,0);

        this.group.add(new_branch);

        let nextLeaf = new_branch.clone();
        nextLeaf.rotateX(Math.PI/4);
        this.group.add(nextLeaf)

        nextLeaf = new_branch.clone();
        nextLeaf.rotateX(-Math.PI/2);
        this.group.add(nextLeaf)
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