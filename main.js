
const inputBlueTeam = document.createElement("input");
inputBlueTeam.type = "number";
inputBlueTeam.value = 2;
inputBlueTeam.classList.add("inputTeamCount");

const inputRedTeam = document.createElement("input");
inputRedTeam.type = "number";
inputRedTeam.value = 2;
inputRedTeam.classList.add("inputTeamCount");

// Create the button element
const restartButton = document.createElement("button");
restartButton.textContent = "Start Battle";
restartButton.classList.add("refresh-btn");

// add to document
const buttonContainer = document.querySelector('.buttonContainer');
buttonContainer.appendChild(inputBlueTeam);
buttonContainer.appendChild(inputRedTeam);
buttonContainer.appendChild(restartButton);


// On button click: save number and reload
restartButton.addEventListener("click", () => {
    const valueBlue = inputBlueTeam.value;
    const valueRed = inputRedTeam.value;
    if (valueBlue) {
        localStorage.setItem("blueTeamCount", valueBlue);
        location.reload(); // Reload the page
    } else {
        alert("Enter a Number for Blue Team.")
    }
    if (valueRed) {
        localStorage.setItem("redTeamCount", valueRed);
        location.reload();
    } else {
        alert("Enter a Number for Red Team.")
    }
});

// On page load: check for stored number
const storedCountBlueTeam = localStorage.getItem("blueTeamCount");
const storedCountRedTeam = localStorage.getItem("redTeamCount");


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

let team1Projectiles = [];
let team2Projectiles = [];

let spriteList = {};
let team1 = [];

let spriteList2 = {};
let team2 = [];

let countTeam1 = storedCountBlueTeam || 2;
let countTeam2 = storedCountRedTeam || 2;

