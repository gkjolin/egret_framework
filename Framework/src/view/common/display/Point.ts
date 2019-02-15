class Point extends egret.Point {
	public constructor(x: number = 0, y: number = 0) {
		super(x, y);
	}

	public static equal(p1: Point, p2: Point): boolean {
		if (p1 == null || p2 == null) {
			return false;
		}
		return p1.x == p2.x && p1.y == p2.y;
	}
}