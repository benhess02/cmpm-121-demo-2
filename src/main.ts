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

const lines : { x: number, y: number }[][] = [];
let currentLine : { x: number, y: number }[] | null = null;

const cursor = { active: false, x: 0, y: 0 };

canvas.addEventListener("drawing-changed", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < lines.length; i++) {
        ctx.beginPath();
        ctx.moveTo(lines[i][0].x, lines[i][0].y);
        for(let j = 1; j < lines[i].length; j++) {
            ctx.lineTo(lines[i][j].x, lines[i][j].y);
        }
        ctx.stroke();
    }
});

canvas.addEventListener("mousedown", (e) => {
    currentLine = [{ x: e.offsetX, y: e.offsetY }];
    lines.push(currentLine);
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
    while(lines.length > 0) {
        lines.pop();
    }
    canvas.dispatchEvent(new Event("drawing-changed"));
});