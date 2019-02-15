class UIEffect extends egret.EventDispatcher {
	public data: Object;
	public scaleX: number = 1;
	public scaleY: number = 1;
	public offsetX: number = 100;
	public offsetY: number = 100;
	public hasWeight: boolean = true;//是否收放慢的影响
	public static EFFECT_END: string = "effect_end";
	private static _effectDic: Object = new Object();
	private static _effectDic2: Object = new Object();//缓存所有的效果对象
	public static showID: number = 0;
	private _assetURL: string;
	private _content: BitmapMovieClip;
	private _startFrame: number = 0;
	private _endFrame: number = -1;
	private _isLoop: boolean;
	private delayRemoveTime: number;
	private _lastTime: number = 0;
	private _delayPlaySi: number = 0;
	private _targetStr: string = "";
	private _rotation: number = 0;
	private _showID: number = 0;
	private _time: number;
	public constructor(targetName: string = "UIEffect") {
		super();
		this._targetStr = targetName;
	}

	public getRotation(): number {
		return this._rotation;
	}

	public setRotation(value: number): void {
		this._rotation = value;
		if (this.content) {
			this.content.rotation = this._rotation;
		}
	}

	public showEffect(url: string, px: number, py: number, parent: any, delay: number = 60, isLoop: boolean = false, cangc: boolean = false, lastTime: number = 0, isQueue: boolean = true,
		time: number = 0, autoRemove: boolean = true, startFrame: number = 1, endFrame: number = -1, delayToPlay: number = 0, addChildIndex: number = -1): void {
		if (!is(parent, "egret.DisplayObject")) {
			return;
		}
		if (UIEffect.getNum() > 20) {
			return;
		}
		this.stop();
		this._showID = UIEffect.showID++;
		this._time = time;
		UIEffect._effectDic[this._showID] = url;
		UIEffect._effectDic2[this._showID] = this;
		this._lastTime = lastTime;
		this._isLoop = isLoop;
		this._startFrame = startFrame;
		this.content = new BitmapMovieClip();
		this.content.setDealy(delay);
		this.content.x = px;
		this.content.y = py;
		this.content.hasWeight = this.hasWeight;
		this.content.touchEnabled = false;
		// this.content.touchChildren = false;
		if (addChildIndex >= 0) {
			parent.addChildAt(this.content, addChildIndex);
		} else {
			parent.addChild(this.content);
		}
		if (time > 0) {
			this.content.visible = false;
			this._time = time;
			TimerManager.getInstance().remove(this._time, this.canShow, this);
			TimerManager.getInstance().add(this._time, this.canShow, this);
		}
		if (autoRemove && this._lastTime == 0) {
			this.content.addEventListener(BitmapMovieClip.END, this.endHandler, this);
		}
		this._assetURL = url;
		if (SourceCache.getInstance().has(this._assetURL)) {
			this.content.scaleX = this.scaleX;
			this.content.scaleY = this.scaleY;
			this.content.offsetX = this.offsetX;
			this.content.offsetY = this.offsetY;
			this.content.rotation = this._rotation;
			this.content.setMovieClipData(SourceCache.getInstance().getEffect(this._assetURL));
			if (delayToPlay == 0) {
				this.content.gotoAndPlay(this._startFrame, this._isLoop, this._startFrame, endFrame);
			} else {
				if (this._delayPlaySi > 0) {
					clearTimeout(this._delayPlaySi);
				}
				this._delayPlaySi = setTimeout2(() => { this.delayToPlayEffect() }, delayToPlay);
			}
			if (this._lastTime > 0) {
				clearTimeout(this.delayRemoveTime);
				this.delayRemoveTime = setTimeout2(() => { this.stopEffect() }, lastTime);
			}
		}
		else {
			SourceCache.getInstance().addEventListener(SourceCache.LOAD_EFFECT_COMPLETE, this.assetLoadCompleteHandler, this);
			if (SourceCache.getInstance().isLoading(this._assetURL) == false) {
				SourceCache.getInstance().load(this._assetURL, ResourceType.EFFECT);
			}
		}
	}

	private delayToPlayEffect(): void {
		if (this.content == null) {
			return;
		}
		this.content.gotoAndPlay(this._startFrame, this._isLoop, this._startFrame, this._endFrame);
	}

	public canShow(): void {
		this.content.visible = true;
		TimerManager.getInstance().remove(this._time, this.canShow, this);
	}

	public setEffectParent(parent: CommonSprite): void {
		if (parent != null && this.content != null) {
			parent.addChild(this.content);
		}
	}
	private assetLoadCompleteHandler(e: ParamEvent): void {
		if (e.data.url == this._assetURL) {
			SourceCache.getInstance().removeEventListener(SourceCache.LOAD_EFFECT_COMPLETE, this.assetLoadCompleteHandler, this);
			if (this._lastTime > 0) {
				clearTimeout(this.delayRemoveTime);
				this.delayRemoveTime = setTimeout2(() => { this.stopEffect() }, this._lastTime);
			}
			if (this.content == null) {
				return;
			}
			var mc: MovieClipData = e.data.mc;
			this.content.scaleX = this.scaleX;
			this.content.scaleY = this.scaleY;
			this.content.offsetX = this.offsetX;
			this.content.offsetY = this.offsetY;
			this.content.rotation = this._rotation;
			this.content.setMovieClipData(mc);
			// this.content.setMovieClipData(SourceCache.getInstance().getEffect(this._assetURL));
			this.content.gotoAndPlay(this._startFrame, this._isLoop, this._startFrame, this._endFrame);
			// this.dispatchEvent(new Event(Event.COMPLETE));
		}
	}

	private endHandler(e: Event): void {
		this.stopEffect();
	}
	private stopEffect(): void {
		if (this.stop()) {
			this.dispatchEvent(new ParamEvent(UIEffect.EFFECT_END));
		}
	}

	private stop(): boolean {
		clearTimeout(this.delayRemoveTime);
		delete UIEffect._effectDic[this._showID];
		delete UIEffect._effectDic2[this._showID];
		SourceCache.getInstance().removeEventListener(SourceCache.LOAD_EFFECT_COMPLETE, this.assetLoadCompleteHandler, this);
		clearTimeout(this._delayPlaySi);
		if (this.content == null) {
			return false;
		}
		this.content.removeEventListener(BitmapMovieClip.END, this.endHandler, this);
		if (this.content.parent != null) {
			this.content.parent.removeChild(this.content);
		}
		this.content.dispose();
		this.content = null;
		return true;
	}

	public static disposeAll(): void {
		var eff: any;
		for (eff in UIEffect._effectDic2) {
			UIEffect._effectDic2[eff].dispose();
			delete UIEffect._effectDic2[eff];
		}
		UIEffect._effectDic2 = new Object();
	}

	public static getNum(): number {
		var result: number = 0;
		var n: any;
		for (n in UIEffect._effectDic2) {
			result++;
		}
		return result;
	}

	public set x(value: number) {
		if (this.content) {
			this.content.x = value;
		}
	}
	public get x(): number {
		if (this.content) {
			return this.content.x;
		}
		return 0;
	}
	public set y(value: number) {
		if (this.content) {
			this.content.y = value;
		}
	}
	public get y(): number {
		if (this.content) {
			return this.content.y;
		}
		return 0;
	}

	public get height() {
		if (this.content) {
			return this.content.height;
		}
		return 0;
	}

	public get width(): number {
		if (this.content) {
			return this.content.width;
		}
		return 0;
	}

	public set visible(value: boolean) {
		if (this.content) {
			this.content.visible = value;
		}
	}

	public dispose(): void {
		this.stopEffect();
	}

	public get content(): BitmapMovieClip {
		return this._content;
	}

	public set content(value: BitmapMovieClip) {
		this._content = value;
	}

	public getContentFrame(frame: number): egret.Texture {
		if (this._content) {
			var bm: BitmapFrame = this._content.getFrame(frame);
			if (bm) {
				return bm.getBitmapData();
			}
		}
		return null;
	}

	public setContentScaleY(value: number): void {
		this._content.scaleY = value;
	}
}