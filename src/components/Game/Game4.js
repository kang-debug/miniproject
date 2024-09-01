const dino = document.getElementById('dino');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

let isJumping = false;
let isGameOver = false;
let score = 0;
let jumpHeight = 100;  // 점프 높이
let obstacleSpeed = 15;  // 초기 장애물 속도
const initialObstacleInterval = 2000;  // 장애물 생성 간격

function startGame() {
    isGameOver = false;
    score = 0;
    obstacleSpeed = 15;  // 초기 장애물 속도
    scoreDisplay.innerText = score;
    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    dino.style.bottom = '0px';
    createObstacle();
    document.addEventListener('keydown', handleJump);
}

function handleJump(event) {
    if (event.key === ' ' && !isJumping && !isGameOver) {
        jump();
    }
}

function jump() {
    let position = 0;
    isJumping = true;

    let upInterval = setInterval(() => {
        if (position >= jumpHeight) {
            clearInterval(upInterval);

            let downInterval = setInterval(() => {
                if (position <= 0) {
                    clearInterval(downInterval);
                    isJumping = false;
                }
                position -= 10;  // 점프 하강 속도
                dino.style.bottom = position + 'px';
            }, 20);
        }

        position += 15;  // 점프 상승 속도
        dino.style.bottom = position + 'px';
    }, 20);
}

function createObstacle() {
    if (isGameOver) return;

    let gameContainer = document.querySelector('.game-container');
    let obstacleTypes = ['cactus', 'bird', 'rock', 'red'];
    let obstacleType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    let obstacle = document.createElement('div');
    obstacle.classList.add(obstacleType);

    // 장애물이 하늘에 나타날 확률 50%
    if (obstacleType !== 'rock' && Math.random() < 0.5) {
        obstacle.classList.add('top');
    }

    gameContainer.appendChild(obstacle);

    let obstaclePosition = 800;
    obstacle.style.left = obstaclePosition + 'px';

    let moveInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(moveInterval);
            gameContainer.removeChild(obstacle);
            return;
        }

        obstaclePosition -= obstacleSpeed;
        obstacle.style.left = obstaclePosition + 'px';

        // Dino와 장애물의 위치 및 크기 정보 가져오기
        let dinoRect = dino.getBoundingClientRect();
        let obstacleRect = obstacle.getBoundingClientRect();

        // 충돌 판정
        if (
            dinoRect.left < obstacleRect.right &&
            dinoRect.right > obstacleRect.left &&
            dinoRect.top < obstacleRect.bottom &&
            dinoRect.bottom > obstacleRect.top
        ) {
            gameOver();
        }

        if (obstaclePosition < -obstacleRect.width) {
            clearInterval(moveInterval);
            gameContainer.removeChild(obstacle);
            score += 100;  // 점수 증가
            scoreDisplay.innerText = score;

            // 장애물 속도 증가
            obstacleSpeed += 0.5;  // 속도를 점진적으로 증가

            // 새로운 장애물 생성
            setTimeout(createObstacle, Math.random() * 1000 + initialObstacleInterval);
        }
    }, 20);
}

function gameOver() {
    isGameOver = true;
    document.removeEventListener('keydown', handleJump);
    restartButton.style.display = 'block';
}

function restartGame() {
    location.reload();  // 페이지 새로고침으로 게임 리스타트
}

// 게임 시작 버튼 클릭 시
startButton.addEventListener('click', startGame);

// 리스타트 버튼 클릭 시
restartButton.addEventListener('click', restartGame);

// 스페이스바로 점프만 처리
document.addEventListener('keydown', handleJump);
