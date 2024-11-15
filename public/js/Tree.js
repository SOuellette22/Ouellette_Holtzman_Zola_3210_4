import * as THREE from 'three';
import { GrammerEngine } from "./GrammerEngine.js"
import { element, positionLocal } from 'three/webgpu';

class Tree {
    constructor() {
        //example of grammer engine remove later
        let engine = new GrammerEngine();

        engine.addRule("1", "11");
        engine.addRule("0", "1[0]0");

        this.tree_string = engine.generate("0", 2);
        console.log(this.tree_string)

        this.branchSegmentLength = 5;

        this.stack = [];
        
        this.tree_group = new THREE.Group();

        this._treeGenerate();
    }

    _treeGenerate() {
        let y_offset = this.branchSegmentLength;                    //y_offset += this.branchSegmentLength;
        let x_offset = 0;
        let angle = 0; 

        for (let curr_char of this.tree_string ) {
            console.log("y_offset", y_offset, "angle: ", angle)
            switch(curr_char) {
                case "1": 
                    this._drawBranch(x_offset, y_offset, angle);
                    break;
                case "0": 
                    this._drawLeaf(x_offset, y_offset, angle);
                    break;
                case "[":
                    this.stack.push(new Element(x_offset, y_offset, angle));
                    angle += 45;
                    x_offset += 2;
                    break;
                case "]":
                    let element = this.stack.pop();
                    x_offset = element.x;
                    y_offset = element.y;
                    angle = element.angle;

                    angle -= 45;
                    x_offset -= 2;
                    break;

            }
            y_offset += 3;
        }
    }

    _drawBranch(x, y, angle) {
        let geom = new THREE.CylinderGeometry( 1, 1, this.branchSegmentLength, 32 );
        let branchMat = new THREE.MeshBasicMaterial({color: 0x8c3b0f  })

        let new_branch = new THREE.Mesh(geom,branchMat);
        new_branch.translateY(y);
        new_branch.translateX(x)
        //new_branch.rotateZ(angle);
        this.tree_group.add(new_branch);
    }
    
    _drawLeaf(x, y, angle) {
        let geom = new THREE.CylinderGeometry( 1, 1, this.branchSegmentLength, 32 );
        let leafMat = new THREE.MeshBasicMaterial({color: 0x85f53b })

        let new_branch = new THREE.Mesh(geom,leafMat);

        new_branch.translateY(y);
        new_branch.translateX(x)
        //new_branch.rotateZ(angle);
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