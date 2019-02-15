class PopManager {
	private layer: CommonSprite;
	private topLayer: CommonSprite;
	private _onOpenPopList: Array<BaseWindow>;
	private _winDic: Object = new Object();
	private static _instance: PopManager;
	private _bg: CustomImage;
	private _modalDic: Object = new Object();
	public constructor() {
		this.layer = GameContent.gameLayers.windowLayer;
		this.topLayer = GameContent.gameLayers.topLayer;
		this._onOpenPopList = new Array();

	}

	public popUp(window: BaseWindow, isBg: boolean = false): void {
		if (this.layer.contains(window) == true) return;
		if (isBg) {
			if (!this._bg) {
				this._bg = new CustomImage();
				this._bg.source = "share_black2"
				this._bg.width = GameContent.stageWidth;
				this._bg.height = GameContent.stageHeight;
				this._bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBgHandler, this);
			}
			this.layer.addChild(this._bg);
		}
		this.layer.addChild(window);
		this._onOpenPopList.push(window);
		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.WINDOW_CHANGE));
	}
	public popBack(window: BaseWindow): void {
		if (this.layer.contains(window) == false) return;
		this.layer.removeChild(window);
		if (this._bg && this._bg.parent) {
			this._bg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBgHandler, this);
			this._bg.parent.removeChild(this._bg);
			this._bg.source = null;
			this._bg = null;
		}
		for (var i: number = 0; i < this._onOpenPopList.length; i++) {
			if (this._onOpenPopList[i] == window) {
				this._onOpenPopList.splice(i, 1);
				break;
			}
		}
		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.WINDOW_CHANGE));
	}

	private onClickBgHandler(): void {
		var window: BaseWindow = this._onOpenPopList[this._onOpenPopList.length - 1];
		if (window) window.isPop = false;
	}

    private setmodal(disObj: egret.DisplayObject, display: boolean, color: number = 0x000000, alpha: number = 0): void {
		var modal: egret.Shape = this._modalDic[disObj.hashCode];
		if (display == false) {
			if (modal != null && this.layer.contains(modal)) {
				this.layer.removeChild(modal);
			}
			delete this._modalDic[disObj.hashCode];
			return;
		}
		if (modal == null) {
			var modalShape: egret.Shape = new egret.Shape();
			modalShape.graphics.beginFill(color, alpha);
			modalShape.graphics.drawRect(0, 0, GameContent.stageWidth, GameContent.stageHeight);

			modal = modalShape;
			this._modalDic[disObj.hashCode] = modal;
		}
		this.layer.addChildAt(modal, this.layer.getChildIndex(disObj));
	}
	public create(winCls: any, modal: Boolean = true, modalAlpha: Number = 0): egret.DisplayObject {
		var window: egret.DisplayObject;
		if (this._winDic[winCls] != undefined) {
			window = this._winDic[winCls];
			this.setmodal(window, false);
		}
		else {
			window = new winCls();
			this._winDic[winCls] = window;
		}
		this.topLayer.addChild(window);

		if (modal == true) {
			// if (window is InteractiveObject) {
			// 	//GlobalContext.stage.focus=window as InteractiveObject;
			// }
			this.setmodal(window, true);
		}
		else {
			this.setmodal(window, false);
			//window.setmodal(false);
		}
		this.setCenter(window);
		// window.addEventListener(egret.TouchEvent.CLOSE, this.closeHandle, this);
		return window;
	}


	public remove(disObj: egret.DisplayObject): void {
		if (disObj == null || disObj.parent == null) return;


		// // delete this._winDic[disObj["constructor"]];

		var modal: CommonSprite = this._modalDic[disObj.hashCode];
		if (modal != null && modal.parent != null) {
			modal.parent.removeChild(modal);
		}
		delete this._modalDic[disObj.hashCode];
		if (disObj.parent != null) {
			disObj.parent.removeChild(disObj);
		}
	}

	public setCenter(disObj: egret.DisplayObject): void {
		disObj.x = GameContent.stageWidth - disObj.width >> 1;
		disObj.y = GameContent.stageHeight - disObj.height >> 1;
	}
	public hasPopWindow(): boolean {
		return this._onOpenPopList.length > 0;
	}
    public hasWindow(winCls: any): boolean {
		return this._winDic[winCls] != undefined;
	}

	public getWindow(winCls: any): egret.DisplayObject {
		if (this.hasWindow(winCls) == true) {
			return this._winDic[winCls];
		}
		return null
	}
	public static getInstance(): PopManager {
		if (!this._instance) this._instance = new PopManager();
		return this._instance;
	}
}