import { A_Star } from "./aStarPath.js";

class imageLoader{
    constructor(){
        this.imageBank = {
            sky: "./sprites/sky.png",
            ground:"./sprites/ground.png",
            grid:"./sprites/grid.png",
            npc: "./sprites/hero-sheet2.png",
            npcGen: "./sprites/man-sheet.png",
            shadow: "./sprites/shadow.png",
            sheet: "./sprites/spritesheet.png",
            shadowBlock: "./sprites/shadowBlock.png",
            projectile: "./sprites/projectile.png",
        };

        // place to store loaded images
        this.images = {};

        Object.keys(this.imageBank).forEach( key => {
            const img = new Image();
            img.src = this.imageBank[key];  // grab value associated with key
            this.images[key] = {            // keep track of images 
                image: img,
                isLoaded: false,            // initialize a false
            }
            img.onload = () =>{             // callback functions that hits once loaded
                this.images[key].isLoaded = true; 
            }
        });
    }
}

export const ImageLoader = new imageLoader();
export const UNWALKABLE_LIST = ["0","7","8","9","10","11","13","21","24","25","26"];
export const WALKABLE_LIST = ["_","1","2","3","4","5","6","12","14","15","20"];
export const GRID_SQUARE_SIZE = 16;

export function getWalkableSpaces(matrix){
    let walkableSpaces = [];
    for(let i = 0; i < matrix.length; i++){
        for(let j = 0 ; j < matrix[i].length; j++){
            if(WALKABLE_LIST.includes(matrix[i][j])){
                walkableSpaces.push([j,i]);
            }
        }
    }
    return walkableSpaces;
}


export function drawMap(map,mapSquare,ctx,shadow){
    for(let i = 0; i < map.length; i++){
        for(let j = 0 ; j < map[i].length; j++){
            if(UNWALKABLE_LIST.includes(map[i][j])){
                // if surrounded by walkable nodes place random obstacle  
                if(map[i][j] === "26"){
                    mapSquare.currentFrame = 26;
                    mapSquare.drawImage(ctx,j*16,i*16);
                }
                // if surrounded by walkable nodes place random obstacle  
                else if(map[i][j] === "21"){
                    mapSquare.currentFrame = 21;
                    mapSquare.drawImage(ctx,j*16,i*16);
                }
                // if surrounded by walkable nodes place random obstacle  
                else if(map[i][j] === "25"){
                    mapSquare.currentFrame = 25;
                    mapSquare.drawImage(ctx,j*16,i*16);
                }
                // if above node is walkable but left & right are not, place dirt with left/right edges
                else if(map[i][j] === "13"){
                    mapSquare.currentFrame = 13;
                    mapSquare.drawImage(ctx,j*16,i*16);
                }
                // if above node is walkable and left & right are to, place dirt with no edges
                else if(map[i][j] === "9"){
                    mapSquare.currentFrame = 9;
                    mapSquare.drawImage(ctx,j*16,i*16);
                }
                // if above node is walkable but right is not, place dirt with right edge
                else if(map[i][j] === "10"){
                    mapSquare.currentFrame = 10;
                    mapSquare.drawImage(ctx,j*16,i*16);
                }
                // if above node is walkable but left is not, place dirt with left edge
                else if(map[i][j] === "8"){
                    mapSquare.currentFrame = 8;
                    mapSquare.drawImage(ctx,j*16,i*16);
                }
                
            }
            // console.log(!walkableList.includes(map[i][j]));
            if(WALKABLE_LIST.includes(map[i][j])){
                shadow.currentFrame = 12;
                shadow.drawImage(ctx,j*16,i*16);
                // if bottom, left, & right nodes are not walkable, place grass with left & right walls
                if(map[i][j] === "12"){
                    mapSquare.currentFrame = 12;
                    mapSquare.drawImage(ctx,j*16,i*16);
                }
                // if top, left, & right nodes are not walkable, place grass with top, left, & right walls
                else if(map[i][j] === "14"){
                    mapSquare.currentFrame = 14;
                    mapSquare.drawImage(ctx,j*16,i*16);
                }
                // if top, & left nodes are not walkable, place grass with left edge
                else if(map[i][j] === "15"){
                    mapSquare.currentFrame = 15;
                    mapSquare.drawImage(ctx,j*16,i*16);
                }
                // if top, & right nodes are not walkable, place grass with right edge
                else if(map[i][j] === "2"){
                    mapSquare.currentFrame = 2;
                    mapSquare.drawImage(ctx,j*16,i*16);
                }
                // if top node is not walkable, place grass with top wall
                else if(map[i][j] === "1"){
                    mapSquare.currentFrame = 1;
                    mapSquare.drawImage(ctx,j*16,i*16);
                }
                // if left, & right nodes are not walkable, place grass with left, & right walls
                else if(map[i][j] === "12"){
                    mapSquare.currentFrame = 12;
                    mapSquare.drawImage(ctx,j*16,i*16);
                }
                // if right node is not walkable, place grass with right edge
                else if(map[i][j] === "6"){
                    mapSquare.currentFrame = 6;
                    mapSquare.drawImage(ctx,j*16,i*16);
                }
                // if left node is not walkable, place grass with left edge
                else if(map[i][j] === "4"){
                    mapSquare.currentFrame = 4;
                    mapSquare.drawImage(ctx,j*16,i*16);
                }
                // place random grass with no walls
                else if(map[i][j] === "5"){
                    mapSquare.currentFrame = 5;
                    mapSquare.drawImage(ctx,j*16,i*16);
                }
                else{
                    mapSquare.currentFrame = 5;
                    mapSquare.drawImage(ctx,j*16,i*16);
                }
            }
        }
    }
}

