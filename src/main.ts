import "./style.css";
import { Drawable } from "./drawable";
import { Tool, MarkerTool } from "./tool";
import { StickerTool } from "./sticker";

const APP_NAME = "Tiny Paint";
const app = document.querySelector<HTMLDivElement>("#app")!;

document.title = APP_NAME;

const titleText = document.createElement("h1");
titleText.innerHTML = APP_NAME;
app.append(titleText);

const toolbox = document.createElement("div");
app.append(toolbox);
const toolButtons: HTMLButtonElement[] = [];
let currentTool: Tool = new MarkerTool(4);
function addToolButton(name: string, tool: Tool) {
	const toolBtn = document.createElement("button");
	toolBtn.innerHTML = name;
	toolBtn.addEventListener("click", (e) => {
		currentTool = tool;
		tool.select();
		toolButtons.forEach((btn) => btn.classList.remove("selected"));
		toolBtn.classList.add("selected");
		canvas.dispatchEvent(new Event("tool-moved"));
	});
	toolbox.append(toolBtn);
	toolButtons.push(toolBtn);
}

addToolButton("Thin Marker", currentTool);
addToolButton("Thick Marker", new MarkerTool(15));
addToolButton("😂", new StickerTool("😂"));
addToolButton("😡", new StickerTool("😡"));
addToolButton("🎆", new StickerTool("🎆"));

toolButtons[0].classList.add("selected");

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
app.append(canvas);
const ctx = canvas.getContext("2d")!;

const clearBtn = document.createElement("button");
clearBtn.innerHTML = "Clear";
app.append(clearBtn);
clearBtn.addEventListener("click", () => {
	while (displayList.length > 0) {
		displayList.pop();
	}
	canvas.dispatchEvent(new Event("drawing-changed"));
});

const undoBtn = document.createElement("button");
undoBtn.innerHTML = "Undo";
app.append(undoBtn);
undoBtn.addEventListener("click", () => {
	if (displayList.length > 0) {
		redoStack.push(displayList.pop()!);
		currentDrawable = null;
		canvas.dispatchEvent(new Event("drawing-changed"));
	}
});

const redoBtn = document.createElement("button");
redoBtn.innerHTML = "Redo";
app.append(redoBtn);
redoBtn.addEventListener("click", () => {
	if (redoStack.length > 0) {
		displayList.push(redoStack.pop()!);
		currentDrawable = null;
		canvas.dispatchEvent(new Event("drawing-changed"));
	}
});

const customStickerBtn = document.createElement("button");
customStickerBtn.innerHTML = "Custom Sticker";
app.append(customStickerBtn);
customStickerBtn.addEventListener("click", () => {
	const customEmojis: readonly string[] = ["👹", "👽", "🤓", "🤯", "🥶"];
	const text = prompt("Custom sticker text", customEmojis[Math.floor(Math.random() * customEmojis.length)]);
	if (text != null) {
		addToolButton(text, new StickerTool(text));
	}
});

const exportBtn = document.createElement("button");
exportBtn.innerHTML = "Export";
app.append(exportBtn);
exportBtn.addEventListener("click", () => {
	const large_canvas = document.createElement("canvas");
	large_canvas.width = 1024;
	large_canvas.height = 1024;
	const large_ctx = large_canvas.getContext("2d")!;
	large_ctx.scale(large_canvas.width / canvas.width, large_canvas.height / canvas.height);
	for (let i = 0; i < displayList.length; i++) {
		displayList[i].draw(large_ctx);
	}
	const anchor = document.createElement("a");
	anchor.href = large_canvas.toDataURL("image/png");
	anchor.download = "sketchpad.png";
	anchor.click();
});

const displayList: Drawable[] = [];
const redoStack: Drawable[] = [];
let currentDrawable: Drawable | null = null;

canvas.addEventListener("drawing-changed", () => {
	ctx.resetTransform();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < displayList.length; i++) {
		displayList[i].draw(ctx);
	}
});

canvas.addEventListener("tool-moved", () => {
	ctx.resetTransform();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < displayList.length; i++) {
		displayList[i].draw(ctx);
	}
	currentTool.drawPreview(ctx);
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
