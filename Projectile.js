import { Sprite } from "./Sprite.js";
import { Vector2 } from "./Vector2.js";

export class Projectile{
    constructor(startingPos,target,imageSheet,frameSize,numColumns,numRows,currentFrame){
        this.projectile = new Sprite({
            imageSheet: imageSheet,
            frameSize: frameSize,
            numColumns: numColumns,
            numRows: numRows, 
            currentFrame: currentFrame,
        });
        this.pos = new Vector2((startingPos[0]), (startingPos[1]));    
        this.angle = this.trajectory(startingPos,target,2);
    }
    
    trajectory(start,target,speed){
        // let magnitudeDiff = Math.abs(((start[0]) + (start[1])) - ((target[0]) + (target[1])))/10;
        // let x = 0; let y = 0;
        // if(magnitudeDiff > 0 ){
        //     x = Math.abs((start[0])-(target[0])) / (magnitudeDiff);
        //     y = Math.abs((start[1])-(target[1])) / (magnitudeDiff);
        // }else{
        //     x = Math.abs((start[0])-(target[0]));
        //     y = Math.abs((start[1])-(target[1]));
        // }
        // let angle = [0,0];
        // if(x > 5){x=5;}
        // if(x < 1){x=1;}
        // if(y > 5){y=5;}
        // if(y < 1){y=1;}

        // if(start[0] >  target[0]){ angle[0] = -(x);}
        // if(start[0] == target[0]){ angle[0] = 0; }
        // if(start[0] <  target[0]){ angle[0] = x; }

        // if(start[1] >  target[1]){ angle[1] = -(x); }
        // if(start[1] == target[1]){ angle[1] = 0; }
        // if(start[1] <  target[1]){ angle[1] = x; }
        
        let diffX = (target[0])-(start[0]);
        let diffY = (target[1])-(start[1]);
        let distance = Math.sqrt((diffX**2) + (diffY**2));
        let normX = (speed*(diffX/distance));
        let normY = (speed*(diffY/distance));
        let angle = [normX,normY]
        return angle;
    }

    update = () => {
        this.pos.x += this.angle[0];
        this.pos.y += this.angle[1];
    }
    draw = () => {

    }
}