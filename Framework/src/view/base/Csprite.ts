class Csprite extends eui.Component {
	private dispatcher: GameDispatcher;
	protected _isInit: boolean;
	protected _imageRed: CustomImage;
	protected _showRedDot: boolean = false;
	public constructor(type: string = "Csprite") {
		super();
		this.dispatcher = GameDispatcher.getInstance();
	}

	public addGlobalEventListener(type: string, listener: Function, thisObj: any, useCapture: boolean = false, priority: number = 0, useWeakReference: boolean = false): void {
		this.dispatcher.addEventListener(type, listener, thisObj, useCapture, priority);
	}

	public removeGlobalEventListener(type: string, listener: Function, thisObj: any, useCapture: boolean = false): void {
		this.dispatcher.removeEventListener(type, listener, thisObj, useCapture);
	}

	public dispatchGlobalEvent(e: egret.Event): boolean {
		return this.dispatcher.dispatchEvent(e);
	}

	public hasGlobalEventListener(type: string): boolean {
		return this.dispatcher.hasEventListener(type);
	}
    public setRedDotPoint(top: number, left: number): void {
		if (this._imageRed) {
			this._imageRed.top = top;
			this._imageRed.left = left;
		}
	}
	public set showRedDot(value: boolean) {
		if (this._showRedDot == value) return;
		this._showRedDot = value;
		if (this._showRedDot == true) {
			if (this._imageRed == null) {
				this._imageRed = new CustomImage();
				this._imageRed.source = RES.getRes("share_json.share_alert");
				this.addChild(this._imageRed);
				this._imageRed.top = 1;
				this._imageRed.left = 1;
			}
			return;
		}
		if (this._imageRed) {
			if (this._imageRed.parent) this._imageRed.parent.removeChild(this._imageRed);
			this._imageRed.dispose();
			this._imageRed = null;
		}
	}

	public get showRedDot(): boolean {
		return this._showRedDot;
	}

	public onAdd(): void {

	}

	public onRemove(): void {

	}

	public dispose(): void {
		this.showRedDot = false;
		if (this.parent) {
			this.parent.removeChild(this);
		}
		this._isInit = false;
	}

}