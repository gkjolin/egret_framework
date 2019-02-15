class TaskVo {
	public template_id: number;
	public name: string;
	public next_id: number;
	public type: number;
	public need: number;
	public add_coin: number;
	public add_exp:number;
	public add_item: string;
	public event: string;
	public xs: number;
	public itemID: number;
	public itemNum: number;
	public itemList: Array<ItemData>;
	public moduleType: string;
	public moduleIndex: number;
	public start_talk: number;
	public end_talk: number;
	public end_npc: number;
	public desc: string;
	public is_rookie: number;
	public monsterList: Array<TaskNoviceMonsterVO>;
	public monsterPos: Array<Point>;
	public constructor() {
	}
	public setMonsterPos(str: string): void {
		if (str == "" || str == "0") return;
		var a = this;
		a.monsterPos = [];

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
			a.monsterPos.push(point);
			n += 2;
		}

	}
	public setMonster(str: string): void {
		if (str == "" || str == "0") return;
		var a = this;
		a.monsterList = [];
		var numberList: RegExpMatchArray = str.match(/\d+/g);
		var vo: TaskNoviceMonsterVO;
		var px: number;
		var py: number;
		var n: number = 0;
		var len: number = numberList.length / 2;
		for (var i: number = 0; i < len; i++) {
			vo = new TaskNoviceMonsterVO();
			vo.id = parseInt(numberList[n]);
			vo.count = parseInt(numberList[n + 1]);
			a.monsterList.push(vo);
			n += 2;
		}
	}
}