const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 1024 / 1.2
canvas.height = 576 / 1.2   
canvas.style.border = '2px solid black';
canvas.style
const gravity = 0.5
class Player {
    constructor(){
        this.position = {
            x: 100,
            y: 100
        }
        this.width = 20
        this.height = 30
        this.velocity = {
            x: 0,
            y: 0
        }
        this.lastKeyPressed;
    }
    draw(){
            ctx.fillStyle = 'blue'
        ctx.fillRect(this.position.x, this.position.y, this.width,this.height)
    }
    update(){
        this.draw()
        this.position.x +=this.velocity.x
        this.position.y +=this.velocity.y
        //vertical boundary 
        if(this.position.y + this.height + this.velocity.y <= canvas.height)
        {this.velocity.y += gravity}
        else {this.velocity.y = 0
              this.position.y = canvas.height - this.height 
        }
    }
}

class Platform {
    constructor(position){
        this.position = {
            x: position.x,
            y: position.y
        }
        this.width = 200
        this.height = 20
    }
    draw(){
        ctx.fillStyle = 'purple'
        ctx.fillRect(this.position.x,this.position.y, this.width,this.height)
    }
}

const player = new Player()
const platforms = [new Platform({x: 200, y:400}), new Platform({x: 500, y:300})]
const keys = {
    right : {
        pressed : false
    },
    left : {
        pressed : false
    },
    jump : {
        pressed : false
    }
}
let scrollOffset = 0;

function animate(){
    requestAnimationFrame(animate)
    ctx.clearRect(0,0,canvas.width,canvas.height)
    platforms.forEach(platform => platform.draw())
    player.update()

    //player controls
    if (keys.left.pressed && player.lastKeyPressed === 'ArrowLeft' && player.position.x > 100) {
        scrollOffset -= 5
        player.velocity.x = -5
      }
       else if (keys.right.pressed && player.lastKeyPressed === 'ArrowRight' && player.position.x < 400) {
        scrollOffset += 5
        player.velocity.x = 5
      }
      else {
        player.velocity.x = 0;
        // Player is at the edge triggering map advancement or regression
        platforms.forEach(platform => {
            if (keys.right.pressed) {
                scrollOffset += 5
                platform.position.x -= 5;
            }
            else if (keys.left.pressed) {
                scrollOffset -= 5
                platform.position.x += 5;
            }
        });
    }
    console.log(player.lastKeyPressed,player.velocity.x)

    //platform collision detection
    platforms.forEach(platform => {
        if (
            player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width
        ) {
            player.velocity.y = 0;
            // Correct the position to be exactly on the platform if falling onto it
            player.position.y = platform.position.y - player.height;
        }
    });
    
}

animate()

addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowRight':
        keys.right.pressed = true
        player.lastKeyPressed = 'ArrowRight'
        break;
      case 'ArrowLeft':
        keys.left.pressed = true
        player.lastKeyPressed = 'ArrowLeft'
        break;
      case ' ':
        keys.jump.pressed = true
        player.lastKeyPressed = 'jump'
        player.velocity.y += -10
        break;
      case 'x':
        break;
    }
  });
  
  addEventListener('keyup', (event) => {
    switch (event.key) {
      case 'ArrowRight':
        keys.right.pressed = false
        player.velocity.x = 0
        break;
      case 'ArrowLeft':
        keys.left.pressed = false
        player.velocity.x = 0
        break;
      case ' ':
        break;
      case 'x':
        break;
    }
  });
  