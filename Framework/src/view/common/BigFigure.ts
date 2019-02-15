class BigFigure extends CommonSprite {
	private _bodyMovieClip: BitmapMovieClip;
	private _wingMovieClip: BitmapMovieClip
	private _weaponMovieClip: BitmapMovieClip;

	private bodyContainer: CommonSprite;
	private secondAction: Boolean = false;
	private hasEvtListener: Boolean = false;
	private _resList: Array<string> = [];

	private _wingURL: string;
	private _weaponURL: string;
	private _bodyURL: string;
	// private _index: number;

	private static INDEX: number = 0;
	public constructor(secondAction: boolean = true, type: string = "BigFigure") {
		super(type);
		// this._index = BigFigure.INDEX++;
		this.secondAction = secondAction;
        this.touchEnabled = false;
		this.bodyContainer = new CommonSprite();
		// this.bodyContainer.touchEnabled = false;
		// this.bodyContainer.touchChildren = false;
		this.addChild(this.bodyContainer);

		this._wingMovieClip = new BitmapMovieClip("BigFigure_Player_wing");
		// this._wingMovieClip = new BitmapMovieClip("BigFigure_Player_wing_" + this._index);
		this._wingMovieClip.setDealy(120);
		this.bodyContainer.addChild(this._wingMovieClip);
		this._bodyMovieClip = new BitmapMovieClip("BigFigure_Player_body");
		// this._bodyMovieClip = new BitmapMovieClip("BigFigure_Player_body_" + this._index);
		this.bodyContainer.addChild(this._bodyMovieClip);
		this._weaponMovieClip = new BitmapMovieClip("BigFigure_Player_weapon");
		// this._weaponMovieClip = new BitmapMovieClip("BigFigure_Player_weapon_" + this._index);
		this.bodyContainer.addChild(this._weaponMovieClip);
	}
	private _bodyURL_a: string;
	public changeBody(career: number, sex: number, cloth: number = 1): void {
		if (cloth == 0) cloth = 1;
		this._bodyURL_a = UrlUtil.getFigureClothURL(career, sex, cloth) + "stand";
		this.loadBody(this._bodyURL_a);
	}
	public loadBody(url: string): void {
		if (url == null || url == "") {
			return;
		}

		var ind: number = this._resList.indexOf(this._bodyURL);
		if (ind >= 0) this._resList.splice(ind, 1);

		this._bodyURL = url;
		if (SourceCache.getInstance().has(this._bodyURL)) {
			this._bodyMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(this._bodyURL));
			this.redraw();
		}
		else {
			if (this._resList.indexOf(this._bodyURL) == -1) this._resList.push(this._bodyURL);
			this.addEvent();
			if (SourceCache.getInstance().isLoading(this._bodyURL) == false) {
				SourceCache.getInstance().load(this._bodyURL, ResourceType.ANIMATION);
			}
		}
	}
	private _weaponURL_a: string;
	public changeWeapon(career: number, sex: number, weaponID: number = 0): void {
		if (weaponID == 0) return;
		this._weaponURL_a = UrlUtil.getFigureWeaponURL(weaponID) + "stand";
		this.loadWeapon(this._weaponURL_a);
	}
	public loadWeapon(url: string): void {
		if (url == null || url == "") {
			return;
		}

		var ind: number = this._resList.indexOf(this._weaponURL);
		if (ind >= 0) this._resList.splice(ind, 1);

		this._weaponURL = url;
		if (SourceCache.getInstance().has(this._weaponURL)) {
			this._weaponMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(this._weaponURL));
			this.redraw();
		}
		else {
			if (this._resList.indexOf(this._weaponURL) == -1) this._resList.push(this._weaponURL);
			this.addEvent();
			if (SourceCache.getInstance().isLoading(this._weaponURL) == false) {
				SourceCache.getInstance().load(this._weaponURL, ResourceType.ANIMATION);
			}
		}
	}
	private _wingURL_a: string;
	public changeWing(wingID: number = 0): void {
		if (wingID == 0) {
			return;
		}
		this._wingURL_a = UrlUtil.getFigureWingURL(wingID) + "stand";
		this.loadWing(this._wingURL_a);
	}
	public loadWing(url: string): void {
		if (url == null || url == "") {
			return;
		}

		var ind: number = this._resList.indexOf(this._wingURL);
		if (ind >= 0) this._resList.splice(ind, 1);

		this._wingURL = url;
		if (SourceCache.getInstance().has(this._wingURL)) {
			this._wingMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(this._wingURL));
			this.redraw();
		}
		else {
			if (this._resList.indexOf(this._wingURL) == -1) this._resList.push(this._wingURL);
			this.addEvent();
			if (SourceCache.getInstance().isLoading(this._wingURL) == false) {
				SourceCache.getInstance().load(this._wingURL, ResourceType.ANIMATION);
			}
		}
	}
	private loadResComplete(event: ParamEvent): void {
		let url: string = event.data.url;
		let mc: MovieClipData = event.data.mc;
		var ind: number = this._resList.indexOf(url);
		if (ind == -1) return;
		this._resList.splice(ind, 1);
		if (url == this._bodyURL) {
			// this._bodyMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(this._bodyURL));
			this._bodyMovieClip.setMovieClipData(mc);
			this.redraw();
		}
		else if (url == this._wingURL) {
			// this._wingMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(this._wingURL));
			this._wingMovieClip.setMovieClipData(mc);
			this.redraw();
		}
		else if (url == this._weaponURL) {
			// this._weaponMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(this._weaponURL));
			this._weaponMovieClip.setMovieClipData(mc);
			this.redraw();
		}
	}
	private addEvent(): void {
		if (this.hasEvtListener == false) {
			SourceCache.getInstance().addEventListener(SourceCache.LOAD_ANIMATION_COMPLETE, this.loadResComplete, this);
			this.hasEvtListener = true;
		}
	}
	private redraw(): void {
		if (this._wingURL != null && this.bodyContainer.contains(this._wingMovieClip) == false) {
			this.bodyContainer.addChild(this._wingMovieClip);
		}
		if (this._bodyURL != null && this.bodyContainer.contains(this._bodyMovieClip) == false) {
			this.bodyContainer.addChild(this._bodyMovieClip);
		}
		if (this._weaponURL != null && this.bodyContainer.contains(this._weaponMovieClip) == false) {
			this.bodyContainer.addChild(this._weaponMovieClip);
		}
		if (this._bodyMovieClip != null && this._bodyMovieClip.parent != null) {
			this._bodyMovieClip.gotoAndPlay(1, true, 1, 6);
		}
		if (this._weaponMovieClip != null && this._weaponMovieClip.parent != null) {
			this._weaponMovieClip.gotoAndPlay(1, true, 1, 6);
		}
		if (this._wingMovieClip != null && this._wingMovieClip.parent != null) {
			this._wingMovieClip.gotoAndPlay(1, true, 1, 6);
		}
		this.layoutMC();
	}
	private layoutMC(): void {
		if (this.bodyContainer.contains(this._wingMovieClip) == true) {
			this.bodyContainer.setChildIndex(this._wingMovieClip, this.bodyContainer.numChildren - 1);
		}
		if (this.bodyContainer.contains(this._bodyMovieClip) == true) {
			this.bodyContainer.setChildIndex(this._bodyMovieClip, this.bodyContainer.numChildren - 1);
		}
		if (this.bodyContainer.contains(this._weaponMovieClip) == true) {
			this.bodyContainer.setChildIndex(this._weaponMovieClip, this.bodyContainer.numChildren - 1);
		}
	}
	private localPoint: Point;
	public isHit(point: Point): boolean {
		this.localPoint = point;
		// if (this.localPoint == null) {
		// 	this.localPoint = new Point();
		// }
		// this.localPoint.x = point.x - this.x - this.bodyContainer.x;
		// this.localPoint.y = point.y - this.y - this.bodyContainer.y;
		if (this._bodyMovieClip && this._bodyMovieClip.isHit(this.localPoint) == true) {
			return true;
		}
		if (this._weaponMovieClip && this._weaponMovieClip.isHit(this.localPoint) == true) {
			return true;
		}
		return false;
	}
	public dispose(): void {
		this._wingURL = null;
		this._bodyURL = null;
		this._weaponURL = null;


		if (this._bodyMovieClip) {
			this._bodyMovieClip.dispose();
			if (this.bodyContainer.contains(this._bodyMovieClip) == true) {
				this.bodyContainer.removeChild(this._bodyMovieClip);
			}
		}
		if (this._weaponMovieClip) {
			this._weaponMovieClip.dispose();
			if (this.bodyContainer.contains(this._weaponMovieClip) == true) {
				this.bodyContainer.removeChild(this._weaponMovieClip);
			}
		}

		if (this._wingMovieClip) {
			this._wingMovieClip.dispose();
			if (this.bodyContainer.contains(this._wingMovieClip) == true) {
				this.bodyContainer.removeChild(this._wingMovieClip);
			}
		}


		SourceCache.getInstance().removeEventListener(SourceCache.LOAD_ANIMATION_COMPLETE, this.loadResComplete, this);
		this.hasEvtListener = false;
	}

	public setTounchEnable(value: boolean): void {
		if (this.bodyContainer) {
			this.bodyContainer.touchEnabled = false;
			this.bodyContainer.touchChildren = false;
		}
		if (this._bodyMovieClip) {
			this._bodyMovieClip.touchEnabled = false;
			// this._bodyMovieClip.touchChildren = false;
		}
		if (this._weaponMovieClip) {
			this._weaponMovieClip.touchEnabled = false;
			// this._weaponMovieClip.touchChildren = false;
		}
		if (this._wingMovieClip) {
			this._wingMovieClip.touchEnabled = false;
			// this._wingMovieClip.touchChildren = false;
		}
	}
}