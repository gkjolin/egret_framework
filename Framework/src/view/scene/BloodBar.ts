class BloodBar extends CommonSprite {
	private _bar: Bitmap;//血条
	private _barbg: Bitmap;//血条的底
	private _barColorType: number;
	private _bloodType: number;
	private _maxWidth: number;
	private _progress: number = 1;//0~1;

	private _sceneCommonURL: string;

	public static BLOOD_MCEND: string = "BLOOD_MCEND";
	public constructor(bloodType: number, useType: string = "BloodBar") {
		super(useType);
		this._bloodType = bloodType;
		// this.configUI();
	}

	/**
	 	*默认红色 
		* 0 红色 1绿色
	*/
	// public setBarColorType(value: number): void {
	// 	if (this._barColorType == value)
	// 		return;
	// 	this._barColorType = value;
	// 	this.changeBarColor();
	// }

	public configUI(): void {
		this._barColorType = 0;
		this._sceneCommonURL = UrlUtil.getCommonSceneURL();
		if (SourceCache.getInstance().has(this._sceneCommonURL)) {
			var sp: CustomSpriteSheet = SourceCache.getInstance().getSP(this._sceneCommonURL);
			this.build(sp);
		}
		else {
			SourceCache.getInstance().addEventListener(SourceCache.LOAD_TEXTURE_COMPLETE, this.loadCompleteHandler, this);
			if (SourceCache.getInstance().isLoading(this._sceneCommonURL) == false) {
				SourceCache.getInstance().load(this._sceneCommonURL, ResourceType.TEXTURE);
			}
		}
	}

	private loadCompleteHandler(e: ParamEvent): void {
		if (e.data.url == this._sceneCommonURL) {
			SourceCache.getInstance().removeEventListener(SourceCache.LOAD_TEXTURE_COMPLETE, this.loadCompleteHandler, this);
			var sp: CustomSpriteSheet = e.data.texture;
			this.build(sp);
		}
	}

	private build(sp: CustomSpriteSheet): void {
		var texture: egret.Texture = sp.getTexture("bar");
		this._maxWidth = texture.textureWidth;
		//黑底
		if (this._barbg == null) {
			this._barbg = new Bitmap(texture);
		}
		this._barbg.name = "_barbg";
		this.addChild(this._barbg);
		//血条
		texture = sp.getTexture("redBar");
		if (this._bar == null) {
			this._bar = new Bitmap(texture);
		}
		this._bar.name = "_bar"
		this.changeBarColor();
		this.addChild(this._bar);
		this.setProgress(1);
		this.update();
	}

	private changeBarColor(): void {

	}

	private update(isTween: boolean = false): void {
		if (this._bar != null) {
			this._bar.scaleX = this._progress;
		}
	}

	public step(): void {

	}

	public getWidth(): number {
		return this._maxWidth;
	}

	public setProgress(value: number): void {
		if (value > 1) value = 1;
		if (this._progress != value) {
			this._progress = value;
			this.update();
		}
	}

	private _tween: egret.Tween;
	public showHpMC(hp: number, maxHp: number): void {
		if (this._bar) {
			if (this._tween) {
				egret.Tween.removeTweens(this._bar);
				this._tween = null;
			}
			this._tween = egret.Tween.get(this._bar).to({ scaleX: hp / maxHp }, 300);
			this._tween.call(this.endMC, this, []);
		}
		else {
			this.endMC();
		}
	}

	public dispose(): void {
		if (this._tween && this._bar) {
			egret.Tween.removeTweens(this._bar);
			this._tween = null;
		}
		if (this.parent) {
			this.parent.removeChild(this);
		}
		SourceCache.getInstance().removeEventListener(SourceCache.LOAD_TEXTURE_COMPLETE, this.loadCompleteHandler, this);
	}

	public clear(): void {
		if (this._tween && this._bar) {
			egret.Tween.removeTweens(this._bar);
			this._tween = null;
		}
		SourceCache.getInstance().removeEventListener(SourceCache.LOAD_TEXTURE_COMPLETE, this.loadCompleteHandler, this);
	}

	private endMC(): void {
		this.dispatchEvent(new ParamEvent(BloodBar.BLOOD_MCEND));
	}
}