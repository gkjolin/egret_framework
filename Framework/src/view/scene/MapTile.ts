class MapTile extends CommonSprite {
	public col: number;//所在列
	public row: number;//所在行
	public url: string;//加载地址
	private _parent: egret.Sprite;
	private _key: string;
	private _hasLoad: boolean = false;
	private _pic: PicLoader;
	public constructor(myParent: egret.Sprite, key: string) {
		super();
		this._parent = myParent;
		this._key = key;
	}

	public doLoad(): void {
		if (!this._pic) {
			this._pic = new PicLoader(PicLoader.MAPTILE);
		}
		if (!this.contains(this._pic)) {
			this.addChild(this._pic);
		}
		this._pic.load(this.url);
		this._hasLoad = true;
	}

	private unLoad(): void {
		this._hasLoad = false;
		if (this._pic) {
			if (this.contains(this._pic)) {
				this.removeChild(this._pic);
			}
			this._pic.dispose();
			this._pic = null;
		}
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}

	public getHasLoad(): boolean {
		return this._hasLoad;
	}

	public dispose(): void {
		this.unLoad();
	}
}