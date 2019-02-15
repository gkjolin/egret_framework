class MovieClipData {
	public static count: number = 0;
	public bitmapFrameList: Array<BitmapFrame>;
	public bitmapNameDic: Object;
	private _useTime: number = 0;
	private _lastTime: number = 0;//最后使用的时间
	public gcTime: number = 100000;
	public url: string = "";
	public length: number = 0;
	public constructor() {
		MovieClipData.count++;
		this.bitmapFrameList = new Array();
		this.bitmapNameDic = new Object();
		this.length = 0;
	}

	public setBitmapFrameList(list: Array<BitmapFrame>): void {
		this.bitmapFrameList = list;
		this.length = this.bitmapFrameList.length;
	}

	private static _emptyInstance: MovieClipData;
	public static getEmptyInstance(): MovieClipData {
		if (MovieClipData._emptyInstance == null) {
			MovieClipData._emptyInstance = new MovieClipData();
			MovieClipData._emptyInstance.url = "empty";
		}
		return MovieClipData._emptyInstance;
	}

	public getFrame(name: string): egret.Texture {
		var frame: BitmapFrame = this.bitmapNameDic[name];
		if (frame == null) {
			return null;
		}
		frame.canGc = false;
		return frame.getBitmapData();
	}

	public dispose(): void {
		MovieClipData.count--;
		if (this.bitmapFrameList) {
			for (let i: number = 0; i < this.bitmapFrameList.length; i++) {
				var bmFrame = this.bitmapFrameList[i];
				if (bmFrame) {
					bmFrame.canGc = true;
					bmFrame.dispose();
					bmFrame = null;
				}
			}
		}
		this.bitmapFrameList = null;
		this._useTime = 0;
		this._lastTime = 0;
		this.length = 0;
	}

	public useTime(): void {
		this._useTime++;
		this._lastTime = getTimer();
	}

	public unUseTime(): void {
		if (this._useTime > 0) {
			this._useTime--;
		}
		this._lastTime = getTimer();
	}

	public getTimes(): number {
		return this._useTime;
	}

	public getLastTime(): number {
		return this._lastTime;
	}
}