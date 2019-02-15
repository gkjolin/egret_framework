interface IElement {
	getId(): any;
	getType(): string;
	isHit(point: Point): boolean;
	setSelect(b: boolean): void
}