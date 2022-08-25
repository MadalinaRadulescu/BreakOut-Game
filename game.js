//Selects canvas element
const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d"); 

//add border to canvas
// cvs.style = "position: absolute; top: 250px; left: 700px; border:1px solid #0ff"
// cvs.style.border = "1px solid #0ff" ;

ctx.lineWidth = 3;


// // // game variables and constants
const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 8;
const SCORE_UNIT = 10;
const MAX_LEVEL = 3;
let GAME_OVER = false;
let LEVEL = 1;
let SCORE = SCORE_UNIT;
let LIFE = 3;
let leftArrow = false;
let rightArrow = false;

// // // create paddle
const paddle = {
    x: cvs.width/2 - PADDLE_WIDTH/2,
    y: cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx: 5
}

// draw paddle
function drawPaddle(){
    ctx.fillStyle = '#2e3548';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle = "#ffcd05";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);

}

document.addEventListener("keydown", function(event){
    if(event.key == "ArrowLeft"){   
        leftArrow = true;
    }else if(event.key == "ArrowRight"){
        rightArrow = true;
    }

});
document.addEventListener("keyup", function(event){
    if(event.key == "ArrowLeft"){   
        leftArrow = false;
    }else if(event.key == "ArrowRight"){
        rightArrow = false;
    }

});

function movePaddle(){
    if(rightArrow && paddle.x + paddle.width < cvs.width){
        paddle.x += paddle.dx
    }else if(leftArrow && paddle.x > 0){
        paddle.x -= paddle.dx
    }
};

// create the ball
const ball = {
    x: cvs.width/2,
    y: paddle.y - BALL_RADIUS,
    radius: BALL_RADIUS,
    speed: 4,
    dx: 3 * (Math.random()*2 -1),
    dy: -4,
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "#ffcd05";
    ctx.fill();
    ctx.strokeStyle = "#2e3548";
    ctx.stroke();
    ctx.closePath();
}

function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function ballWallCollision(){
    if(ball.x + ball.radius > cvs.width || ball.x - ball.radius<0){
        ball.dx = -ball.dx;
    }
    if(ball.y -ball.radius<0){
        ball.dy = -ball.dy
    }
    if(ball.y + ball.radius > cvs.height){
        LIFE --; //lose life
        resetBall();
        resetPaddle();
    }
}

function resetBall(){
    ball.x = cvs.width/2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 3 * (Math.random()*2 -1);
    ball.dy = -4;

}

function resetPaddle(){
    paddle.x = cvs.width/2 - PADDLE_WIDTH/2;
    paddle.y = cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT;
    paddle.width = PADDLE_WIDTH;
    paddle.height = PADDLE_HEIGHT;
    paddle.dx = 5;
}

function ballPaddleColision(){
    if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y <paddle.y + paddle.height && ball.y > paddle.y){
        // check ehere the ball hit the paddle
        let collideSpot = ball.x - (paddle.x + paddle.width/2);
        collideSpot = collideSpot/(paddle.width/2);
        let angle = collideSpot*Math.PI/3;

        ball.dx = -ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);
    }
}

const brick = {
    row: 1,
    column: 5,
    width: 55,
    height: 20,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 40,
    fillColor: "#2e3548",
    strokeColor: "#FFF"
}
let bricks = [];
function createBricks(){
    for(let r = 0; r < brick.row; r++){
        bricks[r]=[];
        for(let c =0; c <brick.column; c++){
            bricks[r][c] = {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status: true
            }
        }
    }
}
createBricks();

function drawBricks(){
    for(let r = 0; r < brick.row; r++){
        for(let c =0; c <brick.column; c++){
            let b = bricks[r][c]
            if(b.status){
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);
                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);

            }
        }
    }

}

function ballBricksCollision(){
    for(let r = 0; r < brick.row; r++){
        for(let c =0; c <brick.column; c++){
            let b = bricks[r][c]
            if(b.status){
                if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y &&ball.y - ball.radius < b.y + brick.height){
                    ball.dy = - ball.dy;
                    b.status = false;
                    SCORE += SCORE_UNIT;
                }

            }
        }
    }
}

function gameStats(text, textX, textY, img, imgX, imgY){
    ctx.fillStyle = "#FFF";
    ctx.font = "25px Germania One";
    ctx.fillText(text, textX, textY);

    ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}

function draw(){
    drawPaddle();
    drawBall();
    drawBricks();
    gameStats(SCORE, 35, 25, SCORE_IMG, 5, 5);
    gameStats(LIFE, cvs.width - 25, 25, LIFE_IMG, cvs.width-55, 5);
    gameStats(LEVEL, cvs.width/2, 25, LEVEL_IMG, cvs.width/2 - 30, 5);

}

function gameOver(){
    if(LIFE <= 0){
        showYouLose();
        GAME_OVER = true;
        // cvs.style.display = "none"
    }
}

function levelUp(){
    let isLevelDone = true;
    for(let r = 0; r < brick.row; r++){
        for(let c =0; c <brick.column; c++){
            isLevelDone = isLevelDone && !bricks[r][c].status;
        }
    }
    if(isLevelDone){
        if(LEVEL >= MAX_LEVEL){
            // cvs.style.display = "none"
            showYouWin();
            GAME_OVER = true;
            return;
        }
        brick.row++;
        createBricks();
        ball.speed += 1.001;
        resetBall();
        resetPaddle();
        LEVEL++;
    }

}

function update(){
    movePaddle();
    moveBall();
    ballWallCollision();
    ballPaddleColision();
    ballBricksCollision();
    gameOver();
    levelUp();

}

// game loop
function loop(){
    // clear canvas
    ctx.drawImage(BG_IMG, 0, 0);
    draw();

    update();
    if( !GAME_OVER){
        requestAnimationFrame(loop);
    } 
}

loop()

const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwon");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

restart.addEventListener("click", function(){
    location.reload();
});

function showYouWin(){
    gameover.style.display = "block";
    youwin.style.display = "block";
}

function showYouLose(){
    gameover.style.display = "block";
    youlose.style.display = "block";
}

