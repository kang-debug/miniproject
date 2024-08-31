import './Game3.css';


export default () =>{
    
    
    document.addEventListener("DOMContentLoaded", () => {
        const game = document.getElementById("game");
        const rows = 20;
        const cols = 10;
        const speed = 500;
        let currentShape;
        let currentPosition = { x: 4, y: 0 };
        let grid = Array.from({ length: rows }, () => Array(cols).fill(0));
        let timerId;
    
        const shapes = [
            [[1, 1, 1, 1]],
            [[1, 1], [1, 1]],
            [[1, 1, 1], [0, 1, 0]],
            [[1, 1, 0], [0, 1, 1]],
            [[0, 1, 1], [1, 1, 0]],
            [[1, 1, 1], [1, 0, 0]],
            [[1, 1, 1], [0, 0, 1]],
        ];
    
        function createGrid() {
            grid.forEach((row, rowIndex) => {
                row.forEach((cell, colIndex) => {
                    const div = document.createElement("div");
                    div.classList.add("cell");
                    div.dataset.row = rowIndex;
                    div.dataset.col = colIndex;
                    game.appendChild(div);
                });
            });
        }
    
        function drawShape() {
            currentShape.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell) {
                        const block = getBlock(currentPosition.y + y, currentPosition.x + x);
                        if (block) block.classList.add("active");
                    }
                });
            });
        }
    
        function eraseShape() {
            const activeBlocks = document.querySelectorAll(".active");
            activeBlocks.forEach(block => block.classList.remove("active"));
        }
    
        function moveShape(dx, dy) {
            eraseShape();
            currentPosition.x += dx;
            currentPosition.y += dy;
            drawShape();
        }
    
        function rotateShape() {
            const newShape = currentShape[0].map((_, index) =>
                currentShape.map(row => row[index])
            ).reverse();
    
            eraseShape();
            currentShape = newShape;
            drawShape();
        }
    
        function freezeShape() {
            currentShape.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell) {
                        const block = getBlock(currentPosition.y + y, currentPosition.x + x);
                        if (block) block.classList.add("fixed");
                        grid[currentPosition.y + y][currentPosition.x + x] = 1;
                    }
                });
            });
            checkFullLines();
            currentShape = getRandomShape();
            currentPosition = { x: 4, y: 0 };
        }
    
        function checkFullLines() {
            for (let y = rows - 1; y >= 0; y--) {
                if (grid[y].every(cell => cell === 1)) {
                    grid.splice(y, 1);
                    grid.unshift(Array(cols).fill(0));
                    updateGrid();
                }
            }
        }
    
        function updateGrid() {
            grid.forEach((row, y) => {
                row.forEach((cell, x) => {
                    const block = getBlock(y, x);
                    if (cell) block.classList.add("fixed");
                    else block.classList.remove("fixed");
                });
            });
        }
    
        function isCollision(x, y, shape) {
            return shape.some((row, dy) =>
                row.some((cell, dx) =>
                    cell && (grid[y + dy] && grid[y + dy][x + dx]) !== 0
                )
            );
        }
    
        function getBlock(row, col) {
            return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        }
    
        function getRandomShape() {
            return shapes[Math.floor(Math.random() * shapes.length)];
        }
    
        function dropShape() {
            if (!isCollision(currentPosition.x, currentPosition.y + 1, currentShape)) {
                moveShape(0, 1);
            } else {
                freezeShape();
                if (currentPosition.y === 0) {
                    clearInterval(timerId);
                    alert("Game Over!");
                }
            }
        }
    
        function control(e) {
            if (e.keyCode === 37) moveShape(-1, 0);
            if (e.keyCode === 39) moveShape(1, 0);
            if (e.keyCode === 40) dropShape(); 
            if (e.keyCode === 38) rotateShape();
        }
    
        createGrid();
        currentShape = getRandomShape();
        drawShape();
        timerId = setInterval(dropShape, speed);
        document.addEventListener("keydown", control);     
    });
    
}