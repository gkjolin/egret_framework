class SceneWaveVo {
	public waveID: number = 0;
	public nextID: number = 0;
	public masterLev: number = 0;
	public masterWave: number = 0;//关
	public monsterID: number = 0;
	public monsterNum: number = 0;
	public passNum: number = 0;
	public bossID: number = 0;
	public sceneID: number = 0;
	private _monPosList: Array<Point>;
	public bossSceneID: number = 0;
	public exp: number = 0;
	public copper: number = 0;
	public playerList: Array<Point>;
	public constructor() {
	}

	public setMonPosList(str: string): void {
		if (this._monPosList == null) {
			this._monPosList = new Array();
		}
		var numberList: RegExpMatchArray = str.match(/\d+/g);
		var point: Point;
		var px: number;
		var py: number;
		var n: number = 0;
		var len: number = numberList.length / 2;
		for (var i: number = 0; i < len; i++) {
			px = parseInt(numberList[n]);
			py = parseInt(numberList[n + 1]);
			point = new Point(px, py);
			this._monPosList.push(point);
			n += 2;
		}
	}

	//设置挂机玩家的坐标
	public setPlayerPosList(str: string): void {
		if (this.playerList == null) {
			this.playerList = new Array();
		}
		var list: Array<Point> = this.playerList;
		var numberList: RegExpMatchArray = str.match(/\d+/g);
		var point: Point;
		var px: number;
		var py: number;
		var n: number = 0;
		var len: number = numberList.length / 2;
		for (var i: number = 0; i < len; i++) {
			px = parseInt(numberList[n]);
			py = parseInt(numberList[n + 1]);
			point = new Point(px, py);
			list.push(point);
			n += 2;
		}
	}

	public get monPosList(): Array<Point> {
		return this._monPosList;
	}
}