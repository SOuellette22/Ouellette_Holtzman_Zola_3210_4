import * as THREE from 'three';
import { GrammerEngine } from "./GrammerEngine.js"
import { element, positionLocal } from 'three/webgpu';

class Tree {
    constructor() {
        //example of grammer engine remove later
        

        this.branchSegmentLength = 1;

        this.stack = [];
        
        this.tree_group = new THREE.Group();

    }

    fractalTreeGenerate() {
        let engine = new GrammerEngine();

        engine.addRule("1", "11");
        engine.addRule("0", "1[0]0");

        let tree_string = engine.generate("0", 5);
        console.log(tree_string)

        let offsets = new Element(0,this.branchSegmentLength, 0)

        for (let curr_char of tree_string ) {
            console.log("y_offset", offsets.x, "angle: ", offsets.y)
            switch(curr_char) {
                case "1": 
                    this._drawBranch(offsets);
                    break;
                case "0": 
                    this._drawLeaf(offsets);
                    break;
                case "[":
                    this.stack.push(new Element(offsets.x, offsets.y, offsets.angle));
                    offsets.angle += 45;
                    offsets.x += 1;
                    break;
                case "]":
                    offsets = this.stack.pop();

                    offsets.angle -= 45;
                    offsets.x -= 1;
                    break;

            }
            offsets.y += 0.25;
        }
    }

    barnsleyFern() {
        let y_offset = this.branchSegmentLength;                    //y_offset += this.branchSegmentLength;
        let x_offset = 0;
        let angle = 0; 

        let engine = new GrammerEngine();

        engine.addRule("X", " F+[[X]-X]-F[-FX]+X");
        engine.addRule("F", "FF");

        let tree_string = engine.generate("X", 4);
        console.log(tree_string)

        let offsets = new Element(0,this.branchSegmentLength, 0)

        for (let curr_char of tree_string) {
            switch(curr_char) {
                case "F":
                    this._drawBranch(offsets);
                    break;
                case "-":
                    offsets.angle += 25;
                    offsets.x -= 1.5;
                    break;
                case "+":
                    offsets.angle -= 25;
                    offsets.x += 1.5;
                    break;
                case "[":
                    this.stack.push(new Element(offsets.x, offsets.y, offsets.angle));
                    break;
                case "]":
                    offsets = this.stack.pop();
                
            }
            offsets.y += 0.25;
        }
    }

    _drawBranch(offsets) {
        let geom = new THREE.CylinderGeometry( 0.5, 0.5, this.branchSegmentLength, 32 );
        let branchMat = new THREE.MeshBasicMaterial({color: 0x8c3b0f  })

        let new_branch = new THREE.Mesh(geom,branchMat);
        new_branch.castShadow = true;
        new_branch.receiveShadow = true;
        
        new_branch.rotateZ(offsets.angle);
        new_branch.position.set(offsets.x, offsets.y,0);

        this.tree_group.add(new_branch);
    }
    
    _drawLeaf(offsets) {
        let geom = new THREE.CylinderGeometry( 0.5, 0.5, this.branchSegmentLength, 32 );
        let leafMat = new THREE.MeshBasicMaterial({color: 0x85f53b })

        let new_branch = new THREE.Mesh(geom,leafMat);
        new_branch.castShadow = true;
        new_branch.receiveShadow = true;

        new_branch.rotateZ(offsets.angle);
        new_branch.position.set(offsets.x,offsets.y,0);

        this.tree_group.add(new_branch);
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