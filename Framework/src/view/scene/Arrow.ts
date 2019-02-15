class Arrow extends egret.EventDispatcher {
	private _arrowEffect: UIEffect;
	private _endPoint: Point;
	private _speed: number;
	private _lastFrameTime: number;
	private _currentFrameTime: number;
	private _id: number;
	private static ARROWINDEX: number = 0;

	public static ARROW_END: string = "ARROW_END";
	public constructor() {
		super();
	}

	public showArrow(url: string, attacker: LiveThing, hiter: LiveThing, parent: Object, lastTime: number, speed: number, delay: number, offPoint: Point): void {
		this._arrowEffect = new UIEffect("Arrow_Effect");
		this._endPoint = new Point(hiter.x + offPoint.x, hiter.y + offPoint.y);
		this._speed = speed;
		var startP: Point = new Point(attacker.x + offPoint.x, attacker.y + offPoint.y);
		var rotation: number = Math.atan2(this._endPoint.y - startP.y, this._endPoint.x - startP.x) * 180 / Math.PI + 90;
		this._arrowEffect.setRotation(rotation);
		this._arrowEffect.showEffect(url, startP.x, startP.y, parent, 40, true);
		this._id = Arrow.ARROWINDEX++;
		RenderManager.add(this.enterHandler, this);
		this._lastFrameTime = getTimer();
	}

	private _enterTimes: number = 0;//如果超过某个数值，就要stop了
	private enterHandler(): void {
		this._currentFrameTime = getTimer();
		var timeGap: number = (this._currentFrameTime - this._lastFrameTime) / 1000;
		this._lastFrameTime = this._currentFrameTime;
		var normal: Point = new Point(this._arrowEffect.x - this._endPoint.x, this._arrowEffect.y - this._endPoint.y);
		normal.normalize(1);
		var maxX: boolean = Math.abs(this._arrowEffect.x - this._endPoint.x) > 5;
		var maxY: boolean = Math.abs(this._arrowEffect.y - this._endPoint.y) > 5;
		if (maxX) {
			this._arrowEffect.x -= this._speed * timeGap * normal.x;
		}
		if (maxY) {
			this._arrowEffect.y -= this._speed * timeGap * normal.y;
		}
		this._enterTimes++;
		if ((this._arrowEffect.x - this._endPoint.x) * normal.x < 0 || (this._arrowEffect.y - this._endPoint.y) * normal.y < 0 || (!maxX && !maxY)) {
			this.stop();
		}
		//正常而言，一个Arrow最多
		if (this._enterTimes > 20) {
			this.stop();
		}
	}

	private stop(): void {
		if (this._arrowEffect) {
			this._arrowEffect.dispose();
			this._arrowEffect = null;
		}
		RenderManager.remove(this.enterHandler, this);
		this.dispatchEvent(new ParamEvent(Arrow.ARROW_END, { endP: this._endPoint }));
	}
}