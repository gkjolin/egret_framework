class ScreenImageEffect {
	private static _instance: ScreenImageEffect;
	public static getInstance(): ScreenImageEffect {
		if (!this._instance) {
			this._instance = new ScreenImageEffect();
		}
		return this._instance;
	}
	public constructor() {
	}
	private _img: PicLoader;
	private _effTween: egret.Tween;
	public playEffect(startX: number, startY: number, endOffX: number, endOffY: number, imgUrl: string, scal: number = 3.5,delay:number = 2000): void {
		var a = this;
		if (a._siInterval > 0) {
			clearInterval(a._siInterval);
		}
		if (a._siDelay > 0) {
			clearTimeout(a._siDelay);
		}
		if (a._effTween) {
			if (a._img)
				egret.Tween.removeTweens(a._img);
			a._effTween = null;
		}
		if (a._img != null) {
			a._img.dispose();
			a._img = null;
			clearTimeout(a._siDelay);
		}
		if (a._img == null) {
			a._img = new PicLoader();
			a._img.scaleX = scal;
			a._img.scaleY = scal;
			a._img.load(imgUrl);
			GameContent.gameLayers.guideLayer.addChild(a._img);
			a._img.x = startX;
			a._img.y = startY;
		}
		a._effTween = egret.Tween.get(a._img).to({ x: a._img.x + endOffX, y: a._img.y + endOffY, scaleX: 1, scaleY: 1 }, 200).wait(10).call(() => {
			a.shake(a._img, 2, 4, 11);
			if (a._effTween) {
				egret.Tween.removeTweens(a._img);
				a._effTween = null;
			}
			a._siDelay = setTimeout2(() => {
				if (a._img != null && a._img.parent != null) {
					a._img.dispose();
					a._img = null;
					clearTimeout(a._siDelay);
				}
			}, delay);
		});
	}
	private _isShake: Boolean;
	private _siDelay: number = 0;
	private _siInterval: number = 0;
	private shake(dis: PicLoader, times: number = 2, offset: number = 4, speed: number = 32): void {
		var a = this;
		if (a._isShake) {
			return;
		}
		a._isShake = true;
		var point: Point = new Point(dis.x, dis.y);
		var offsetXYArray: Array<number> = [0, 0];
		var num: number = 0;
		a._siInterval = setInterval(function (): void {
			offsetXYArray[num % 2] = (num++) % 4 < 2 ? 0 : offset;
			if (num > (times * 4 + 1)) {
				clearInterval(a._siInterval);
				num = 0;
				a._isShake = false;
			}
			dis.x = offsetXYArray[0] + point.x;
			dis.y = offsetXYArray[1] + point.y;
		}, speed);
	}
}