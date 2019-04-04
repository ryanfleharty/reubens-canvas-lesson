console.log("canvas");

const canvas = document.getElementById('my-canvas');
console.log(canvas) // cool now we have the canvas

// the "context" is what you actually draw on -- you basically always need it
const ctx = canvas.getContext('2d');
console.log(ctx); // cool, our rendering context is set up


function makeX() {

  // "hey i'm about to draw a new line"
  ctx.beginPath()

  // "start the line here"
  ctx.moveTo(100, 100) // pass in coords starting from top left corner: x, then y.

  // "the line should end here"
  ctx.lineTo(300, 300)

  // you could style your stroke -- any valid CSS color value can go here
  ctx.strokeStyle = "blue";

  // this will "stick" until you change it 
  ctx.lineWidth = 6

  // "actually draw the line"
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(100, 300);
  ctx.lineTo(300, 100);
  ctx.stroke();
  
}

// makes a grid of 1px black lines with 49px between each parallel line
function makeGrid() {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1

  // draw vertical lines
  for(let i = 0; i <= canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
  }
  // draw horizontal lines
  for(let i = 0; i <= canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
  }

}


function makeRectangles() {

  // make a rectangle outline -------

  // same as before....
  ctx.beginPath();

  // this is the method for rectangles of any shape
  // it takes 4 parameters, here they are in order
  // 1. x coord of the UPPER LEFT HAND CORNER of the rectangle
  // 2. y coord of the UPPER LEFT HAND CORNER of the rectangle
  // 3. width of rect
  // 4. height of rect
  ctx.rect(300, 300, 80, 180);

  // set styles
  ctx.strokeStyle = "maroon";
  ctx.lineWidth = 4;

  // actually draw an outline of a rectangle
  ctx.stroke();


  // Make a rectangle (filled in)! -------

  ctx.beginPath();
  ctx.rect(70, 120, 170, 40);

  // set the fill color 
  ctx.fillStyle = "green";

  // use fill instead of stroke to get a solid rectangle
  ctx.fill()
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}


function makeCircles() {

  ctx.beginPath();

  // to draw a circle, use .arc() -- params are of a different nature
  // x: the x coord fo the CENTER of the circle
  // y: the y coord of the CENTER of the circle
  // radius: 
  // start: "start angle", we'll keep it simple and just always set this to zero
  // end: "end angle": how much of the circle you want to actually draw in RADIANS (Note 2π radians is 360°), starting from start angle.

  // for simplicity, to draw circles, just always use 0 for start, and 2π (2 * Math.PI) for end.

  ctx.arc(75, 525, 71, 0, Math.PI * 2);

  ctx.fillStyle = '#ff0000';

  ctx.fill();


  // make an olive-green circle outline
  ctx.beginPath();
  ctx.arc(75, 325, 71, 0, Math.PI * 2);

  ctx.strokeStyle = '#999900';

  ctx.stroke();

}




const captSquare = {
  x: 502,
  y: 52,
  height: 46,
  width: 46,
  color: "orange",
  speed: 2,
  direction: {
    up: false,
    right: false,
    down: false,
    left: false
  },
  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
  },
  setDirection(key) {
    // pressing a key means we should be moving in that direction
    // remember -- move will be called every 1/60th of a second regardless
    if(key == "w") this.direction.up = true;
    if(key == "a") this.direction.left = true;
    if(key == "s") this.direction.down = true;
    if(key == "d") this.direction.right = true;
  },
  unsetDirection(key) {
    // releasing a key means we should no longer be moving in that direction
    // remember -- move will be called every 1/60th of a second regardless
    if(key == "w") this.direction.up = false;
    if(key == "a") this.direction.left = false;
    if(key == "s") this.direction.down = false;
    if(key == "d") this.direction.right = false;
  },
  move() {
    // move it if it should be moving
    // remember -- this will be called every 1/60th of a second 
    if(this.direction.up) this.y -= this.speed;
    if(this.direction.right) this.x += this.speed;
    if(this.direction.down) this.y += this.speed;
    if(this.direction.left) this.x -= this.speed;
  },
  checkCollision(thing) {
    if(
      this.x + this.width > thing.x &&
      this.x < thing.x + thing.width &&
      thing.y < this.y + this.height && 
      thing.y + thing.height > this.y
    ) {
      console.log("collision");
      return true
    }
    else return false;
  },
}