// create a variable number of sprites for each team
for (let i = 0; i < countTeam1; i++) {
    let randomPos = Math.floor(Math.random() * walkable.length);
    spriteList[i] = new NPC(walkable[randomPos], ImageLoader.images.npc, new Vector2(32, 32), 3, 8, 1, newMap);
    team1.push(spriteList[i]);
}
for (let i = 0; i < countTeam2; i++) {
    let randomPos = Math.floor(Math.random() * walkable.length);
    spriteList2[i] = new NPC(walkable[randomPos], ImageLoader.images.npcGen, new Vector2(32, 32), 3, 8, 1, newMap);
    team2.push(spriteList2[i]);
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

function attacking(teamA, teamAProjectile, teamB, offset = 0) {
    for (let i = 0; i < teamA.length; i++) {
        // target a random live opponent
        let ran = (Math.floor(Math.random() * teamB.length));
        if (teamB[0] != undefined && teamA[i].canAttack && teamAProjectile.length < teamA.length) {
            let bullet = new Projectile(
                [teamA[i].pos.x + 11, teamA[i].pos.y + 20],
                [teamB[ran].pos.x + 11, teamB[ran].pos.y + 20],
                ImageLoader.images.projectile, new Vector2(16, 16), 4, 5, 0
            );
            bullet.colorSpriteOffset = offset;
            teamAProjectile.push(bullet);
            teamA[i].canAttack = false;
        }
    }
}

function projectileCollision(teamAProjectile, teamB, teamBSpriteList) {
    for (let i = 0; i < Object.keys(teamBSpriteList).length; i++) {
        if (teamAProjectile.length != 0 && teamBSpriteList[i] != null) {
            for (let j = 0; j < teamAProjectile.length; j++) {
                if (teamAProjectile[j].isLive &&
                    teamBSpriteList[i].isLive &&
                    collision(teamBSpriteList[i].pos.x, teamBSpriteList[i].pos.y, 32, 21,
                        teamAProjectile[j].pos.x, teamAProjectile[j].pos.y,
                        teamAProjectile[j].projectile.frameSize.y, teamAProjectile[j].projectile.frameSize.x
                    )) {
                    teamB.splice(teamB.indexOf(teamBSpriteList[i]), 1);
                    teamAProjectile[j].isLive = false;
                    teamBSpriteList[i].isLive = false;
                }
            }
        }
    }
    // update team
    for (let i = 0; i < Object.keys(teamBSpriteList).length; i++) {
        if (teamBSpriteList[i] != null) {
            teamBSpriteList[i]?.update();
        }
    }
}

function projectileCleanUp(team) {
    // if either teams projectile goes out of bounds
    for (let i = 0; i < team.length; i++) {
        if (team[i].pos.x < 0 || team[i].pos.x > window.screen.width ||
            team[i].pos.y < 0 || team[i].pos.y > window.screen.height) {
            team.splice(team.indexOf(team[i]), 1);
        }
    }

    // when a projectile is done animating remove it from drawing list
    for (let i = 0; i < team.length; i++) {
        if (team[0] !== undefined) {
            if (team[i].animationDuration > 20) {
                team.splice(team.indexOf(team[i]), 1);
            }
        }
    }
    // update projectiles
    if (team.length != 0) {
        for (let i = 0; i < team.length; i++) {
            team[i].update();
        }
    }
}

// our games loop for updateding the game world
const update = () => {
    // team attacking and its projectile
    attacking(team1, team1Projectiles, team2, 8);
    attacking(team2, team2Projectiles, team1);

    // collision btw opposong teams projectile
    projectileCollision(team1Projectiles, team2, spriteList2);
    projectileCollision(team2Projectiles, team1, spriteList);

    projectileCleanUp(team1Projectiles);
    projectileCleanUp(team2Projectiles);

    // Display Winners or Losers
    if (team1.length > 0 && team2.length > 0) {
        document.getElementById('scoreBoard').innerHTML = 'Score Board: Blue: '+team1.length+' Red: '+team2.length;
    } else if (team1.length == 0 && team2.length > 0) {
        document.getElementById('scoreBoard').innerHTML = 'Winner Blue Team!'
    } else if (team1.length > 0 && team2.length == 0) {
        document.getElementById('scoreBoard').innerHTML = 'Winner Red Team!'
    } else if (team1.length == 0 && team2.length == 0) {
        document.getElementById('scoreBoard').innerHTML = 'All Losers!!!'
    }
};

// pass to the queue our sprite and it will be assign by its y position
let layerQ = new MinHeap("pos", "y");
function drawSpites(sprite) {
    for (let i = 0; i < Object.keys(sprite).length; i++) {
        if (sprite[i] != null) {
            // add each of our sprite to priorityQ based on their y position, to draw sprites higher on the screen first
            // gives it a fealing of depth, when one sprite walks behind another sprite, it wont be standing on the others head
            layerQ.add(sprite[i]);
        }
    }
}
function drawProjectile(projectile, offsetX, offsetY) {
    if (projectile.length !== 0) {
        for (let i = 0; i < projectile.length; i++) {
            projectile[i].projectile.drawImage(ctx, projectile[i].pos.x - offsetX, projectile[i].pos.y - offsetY);
        }
    }
}
let offsetX = 9;
let offsetY = 20
const draw = () => {
    // console.log("DRAW");
    skySprite.drawImage(ctx, 0, 0);
    // method that draws correct map tile image to our randomly generated map
    drawMap(newMap, mapTile, ctx, shadowTile);

    // draw shadows/wet-spots for players
    drawSpites(spriteList);
    drawSpites(spriteList2);
    // if Q is not empty
    while (layerQ.peek() !== null) {
        let tempSprite = layerQ.remove();
        // keep drawing a shadow for player even if they are out of the game
        shadow.drawImage(ctx, tempSprite.pos.x - offsetX, tempSprite.pos.y - offsetY);
        // having the shadow drawn here and seprately allows for a wet spot to be left
        // in background signigying an out play and keeds it from overlaping existing players
    }

    // draw players that are not out yet
    drawSpites(spriteList);
    drawSpites(spriteList2);
    // if Q is not empty
    while (layerQ.peek() !== null) {
        let tempSprite = layerQ.remove();
        if (tempSprite.showSprite) {
            // draw sprite
            tempSprite.npc.drawImage(ctx, tempSprite.pos.x - offsetX, tempSprite.pos.y - offsetY);
        }
    }

    drawProjectile(team1Projectiles, offsetX, offsetY);
    drawProjectile(team2Projectiles, offsetX, offsetY);
}

const gameLoop = new GameEngine(update, draw);
gameLoop.start();