class BitmapMovieClip extends Bitmap {
	// private _bitmap: Bitmap;
	private _endFuncObj: Object;
	private _delay: number = 60;				//频率
	private _lastTime: number;					//上次的渲染时间
	private _isLockFrame: boolean = false;		//是否是锁定帧，锁定帧后不受gotoandstop和gotoAndPlay影响
	private _movieClipData: MovieClipData;
	private _startFrame: number;
	private _endFrame: number;
	private _isLoop: boolean;
	private movieStep: number;
	private _opposite: boolean = false;
	private _updateFuncObj: Object;

	// public offsetX: number = 0;
	// public offsetY: number = 0;
	public offsetX: number = -395;
	public offsetY: number = -395;
	public url: string = "default";
	public canSkipFrame: boolean = false;	//是否可跳帧
	public hasWeight: boolean = true;
	public currentFrame: number;
	public totalFrames: number;
	public static END: string = "end";
	public static count: number = 0;
	private bitmapFrame: BitmapFrame;
	// private static _index: number = 0;//类的索引，用于生成对象名称的
	public constructor(type: string = "BitmapMovieClip") {
		super(null);
		var a = this;
		a.init();
	}

	private init(): void {
		var a = this;
		BitmapMovieClip.count++;
		// BitmapMovieClip._index++;
		// a.touchChildren = false;
		a.touchEnabled = false;
		a.addEventListener(egret.Event.ADDED_TO_STAGE, a.addedToStageHandler, a);
	}

	private addedToStageHandler(event: egret.Event): void {
		var a = this;
		a.render();
	}

	public setDealy(delay: number): void {
		delay = Math.ceil(delay / 30) * 30;
		var a = this;
		if (delay == a._delay) {
			return;
		}
		a._delay = delay > 0 ? delay : 60;
	}

	public getDelay(): number {
		var a = this;
		return a._delay;
	}

	public setMovieClipData(value: MovieClipData): void {
		var a = this;
		if (value == null) return;
		if (value == a._movieClipData) return;
		if (a._movieClipData != null) {
			a._movieClipData.unUseTime();
			// if (a._bitmap) {
			// 	a._bitmap.texture = null;
			// }
			a.$bitmapData = null;
		}
		a._movieClipData = value;
		a._movieClipData.useTime();
		a.totalFrames = a._movieClipData.length;
		a._startFrame = 1;
		a._endFrame = a.totalFrames;
		a.url = a._movieClipData.url;
		a._isLockFrame = false;
	}

	public getMovieClipData(): MovieClipData {
		var a = this;
		return a._movieClipData;
	}

	// public getBitmapData(): egret.BitmapData {
	// 	a.createBitmap();
	// 	return a._bitmap.bitmapData;
	// }

	public get bitmap(): Bitmap {
		var a = this;
		a.createBitmap();
		return a;
		// return a._bitmap;
	}

	private createBitmap(): void {
		// if (a._bitmap == null) {
		// 	a._bitmap = new Bitmap(null);
		// 	a._bitmap.x = 0;
		// 	a._bitmap.y = 0;
		// 	a._bitmap.touchEnabled = false;
		// 	a.addChild(a._bitmap);
		// }
	}

	public play(): void {
		var a = this;
		RenderManager.add(a.step, a);
	}

	public stop(): void {
		var a = this;
		RenderManager.remove(a.step, a);
	}

	private step(): boolean {
		var a = this;
		if (a.stage == null) {
			if (a._isLoop == false) {
				a.dispatchEvent(new egret.Event(BitmapMovieClip.END));
			}
			return false;
		}
		if (a._movieClipData == null) {
			return false;
		}
		if (a._movieClipData.length == 0) {
			return false;
		}
		var weight: number = 1;
		if (a.hasWeight == true) {
			weight = RenderManager.frameWeight;
		}
		if (getTimer() - a._lastTime < a._delay * weight) return false;
		var gapTime: number = getTimer() - RenderManager.getCurrentTime();
		if (a.currentFrame > 1 && gapTime > 15) {
			return true;
		}
		if ((a._opposite == false && a.currentFrame >= a._endFrame) || (a._opposite == true && a.currentFrame <= a._startFrame)) {
			if (a._isLoop == false) {
				a.dispatchEvent(new egret.Event(BitmapMovieClip.END));
				a.stop();
				if (a._endFuncObj != null) {
					a.execEndFunc();
				}
				return false;
			}
			a.currentFrame = a._opposite == false ? a._startFrame : a._endFrame;
		}
		else {
			if (a._isLoop == true) {
				if (a._opposite == false) {
					a.currentFrame++;
				}
				else {
					a.currentFrame--;
				}
			}
			else {
				a.movieStep = (getTimer() - a._lastTime) / (a._delay * weight) >> 0;
				if (a.movieStep == 0) return false;
				if (a._opposite == false) {
					a.currentFrame += a.movieStep;
				}
				else {
					a.currentFrame -= a.movieStep;
				}
			}
			if (a._opposite == false && a.currentFrame >= a._endFrame) {
				a.currentFrame = a._endFrame;
			}
			else if (a._opposite && a.currentFrame <= a._startFrame) {
				a.currentFrame = a._startFrame;
			}
		}
		a.setCurrentFrame(a.currentFrame);
		return false;
	}

	private setCurrentFrame(frameIndex: number): void {
		var a = this;
		if (a._movieClipData == null) return;
		a._lastTime = getTimer();
		var len: number = a._movieClipData.length;
		if (len == 0) return;
		if (frameIndex > len) {
			frameIndex = len;
		}
		a.currentFrame = frameIndex;
		a.bitmapFrame = a._movieClipData.bitmapFrameList[a.currentFrame - 1] as BitmapFrame;
		//如果该显示对象不再舞台上，则不再渲染
		if (a.stage == null) {
			// if (a._bitmap != null) {
			// 	a._bitmap.bitmapData = null;
			// }
			a.$bitmapData = null;
			return;
		}
		a.render();
	}

