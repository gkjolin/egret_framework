class BossEnterView extends egret.DisplayObjectContainer {
	private _bg: PicLoader;
	private _txtImage: PicLoader;
	private _bigBg: PicLoader;
	private n: number = 0;
	private nBg: number = 0;
	private _timeGap: number = 100;
	private _timeGap2: number = 150;
	private _px: number;
	private _py: number;
	public constructor() {
		super();
		this.init();
	}

	private init(): void {
		var picCanGC: boolean = false;
		var a = this;
		a._px = GameContent.stageWidth - 442 >> 1;
		a._py = GameContent.stageHeight - 244 >> 1;
		a._bigBg = new PicLoader();
		a._bigBg.setPicCanGC(picCanGC);
		var url = UrlUtil.getOtherIcon("bossEnterBg");
		a._bigBg.load(url);
		a._bigBg.setWH(GameContent.stageWidth, GameContent.stageHeight);
		a.addChild(a._bigBg);
		a._bg = new PicLoader();
		a._bg.setPicCanGC(picCanGC);
		url = UrlUtil.getOtherIcon("bossEnter1");
		a._bg.load(url);
		a._bg.x = a._px;
		a._bg.y = a._py;
		a.addChild(a._bg);
		a._txtImage = new PicLoader();
		a._txtImage.setPicCanGC(picCanGC);
		url = UrlUtil.getOtherIcon("bossEnter2");
		a._txtImage.load(url);
		a.addChild(a._txtImage);
		a._txtImage.x = a._px + 70;
		a._txtImage.y = a._py + 157;
		this.setBigBgAlpha();
	}

	private _tween1: egret.Tween;
	private _tween2: egret.Tween;
	private setBigBgAlpha(): void {
		var bg = this._bigBg;
		var txt = this._txtImage;
		bg.alpha = 0.2;
		this.startTweenBg(bg);
		this.startTweenTxt(txt);
	}

	private _bgSi: number = 0;
	private _endSi: number = 0;
	private startTweenBg(bg: egret.DisplayObject): void {
		if (this.nBg > 1) {
			return;
		}
		this.nBg++;
		this._tween1 = egret.Tween.get(bg).to({ alpha: 1 }, this._timeGap);
		this._tween1.call(this.endTweenBg, this, [bg]);
	}
	private endTweenBg(item: egret.DisplayObject): void {
		this._bgSi = setTimeout2((item) => {
			this._tween1 = egret.Tween.get(item).to({ alpha: 0.2 }, this._timeGap);
			this._tween1.call(this.startTweenBg, this, [item]);
		}, this._timeGap2, item);
	}

	//boss出场几个字的特效
	private _txtSi: number = 0;
	private startTweenTxt(item: egret.DisplayObject): void {
		if (this.n > 1) {
			if (this._endSi > 0) {
				clearTimeout(this._endSi);
			}
			this._endSi = setTimeout2(() => {
				this.remove();
			}, this._timeGap + 100);
			return;
		}
		this.n++;
		this._tween2 = egret.Tween.get(item).to({ x: this._px + 18, scaleX: 1.5, scaleY: 1.5 }, this._timeGap);
		this._tween2.call(this.endTweenTxt, this, [item]);
	}
	private endTweenTxt(item: egret.DisplayObject): void {
		this._txtSi = setTimeout2(() => {
			this._tween2 = egret.Tween.get(item).to({ x: this._px + 70, scaleX: 1, scaleY: 1 }, this._timeGap);
			this._tween2.call(this.startTweenTxt, this, [item]);
		}, this._timeGap2, item);
	}

	public remove(): void {
		if (this.parent) {
			this.parent.removeChild(this);
		}
		this.dispatchEvent(new ParamEvent(EventName.WINDOW_DISPOSE));
	}

	public show(): void {
		GameContent.gameLayers.mainUILayer.addChild(this);
	}

	public dispose(): void {
		var a = this;
		if (a._tween1) {
			egret.Tween.removeTweens(a._bigBg);
			a._tween1 = null;
		}
		if (a._tween2) {
			egret.Tween.removeTweens(a._txtImage);
			a._tween2 = null;
		}
		if (a._bg) {
			a._bg.dispose();
			a._bg = null;
		}
		if (a._txtImage) {
			a._txtImage.dispose();
			a._txtImage = null;
		}
		if (a._bgSi > 0) {
			clearTimeout(a._bgSi);
		}
		if (a._txtSi > 0) {
			clearTimeout(a._txtSi);
		}
		a = null;
	}
}