// ゲーム要素の取得
const game = document.getElementById('game');
const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');



// ゲーム状態のフラグ
let isGameRunning = false;
let isGamePaused = false;

// パドルの初期位置と速度
let paddleX = (game.clientWidth - paddle.clientWidth) / 2;
const paddleSpeed = 15;

// ボールの初期位置と速度
let ballX = (game.clientWidth - ball.clientWidth) / 2;
let ballY = game.clientHeight - paddle.clientHeight - ball.clientHeight - 10;
let ballSpeedX = 2;
let ballSpeedY = -2;

// ブロックの列と行の数
const rows = 4;
const columns = 6;
const totalBlocks = rows * columns;
let blocksLeft = totalBlocks;

// パドルの移動
document.addEventListener('keydown', (e) => {
    if (isGameRunning && !isGamePaused) {
        if (e.key === 'ArrowLeft' && paddleX > 0) {
            paddleX -= paddleSpeed;
        }
        if (e.key === 'ArrowRight' && paddleX < game.clientWidth - paddle.clientWidth) {
            paddleX += paddleSpeed;
        }
        paddle.style.left = `${paddleX}px`;
    }
});

// スタートボタンのクリックイベント
startButton.addEventListener('click', () => {
    if (!isGameRunning) {
        initializeGame(); // ゲームを初期状態にリセット
        resetBall(); // ボールを初期位置に戻す
        startGame();
    }
});

// 一時停止ボタンのクリックイベント
pauseButton.addEventListener('click', () => {
    if (isGameRunning) {
        togglePauseGame();
    }
});



// ブロックとボールの当たり判定
function checkBlockCollision() {
    const blocks = document.querySelectorAll('.block');
    let collided = false; // ボールがどれかのブロックと交差したかを示すフラグ

    for (const block of blocks) {
        if (block.style.display !== 'none') {
            const blockRect = block.getBoundingClientRect(); // ブロックの位置とサイズを取得
            const ballRect = ball.getBoundingClientRect();   // ボールの位置とサイズを取得

            // ボールとブロックが交差しているかを判定
            if (
                ballRect.right >= blockRect.left &&
                ballRect.left <= blockRect.right &&
                ballRect.bottom >= blockRect.top &&
                ballRect.top <= blockRect.bottom
            ) {
                // ボールがブロックと交差している場合
                block.style.display = 'none'; // ブロックを非表示にする
                ballSpeedY = -ballSpeedY;

                collided = true;
                blocksLeft--; // ブロックの残り数を減少させる
                console.log(blocksLeft); // ブロックの残り数をコンソールに表示
                
            }
        }
    }

    // ブロックがすべて壊れているかを確認
    if (blocksLeft === 0) {
        gameClear();
    }

    return collided;
}


// ゲームループ
function gameLoop() {
    if (isGameRunning && !isGamePaused) {
        // ボールの移動
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;

        // ボールの当たり判定
        if (ballX < 0 || ballX > game.clientWidth - ball.clientWidth) {
            ballSpeedX = -ballSpeedX;
        }
        if (ballY < 0) {
            ballSpeedY = -ballSpeedY;
        }
        if (ballY > game.clientHeight - ball.clientHeight) {
            gameOver();
        }

        // パドルとボールの当たり判定
        if (
            ballY + ball.clientHeight >= game.clientHeight - paddle.clientHeight &&
            ballX + ball.clientWidth >= paddleX &&
            ballX <= paddleX + paddle.clientWidth
        ) {
            ballSpeedY = -ballSpeedY;
        }

        // ブロックとボールの当たり判定
        checkBlockCollision();
    }

    // ゲームループの再実行
    if (isGameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

// ブロック生成関数
function createBlocks() {
    // 既存のブロックを削除
    const existingBlocks = document.querySelectorAll('.block');
    existingBlocks.forEach((block) => {
        block.remove();
    });

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            const block = document.createElement('div');
            block.classList.add('block');
            block.style.top = `${j * 24}px`;
            block.style.left = `${i * 66}px`;
            game.appendChild(block);
        }
    }
}


// ゲーム開始関数
function startGame() {
    isGameRunning = true;
    startButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
    createBlocks(); // ブロック生成を追加
    gameLoop();
}

// ゲーム一時停止/再開関数
function togglePauseGame() {
    isGamePaused = !isGamePaused;
    if (isGamePaused) {
        pauseButton.textContent = '再開';
    } else {
        pauseButton.textContent = '一時停止';
    }
}

// ゲームクリア時とゲームオーバー時にボールを初期位置に戻す関数
function resetBall() {
    ballX = (game.clientWidth - ball.clientWidth) / 2;
    ballY = game.clientHeight - paddle.clientHeight - ball.clientHeight - 10;
    ballSpeedX = 2;
    ballSpeedY = -2;
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
}

// ゲームクリア時の処理
function gameClear() {
    isGameRunning = false;
    pauseButton.style.display = 'none';
    startButton.style.display = 'inline-block';
    alert('ゲームクリア！');
    initializeGame(); // ゲームを初期状態にリセット
    resetBall(); // ボールを初期位置に戻す
}

// ゲームオーバー時の処理
function gameOver() {
    isGameRunning = false;
    pauseButton.style.display = 'none';
    startButton.style.display = 'inline-block';
    alert('ゲームオーバー');
    initializeGame(); // ゲームを初期状態にリセット
    resetBall(); // ボールを初期位置に戻す
}

// ブロック初期化関数
function initializeBlocks() {
    const blocks = document.querySelectorAll('.block');
    blocks.forEach((block) => {
        block.style.display = 'block';
    });
    blocksLeft = totalBlocks;
}


// 初期化処理
function initializeGame() {
    createBlocks();
    blocksLeft = totalBlocks; // ブロック数を初期化
}

// ゲームスタート前に初期状態にする
initializeGame();