	private execEndFunc(): void {
		var a = this;
		if (a._endFuncObj) {
			var f: Function = a._endFuncObj["func"];
			var thisObj = a._endFuncObj["thisObj"];
			var params = a._endFuncObj["parameters"];
			if (!f) {
				var kk = 1;
			}
			f.apply(thisObj, params);
		}
	}

	public getBitmapFrame(): BitmapFrame {
		var a = this;
		return a.bitmapFrame;
	}

	private render(): void {
		var a = this;
		if (a._movieClipData == null || a._movieClipData.length == 0) return;
		a.createBitmap();
		if (a.bitmapFrame == null) {
			a.$bitmapData = null;
			// a._bitmap.bitmapData = null;
			return;
		}
		a.texture = a.bitmapFrame.getBitmapData();
		// a._bitmap.texture = a.bitmapFrame.getBitmapData();
		// a._bitmap.x = 0;
		// a._bitmap.y = 0;
		if (a._updateFuncObj != null) {
			a.execUpdateFunc();
		}
	}
	private execUpdateFunc(): void {
		var a = this;
		if (a._updateFuncObj) {
			var f: Function = a._updateFuncObj["func"];
			var thisObj = a._updateFuncObj["thisObj"];
			var params = a._updateFuncObj["parameters"];
			f.apply(thisObj, params);
		}
	}

	public gotoAndPlay(frame: number, isLoop: boolean = true, __startFrame: number = 1, endFrame: number = -1, endObj: Object = null, updateObj: Object = null, opposite: boolean = false): void {
		var a = this;
		if (a._movieClipData == null || a._movieClipData.length == 0 || a._isLockFrame == true) return;
		a._isLoop = isLoop;
		a._opposite = opposite;
		a.currentFrame = frame;
		a._startFrame = __startFrame;
		if (endFrame == -1) {
			a._endFrame = a.totalFrames;
		}
		else {
			a._endFrame = endFrame;
		}
		a._endFuncObj = endObj;
		a._updateFuncObj = updateObj;
		a.setCurrentFrame(a.currentFrame);
		a.play();
	}

	public gotoAndStop(frame: number): void {
		var a = this;
		if (a._movieClipData == null || a._movieClipData.length == 0 || a._isLockFrame == true) return;
		a.currentFrame = frame;
		a.setCurrentFrame(a.currentFrame);
		a.stop();
	}

	public prevFrame(): void {
		var a = this;
		a.gotoAndStop(Math.max(a.currentFrame - 1, 1));
	}

	public nextFrame(): void {
		var a = this;
		a.gotoAndStop(Math.min(a.currentFrame + 1, a._movieClipData.bitmapFrameList.length));
	}


	public clearFunc(): void {
		var a = this;
		a._updateFuncObj = null;
		a._endFuncObj = null;
	}

	public gotoName(bitmapName: string): void {
		var a = this;
		if (a._movieClipData == null) return;
		if (a._movieClipData.bitmapNameDic[bitmapName] == null) return;
		a._isLockFrame = true;
		a.bitmapFrame = a._movieClipData.bitmapNameDic[bitmapName];
		a.bitmapFrame.canGc = false;
		a.render();
	}

	public getCurrentBitmapFrame(): BitmapFrame {
		var a = this;
		if (a.bitmapFrame != null) {
			return a.bitmapFrame;
		}
		return null;
	}

	public clearFrame(): void {
		var a = this;
		if (a.bitmap != null) {
			a.bitmap.$bitmapData = null;
		}
	}

	public isHit(point: Point): boolean {
		var a = this;
		if (a.bitmap == null) return false;
		var hitPoint: Point = new Point(point.x - a.bitmap.x, point.y - a.bitmap.y);
		// var hitPoint: Point = new Point(point.x - a._bitmap.x, point.y - a.bitmap.y);
		// if (a.getCurrentBitmapFrame() != null) {
		// 	hitPoint.x = hitPoint.x - a.getCurrentBitmapFrame().getBitmapData()._offsetX;
		// 	hitPoint.y = hitPoint.y - a.getCurrentBitmapFrame().getBitmapData()._offsetY;
		// }
		if (hitPoint.x > 0 && hitPoint.x < a.bitmap.width && hitPoint.y > 0 && hitPoint.y < a.bitmap.height) {
			return true;
		}
		return false;
	}

	public getFrame(frame: number): BitmapFrame {
		var a = this;
		if (a._movieClipData == null || frame > a._movieClipData.bitmapFrameList.length) {
			return null;
		}
		return a._movieClipData.bitmapFrameList[frame - 1] as BitmapFrame;
	}

	public dispose(): void {
		var a = this;
		if (a.parent != null)
			a.parent.removeChild(a);
		a.stop();
		a.removeEventListener(egret.Event.ADDED_TO_STAGE, a.addedToStageHandler, a);
		if (a._movieClipData != null) {
			a._movieClipData.unUseTime();
			a._movieClipData = null;
		}
		// if (a._bitmap != null) {
		// 	a._bitmap.texture = null;
		// 	a._bitmap.bitmapData = null;
		// 	a._bitmap = null;
		// }
		a.$bitmapData = null;
		BitmapMovieClip.count--;
	}
	// private isUseInMonster(): boolean {
	// 	return a._type.indexOf("Monster") > -1;
	// }

	// private isUsePlayer(): boolean {
	// 	return a._type.indexOf("Player") > -1;
	// }
}