captSquare.draw();



const cmdrCircle = {
  x: 200, 
  y: 40, 
  r: 17,
  color: "cadetblue", // now the color can be changed
  speed: 10, // changing this will change how "fast" the ball moves
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
    ctx.fillStyle = this.color; // now the color can be changed
    ctx.fill();
  },
  move(direction) {
    if(direction === "ArrowDown" && this.y + this.r + this.speed < canvas.height) {
      this.y += this.speed;
    }
    if(direction === "ArrowUp" && this.y - this.r - this.speed > 0) {
      this.y -= this.speed;
    }
    if(direction === "ArrowLeft" && this.x - this.r - this.speed > 0) {
      this.x -= this.speed;
    }
    if(direction === "ArrowRight" && this.x + this.r + this.speed < canvas.width) {
      this.x += this.speed;
    }
    clearCanvas(); // this should fix our trailer issue
    this.draw();
  }
}
cmdrCircle.draw();



// obstacle -- hit it and u die
const obstacle = {
  x: 250,
  y: 250,
  width: 100,
  height: 100,
  color: "black",
  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();    
  }
}
obstacle.draw();


let requestID;
let animationRunning = false;

let x = 0;
function animate() {
  // code in here will be repeated 60 times/sec (approx)

  animationRunning = true;
  
  captSquare.move();
  clearCanvas(); // prevent trailers!
  captSquare.draw();

  cmdrCircle.draw(); // that's better

  obstacle.draw(); // don't forget --- you gotta redraw everything

  if(captSquare.checkCollision(obstacle)) {
    gameOver(); // throw some snarky shade; comment this out to see return stopping the animation
    return; // stop the animation
  } else {
    // recursion -- you are creating a situation where the function calls itself 
    requestID = window.requestAnimationFrame(animate)
  }

}
animate();

function stopAnimation() {
  cancelAnimationFrame(requestID)
  animationRunning = false;
}

function gameOver() {
  document.write(`
    <h1>YOU ARE DEAD YOU SHOULD NOT HAVE CRASHED INTO THAT</h1>
    <FORM>
      <INPUT TYPE="hidden" VALUE="you also shouldn't capitalize your html or use STYLE='' because it's not 1995">
      <BUTTON STYLE="font-size: 18pt">CLICK</BUTTON>
    </FORM>
  `)
}

document.getElementById('make-x').addEventListener('click', (event) => {
  makeX();
})
document.getElementById('make-grid').addEventListener('click', (event) => {
  makeGrid();
})
document.getElementById('make-rect').addEventListener('click', (event) => {
  makeRectangles();
})
document.getElementById('clear').addEventListener('click', (event) => {
  clearCanvas();
})
document.getElementById('make-circles').addEventListener('click', (event) => {
  makeCircles();
})
document.addEventListener('keydown', (event) => {
  // console.log(event);
  // Note: we could lighten the load on our processor by filtering out keypresses here that aren't
  // Up, Down, Left, or Right
  if(["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(event.key)) {
    cmdrCircle.move(event.key)
  }

  // for captSquare
  if(["w", "a", "s", "d"].includes(event.key)) {
    captSquare.setDirection(event.key)  
  }

  // so that we can restart animation 
  if(event.key === "1") {
    if(!animationRunning) animate();
    else console.log("nope");
  }
  if(event.key === "2") {
    stopAnimation();
  }


})

document.addEventListener('keyup', (event) => {
  // for captSquare
  if(["w", "a", "s", "d"].includes(event.key)) {
    captSquare.unsetDirection(event.key)  
  }
})

// document.getElementById('animate').addEventListener('click', (event) => {
//   animate();
// })

document.getElementById('stop-animation').addEventListener('click', (event) => {
  stopAnimation();
})