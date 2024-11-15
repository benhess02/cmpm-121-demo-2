export interface Drawable {
	draw(ctx: CanvasRenderingContext2D): void;
	drag(x: number, y: number): void;
}

export class Line implements Drawable {
	points: { x: number; y: number }[];
	thickness: number;

	constructor(x: number, y: number, thickness: number) {
		this.points = [{ x: x, y: y }];
		this.thickness = thickness;
	}

	draw(ctx: CanvasRenderingContext2D): void {
		ctx.lineWidth = this.thickness;
		ctx.beginPath();
		ctx.moveTo(this.points[0].x, this.points[0].y);
		for (let j = 1; j < this.points.length; j++) {
			ctx.lineTo(this.points[j].x, this.points[j].y);
		}
		ctx.stroke();
	}

	drag(x: number, y: number): void {
		this.points.push({ x: x, y: y });
	}
}
