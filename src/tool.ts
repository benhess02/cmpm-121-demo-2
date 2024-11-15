import { Drawable, Line } from "./drawable";

export interface Tool {
	move(x: number, y: number): void;
	drawPreview(ctx: CanvasRenderingContext2D): void;
	select(): void;
	createDrawable(): Drawable;
}
export class MarkerTool implements Tool {
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

	select(): void {}

	createDrawable(): Drawable {
		return new Line(this.x, this.y, this.thickness);
	}
}
