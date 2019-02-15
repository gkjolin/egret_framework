class Tools {
	public constructor() {
	}

	public static GrayFilter: egret.ColorMatrixFilter = new egret.ColorMatrixFilter([1 / 3, 1 / 3, 1 / 3, 0, 0, 1 / 3, 1 / 3, 1 / 3, 0, 0, 1 / 3, 1 / 3, 1 / 3, 0, 0, 0, 0, 0, 1, 0]);
	public static ZHANSHI: number = 1;
	public static FASHI: number = 2;
	public static DAOSHI: number = 3;
	public static MALE: number = 1;
	public static FEMALE: number = 2;


	//字符串转化成物品列表
	public static changeToItemData(str: string): Array<any> {
		var list: Array<any> = new Array();
		// var showArr: RegExpMatchArray = str.match(/\d+/g);
		// var itemdata: ItemData;
		// var k: number = 0;
		// while (k < showArr.length) {
		// 	var item_id: number = Number(showArr[k]);
		// 	if (item_id > 0) {
		// 		itemdata = new ItemData();
		// 		itemdata.info = GoodsListProxy.getInstance().getGoodsInfoByType(item_id);
		// 		itemdata.info.num = Number(showArr[k + 1]);
		// 		itemdata.num = Number(showArr[k + 1]);
		// 		list.push(itemdata)
		// 	}
		// 	k += 2;
		// }
		return list;
	}

	public static changeToNumberStr(num: number): string {
		if (num < 10) {
			return "0" + num;
		}
		return num.toString();
	}

	//获取职业名称
	public static getJobName(job: number): string {
		return ["战皇", "法神", "道祖"][job - 1];
	}

	//获取性别名称
	public static getSexName(sex: number): string {
		return ["男", "女"][sex - 1];
	}

	//获取职业文件夹名称
	public static getJobFolder(job: number): string {
		return ["zhanshi", "fashi", "daoshi"][job - 1];
	}

	//获取性别文件夹名称
	public static getSexFolder(sex: number): string {
		return ["man", "woman"][sex - 1];
	}

	//字符串转化成物品列表，一般用在配置中
	public static changeToNodeDropList(str: string): Array<NodeDrop_list> {
		var list: Array<NodeDrop_list> = new Array();
		var numberList: RegExpMatchArray = str.match(/\d+/g);
		var node: NodeDrop_list;
		for (var i: number = 0; i < numberList.length; i += 2) {
			node = new NodeDrop_list();
			node.asset_id = parseInt(numberList[i])
			node.value = parseInt(numberList[i + 1]);
			list.push(node);
		}
		return list;
	}
	//字符串转化成属性标识，一般用在配置中
	public static changeToNodeProList(str: string): Array<NodePro> {
		var list: Array<NodePro> = new Array();
		var numberList: RegExpMatchArray = str.match(/\d+/g);
		var node: NodePro;
		for (var i: number = 0; i < numberList.length; i += 2) {
			node = new NodePro();
			node.key = parseInt(numberList[i])
			node.value = parseInt(numberList[i + 1]);
			list.push(node);
		}
		return list;
	}

	public static changeToDateList(str: string): Array<Date> {
		var list: Array<Date> = new Array();
		var numberList: RegExpMatchArray = str.match(/\d+/g);
		var node: Date;
		var tNode: Date;
		for (var i: number = 0; i < numberList.length; i += 3) {
			node = new Date(parseInt(numberList[i]), parseInt(numberList[i + 1]) - 1, parseInt(numberList[i + 2]));
			tNode = new Date(node.getTime() - 24 * 60 * 60 * 1000);
			// node.setFullYear(parseInt(numberList[i]));
			// node.setMonth(parseInt(numberList[i + 1]));
			// node.setDate(parseInt(numberList[i + 2]))
			list.push(tNode);
		}
		return list;
	}

	// //字符串转化成物品列表
	// public static changeToItemData(str: string): Array<ItemData> {
	// 	var list: Array<ItemData> = new Array();
	// 	var showArr: RegExpMatchArray = str.match(/\d+/g);
	// 	var itemdata: ItemData;
	// 	var k: number = 0;
	// 	while (k < showArr.length) {
	// 		var item_id: number = Number(showArr[k]);
	// 		if (item_id > 0) {
	// 			itemdata = new ItemData();
	// 			itemdata.info = GoodsListProxy.getInstance().getGoodsInfoByType(item_id);
	// 			itemdata.info.num = Number(showArr[k + 1]);
	// 			itemdata.num = Number(showArr[k + 1]);
	// 			list.push(itemdata)
	// 		}
	// 		k += 2;
	// 	}
	// 	return list;
	// }

	public static convertRoundLv(lv: number, round: number = 0, isShowAll: boolean = true): string {
		var result: string;
		if (round > 0) {
			if (isShowAll) {
				result = StringUtil.substitute("{0}转{1}级", round, lv);
			} else {
				result = StringUtil.substitute("{0}转", round);
			}
		}
		else {
			result = StringUtil.substitute("{0}级", lv);
		}
		return result;
	}



	//把掉落列表的非虚拟物品拆成一个一个的样子
	public static convertDropList(list: Array<NodeDrop_list>): Array<NodeDrop_list> {
		var goodsList: Array<NodeDrop_list> = new Array();
		var node: NodeDrop_list;
		var tmpNode: NodeDrop_list;
		for (var i: number = 0; i < list.length; i++) {
			node = list[i];
			if (node.asset_id > 1000 && node.value > 1) {
				for (var j: number = 0; j < node.value; j++) {
					tmpNode = new NodeDrop_list();
					tmpNode.asset_id = node.asset_id;
					tmpNode.value = 1
					goodsList.push(tmpNode);
				}
			}
			else {
				goodsList.push(node);
			}
		}
		return goodsList;
	}

	//转换数字
	public static convertNumber(num: number): string {
		var str: string = "";
		var result: number = 0;
		var numStr: string;
		var danwei: string;
		if (num >= 100000000) {
			result = num / 100000000;
			danwei = "亿";
		}
		else if (num >= 10000) {
			result = num / 10000;
			danwei = "万";
		}
		else {
			return num.toString();
		}
		numStr = result.toString();
		var index: number = numStr.indexOf(".");
		if (index >= 0) {
			str = numStr.substr(0, index + 2) + danwei;
		}
		else {
			str = numStr + danwei;
		}
		return str;
	}

	//获取掉落列表中会占格子的物品
	public static getGoodsNumInDropList(list: Array<NodeDrop_list>): number {
		var num: number = 0;
		var node: NodeDrop_list;
		for (var i: number = 0; i < list.length; i++) {
			node = list[i];
			if (node.asset_id > 10000) {
				num++;
			}
		}
		return num;
	}

	public static changeObjToString(obj: any): string {
		if (obj == null) {
			return "empty";
		}
		var content: string = "";
		var list = obj.list;
		for (var i: number = 0; i < list.length; i++) {
			content += StringUtil.substitute("key = {0} value = {1}\n", list[i]["name"], obj[list[i]["name"]]);
		}
		return content;
	}

	public static GameRefresh(): void {
		if (ConfigManager.is37()) {
			window["refreshGame"]();
		}
		else {
			window.location.reload();
		}
	}

	//返回-num到num之间的随机数
	public static makeCustomRandom(num: number): number {
		var n: number = Math.ceil(Math.random() * 4);
		var result: number = Math.pow(-1, n) * Math.ceil(Math.random() * num);
		return result;
	}

	public static randRange(min: number, max: number): number {
		if (min > max) {
			max = min ^ max;
			min = max ^ min;
			max = max ^ min;
		}
		var gap: number = max - min + 1;
		return min + (Math.random() * gap >> 0);
	}

	//获取页面参数
	public static getPageParams(key: string): string {
		var par: Object = AllParamObj["params"];
		var result: string;
		if (par) {
			result = par[key];
		}
		if (result == "" || result == null || result == undefined) {
			result = egret.getOption(key);
		}
		return result;
	}

	//获取总长度函数
	public static getRotationLong(Scores: number, Skew: number, Qmin: number, Qmax: number, Location: number, offset: number): number {
		/*
		------------------------------------------------------
		 Scores    int      转盘拆分份数
		------------------------------------------------------
		 Skew      Number   第一个奖区起始点与0点位置的偏移比例
		------------------------------------------------------
		 Qmin      int      最少圈数
		------------------------------------------------------
		 Qmax      int      最多圈数
		------------------------------------------------------
		 Location  int      奖品所在奖区,奖品位置 0-7 可以自己修改
		------------------------------------------------------
		 offset    Number   指针所停位置离奖区边缘的比例
		------------------------------------------------------
		*/
		var _q: number = 360 * (Math.floor(Math.random() * (Qmax - Qmin)) + Qmin);//整圈长度
		var _Skew: number = (360 / Scores) * Skew;//第一个奖区起始点与0点位置的偏移量
		var _location: number = (360 / Scores) * Location;//目标奖区的起始点
		var _offset: number = Math.floor(Math.random() * (360 / Scores) * (1 - 2 * offset)) + (360 / Scores) * offset;
		return _q + _Skew + _location + _offset;
	}

	public static bu0(str: string): string {
		var value: number = parseInt(str);
		var result: string;
		if (value < 10) {
			result = "0" + str;
		}
		else {
			result = str;
		}
		return result;
	}
	static randomName(sex: number = 1): string {
		var pname: string = "";
		var firstName: Array<string> = [];

		if (sex == 1) {
			firstName = LoginLang._surnameList.concat(LoginLang._surnameList_man);
			pname = firstName[Math.floor(firstName.length * Math.random())] + LoginLang._forenameList_man_0[Math.floor(LoginLang._forenameList_man_0.length * Math.random())];
		}
		else {
			firstName = LoginLang._surnameList.concat(LoginLang._surnameList_wonman);
			pname = firstName[Math.floor(firstName.length * Math.random())] + LoginLang._forenameList_woman_0[Math.floor(LoginLang._forenameList_woman_0.length * Math.random())];
		}

		if (FilterText.getInstance().isHaveFilterTxt(pname)) {
			return this.randomName();
		} else {
			return pname;
		}
	}
}