class TextureLoader extends egret.EventDispatcher {
	private _url: string;
	private _texture: egret.Texture;

	public static COMPLETE: string = "texture_complete";
	public constructor() {
		super();
	}


	public load(url: string): void {
		this._url = url;
		RES.getResByUrl(url + ".png", (texture: egret.Texture) => { this.loadTextureComplete(texture) }, this, RES.ResourceItem.TYPE_IMAGE);
	}

	//纹理加载完了就加载json
	private loadTextureComplete(texture: egret.Texture): void {
		this._texture = texture;
		RES.getResByUrl(this._url + ".json", (json: JSON) => { this.loadJsonComplete(json) }, this, RES.ResourceItem.TYPE_JSON);
	}

	//json加载完了就抛出加载完成的事件
	private loadJsonComplete(json: JSON): void {
		var sp: CustomSpriteSheet = this.parseMC(json, this._texture);
		this.dispatchEvent(new ParamEvent(TextureLoader.COMPLETE, { url: this._url, sp: sp }));
	}

	private parseMC(json: JSON, pngs: egret.Texture): CustomSpriteSheet {
		let frameList: Object = json["frames"];
		var sp = new CustomSpriteSheet(pngs);
		let frameObj: Object;
		let frameWHObj: Object;
		let texture: egret.Texture;
		let textureName: string;
		for (let n in frameList) {
			frameObj = frameList[n];
			textureName = n;
			sp.createTexture(textureName, frameObj["x"], frameObj["y"], frameObj["w"], frameObj["h"], frameObj["offX"], frameObj["offY"], frameObj["sourceW"], frameObj["sourceH"]);
		}
		return sp;
	}
}