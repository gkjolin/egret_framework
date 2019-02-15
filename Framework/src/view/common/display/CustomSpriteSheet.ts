class CustomSpriteSheet extends egret.SpriteSheet {
	private static _classDic: Object = new Object();
	private _type: string;
	public constructor(texture: egret.Texture, type: string = "CustomSpriteSheet") {
		super(texture);
		this._type = type;
		if (CustomSpriteSheet._classDic[type] == undefined || CustomSpriteSheet._classDic[type] == null) {
			CustomSpriteSheet._classDic[type] = 1;
		}
		else {
			CustomSpriteSheet._classDic[type] = CustomSpriteSheet._classDic[type] + 1;
		}
	}
}