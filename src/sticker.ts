import { Tool } from "./tool";
import { Drawable } from "./drawable";

const STICKER_OFFSET_X = 35;
const STICKER_OFFSET_Y = 16;

export class Sticker implements Drawable {
	x: number;
	y: number;
	base_rotation: number;
	rotation: number;
	symbol: string;

	constructor(x: number, y: number, rotation: number, symbol: string) {
		this.x = x;
		this.y = y;
		this.base_rotation = rotation;
		this.rotation = rotation;
		this.symbol = symbol;
	}

	draw(ctx: CanvasRenderingContext2D): void {
		ctx.font = "50px serif";
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		ctx.fillText(this.symbol, -STICKER_OFFSET_X, STICKER_OFFSET_Y);
		// Can't use resetTransform here since we might be on the scaled export canvas
		ctx.rotate(-this.rotation);
		ctx.translate(-this.x, -this.y);
	}

	drag(x: number, y: number): void {
		this.rotation = this.base_rotation + (x - this.x) / 20;
	}
}

export class StickerTool implements Tool {
	symbol: string;
	x: number = 0;
	y: number = 0;
	rotation: number = 0;

	constructor(symbol: string) {
		this.symbol = symbol;
	}

	move(x: number, y: number): void {
		this.x = x;
		this.y = y;
	}

	drawPreview(ctx: CanvasRenderingContext2D): void {
		ctx.font = "50px serif";
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		ctx.fillText(this.symbol, -STICKER_OFFSET_X, STICKER_OFFSET_Y);
		// Can't use resetTransform here since we might be on the scaled export canvas
		ctx.rotate(-this.rotation);
		ctx.translate(-this.x, -this.y);
		ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
	}

	select(): void {
		this.rotation = Math.random() * Math.PI * 2;
	}

	createDrawable(): Drawable {
		return new Sticker(this.x, this.y, this.rotation, this.symbol);
	}
}
