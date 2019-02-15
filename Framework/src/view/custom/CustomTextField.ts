class CustomTextField extends egret.TextField {
	private static _classDic: Object = new Object();
	private _type: string;
	public constructor(type: string = "CustomTextField") {
		super();
		this._type = type;
		this.size = 18;
		this.textColor = 0xE7D0B7;
		this.touchEnabled = false;
	}

	public addMiaoBian(): void {
		this.stroke = 1;
		this.strokeColor = 0x000000;
	}

	public dispose(): void {
		CustomTextField._classDic[this._type] = CustomTextField._classDic[this._type]--;
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
}