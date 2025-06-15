// a class in our main loop that allows us to call 
// requestAnimationFrame at set intervals and to be stopped/started 
export class GameEngine{
    constructor(update, render) {
        this.fps = 1000/60; 
        this.previousTimeStamp = 0;
        this.totalTimePassed = 0;
        
        this.update = update;
        this.render = render;

        this.requestAnimationFrameID = null;     
        this.running = false;
    }

    // A way to make shure the game is running at a timestep of 60 fps
    mainLoop = (timeStamp) => {
        if(!this.running) return;

        let deltaTime = timeStamp - this.previousTimeStamp;
        this.previousTimeStamp = timeStamp;

        // accumulate all the time since last frame.
        this.totalTimePassed += deltaTime;

        // Fixed time step updates
        // if enough time has passed to meet our fps
        while(this.totalTimePassed >= this.fps){
            // only update game at appropriate fps interval
            this.update(); 
            // this.render();
            // update at consistent intervals
            this.totalTimePassed -= this.fps;
            
        }
        // Render as fast as we can
        this.render();
        // similar to setInterval or setTimeout
        this.requestAnimationFrameID = requestAnimationFrame(this.mainLoop);
    }

    start(){
        if(!this.running){
            this.running = true;
            this.requestAnimationFrameID = requestAnimationFrame(this.mainLoop);
        }
    }
    stop(){// game pause
        if(this.requestAnimationFrameID){
            cancelAnimationFrame(this.requestAnimationFrameID);
        }
        this.running = false;
    }
}