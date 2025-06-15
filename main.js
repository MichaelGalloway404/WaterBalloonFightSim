import { GameEngine } from "./GameEngine.js";
import { ImageLoader, drawMap, makeMap, collision, getWalkableSpaces } from "./Resources.js";
import { Sprite } from "./Sprite.js";
import { Vector2 } from "./Vector2.js";
import { MinHeap } from "./MinHeap.js";
import { BLANK_MAP } from "./Maps.js";
import { NPC } from "./NPC.js";
import { Projectile } from "./Projectile.js";

const canvas = document.querySelector('#game-screen');
const ctx = canvas.getContext("2d");

// staring positons on our grid consiting of 10x19 tiles each 16x16 pixels


let createNewMap = new makeMap(BLANK_MAP, [5, 5]);
let newMap = createNewMap.createMap();

let walkable = getWalkableSpaces(newMap);

let spriteList = {};
let spriteList2 = {};
let numberOfSprites = 3;
// create a variable number of sprites
for (let i = 0; i < numberOfSprites; i++) {
    let randomPos = Math.floor(Math.random() * walkable.length);
    spriteList[i] = new NPC(walkable[randomPos], ImageLoader.images.npc, new Vector2(32, 32), 3, 8, 1, newMap);

    randomPos = Math.floor(Math.random() * walkable.length);
    spriteList2[i] = new NPC(walkable[randomPos], ImageLoader.images.npcGen, new Vector2(32, 32), 3, 8, 1, newMap);
}

// backround
const skySprite = new Sprite({
    imageSheet: ImageLoader.images.sky,
    frameSize: new Vector2(320, 180)
})

// map images used to build randomized map
const mapTile = new Sprite({
    imageSheet: ImageLoader.images.sheet,
    frameSize: new Vector2(16, 16),
    numColumns: 4,
    numRows: 7,
    currentFrame: 3,
});

// shadow for each sprite
const shadow = new Sprite({
    imageSheet: ImageLoader.images.shadow,
    frameSize: new Vector2(32, 32),
})

// shadow for every block placed
const shadowTile = new Sprite({
    imageSheet: ImageLoader.images.shadowBlock,
    frameSize: new Vector2(16, 16 * 16),
})

let team1Projectiles = [];
let team2Projectiles = [];

// build team 1
let team1 = [];
for (let i = 0; i < Object.keys(spriteList).length; i++) {
    team1.push(spriteList[i]);
}
// build team 2
let team2 = [];
for (let i = 0; i < Object.keys(spriteList2).length; i++) {
    team2.push(spriteList2[i]);
}

let timer = 0;