export class makeMap{
    constructor(map, startingNodePos){
        this.map = map;
        this.startingNodePos = startingNodePos;
    }
    createMap(){
        if(this.startingNodePos[0] < this.map.length && this.startingNodePos[0] >= 0)
            if(this.startingNodePos[1] < this.map[0].length && this.startingNodePos[1] >= 0)
                this.map[this.startingNodePos[1]][this.startingNodePos[0]] = "_";
        // 1st pass: make random walkable ground
        for(let i = 1; i < this.map.length-1; i++){
            for(let j = 1 ; j < this.map[i].length-1; j++){
                if(this.map[i][j] === "0"){
                    let place = Math.floor(Math.random() * 10);//0-9
                    if(place >= 3){ //60% chance to place ground
                        this.map[i][j] = "_";
                    }
                }
            }
        }
        // 2nd pass: use A* to delete unwalkable nodes
        for(let i = 0; i < this.map.length; i++){
            for(let j = 0 ; j < this.map[i].length; j++){
                if(this.map[i][j] === "_"){
                    let aStar = new A_Star([this.startingNodePos[1],this.startingNodePos[0]], [i,j], this.map, UNWALKABLE_LIST);
                    let walkable = aStar.aStarPath();
                    if(walkable === false){
                        this.map[i][j] = "0";
                    }
                }
            }
        }
        // 3rd pass: lable finial map with correct symbles for drawing, sometimes random
        for(let i = 0; i < this.map.length; i++){
            for(let j = 0 ; j < this.map[i].length; j++){
                let neighbor = this.getNeighbors(i,j,this.map);
                if(this.map[i][j] === "0"){
                    // if surrounded by walkable nodes place random obstacle  
                    if(neighbor.top && neighbor.topRight && neighbor.topLeft &&
                        neighbor.bottom && neighbor.bottomRight && neighbor.bottomLeft 
                        && neighbor.left && neighbor.right){
                            this.map[i][j] = "9";
                    }
                    // if above node is walkable but left & right are not, place dirt with left/right edges
                    else if(neighbor.top && !neighbor.topRight && !neighbor.topLeft){
                        this.map[i][j] = "13";
                    }
                    // if above node is walkable and left & right are to, place dirt with no edges
                    else if(neighbor.top && neighbor.topLeft && neighbor.topRight){
                        this.map[i][j] = "9";
                    }
                    // if above node is walkable but right is not, place dirt with right edge
                    else if(neighbor.top && !neighbor.topRight){
                        this.map[i][j] = "10";
                    }
                    // if above node is walkable but left is not, place dirt with left edge
                    else if(neighbor.top && !neighbor.topLeft){
                        this.map[i][j] = "8";
                    }
                    
                }
                if(this.map[i][j] === "_"){
                    // if bottom, left, & right nodes are not walkable, place grass with left & right walls
                    if(!neighbor.bottom && !neighbor.right && !neighbor.left){
                        this.map[i][j] = "12";
                    }
                    // if top, left, & right nodes are not walkable, place grass with top, left, & right walls
                    else if(!neighbor.top && !neighbor.right && !neighbor.left){
                        this.map[i][j] = "14";
                    }
                    // if top, & left nodes are not walkable, place grass with left edge
                    else if(!neighbor.top && !neighbor.left){
                        this.map[i][j] = "15";
                    }
                    // if top, & right nodes are not walkable, place grass with right edge
                    else if(!neighbor.top && !neighbor.right){
                        this.map[i][j] = "2";
                    }
                    // if top node is not walkable, place grass with top wall
                    else if(!neighbor.top){
                        this.map[i][j] = "1";
                    }
                    // if left, & right nodes are not walkable, place grass with left, & right walls
                    else if(!neighbor.right && !neighbor.left){
                        this.map[i][j] = "12";
                    }
                    // if right node is not walkable, place grass with right edge
                    else if(!neighbor.right){
                        this.map[i][j] = "6";
                    }
                    // if left node is not walkable, place grass with left edge
                    else if(!neighbor.left){
                        this.map[i][j] = "4";
                    }
                    // place random grass with no walls
                    else{
                        this.map[i][j] = "5";
                    }
                }
            }
        }
        // 4th pass: place random collidable
        for(let i = 0; i < this.map.length; i++){
            for(let j = 0 ; j < this.map[i].length; j++){
                let neighbor = this.getNeighbors(i,j,this.map);
                if(WALKABLE_LIST.includes(this.map[i][j])){
                    if(neighbor.top && neighbor.topRight && neighbor.topLeft &&
                        neighbor.bottom && neighbor.bottomRight && neighbor.bottomLeft 
                        && neighbor.left && neighbor.right){
                            let rand = Math.floor(Math.random() * 10);
                            if(rand > 4){
                                this.map[i][j] = "25";
                            }
                            else{
                                this.map[i][j] = "26";
                            }
                    }
                    else if(neighbor.top && neighbor.topRight && neighbor.topLeft &&
                        neighbor.left && neighbor.right){
                            let rand = Math.floor(Math.random() * 10);
                            if(rand > 4){
                                this.map[i][j] = "25";
                            }
                            else{
                                this.map[i][j] = "26";
                            }
                    }
                }
            }
        }
        return this.map;
    }
    getNeighbors(row,colmn,matrix){
        let neighbors = {};
        let top  = row-1; let bottom = row+1;
        let left = colmn-1; let right  = colmn+1;
        // if top exits
        if(top >= 0){
            // top node
            if(WALKABLE_LIST.includes(matrix[top][colmn])){
                neighbors["top"] = true;
            }
            // top-left
            if(left >=0){
                if(WALKABLE_LIST.includes(matrix[top][left])){
                    neighbors["topLeft"] = true;
                }
            }
            // top right
            if(right <= matrix[row].length){
                if(WALKABLE_LIST.includes(matrix[top][right])){
                    neighbors["topRight"] = true;
                }
            }
    
        }
        // if bottom node exits
        if(bottom < matrix.length){
            if(WALKABLE_LIST.includes(matrix[bottom][colmn])){
                neighbors["bottom"] = true;
            }
            // bottom-left
            if(left >=0){
                if(WALKABLE_LIST.includes(matrix[bottom][left])){
                    neighbors["bottomLeft"] = true;
                }
            }
            // bottom right
            if(right <= matrix[row].length){
                if(WALKABLE_LIST.includes(matrix[bottom][right])){
                    neighbors["bottomRight"] = true;
                }
            }
        }
        // if left node exits
        if(left >=0){
            if(WALKABLE_LIST.includes(matrix[row][left])){
                neighbors["left"] = true;
            }
        }
        // if right node exits
        if(right <= matrix[row].length){
            if(WALKABLE_LIST.includes(matrix[row][right])){
                neighbors["right"] = true;
            }
        }
        return neighbors;
    }
}

export function collision(aX,aY,aHeight,aWidth,bX,bY,bHeight,bWidth){
    if(aX < bX &&
       aY < bY &&
      (aX + aWidth) > (bX + bWidth/2) &&
      (aY + aHeight) > (bY + bHeight/2)
    ){
        return true;
    }else{
        return false;
    }       
}