class PicLoader extends Bitmap {
	private _url: string;
	private _textureW: number = 0;
	private _textureH: number = 0;
	public data: any;
	private _useType: number = 0;
	private _customTexture: CustomTexture;

	public static COMMON: number = 0;
	public static MAPTILE: number = 1; //地图块加载的优先级会比较高，所以有些图片都会用这个类型
	private _canGC: boolean = true;
	public constructor(useType: number = 0) {
		super(null);
		this._useType = useType;
	}

	public load(url: string, isPre: boolean = false): void {
		this._url = url;
		if (SourceCache.getInstance().has(this._url)) {
			var texture: CustomTexture = SourceCache.getInstance().getPicTexture(this._url);
			this.setTexture(texture);
		} else {
			SourceCache.getInstance().addEventListener(SourceCache.LOAD_PIC_COMPLETE, this.loadPicComplete, this);
			if (this._useType == PicLoader.COMMON) {
				SourceCache.getInstance().load(this._url, ResourceType.IMAGE);
			} else if (this._useType == PicLoader.MAPTILE) {
				SourceCache.getInstance().load(this._url, ResourceType.MAPTILE, isPre);
			}
		}
	}

	public loadByJsonName(str: string): void {
		this._url = str;
		this.texture = RES.getRes(this._url);
	}

	private loadPicComplete(event: ParamEvent): void {
		if (this._url != event.data.url) {
			return;
		}
		var pic: CustomTexture = event.data.pic;
		SourceCache.getInstance().removeEventListener(SourceCache.LOAD_PIC_COMPLETE, this.loadPicComplete, this);
		var texture: CustomTexture = pic;
		this.setTexture(texture);
		if (this._textureH > 0 && this._textureW > 0) {
			this.setWH(this._textureW, this._textureH);
		}
	}

	private setTexture(texture: CustomTexture): void {
		if (this._customTexture) {
			this._customTexture.unUse();
		}
		this._customTexture = texture;
		this._customTexture.use();
		this._customTexture.canGC = this._canGC;
		this.texture = this._customTexture.texture;
	}

	public dispose(): void {
		if (this.parent) {
			this.parent.removeChild(this);
		}

		this.data = null;
		if (this._customTexture) {
			this._customTexture.unUse();
		}
		this._customTexture = null;
		this.texture = null;
		this.$bitmapData = null;
		SourceCache.getInstance().removeEventListener(SourceCache.LOAD_PIC_COMPLETE, this.loadPicComplete, this);
	}

	public setWH(w: number, h: number): void {
		if (this.texture) {
			this.fillMode = egret.BitmapFillMode.SCALE;
			this.width = w;
			this.height = h;
		} else {
			this._textureW = w;
			this._textureH = h;
		}
	}

	public setPicCanGC(value: boolean): void {
		if (this._customTexture) {
			this._customTexture.canGC = value;
		}
		this._canGC = value;
	}

	public get url(): string {
		return this._url;
	}
}
