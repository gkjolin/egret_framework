class AnimationLoader extends egret.EventDispatcher {
	private _url: string;
	private _texture: egret.Texture;
	private _noResDic: Object;

	public static COMPLETE: string = "animation_complete";
	public constructor() {
		super();
		this.init();
	}

	private init(): void {
		this._noResDic = new Object();
	}

	public load(url: string): void {
		this._url = url;
		//如果加载的是一个没有资源的路径，那直接返回了
		if (this._noResDic[this._url]) {
			return;
		}
		RES.getResByUrl(url + ".png", this.loadTextureComplete, this, RES.ResourceItem.TYPE_IMAGE);
		// RES.getResByUrl(url + ".png", (texture: egret.Texture) => { this.loadTextureComplete(texture) }, this, RES.ResourceItem.TYPE_IMAGE);
	}

	//纹理加载完了就加载json
	private loadTextureComplete(texture: egret.Texture): void {
		this._texture = texture;
		RES.getResByUrl(this._url + ".json", this.loadJsonComplete, this, RES.ResourceItem.TYPE_JSON);
		// RES.getResByUrl(this._url + ".json", (json: JSON) => { this.loadJsonComplete(json) }, this, RES.ResourceItem.TYPE_JSON);
	}

	//json加载完了就抛出加载完成的事件
	private loadJsonComplete(json: JSON): void {
		var mc: MovieClipData = this.parseMC(json, this._texture);
		// var mc: MovieClipData = testTime("parseMc", this.parseMC, this, json, this._texture);
		this.dispatchEvent(new ParamEvent(AnimationLoader.COMPLETE, { url: this._url, mc: mc }));
	}

	private parseMC(json: JSON, pngs: egret.Texture): MovieClipData {
		if (json == null) {
			this._noResDic[this._url] = 1;
			return;
		}
		var action: string = this._url.split("\/").pop();
		var a = json["mc"];
		if (a == null) {
			throw new Error(this._url);
		}
		var b = a[action];
		var frameList: Array<Object> = b["frames"];
		var resList: Object = json["res"];
		var sp: CustomSpriteSheet = new CustomSpriteSheet(pngs);
		var mc: MovieClipData = new MovieClipData();
		mc.url = this._url;
		var bitmapList: Array<BitmapFrame> = new Array();
		var tmpBitmap: BitmapFrame;
		var frameObj: Object;
		var frameWHObj: Object;
		var texture: egret.Texture;
		var textureName: string;
		for (var i: number = 0; i < frameList.length; i++) {
			frameObj = frameList[i];
			frameWHObj = resList[frameObj["res"]];
			textureName = this._url + frameObj["res"];
			texture = sp.createTexture(textureName, frameWHObj["x"], frameWHObj["y"], frameWHObj["w"], frameWHObj["h"], frameObj["x"], frameObj["y"], frameWHObj["w"], frameWHObj["h"]);
			tmpBitmap = new BitmapFrame();
			tmpBitmap.draw(texture);
			tmpBitmap.width = frameWHObj["w"];
			tmpBitmap.height = frameWHObj["h"];
			bitmapList.push(tmpBitmap);
			mc.bitmapNameDic[frameObj["res"]] = tmpBitmap;
		}
		mc.setBitmapFrameList(bitmapList);
		bitmapList = null;
		a = null;
		action = null;
		b = null;
		frameList = null;
		resList = null;
		sp = null;
		tmpBitmap = null;
		frameObj = null;
		frameWHObj = null;
		texture = null;
		textureName = null;
		return mc;
	}
}