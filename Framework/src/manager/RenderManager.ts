class RenderManager {
	private static _enterFrame: egret.Sprite;
	private static _list: Object = new Object(); //方便查看当前有哪些需要渲染的对象
	public static _renderList: Array<Object> = new Array();
	private static _len: number = 0;
	public static _time: number = 0;
	public static frameWeight: number = 1;
	public constructor() {}

	public static start(): void {
		if (RenderManager._enterFrame == null) {
			RenderManager._enterFrame = new egret.Sprite();
		}
		if (!RenderManager._enterFrame.hasEventListener(egret.Event.ENTER_FRAME)) {
			RenderManager._enterFrame.addEventListener(egret.Event.ENTER_FRAME, RenderManager.onRender, RenderManager);
		}
	}

	private static onRender(event: egret.Event): void {
		RenderManager._time = getTimer();
		var list: Array<Object> = RenderManager._renderList;
		var t1: number = 0;
		var gap: number = 0;
		var obj: Object;
		for (var i: number = 0; i < list.length; i++) {
			// t1 = getTimer();
			obj = RenderManager._renderList[i];
			var thisObj = obj['thisObj'];
			obj['func'].apply(thisObj);
			// gap = getTimer() - t1;
			// if (gap > 2) {
			// 	trace(StringUtil.substitute("---------- gap = {0} funName = {1}", gap, RenderManager.getNameByFun(fun)));
			// }
		}
		event = null;
	}

	// public static getNameByFun(f: any): string {
	// 	var n: any;
	// 	for (n in RenderManager._list) {
	// 		if (RenderManager._list[n] == f) {
	// 			return n;
	// 		}
	// 	}
	// 	return "not found";
	// }

	public static add(fun: any, thisObj: any): void {
		// if (RenderManager._list[thisObj] == null || RenderManager._list[thisObj] == undefined) {
		// 	RenderManager._list[thisObj] = fun;
		// 	RenderManager._renderList.push(fun);
		// 	RenderManager._len++;
		// }
		if (RenderManager.has(fun, thisObj)) {
			return;
		}
		var obj: Object = new Object();
		obj['func'] = fun;
		obj['thisObj'] = thisObj;
		RenderManager._renderList.push(obj);
		RenderManager._len++;
		fun = null;
		thisObj = null;
	}

	public static remove(func: any, thisObj: any): void {
		var list: Array<Object> = RenderManager._renderList;
		for (var i: number = 0; i < list.length; i++) {
			var obj = list[i];
			if (func == obj['func'] && thisObj == obj['thisObj']) {
				RenderManager._len--;
				list.splice(i, 1);
				break;
			}
		}
		list = null;
	}

	public static has(func: any, thisObj): boolean {
		var list: Array<Object> = RenderManager._renderList;
		for (var i: number = 0; i < list.length; i++) {
			var obj = list[i];
			if (func == obj['func'] && thisObj == obj['thisObj']) {
				return true;
			}
		}
		return false;
	}

	// public static remove(objName: string): void {
	// 	if (RenderManager._list[objName] != null && RenderManager._list[objName] != undefined) {
	// 		var func: any = RenderManager._list[objName];
	// 		var index: number = RenderManager._renderList.indexOf(func);
	// 		if (index > 0) {
	// 			RenderManager._renderList.splice(index, 1);
	// 		}
	// 		delete RenderManager._list[objName];
	// 		func = null;
	// 		RenderManager._len--;
	// 	}
	// 	objName = null;
	// }

	public static getCurrentTime(): number {
		return this._time;
	}
}
