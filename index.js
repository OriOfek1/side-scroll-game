const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight
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
        //horizontal boundary
        // if(this.position.x + this.width +this.velocity.x >= canvas.width ||
        //     this.position.x + this.velocity.x < 0)
        //     {this.velocity.x = 0}
        
    }
}

const player = new Player()

function animate(){
    requestAnimationFrame(animate)
    ctx.clearRect(0,0,canvas.width,canvas.height)
    player.update()
}

animate()

