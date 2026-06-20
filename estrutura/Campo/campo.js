let board = [];
let rows = 8;
let columns = 8;

let minesCount = 10;
let minesLocation = [];

let tilesClicked = 0;
let flagEnabled = false;

let gameOver = false;

window.onload = function () {
    startGame();
};



function setMines() {
    // minesLocation.push("2-2"); 
    // minesLocation.push("2-3");
    // minesLocation.push("5-6");
    // minesLocation.push("3-4");
    // minesLocation.push("1-1");

    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}


function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMines();

    //preenchimento do quadrado
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            //<div id="0-0"></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }

if (minesLocation.includes(tile.id)) {

    createExplosion(tile);
    triggerShake();

    gameOver = true;

    setTimeout(() => {
        revealMines();
        showGameOver();
    }, 300);

    return;
}

    let coords = tile.id.split("-"); // "0-0" -> ["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);

}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    //top 3
    minesFound += checkTile(r - 1, c - 1);      //top left
    minesFound += checkTile(r - 1, c);        //top 
    minesFound += checkTile(r - 1, c + 1);      //top right

    //left and right
    minesFound += checkTile(r, c - 1);        //left
    minesFound += checkTile(r, c + 1);        //right

    //bottom 3
    minesFound += checkTile(r + 1, c - 1);      //bottom left
    minesFound += checkTile(r + 1, c);        //bottom 
    minesFound += checkTile(r + 1, c + 1);      //bottom right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        board[r][c].innerText = "";

        //top 3
        checkMine(r - 1, c - 1);    //top left
        checkMine(r - 1, c);      //top
        checkMine(r - 1, c + 1);    //top right

        //left and right
        checkMine(r, c - 1);      //left
        checkMine(r, c + 1);      //right

        //bottom 3
        checkMine(r + 1, c - 1);    //bottom left
        checkMine(r + 1, c);      //bottom
        checkMine(r + 1, c + 1);    //bottom right
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}

function createExplosion(tile) {
    const rect = tile.getBoundingClientRect();

    for (let i = 0; i < 8; i++) {
        const particle = document.createElement("div");
        particle.classList.add("explosion");

        document.body.appendChild(particle);

        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        particle.style.left = x + "px";
        particle.style.top = y + "px";

        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 60;

        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        particle.animate([
            { transform: "translate(0,0) scale(1)", opacity: 1 },
            { transform: `translate(${dx}px, ${dy}px) scale(2)`, opacity: 0 }
        ], {
            duration: 600,
            easing: "ease-out"
        });

        setTimeout(() => particle.remove(), 600);
    }
}

function triggerShake() {
    const body = document.body;

    body.classList.add("shake");

    setTimeout(() => {
        body.classList.remove("shake");
    }, 400);
}

function showGameOver() {
    document.getElementById("game-over").style.display = "flex";
}
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("restart-btn").addEventListener("click", restartGame);
});

function restartGame() {
    location.reload();
}

function setFlag() {
    flagEnabled = !flagEnabled;

    const btn = document.getElementById("flag-button");

    if (flagEnabled) {
        btn.classList.add("active");
    } else {
        btn.classList.remove("active");
    }
}

