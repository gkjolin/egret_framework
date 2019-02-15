class TileUtil {
	public static tileWidth: number = 256;
	public static tileHeight: number = 256;
	public static GRID_WIDTH: number = 60;
	public static GRID_HEIGHT: number = 30;
	public static scale: number = 1;

	public static ALPHA: number = 2;

	public static STEP: number = 30;
	public constructor() {
	}

	public static changeXToPixs(num: number): number {
		return Math.floor(num * TileUtil.GRID_WIDTH);
		// return Math.floor(num * TileUtil.GRID_WIDTH + TileUtil.GRID_WIDTH / 2);
	}

	public static changeYToPixs(num: number): number {
		return Math.floor(num * TileUtil.GRID_HEIGHT);
		// return Math.floor(num * TileUtil.GRID_HEIGHT + TileUtil.GRID_HEIGHT / 2);
	}

	public static changeXToTile(num: number): number {
		return Math.floor(num / TileUtil.GRID_WIDTH);
	}

	public static changeYToTile(num: number): number {
		return Math.floor(num / TileUtil.GRID_HEIGHT);
	}
}