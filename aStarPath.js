import { MinHeap } from "./MinHeap.js";

// node for A star grid
class node{
    constructor(pos,startNode=null,endNode=null,parent=null){
        this.pos = pos;
        this.g_score = this.huristic(this,startNode);
        this.h_score = this.huristic(this,endNode);
        this.f_score = this.g_score + this.h_score;
        this.parent = parent;
    }
    huristic(currNode, targetNode){
        if(currNode && targetNode){
            return (Math.abs(targetNode.pos[0]-currNode.pos[0]))+(Math.abs(targetNode.pos[1]-currNode.pos[1]))*10;
        }
        return 0;
    }
};
//    A* PATHFINDING
export class A_Star{
    constructor(startPos,endPos,map,unwalkableList){
        this.unwalkableList = unwalkableList;
        this.start = new node(startPos);
        this.end = new node(endPos);
        this.openList = new MinHeap("f_score");
        this.closedList = {};
        this.map = map;
    }

    getNeighbors(map,currNode){
        let topNode;
        let bottomNode;
        let rightNode;
        let leftNode;
        let neighbors = {};
        let row = currNode.pos[0];
        let colmn = currNode.pos[1];
        if(row-1 >=0){
            topNode = new node([row-1,colmn],this.start,this.end,currNode);
            neighbors['top'] = topNode;
        }
        if(row+1 < map.length){
            bottomNode = new node([row+1,colmn],this.start,this.end,currNode);
            neighbors['bottom'] = bottomNode;
        }
        if(colmn+1 < map[0].length){
            rightNode = new node([row,colmn+1],this.start,this.end,currNode);
            neighbors['right'] = rightNode;
        }
        if(colmn-1 >= 0){
            leftNode = new node([row,colmn-1],this.start,this.end,currNode);
            neighbors['left'] = leftNode;
        }
        return neighbors;
    }

    aStarPath(){
        let notWalkable = false;
        this.openList.add(this.start);
        let running = true;
        let finalNode = this.start;
        while (running){
            let current = this.openList.remove();
            if(current === null){
                return notWalkable;
            }
            this.closedList[current.pos] = current;
            if (current.pos[0] == this.end.pos[0] && current.pos[1] == this.end.pos[1]){
                finalNode = current;
                running = false;
                break;
            }
            let currentNeighbors = this.getNeighbors(this.map,current);
            for (const [key, value] of Object.entries(currentNeighbors)) {
                
                // if neighbor is not traversable and not already in closed list
                if(this.unwalkableList.includes(this.map[value.pos[0]][value.pos[1]]) && this.closedList[value.pos] === undefined){
                    this.closedList[value.pos] = value;
                }else{
                    if(this.closedList[value.pos] === undefined){
                        this.openList.add(value);
                    }
                }
            }  
        }
        return finalNode;
    }
    getUsablePath(){
        let finalPath = [];
        let linkedListOfPath = this.aStarPath();
        while(linkedListOfPath?.parent != null){
            finalPath.unshift(linkedListOfPath.pos);
            linkedListOfPath = linkedListOfPath.parent;
        }
        return finalPath;
    }
}




// Testing area

// // map[y][x]  0 = wall, * = traversable
// let map = [   //  0   1   2   3   4   5   6   x
//     ["*","*","*","*","*","*","*",],// 0
//     ["0","0","0","0","*","*","*",],// 1
//     ["0","*","*","*","*","*","*",],// 2
//     ["0","*","0","0","0","0","0",],// 3
//     ["0","*","0","*","*","*","0",],// 4
//     ["0","*","0","*","0","*","0",],// 5
//     ["0","*","*","*","0","*","0",],// 6
//     ["0","*","*","*","0","*","*",] // 7
//                                    // y
// ];

// let map = [   //  0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16x
//                  ["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],// 0
//                  ["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],// 1
//                  ["0","0","0","0","0","0","0","*","*","*","*","*","*","*","0","0","0"],// 2
//                  ["0","0","0","*","0","*","*","*","0","0","*","*","*","*","*","*","0"],// 3
//                  ["0","0","0","*","0","0","*","*","*","*","*","*","*","0","0","*","0"],// 4
//                  ["0","0","0","*","0","0","*","0","0","0","0","*","*","*","*","*","0"],// 5
//                  ["0","0","0","*","*","*","*","*","*","*","*","*","0","0","0","*","0"],// 6
//                  ["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],// 7
//                  ["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],// 8
//                  ["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],// 9
//                  ["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],// 10
    
// ];


// function printMap(matrix){
//     let row = "";
//     for(let i=0; i < matrix.length; i++){
//         for(let j=0; j < matrix[i].length; j++){
//             row = row + matrix[i][j] + " ";
//         }
//         console.log(row);
//         row = "";
//     }
// }
// // printMap(map);

// // let foundPath = [[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4]];
// function drawPath(matrix,path){
//     for(let i=0; i < path.length; i++){
//         // matrix[row][col]  matrix[y][x]
//         matrix[path[i][0]][path[i][1]] = "^";
//     }
// }

// //                         start  end  matrix
// let aStarPath = new A_Star([7,6],[0,0],map);
// // returns list of matrix indexes to get to end index
// let finishedPath = aStarPath.getUsablePath();

// printMap(map);
// console.log(" ");
// console.log("FINDING PATH");
// console.log(" ");
// drawPath(map,finishedPath);
// printMap(map);
// console.log(" ");
// console.log(finishedPath);