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
        this.animateTime = 0;
        this.isLive = true;
        this.animationDuration = 0;
        // offset the sprite frames used based on team-member, for diff color projectiles
        this.colorSpriteOffset = 0;
    }
    
    trajectory(start,target,speed){
        let diffX = (target[0])-(start[0]);
        let diffY = (target[1])-(start[1]);
        let distance = Math.sqrt((diffX**2) + (diffY**2));
        let normX = (speed*(diffX/distance));
        let normY = (speed*(diffY/distance));
        let angle = [normX,normY]
        return angle;
    }
    animate(axis,speed=6,offset=0){
        let frameSpeed = speed;
        let frameItter = Math.abs(axis);
        this.projectile.currentFrame = (Math.floor(frameItter/frameSpeed)%4)+offset;
    }

    update = () => {
        this.animateTime++
        if(this.isLive){
            this.pos.x += this.angle[0];
            this.pos.y += this.angle[1];
            this.animate(this.animateTime,6,0+this.colorSpriteOffset);
        }else{
            this.animationDuration++;
            if(this.animationDuration < 20){
                this.animate(this.animateTime,8,4+this.colorSpriteOffset);
            }else{
                this.animate(this.animateTime,8,16+this.colorSpriteOffset);
            }
            
        }
    }
}