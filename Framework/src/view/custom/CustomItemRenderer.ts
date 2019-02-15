class CustomItemRenderer extends eui.ItemRenderer {
	private static _classDic: Object = new Object();
	private _type: string;
	private dispatcher: GameDispatcher;
	private _imageRed: CustomImage;
	private _showRedDot: boolean = false;
	public constructor(type: string = "CustomItemRenderer") {
		super();
		this.dispatcher = GameDispatcher.getInstance();
		this._type = type;
		if (CustomItemRenderer._classDic[type] == undefined || CustomItemRenderer._classDic[type] == null) {
			CustomItemRenderer._classDic[type] = 1;
		}
		else {
			CustomItemRenderer._classDic[type] = CustomItemRenderer._classDic[type] + 1;
		}
	}

	public addGlobalEventListener(type: string, listener: Function, thisObj: any, useCapture: boolean = false, priority: number = 0, useWeakReference: boolean = false): void {
		this.dispatcher.addEventListener(type, listener, thisObj, useCapture, priority);
	}

	public removeGlobalEventListener(type: string, listener: Function, useCapture: boolean = false): void {
		this.dispatcher.removeEventListener(type, listener, useCapture);
	}

	public dispatchGlobalEvent(e: egret.Event): boolean {
		return this.dispatcher.dispatchEvent(e);
	}

	public hasGlobalEventListener(type: string): boolean {
		return this.dispatcher.hasEventListener(type);
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

	public dispose(): void {
		CustomItemRenderer._classDic[this._type] = CustomItemRenderer._classDic[this._type]--;
	}
}