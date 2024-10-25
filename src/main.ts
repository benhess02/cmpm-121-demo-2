import "./style.css";

interface Drawable {
    draw(ctx: CanvasRenderingContext2D): void;
    drag(x: number, y: number): void;
}

class Line implements Drawable {
  points: { x: number, y: number }[];
  thickness: number;

  constructor(x: number, y: number, thickness: number) {
    this.points = [{x: x, y: y}];
    this.thickness = thickness;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.lineWidth = this.thickness;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for(let j = 1; j < this.points.length; j++) {
      ctx.lineTo(this.points[j].x, this.points[j].y);
    }
    ctx.stroke();
  }

  drag(x: number, y: number): void {
    this.points.push({ x: x, y: y });
  }
}

const APP_NAME = "Hello";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;

const titleText = document.createElement("h1");
titleText.innerHTML = APP_NAME;
app.append(titleText);

const thinMarkerBtn = document.createElement("button");
thinMarkerBtn.innerHTML = "Thin Marker";
thinMarkerBtn.classList.add("selected");
app.append(thinMarkerBtn);

const thickMarkerBtn = document.createElement("button");
thickMarkerBtn.innerHTML = "Thick Marker";
app.append(thickMarkerBtn);

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

const displayList : Drawable[] = [];
const redoStack : Drawable[] = [];
let currentDrawable : Drawable | null = null;

let markerThickness : number = 3;

canvas.addEventListener("drawing-changed", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < displayList.length; i++) {
      displayList[i].draw(ctx);
    }
});

canvas.addEventListener("mousedown", (e) => {
    currentDrawable = new Line(e.offsetX, e.offsetY, markerThickness);
    displayList.push(currentDrawable);
    canvas.dispatchEvent(new Event("drawing-changed"));
});

canvas.addEventListener("mousemove", (e) => {
    if (currentDrawable != null) {
        currentDrawable.drag(e.offsetX, e.offsetY);
        canvas.dispatchEvent(new Event("drawing-changed"));
    }
});

canvas.addEventListener("mouseup", (e) => {
    currentDrawable = null;
});

canvas.addEventListener("mouseleave", (e) => {
    currentDrawable = null;
});

thinMarkerBtn.addEventListener("click", (e) => {
    markerThickness = 3;
    thickMarkerBtn.classList.remove("selected");
    thinMarkerBtn.classList.add("selected");
})

thickMarkerBtn.addEventListener("click", (e) => {
    markerThickness = 10;
    thinMarkerBtn.classList.remove("selected");
    thickMarkerBtn.classList.add("selected");
})

clearBtn.addEventListener("click", () => {
    while(displayList.length > 0) {
        displayList.pop();
    }
    canvas.dispatchEvent(new Event("drawing-changed"));
});

undoBtn.addEventListener("click", () => {
    if(displayList.length > 0) {
        redoStack.push(displayList.pop()!);
        currentDrawable = null;
        canvas.dispatchEvent(new Event("drawing-changed"));
    }
});

redoBtn.addEventListener("click", () => {
    if(redoStack.length > 0) {
        displayList.push(redoStack.pop()!);
        currentDrawable = null;
        canvas.dispatchEvent(new Event("drawing-changed"));
    }
});