class FilterText extends egret.EventDispatcher {
	private _wordMap: Object;
	private _splitReg: RegExp = /(\n|\r)+/mg;
	private static _instance: FilterText;
	public static getInstance(): FilterText {
		if (this._instance == null) {
			this._instance = new FilterText();
		}
		return this._instance;
	}
	public constructor() {
		super();
		this._wordMap = new Object();
		this.createWord();
		this.createWordOther();
	}
	private createWord(): void {
		var jsonObj: Object = DataManager.getInstance().getObj("data_word");
		let list: Array<Object> = jsonObj["data_word"];
		let itemObj: Object;
		for (let i: number = 0; i < list.length; i++) {
			itemObj = list[i];
			this.addWord(itemObj["keyword"]);
		}
	}
	private createWordOther(): void {
		var jsonObj: Object = DataManager.getInstance().getObj("data_word_other");
		let list: Array<Object> = jsonObj["data_word_other"];
		let itemObj: Object;
		for (let i: number = 0; i < list.length; i++) {
			itemObj = list[i];
			this.addWord(itemObj["keyword"]);
		}
	}
	public addWord(value: string): void {
		value = value.replace("\n", "");
		value = value.replace("(", "\\(");
		value = value.replace(")", "\\)");
		value = value.replace("*", "\\*");
		value = value.replace("^", "\\^");
		value = value.replace("$", "\\$");
		value = value.replace("@", "\\@");
		value = value.replace("!", "\\!");
		value = value.replace("&", "\\&");
		value = value.replace("#", "\\#");
		if (value != null && value.length > 0) {
			var dic: string;
			var s: string = value.charAt(0);
			dic = this._wordMap[s] as string;
			if (dic) {
				this._wordMap[s] += "|" + value;
			}
			else {
				this._wordMap[s] = value;
			}
		}
	}
	/**
				   * 获取过滤后的字符串 
				   * @param str
				   * @return 
				   * 
				   */
	public getFilterStr(str: string): string {
		if (!isFilterTxt) return str;
		if (null == str || str == "") return "";
		//根据正则替换字符串
		var len: number = str.length;
		var s: string;
		var ws: any;
		var wsDic: Object = new Object();
		for (var i: number = 0; i < len; i++) {
			s = str.charAt(i);
			if (s != "*") {
				if (wsDic[s] == null) {
					ws = this._wordMap[s];
					try {
						ws = this._wordMap[s] = new RegExp("(" + ws + ")", "img");
					} catch (error) {
						return str;
					}
					str = str.replace(ws, this.regHandler);
					wsDic[s] = ws;
				}
			}
		}
		return str;
	}
	/**
* 处理过滤的函数 
* @return 
* 
*/
	private regHandler(): string {
		//获取正则获取的字符串
		//trace( arguments[1] );
		var s: string = arguments[1].toString();
		//替换成*
		return s.replace(/.{1}/g, "*");
	}
	/**
	 * 是否含有过滤关键字 
	 * @param str
	 * @return 
	 * 
	 */
	public isHaveFilterTxt(str: string): boolean {
		var str2: string = this.getFilterStr(str);
		return !(str2 == str);
	}

}