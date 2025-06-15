import {Vector2} from "./Vector2.js";

export class Sprite{
    constructor({
        imageSheet,   // image file
        frameSize,  // size of the crop for our sub image in sprite sheet
        numColumns, // number of frame colmns
        numRows,    // number of frame rows
        currentFrame,      // currently displayed image
        scale,      // default 1
    }){
        this.imageSheet = imageSheet;
        // default to our 16x16 pixel grid squares
        this.frameSize = frameSize ?? new Vector2(16,16);
        this.numColumns = numColumns ?? 1;
        this.numRows = numRows ?? 1;
        this.currentFrame = currentFrame ?? 0; 
        this.scale = scale ?? 1;
        // key-val pair of our images, ex. 3x8 matrix equals images 0-24, not indexes
        this.frameDict = new Map();
        this.frameDirectory();
    }

    frameDirectory() {
        let currentFrame = 0;
        for(let i = 0; i < this.numRows; i++){
            for(let j = 0; j < this.numColumns; j++){
                this.frameDict.set(currentFrame, new Vector2(this.frameSize.x * j, this.frameSize.y * i));
                currentFrame++;
            }
        }
    }

    drawImage(ctx, x, y){
        // return if image isn't ready yet
        if(!this.imageSheet.isLoaded){
            return;
        }

        // Find frame to use
        let frameX = 0;
        let frameY = 0;
        const frame = this.frameDict.get(this.currentFrame); //dynamically lookup whats in frameMap
        if(frame){
            frameX = frame.x;
            frameY = frame.y;
        }

        // CANVAS DRAWIMAGE METHOD PARAMS
        // img 	        Specifies the image, canvas, or video element to use 	 
        // sx 	        Optional. The x coordinate where to start clipping 	
        // sy 	        Optional. The y coordinate where to start clipping 	
        // swidth 	    Optional. The width of the clipped image 	
        // sheight 	    Optional. The height of the clipped image 	
        // x 	        The x coordinate where to place the image on the canvas 	
        // y 	        The y coordinate where to place the image on the canvas 	
        // width 	    Optional. The width of the image to use (stretch or reduce the image) 	
        // height 	    Optional. The height of the image to use (stretch or reduce the image)

        ctx.drawImage(                          // the native method for canvas, pass 9 args
            this.imageSheet.image,
            frameX,frameY,                      // top corner of frame
            this.frameSize.x,this.frameSize.y,  // how much to crop(X),crop(Y)
            x,y,                                // Where to place the image on canvas x,y
            this.frameSize.x * this.scale,      // how large to scale x dafault 1
            this.frameSize.y * this.scale,      // how large to scale y dafault 1
        )
    }
}