class CWSceneConfigVo {
	public template_id: number;
	public scene_id: number;
	public revive_time: number;
	public con_gold: number;
	public go_point: number;
	public randomPath: Array<Point>;
	public monPoint: Array<Point>;
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

	public setMonPoint(str: string): void {
		this.monPoint = new Array();
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
			this.monPoint.push(point);
		}
	}
}