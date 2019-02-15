class BossRoundVo {
	public template_id: number;
	public boss_id: number;
	public boss_name: string;
	public min_round: number;
	public max_round: number;
	public boss_scene_id: number;
	public boss_pos: Point;
	public itemList: Array<ItemData>;
	public kill_award: Array<ItemData>;
	public luck_award: Array<ItemData>;
	public randomPath: Array<Point>;

	public constructor() {
	}

	public setRandomPath(str: string): void {
		this.randomPath = new Array();
		var numberList: RegExpMatchArray = str.match(/\d+/g);
		var point: Point;
		var px: number;
		var py: number;
		for (var i: number = 0; i < numberList.length; i += 2) {
			px = parseInt(numberList[i]);
			py = parseInt(numberList[i + 1]);
			point = new Point();
			point.x = px;
			point.y = py;
			this.randomPath.push(point);
		}
	}

	public setBossPos(pos: string): void {
		var numberList: RegExpMatchArray = pos.match(/\d+/g);
		this.boss_pos = new Point();
		this.boss_pos.x = parseInt(numberList[0]);
		this.boss_pos.y = parseInt(numberList[1]);
	}
}