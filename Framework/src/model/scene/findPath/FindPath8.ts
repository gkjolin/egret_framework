class FindPath8 {
	private static _map: Array<Array<FindNode>> = [];				//地图
	private _w: number;					//地图的宽
	private _h: number;					//地图的高
	private _open: Array<FindNode>;			//开放列表
	private _starPoint: FindNode;
	private _endPoint: FindNode;
	protected _path: Array<Point> = [];		//计算出的路径
	public constructor(map: Array<Array<number>>) {
		FindNode.resetDic();
		var a = this;
		a._w = map[0].length;
		a._h = map.length;
		var value: number;
		var mapValue: number;
		var y: number;
		var x: number;
		for (y = 0; y < a._h; y++) {
			if (FindPath8._map[y] == undefined) {
				FindPath8._map[y] = new Array();
			}
			for (x = 0; x < a._w; x++) {
				mapValue = map[y][x];
				if (mapValue == 0 || mapValue == 2 || mapValue == 3 || mapValue == 5 || mapValue == 6 || mapValue == 7 || mapValue == 8 || mapValue == 9 || mapValue == 10 || mapValue == 11 || mapValue == 61) {
					value = 0;
				}
				else {
					value = 1;
				}
				var tmpNode: FindNode = FindPath8._map[y][x];
				if (tmpNode == null || tmpNode == undefined) {
					tmpNode = new FindNode();
					tmpNode.x = x;
					tmpNode.y = y;
					FindPath8._map[y][x] = tmpNode;
				}
				tmpNode.value = value;
			}
		}
		FindNode.clearDic();
		var g = FindPath8._map;
		trace("99");
	}
	public get path(): Array<Point> {
		return this._path;
	}
	public find(star: Point, end: Point): Array<Point> {
		var a = this;
		a._path = [];
		if (FindPath8._map[star.y] == null) {
			return null;
		}
		a._starPoint = FindPath8._map[star.y][star.x];
		if (FindPath8._map[end.y] == null) {
			return null
		};
		a._endPoint = FindPath8._map[end.y][end.x];
		if (a._endPoint == null || a._endPoint.value == 1) {
			return null;
		}
		if (a._starPoint == null || a._starPoint.value == 1) {
			return null
		};
		if (a._endPoint.x == a._starPoint.x && a._endPoint.y == a._starPoint.y) {
			return null;
		}
		var __getEnd: boolean = false;
		a.initBlock();

		var __thisNode: FindNode = a._starPoint;
		while (!__getEnd) {
			__thisNode.block = true;
			FindNode.changeValue(__thisNode);
			var __checkList: Array<FindNode> = [];

			//左右上下方向
			if (__thisNode.y > 0) {
				__checkList.push(FindPath8._map[(__thisNode.y - 1)][__thisNode.x]);
			}
			if (__thisNode.x > 0) {
				__checkList.push(FindPath8._map[__thisNode.y][(__thisNode.x - 1)]);
			}
			if (__thisNode.x < a._w - 1) {
				__checkList.push(FindPath8._map[__thisNode.y][(__thisNode.x + 1)]);
			}
			if (__thisNode.y < a._h - 1) {
				__checkList.push(FindPath8._map[(__thisNode.y + 1)][__thisNode.x]);
			}
			//对角方向且没有被夹住
			if (__thisNode.y > 0 && __thisNode.x > 0 && !(FindPath8._map[(__thisNode.y)][(__thisNode.x - 1)].value == 1 && FindPath8._map[(__thisNode.y - 1)][(__thisNode.x)].value == 1)) {
				__checkList.push(FindPath8._map[(__thisNode.y - 1)][(__thisNode.x - 1)]);
			}
			if (__thisNode.y < a._h - 1 && __thisNode.x > 0 && !(FindPath8._map[(__thisNode.y)][(__thisNode.x - 1)].value == 1 && FindPath8._map[(__thisNode.y + 1)][(__thisNode.x)].value == 1)) {
				__checkList.push(FindPath8._map[(__thisNode.y + 1)][(__thisNode.x - 1)]);
			}
			if (__thisNode.y > 0 && __thisNode.x < a._w - 1 && !(FindPath8._map[(__thisNode.y - 1)][(__thisNode.x)].value == 1 && FindPath8._map[(__thisNode.y)][(__thisNode.x + 1)].value == 1)) {
				__checkList.push(FindPath8._map[(__thisNode.y - 1)][(__thisNode.x + 1)]);
			}
			if (__thisNode.y < a._h - 1 && __thisNode.x < a._w - 1 && !(FindPath8._map[(__thisNode.y + 1)][(__thisNode.x)].value == 1 && FindPath8._map[(__thisNode.y)][(__thisNode.x + 1)].value == 1)) {
				__checkList.push(FindPath8._map[(__thisNode.y + 1)][(__thisNode.x + 1)]);
			}
			//开始检测当前节点周围
			var __len: number = __checkList.length;
			for (var i: number = 0; i < __len; i++) {
				//周围的每一个节点
				var __neighboringNode: FindNode = __checkList[i];
				//判断是否是目的地
				if (__neighboringNode == a._endPoint) {
					__neighboringNode.nodeparent = __thisNode;
					__getEnd = true;
					break;
				}
				//是否可通行
				if (__neighboringNode.value == 0) {
					a.count(__neighboringNode, __thisNode);//计算该节点
					FindNode.changeValue(__neighboringNode);
				}
			}
			if (!__getEnd) {
				//如果未找到目的地
				if (a._open.length > 0) {
					//开发列表不为空，找出F值最小的做为下一个循环的当前节点
					__thisNode = a._open.splice(a.getMin(), 1)[0];
				} else {
					//开发列表为空，寻路失败
					return [];
				}
			}
		}
		a.drawPath();
		return a._path;
	}


	//寻路前的初始化
	private initBlock(): void {
		FindNode.resetDic();
		this._open = [];
		FindNode.clearDic();
	}
	//计算每个节点
	private count(neighboringNode: FindNode, centerNode: FindNode): void {
		//是否在关闭列表里
		if (!neighboringNode.block) {
			//不在关闭列表里才开始判断
			var __g: number = centerNode.value_g + 10;
			if (this.abs(neighboringNode.x - centerNode.x) == 1 && this.abs(neighboringNode.y - centerNode.y) == 1) {
				__g = centerNode.value_g + 14;
			}
			else {
				__g = centerNode.value_g + 10;
			}
			////////////////////////////////////////////////////////////////////////////////////
			// 方向改变的时候加权，可以让寻出来的路径尽量走直线
			/*if (centerNode.dir == nextDir)
			{
				__g -= 8;	// 该权值越大，则在贴墙走的情况下拐点会越少
			}*/
			if (neighboringNode.open) {
				//如果该节点已经在开放列表里
				if (neighboringNode.value_g >= __g) {
					//如果新G值小于或者等于旧值，则表明该路更优，更新其值
					neighboringNode.value_g = __g;
					this.ghf(neighboringNode);
					neighboringNode.nodeparent = centerNode;
				}
			} else {
				//如果该节点未在开放列表里
				//添加至列表
				this.addToOpen(neighboringNode);
				//计算GHF值
				neighboringNode.value_g = __g;
				this.ghf(neighboringNode);
				neighboringNode.nodeparent = centerNode;
			}
		}
	}

	//画路径
	private drawPath(): void {
		var __pathNode: FindNode = this._endPoint;
		//倒过来得到路径
		while (__pathNode != this._starPoint) {
			this._path.unshift(new Point(__pathNode.x, __pathNode.y));
			__pathNode = __pathNode.nodeparent;
		}
		this._path.unshift(new Point(__pathNode.x, __pathNode.y));
	}
	//加入开放列表
	private addToOpen(newNode: FindNode): void {
		this._open.push(newNode);
		newNode.open = true;
	}

	//计算ghf各值
	private ghf(node: FindNode): void {
		var __dx: number = this.abs(node.x - this._endPoint.x);
		var __dy: number = this.abs(node.y - this._endPoint.y);
		node.value_h = 10 * (__dx + __dy);
		node.value_f = node.value_g + node.value_h;
	}
	//得到开放列表里拥有最小F值的节点在列表里的位置
	private getMin(): number {
		var __len: number = this._open.length;
		var __f: number = 100000;
		var __i: number = 0;
		for (var i: number = 0; i < __len; i++) {
			if (__f > this._open[i].value_f) {
				__f = this._open[i].value_f;
				__i = i;
			}
		}
		return __i;
	}
	private abs(value: number): number {
		return value < 0 ? value * -1 : value;
	}
}