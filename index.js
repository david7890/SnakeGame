const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

class SnakePart{
    constructor(x, y){
        this.x = x
        this.y = y
    }
}

let speed = 17;
//tamaño del lienzo 20 pixeles 
let tileCount = 20
let tileSize = canvas.width / tileCount -2;
let headX = 10
let headY = 10
const snakeParts = []
let tailLenght = 2

let appleX = 5
let appleY = 5

let xVelocity = 0
let yVelocity = 0

let score = 0

const gulpSound = new Audio("gulp.mp3")
//game loop
function drawGame(){
    changeSnakePosition()
    let result = isGameOver()
    if(result){
        return
    }
    clearScreen()

    checkAppleCollision()
    drawApple()
    drawSnake()

    drawScore()
    if(score > 10){
        speed = 15
    }
    if(score > 20){
        speed = 13
    }

    //cada cierto tiempo borra el lienzo y lo vuelve a dibujarv
    setTimeout(drawGame, 1000/speed)
}

function isGameOver(){
    let gameOver = false

    if(yVelocity === 0 && xVelocity === 0){
        //si vel es 0 no se esta moviendo y no es game over
        return false
    }
    for(let i = 0 ; i < snakeParts.length; i++){
        let part = snakeParts[i]
        //si head y part ocupan el mismo espacio 
        if(part.x === headX && part.y === headY){
            gameOver = true
            break
        }
    }

    if(gameOver){
        ctx.fillStyle = "white"
        ctx.font = "50px Verdana"

        ctx.fillText("Game Over", canvas.width / 6.5, canvas.height / 2)
    }

    return gameOver
}

function drawScore(){
    ctx.fillStyle= "white"
    ctx.font = "10px Verdana"
    ctx.fillText("Score " + score, canvas.width - 50, 15)
}

function clearScreen(){
    ctx.fillStyle = 'black'
    ctx.fillRect(0,0,canvas.clientWidth, canvas.height)

}

function drawApple(){
    ctx.fillStyle = "red"
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize)
}

function drawSnake(){
    
    ctx.fillStyle = '#2BED51'
    for(let i = 0; i < snakeParts.length; i++){
        let part = snakeParts[i]
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize)
    }

    snakeParts.push(new SnakePart(headX, headY)) //agregar un objeto al array
    if(snakeParts.length > tailLenght){
        //si es mas grande que tail quita uno
        snakeParts.shift()
    }

    ctx.fillStyle = 'orange'
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize)

}

function changeSnakePosition(){
    //cambia coords de cabeza
    if(headX * tileCount >= canvas.width){
        headX = 0
    }
    else if(headX * tileCount <= 0){
        headX = 20
    }
    if(headY * tileCount >= canvas.height){
        headY = 0
    }
    else if(headY * tileCount <= 0){
        headY = 20
    }

    headX = headX + xVelocity
    headY = headY + yVelocity
}

function checkAppleCollision(){
    if(appleX === headX && appleY === headY){
        //random da nums entre 0 y 1 y floor redondea
        appleX = Math.floor(Math.random() * tileCount)
        appleY = Math.floor(Math.random() * tileCount)
        tailLenght++
        score++
        gulpSound.play()
    }
}

document.body.addEventListener('keydown', keyDown)

//Cual evento pasa si se aprieta una tecla
function keyDown(event){
    //flecha arriba
    //se resta porque si se mueve arriba hay coords menores que abajo
    if(event.keyCode == 38){
        //si se esta moviendo para abajo no se puede mover hacia arriba
        if(yVelocity == 1){
            return
        }
        yVelocity = -1
        xVelocity = 0
    }

    //down 
    if(event.keyCode == 40){
        if(yVelocity == -1){
            return
        }
        yVelocity = 1
        xVelocity = 0
    }

    //left
    if(event.keyCode == 37){
        if(xVelocity == 1){
            return
        }
        yVelocity = 0
        xVelocity = -1
    }
    //right
    if(event.keyCode == 39){
        if(xVelocity == -1){
            return
        }
        yVelocity = 0
        xVelocity = 1
    }
}

drawGame()