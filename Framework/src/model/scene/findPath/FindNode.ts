class FindNode {
	public constructor() {
	}
	private static _dic: Object = new Object();

	public x: number = 0;
	public y: number = 0;
	public value: number = 0;
	public block: boolean = false;
	public open: boolean = false;
	public value_g: number = 0;
	public value_h: number = 0;
	public value_f: number = 0;
	public nodeparent: FindNode = null;
	public dir: number = 0;
	public init(x: number, y: number, value: number): void {
		var a = this;
		a.x = x;
		a.y = y;
		a.value = value;
		a.block = false;
		a.open = false;
		a.value_g = 0;
		a.value_h = 0;
		a.value_f = 0;
		a.nodeparent = null;
	}

	public static changeValue(obj: FindNode): void {
		var index: string = obj.x + "_" + obj.y;
		if (FindNode._dic[index] == undefined) {
			FindNode._dic[index] = obj;
		}

	}
	public static clearDic(): void {
		FindNode._dic = new Object();
	}
	public static resetDic(): void {
		for (var n in FindNode._dic) {
			var obj: FindNode = FindNode._dic[n];
			if (obj) {
				obj.block = false;
				obj.open = false;
				obj.value_g = 0;
				obj.value_h = 0;
				obj.value_f = 0;
				obj.nodeparent = null;
			}
		}
	}
}