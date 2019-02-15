class MapUtil {
	private static dirXY: Array<Object> = [{ x: 0, y: 1, dpx: 0, dpy: 0 }, { x: -1, y: 1, dpx: 0, dpy: 0 }, { x: -1, y: 0, dpx: 0, dpy: 0 }, { x: -1, y: -1, dpx: 0, dpy: 0 }, { x: 0, y: -1, dpx: 0, dpy: 0 }, { x: 1, y: -1, dpx: 0, dpy: 0 }, { x: 1, y: 0, dpx: 0, dpy: 0 }, { x: 1, y: 1, dpx: 0, dpy: 0 }];
	public constructor() {
	}

	public static judgeDir(px: number, py: number, tx: number, ty: number): number {
		var dir: number;
		var angle: number = -Math.atan2(ty - py, tx - px) * (180 / Math.PI);
		if (angle > -155 && angle <= -115) {
			dir = 1;
		}
		else if (angle > -115 && angle <= -65) {
			dir = 2;
		}
		else if (angle > -65 && angle <= -25) {
			dir = 3;
		}
		else if (angle > -25 && angle <= 25) {
			dir = 6;
		}
		else if (angle > 25 && angle <= 65) {
			dir = 9;
		}
		else if (angle > 65 && angle <= 115) {
			dir = 8;
		}
		else if (angle > 115 && angle <= 155) {
			dir = 7;
		}
		else {
			dir = 4;
		}
		return dir;
	}
	/**
	 * 通过方向获取角度
	 * @return 
	 * 
	 */
	public static getAngle(dir: number): number {
		var angle: number;
		if (dir == 1) {
			angle = 225 * Math.PI / 180;
		}
		else if (dir == 2) {
			angle = 270 * Math.PI / 180;
		}
		else if (dir == 3) {
			angle = 315 * Math.PI / 180;
		}
		else if (dir == 6) {
			angle = 0
		}
		else if (dir == 9) {
			angle = 45 * Math.PI / 180;
		}
		else if (dir == 8) {
			angle = 90 * Math.PI / 180;
		}
		else if (dir == 7) {
			angle = 135 * Math.PI / 180;
		}
		else if (dir == 4) {
			angle = 180 * Math.PI / 180;
		}
		return angle;
	}
	public static getDirXY(px: number, py: number, tx: number, ty: number): Object {
		var dir: number = this.judgeDir(px, py, tx, ty);
		if (dir == 2) {
			return this.dirXY[0];
		}
		if (dir == 1) {
			return this.dirXY[1];
		}
		if (dir == 4) {
			return this.dirXY[2];
		}
		if (dir == 7) {
			return this.dirXY[3];
		}
		if (dir == 8) {
			return this.dirXY[4];
		}
		if (dir == 9) {
			return this.dirXY[5];
		}
		if (dir == 6) {
			return this.dirXY[6];
		}
		if (dir == 3) {
			return this.dirXY[7];
		}
		return null;
	}

	public static getDirXY2(px: number, py: number, tx: number, ty: number): number {
		var dir: number = this.judgeDir(px, py, tx, ty);
		if (dir == 2) {
			return 1;
		}
		if (dir == 1) {
			return 2;
		}
		if (dir == 4) {
			return 3;
		}
		if (dir == 7) {
			return 4;
		}
		if (dir == 8) {
			return 5;
		}
		if (dir == 9) {
			return 6;
		}
		if (dir == 6) {
			return 7;
		}
		if (dir == 3) {
			return 8;
		}
		return 1;
	}

	public static getDirObject(px: number, py: number, tx: number, ty: number): Object {
		var dir: number = this.judgeDir(px, py, tx, ty);
		var dirObject: any = new Object();
		dirObject.dir = dir;
		switch (dir) {
			case 9:
				dirObject.frame = 7;
				dirObject.scale = -1;
				break;
			case 6:
				dirObject.frame = 4;
				dirObject.scale = -1;
				break;
			case 3:
				dirObject.frame = 1;
				dirObject.scale = -1;
				break;
			default:
				dirObject.frame = dir;
				dirObject.scale = 1;
				break;
		}
		return dirObject;
	}
}