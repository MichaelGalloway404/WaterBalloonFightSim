import { UNWALKABLE_LIST, getWalkableSpaces, GRID_SQUARE_SIZE } from "./Resources.js";
import { Sprite } from "./Sprite.js";
import { Vector2 } from "./Vector2.js";
import { A_Star } from "./aStarPath.js";

export class NPC {
    constructor(startingPos, imageSheet, frameSize, numColumns, numRows, currentFrame, map) {
        this.npc = new Sprite({
            imageSheet: imageSheet,
            frameSize: frameSize,
            numColumns: numColumns,
            numRows: numRows,
            currentFrame: currentFrame,
        });

        this.animationLifeTime = 0;
        this.showSprite = true;

        this.pos = new Vector2((startingPos[0] * GRID_SQUARE_SIZE), (startingPos[1] * GRID_SQUARE_SIZE));
        this.decisionTimer = 0;
        this.path = [];
        this.walkableGround = getWalkableSpaces(map);
        this.map = map;
        // randomized length of time till character can choose a pos to walk to
        this.timeTillPathChoice = 1;

        // is character participating in game or has been eleminated
        this.isLive = true;
        this.canAttack = false;
        // diffirent and unique fire rate per character instance
        this.randomAtckTime = Math.floor(Math.random() * 240) + 150;
        this.attackRateTimer = 0;
    }
    animate(startingFrame, axis, speed = 6, numFrames = 3) {
        let frameSpeed = speed;
        // sprite sheet staring frame
        let offset = startingFrame;
        // value used to step through frames
        let frameItter = Math.abs(axis);
        // an incrementor divided by frame speed, apply mod to keep it in bounds with an offset for correct spot in spritesheet
        // lets us loop through a set number of frames at an offset
        this.npc.currentFrame = (Math.floor(frameItter / frameSpeed) % numFrames) + offset;
    }

    update = () => {
        this.decisionTimer++;

        this.attackRateTimer++;
        // trigger bool that main game can used to fire projectile, unique to this character instance
        if (this.isLive && this.attackRateTimer > this.randomAtckTime) {
            this.canAttack = true;
            this.attackRateTimer = 0;
        }

        // if live and not currently walking a path and its time to make a decision then find new random path
        if (this.isLive && this.path.length === 0 && this.decisionTimer > (60 * this.timeTillPathChoice)) {
            let ranChoice = Math.floor(Math.random() * this.walkableGround.length);
            let choice = this.walkableGround[ranChoice];

            // floor divide our pos by GRID_SQUARE_SIZE(16) to fit our grid
            let row = Math.floor(this.pos.y / GRID_SQUARE_SIZE);
            let colmn = Math.floor(this.pos.x / GRID_SQUARE_SIZE);

            // run A* starting-node and ending-node and matrix to travers
            let aStarPath = new A_Star([row, colmn], [choice[1], choice[0]], this.map, UNWALKABLE_LIST);

            // return our newly found path and set time till next possible path
            this.path = aStarPath.getUsablePath();
            this.timeTillPathChoice = Math.floor(Math.random() * 10);

            // reset time till next decision check
            this.decisionTimer = 0;
        }

        // if we have a path saved
        if (this.isLive && this.path[0]) {
            // have player go to first node in path
            if (this.pos.x > (this.path[0][1] * GRID_SQUARE_SIZE)) {
                this.animate(9, this.pos.x);
                this.pos.x -= 1;
            }
            else if (this.pos.x < (this.path[0][1] * GRID_SQUARE_SIZE)) {
                this.animate(3, this.pos.x);
                this.pos.x += 1;
            }
            else if (this.pos.y > (this.path[0][0] * GRID_SQUARE_SIZE)) {
                this.animate(6, this.pos.y);
                this.pos.y -= 1;
            }
            else if (this.pos.y < (this.path[0][0] * GRID_SQUARE_SIZE)) {
                this.animate(0, this.pos.y);
                this.pos.y += 1;
            }
            // remove path nodes already visited
            else {
                this.path.shift();
            }
            // if path is found stand still
            if (this.path.length === 0) {
                this.npc.currentFrame = 1;
            }
        }
        if (!this.isLive) {
            this.animationLifeTime++;
            // continue to play animation for a tagged out character
            if(this.animationLifeTime < 100){
                this.animate(12, this.decisionTimer, 12, 4);
            }else{this.showSprite = false;}
        }
    };
}