import "./style.css";

const APP_NAME = "Hello";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;

const titleText = document.createElement("h1");
titleText.innerHTML = APP_NAME;
app.append(titleText);

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
app.append(canvas);
const ctx = canvas.getContext("2d")!;

const clearBtn = document.createElement("button");
clearBtn.innerHTML = "Clear";
app.append(clearBtn);

const undoBtn = document.createElement("button");
undoBtn.innerHTML = "Undo";
app.append(undoBtn);

const redoBtn = document.createElement("button");
redoBtn.innerHTML = "Redo";
app.append(redoBtn);

const displayList : { x: number, y: number }[][] = [];
const redoStack : { x: number, y: number }[][] = [];
let currentLine : { x: number, y: number }[] | null = null;

canvas.addEventListener("drawing-changed", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < displayList.length; i++) {
        ctx.beginPath();
        ctx.moveTo(displayList[i][0].x, displayList[i][0].y);
        for(let j = 1; j < displayList[i].length; j++) {
            ctx.lineTo(displayList[i][j].x, displayList[i][j].y);
        }
        ctx.stroke();
    }
});

canvas.addEventListener("mousedown", (e) => {
    currentLine = [{ x: e.offsetX, y: e.offsetY }];
    displayList.push(currentLine);
    canvas.dispatchEvent(new Event("drawing-changed"));
});

canvas.addEventListener("mousemove", (e) => {
    if (currentLine != null) {
        currentLine.push({ x: e.offsetX, y: e.offsetY });
        canvas.dispatchEvent(new Event("drawing-changed"));
    }
});

canvas.addEventListener("mouseup", (e) => {
    currentLine = null;
});

canvas.addEventListener("mouseleave", (e) => {
    currentLine = null;
});

clearBtn.addEventListener("click", () => {
    while(displayList.length > 0) {
        displayList.pop();
    }
    canvas.dispatchEvent(new Event("drawing-changed"));
});

undoBtn.addEventListener("click", () => {
    if(displayList.length > 0) {
        redoStack.push(displayList.pop()!);
        currentLine = null;
        canvas.dispatchEvent(new Event("drawing-changed"));
    }
});

redoBtn.addEventListener("click", () => {
    if(redoStack.length > 0) {
        displayList.push(redoStack.pop()!);
        currentLine = null;
        canvas.dispatchEvent(new Event("drawing-changed"));
    }
});