export class Input{
    constructor(){
        this.heldDIR = [];
        this.mouseClickPos = [];

        document.addEventListener('click', (event) => {
            // get game-screens rectangle
            let canvas = document.getElementById('game-screen');
            const rect = canvas.getBoundingClientRect();
    
            // get X & Y reletive to game screen times scaling
            // for if screen isn't at full width/height 
            // all divided by 16 to fit our grid
            const mouseClickX = Math.floor(((event.clientX) * (canvas.width / rect.width)/16));
            const mouseClickY = Math.floor(((event.clientY) * (canvas.height / rect.height))/16);
            this.mouseClickPos.push(mouseClickY,mouseClickX);        
    });

        // KEY DOWN
        document.addEventListener("keydown", (key)=>{
            if(key.code === "ArrowUp"){
             this.onArrowPressed('UP');   
            }
            if(key.code === "ArrowDown"){
             this.onArrowPressed('DOWN');   
            }
            if(key.code === "ArrowLeft"){
             this.onArrowPressed('LEFT');   
            }
            if(key.code === "ArrowRight"){
             this.onArrowPressed('RIGHT');   
            }
        });
        // KEY UP
        document.addEventListener("keyup", (key) =>{
            if(key.code === "ArrowUp"){
             this.onArrowReleased('UP');   
            }
            if(key.code === "ArrowDown"){
             this.onArrowReleased('DOWN');   
            }
            if(key.code === "ArrowLeft"){
             this.onArrowReleased('LEFT');   
            }
            if(key.code === "ArrowRight"){
             this.onArrowReleased('RIGHT');   
            }
        });
    }

    // get current dir
    get direction(){ // getters allow for syntax like Input.direction();
        return this.heldDIR[0]; // return first element, could be undefined
    }
    onArrowPressed(dir){
        // Add this arrow to queue if it's new(no double up ect...)
        if(this.heldDIR.indexOf(dir) === -1){
            this.heldDIR.unshift(dir);
        }
    }
    onArrowReleased(dir){
        const indx = this.heldDIR.indexOf(dir);
        if(indx === -1){return;}
        // Remove this key from list
        this.heldDIR.splice(indx, 1);
    }

}