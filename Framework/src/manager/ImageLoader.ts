class ImageLoader extends egret.EventDispatcher {
	private _url: string;
	public static COMPLETE: string = "imageloader_complete";
	public constructor() {
		super();
	}

	public load(url: string): void {
		this._url = url;
		RES.getResByUrl(url, (texture: egret.Texture) => { this.loadTextureComplete(texture) }, this, RES.ResourceItem.TYPE_IMAGE);
	}

	private loadTextureComplete(texture: egret.Texture): void {
		var ct: CustomTexture = new CustomTexture();
		ct.setTexture(texture);
		ct.url = this._url;
		this.dispatchEvent(new ParamEvent(ImageLoader.COMPLETE, { url: this._url, ct: ct }));
	}
}