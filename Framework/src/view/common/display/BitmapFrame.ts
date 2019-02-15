class BitmapFrame {
	public rx: number;
	public ry: number;
	public x: number;
	public y: number;
	public width: number;
	public height: number;
	public label: string;
	public fileName: string;
	public lastUseTime: number;				//最后调用的时间
	// public isDraw: Boolean = false;		//是否
	// public reWritePos: Boolean = true;	//直接获取图片时没有设置坐标
	public canGc: Boolean = true;

	private _clsName: string;

	private assetClass: Object;
	private _bitmapData: egret.Texture;
	public constructor() {

	}

	public draw(source: egret.Texture): void {
		this._bitmapData = source;
		// this.isDraw = true;
	}

	public getBitmapData(): egret.Texture {
		this.lastUseTime = getTimer();
		return this._bitmapData;
	}

	public dispose(): void {
		if (this._bitmapData) {
			// this._bitmapData.dispose();
			this._bitmapData = null;
		}
	}
}