import "./style.css";

interface Drawable {
    draw(ctx: CanvasRenderingContext2D): void;
    drag(x: number, y: number): void;
}

interface Tool {
    move(x: number, y: number): void;
    drawPreview(ctx: CanvasRenderingContext2D): void;
    createDrawable(): Drawable;
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

class MarkerTool implements Tool {
  thickness: number;
  x: number = 0;
  y: number = 0;

  constructor(thickness: number) {
    this.thickness = thickness;
  }

  move(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  drawPreview(ctx: CanvasRenderingContext2D): void {
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.thickness / 2, 0, Math.PI * 2);
    ctx.stroke();
  }

  createDrawable(): Drawable {
    return new Line(this.x, this.y, this.thickness);
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
let currentTool: Tool = new MarkerTool(3);

canvas.addEventListener("drawing-changed", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < displayList.length; i++) {
      displayList[i].draw(ctx);
    }
});

canvas.addEventListener("tool-moved", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < displayList.length; i++) {
      displayList[i].draw(ctx);
    }
    currentTool.drawPreview(ctx)
});

canvas.addEventListener("mousedown", (e) => {
    currentDrawable = currentTool.createDrawable();
    displayList.push(currentDrawable);
    canvas.dispatchEvent(new Event("drawing-changed"));
});

canvas.addEventListener("mousemove", (e) => {
    if (currentDrawable != null) {
        currentDrawable.drag(e.offsetX, e.offsetY);
        canvas.dispatchEvent(new Event("drawing-changed"));
    } else {
        currentTool.move(e.offsetX, e.offsetY);
        canvas.dispatchEvent(new Event("tool-moved"));
    }
});

canvas.addEventListener("mouseup", (e) => {
    currentDrawable = null;
    currentTool.move(e.offsetX, e.offsetY);
    canvas.dispatchEvent(new Event("tool-moved"));
});

canvas.addEventListener("mouseleave", (e) => {
    currentDrawable = null;
    currentTool.move(e.offsetX, e.offsetY);
    canvas.dispatchEvent(new Event("tool-moved"));
});

thinMarkerBtn.addEventListener("click", (e) => {
    currentTool = new MarkerTool(3);
    thickMarkerBtn.classList.remove("selected");
    thinMarkerBtn.classList.add("selected");
})

thickMarkerBtn.addEventListener("click", (e) => {
    currentTool = new MarkerTool(10);
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