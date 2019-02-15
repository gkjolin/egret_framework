class CommonSprite extends egret.Sprite {
	public static classDic: Object = new Object();
	protected _type: string;
	public constructor(type: string = "CommonSprite") {
		super();
		this._type = type;
		if (CommonSprite.classDic[type] == undefined || CommonSprite.classDic[type] == null) {
			CommonSprite.classDic[type] = 1;
		}
		else {
			CommonSprite.classDic[type] = CommonSprite.classDic[type] + 1;
		}
	}

	public dispose(): void {
		var num: number = CommonSprite.classDic[this._type];
		CommonSprite.classDic[this._type] = (num - 1);
	}
}