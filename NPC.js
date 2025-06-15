import { UNWALKABLE_LIST,getWalkableSpaces } from "./Resources.js";
import { Sprite } from "./Sprite.js";
import { Vector2 } from "./Vector2.js";
import { A_Star } from "./aStarPath.js";

export class NPC{
    constructor(startingPos,imageSheet,frameSize,numColumns,numRows,currentFrame,map){
        this.npc = new Sprite({
            // imageSheet: ImageLoader.images.npc,
            // frameSize: new Vector2(32,32),
            // hFrame: 3,
            // vFrame: 8, 
            // frame: 1, 
            imageSheet: imageSheet,
            frameSize: frameSize,
            numColumns: numColumns,
            numRows: numRows, 
            currentFrame: currentFrame, 
        });
        this.pos = new Vector2((16*startingPos[0]), (16*startingPos[1]));
        
        this.timer = 0;
        this.path = [];
        this.walkableGround = getWalkableSpaces(map);
        this.map = map;        
    }
    animate(startingFrame,axis){
        let frameSpeed = 6;
        let offset = startingFrame;
        let frameItter = Math.abs(axis);
        this.npc.currentFrame = (Math.floor(frameItter/frameSpeed)%3)+offset;
    }

    // collision(self,target){
    //     if(self.pos.x < target?.pos.x &&
    //        self.pos.y < target?.pos.y &&
    //       (self.pos.x + self.npc.frameSize.x) > (target?.pos.x + target?.projectile.frameSize.x) &&
    //       (self.pos.y + self.npc.frameSize.y) > (target?.pos.y + target?.projectile.frameSize.y)
    //     ){
    //         // console.log("COLLISION",self.pos.x,self.pos.y,"    ",target.pos.x,target.pos.y);
    //         return true;
    //     }else{return false;}       
    // }
    update = () =>{
            this.timer++;
            if(this.timer > 60*1){// milisecounds * seconds
                let ranChoice = Math.floor(Math.random() * this.walkableGround.length);
                let choice = this.walkableGround[ranChoice];
                // floor divide our pos by 16 to fit our grid
                let row = Math.floor(this.pos.y/16);
                let colmn = Math.floor(this.pos.x/16);
                
                // run A* starting-node and ending-node and matrix to travers
                let aStarPath = new A_Star([row,colmn], [choice[1],choice[0]], this.map, UNWALKABLE_LIST);
                // return our newly found path
                this.path = aStarPath.getUsablePath();
                this.timer = 0;
            }

        // if we have a path saved
        if(this.path[0]){
            // have player go to first node in path
            if(this.pos.x > (this.path[0][1]*16)){
                this.animate(9,this.pos.x);
                this.pos.x -= 1;
            }
            else if(this.pos.x < (this.path[0][1]*16)){
                this.animate(3,this.pos.x);
                this.pos.x += 1;
            }
            else if(this.pos.y > (this.path[0][0]*16)){
                this.animate(6,this.pos.y);
                this.pos.y -= 1;
            }
            else if(this.pos.y < (this.path[0][0]*16)){
                this.animate(0,this.pos.y);
                this.pos.y += 1;
            }
            // remove path nodes already visited
            else{
                this.path.shift();
            }
            // if path is found stand still
            if(this.path.length === 0){
                this.npc.currentFrame = 1;
            }
        }
    };

}