// our games loop for updateding the game world
const update = () => {
    timer++;
    if (timer > 400) {
        // reset team 1
        if (team1Projectiles.length > 0) { team1Projectiles = []; }
        // reset team 2
        if (team2Projectiles.length > 0) { team2Projectiles = []; }
        timer = 0;
    }

    // delete team 1 bullet on collision
    for (let i = 0; i < team1Projectiles.length; i++) {
        if (team1Projectiles[i].pos.x < 0 || team1Projectiles[i].pos.x > window.screen.width ||
            team1Projectiles[i].pos.y < 0 || team1Projectiles[i].pos.y > window.screen.height) {
            team1Projectiles.splice(team1Projectiles.indexOf(team1Projectiles[i]), 1);
        }
    }
    // delete team 2 bullet on collision
    for (let i = 0; i < team2Projectiles.length; i++) {
        if (team2Projectiles[i].pos.x < 0 || team2Projectiles[i].pos.x > window.screen.width ||
            team2Projectiles[i].pos.y < 0 || team2Projectiles[i].pos.y > window.screen.height) {
            team2Projectiles.splice(team2Projectiles.indexOf(team2Projectiles[i]), 1);
        }
    }

    // COLLISON BTW TEAM 2 AND PROJECTILE FROM TEAM 1
    for (let i = 0; i < Object.keys(spriteList2).length; i++) {
        if (team1Projectiles.length != 0 && spriteList2[i] != null) {
            for (let j = 0; j < team1Projectiles.length; j++) {
                if (spriteList2[i] !== null && collision(
                    spriteList2[i].pos.x, spriteList2[i].pos.y,
                    40, 21,
                    Math.round(team1Projectiles[j].pos.x), Math.round(team1Projectiles[j].pos.y),
                    team1Projectiles[j].projectile.frameSize.y, team1Projectiles[j].projectile.frameSize.x
                )) {
                    team2.splice(team2.indexOf(spriteList2[i]), 1);
                    team1Projectiles.splice(team1Projectiles.indexOf(team1Projectiles[j]), 1);
                    spriteList2[i] = null;
                }
            }
        }
    }
    // COLLISON BTW TEAM 1 AND PROJECTILE FROM TEAM 2
    for (let i = 0; i < Object.keys(spriteList).length; i++) {
        if (team2Projectiles.length != 0 && spriteList[i] != null) {
            for (let j = 0; j < team2Projectiles.length; j++) {
                if (spriteList[i] !== null && collision(
                    spriteList[i].pos.x, spriteList[i].pos.y,
                    40, 21,
                    Math.round(team2Projectiles[j].pos.x), Math.round(team2Projectiles[j].pos.y),
                    team2Projectiles[j].projectile.frameSize.y, team2Projectiles[j].projectile.frameSize.x
                )) {
                    team1.splice(team1.indexOf(spriteList[i]), 1);
                    team2Projectiles.splice(team2Projectiles.indexOf(team2Projectiles[j]), 1);
                    spriteList[i] = null;
                }
            }
        }
    }

    // handle team 1 attacking
    for (let i = 0; i < Object.keys(spriteList).length; i++) {
        let ran = (Math.floor(Math.random() * team2.length));
        if (spriteList[i] !== null && team2[0] != undefined && timer >= 100 && timer <= 101) {
            let bullet = new Projectile(
                [spriteList[i].pos.x + 11, spriteList[i].pos.y + 20],
                [team2[ran].pos.x + 11, team2[ran].pos.y + 20],
                ImageLoader.images.grid, new Vector2(5, 5), 1, 0, 0
            );
            if (team1Projectiles.length < numberOfSprites) {
                team1Projectiles.push(bullet);
            }
        }
    }
    // handle team 2 attacking
    for (let i = 0; i < Object.keys(spriteList2).length; i++) {
        let ran = (Math.floor(Math.random() * team1.length));
        if (spriteList2[i] !== null && team1[0] != undefined && timer >= 100 && timer <= 101) {
            let bullet = new Projectile(
                [spriteList2[i].pos.x + 11, spriteList2[i].pos.y + 20],
                [team1[ran].pos.x + 11, team1[ran].pos.y + 20],
                ImageLoader.images.grid, new Vector2(5, 5), 1, 0, 0
            );
            if (team2Projectiles.length < numberOfSprites) {
                team2Projectiles.push(bullet);
            }
        }
    }

    // update team 1
    for (let i = 0; i < Object.keys(spriteList).length; i++) {
        if (spriteList[i] != null) {
            spriteList[i]?.update();
        }

    }
    // update team 2
    for (let i = 0; i < Object.keys(spriteList2).length; i++) {
        if (spriteList2[i] != null) {
            spriteList2[i]?.update();
        }

    }
    // update team 1 projectiles
    if (team1Projectiles.length != 0) {
        for (let i = 0; i < team1Projectiles.length; i++) {
            team1Projectiles[i].update();
        }
    }
    // update team 2 projectiles
    if (team2Projectiles.length != 0) {
        for (let i = 0; i < team2Projectiles.length; i++) {
            team2Projectiles[i].update();
        }
    }
};

// pass to the queue our sprite and it will be assign by its y position
let layerQ = new MinHeap("pos", "y");

const draw = () => {
    // console.log("DRAW");
    skySprite.drawImage(ctx, 0, 0);
    // method that draws correct map tile image to our randomly generated map
    drawMap(newMap, mapTile, ctx, shadowTile);

    // add each of our sprite to priorityQ based on their y position, to draw sprites higher on the screen first
    // gives it a fealing of depth, when one sprite walks behind another sprite, it wont be standing on the others head
    for (let i = 0; i < Object.keys(spriteList).length; i++) {
        if (spriteList[i] != null) {
            layerQ.add(spriteList[i]);
        }
    }

    for (let i = 0; i < Object.keys(spriteList2).length; i++) {
        if (spriteList2[i] != null) {
            layerQ.add(spriteList2[i]);
        }

    }

    // if Q is not empty
    while (layerQ.peek() !== null) {
        let tempSprite = layerQ.remove();
        // add a shadow to sprite
        shadow.drawImage(ctx, tempSprite.pos.x - 9, tempSprite.pos.y - 20);
        tempSprite.npc.drawImage(ctx, tempSprite.pos.x - 9, tempSprite.pos.y - 20);
        // shadow.drawImage(ctx, tempSprite.pos.x, tempSprite.pos.y);
        // tempSprite.npc.drawImage(ctx, tempSprite.pos.x, tempSprite.pos.y);
    }

    // if(bullet != null){
    //     bullet.projectile.drawImage(ctx,bullet.pos.x,bullet.pos.y);
    // }

    // draw team 1 prjectiles
    if (team1Projectiles.length !== 0) {
        for (let i = 0; i < team1Projectiles.length; i++) {
            team1Projectiles[i].projectile.drawImage(ctx, team1Projectiles[i].pos.x - 9, team1Projectiles[i].pos.y - 20);
        }
    }
    // draw team 2 prjectiles
    if (team2Projectiles.length !== 0) {
        for (let i = 0; i < team2Projectiles.length; i++) {
            team2Projectiles[i].projectile.drawImage(ctx, team2Projectiles[i].pos.x - 9, team2Projectiles[i].pos.y - 20);
        }
    }

}

const gameLoop = new GameEngine(update, draw);
gameLoop.start();