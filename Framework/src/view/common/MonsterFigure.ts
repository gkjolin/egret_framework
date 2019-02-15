class MonsterFigure extends CommonSprite {
	private _bodyMovieClip: BitmapMovieClip;
	private _bodyURL: string;
	private _index: number;
	private _action: string;
	private _dir: number;
	private _scale: number = 1;

	private static INDEX: number = 0;
	public constructor(type: string = "MonsterFigure") {
		super(type);
		this.touchEnabled = false;
		this.touchChildren = false;
		this._index = MonsterFigure.INDEX++;
		this._bodyMovieClip = new BitmapMovieClip("MonsterFigure_body_" + this._index);
		this.addChild(this._bodyMovieClip);
	}

	public setRes(res: number, action: string = "stand", dir: number = 2): void {
		if (dir == 4) {
			this._dir = 6;
			this._scale = -1;
		}
		else {
			this._dir = dir;
			this._scale = 1;
		}
		this._bodyURL = UrlUtil.getMonsterURL(res) + action + this._dir;
		this._action = action;
		if (SourceCache.getInstance().has(this._bodyURL)) {
			this._bodyMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(this._bodyURL));
			this.play();
		}
		else {
			SourceCache.getInstance().addEventListener(SourceCache.LOAD_ANIMATION_COMPLETE, this.loadComplete, this);
			SourceCache.getInstance().load(this._bodyURL, ResourceType.ANIMATION);
		}
	}

	private loadComplete(event: ParamEvent): void {
		if (event.data.url == this._bodyURL) {
			var mc: MovieClipData = event.data.mc;
			this._bodyMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(this._bodyURL));
			this._bodyMovieClip.setMovieClipData(mc);
			this.play();
		}
	}

	private play(): void {
		var dir: number = this._dir;
		var startFrame: number = 1;
		if (this._action == "stand") {
			var endFrame: number = MonsterFrame["STAND"];
		}
		else if (this._action == "attack") {
			var endFrame: number = MonsterFrame["ATTACK"];
		}
		this._bodyMovieClip.scaleX = this._scale;
		this._bodyMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);
	}

	public stopAt(frame: number): void {
		if (this._bodyMovieClip) {
			this._bodyMovieClip.gotoAndStop(frame);
		}
	}

	public dispose(): void {
		if (this.parent) {
			this.parent.removeChild(this);
		}
		if (this.contains(this._bodyMovieClip)) {
			this.removeChild(this._bodyMovieClip);
			this._bodyMovieClip.dispose();
			this._bodyMovieClip = null;
		}
		this._bodyURL = null;
	}
}