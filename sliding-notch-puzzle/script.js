let canvas = document.getElementById("canvas");
let widthElem = document.getElementById("width");
let heightElem = document.getElementById("height");
let sizeElem = document.getElementById("size");
let amountElem = document.getElementById("amount");
let scrambleAmountElem = document.getElementById("scramble-amount");
let diffListElem = document.getElementById("diff-list");
let timeElem = document.getElementById("time");
let movesElem = document.getElementById("moves");
let windowElem = document.getElementById("window-container");
let timeString = document.getElementById("time-string");
let movesString = document.getElementById("moves-string");
let sizeString = document.getElementById("size-string");
let amountString = document.getElementById("amount-string");
let scrambleString = document.getElementById("scramble-string");
let moves = 0;
let timerStartAt = 0;
let timerPaused = false;
let width, height, size, amount, timer, interval;
let backgroundColor = "rgb(200,200,200)";
let foregroundColor = "rgb(150,150,150)";
let fontSize = 0.3;
let scrambleValue = 0;
let data = [];
let parts = [];

function apply() {
    data = [];
    width = parseInt(widthElem.value);
    height = parseInt(heightElem.value);
    size = parseInt(sizeElem.value);
    amount = parseInt(amountElem.value);
    canvas.style.width = width * (size) + "px";
    canvas.style.height = height * (size) + "px";
    canvas.innerHTML = "";
    for (let i = 0; i < amount; i++) {
        let part = document.createElement("div");
        part.className = "part";
        part.style.width = part.style.height = size + "px";
        part.style.fontSize = fontSize * size + "px";
        part.onclick = function() {
            clickEvent(i);
        };
        if (i + 1 != amount) {
            data.push((i + 1).toString());
        } else {
            data.push("");
        }
        canvas.appendChild(part);
    }
    parts = document.getElementsByClassName("part");
    moves = 0;
    scrambleValue = scrambleAmountElem.value;
    updateCanvas();
    updateMoves();
    stopTimer();
}

function updateCanvas() {
    for (let i = 0; i < amount; i++) {
        parts[i].innerText = data[i];
    }
}

function updateDiff() {
    let d = diffListElem.value;
    if (d == "Beginner") {
        sizeElem.value = 50;
        widthElem.value = 3;
        heightElem.value = 4;
        amountElem.value = 10;
        scrambleAmountElem.value = 500;
    } else if (d == "Easy") {
        sizeElem.value = 50;
        widthElem.value = 4;
        heightElem.value = 5;
        amountElem.value = 17;
        scrambleAmountElem.value = 500;
    } else if (d == "Normal") {
        sizeElem.value = 50;
        widthElem.value = 5;
        heightElem.value = 6;
        amountElem.value = 26;
        scrambleAmountElem.value = 500;
    } else if (d == "Hard") {
        sizeElem.value = 50;
        widthElem.value = 6;
        heightElem.value = 7;
        amountElem.value = 37;
        scrambleAmountElem.value = 1000;
    } else if (d == "Very hard") {
        sizeElem.value = 50;
        widthElem.value = 7;
        heightElem.value = 8;
        amountElem.value = 50;
        scrambleAmountElem.value = 2000;
    } else if (d == "Extremely hard") {
        sizeElem.value = 50;
        widthElem.value = 10;
        heightElem.value = 11;
        amountElem.value = 101;
        scrambleAmountElem.value = 5000;
    }
    apply();
}

function updateMoves() {
    movesElem.value = moves;
}

function clickEvent(tile) {
    for (let w = -1; w <= 1; w++) {
        for (let h = -1; h <= 1; h++) {
            let wantedPart = tile + w * width + h * 1;
            let clipping = (tile % width == 0 && (wantedPart + 1) % width == 0) || ((tile + 1) % width == 0 && wantedPart % width == 0);
            let diagonal = (w * w == 1 && h * h == 1);
            let isValidPart = wantedPart >= 0 && wantedPart < amount && wantedPart != tile;
            if (isValidPart && !clipping && !diagonal) {
                let touchingEmptySpace = (parts[wantedPart].innerText == "");
                if (touchingEmptySpace) {
                    parts[wantedPart].innerText = parts[tile].innerText;
                    parts[tile].innerText = "";
                    moves++;
                    if (timerPaused) startTimer();
                    updateMoves();
                    checkWin();
                    return true;
                }
            }
        }
    }
    return false;
}

function scramble(times) {
    for (let t = 0; t < times; t++) {
        let wantedPart = Math.round(newRandom(0, amount - 1));
        let success = clickEvent(wantedPart);
        if (!success) {
            t--;
        }
    }
    moves = 0;
    timeElem.value = "";
    updateMoves();
    winWindow(false);
    stopTimer();
}

function checkWin() {
    let correctPcs = 0;
    for (let i = 0; i < amount - 1; i++) {
        if (parts[i].innerText == i + 1) {
            correctPcs++;
        }
    }
    if (correctPcs == amount - 1) {
        stopTimer();
        winWindow(true);
    }
}

function newRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function startTimer() {
    moves = 1;
    updateMoves();
    timerStartAt = Date.now();
    timerPaused = false;
}

function stopTimer() {
    timerPaused = true;
}

function updateTimer() {
    timer = Date.now() - timerStartAt;
    timeElem.value = timeToString(timer);
}

function timeToString(ms) {
    var seconds = ms / 1000;
    var hours = parseInt( seconds / 3600 ); 
    seconds = seconds % 3600;
    var minutes = parseInt( seconds / 60 );
    seconds = seconds % 60;
    return hours+":"+minutes+":"+seconds;
}

function winWindow(state) {
    if (state) {
        windowElem.style.display = "flex";
        movesString.innerText = moves;
        timeString.innerText = timeToString(timer);
        sizeString.innerText = width + " x " + height;
        amountString.innerText = amount;
        scrambleString.innerText = scrambleValue;
    } else {
        windowElem.style.display = "none";
    }
}

interval = setInterval(function() { 
    if (!timerPaused) updateTimer()
}, 100);

diffListElem.value = "Easy";
startTimer();
stopTimer();
winWindow(false);
apply();