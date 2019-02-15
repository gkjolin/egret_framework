class LayeroutWindow extends BaseWindow {
	protected panelSkin: LayeroutWindowSkin;//窗口.exml中的panel命名为panelSkin,不然会报错
	private _resGroupName: string;
	public constructor(type: string = "LayeroutWindow") {
		super(type);
		this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompHandler, this);
	}
	protected uiCompHandler(): void {
		if (this.panelSkin) this.panelSkin.addEventListener(EventName.WIN_CLOSE, this.onCloseBtnClick, this);
	}
	protected onCloseBtnClick(e: ParamEvent): void {
		this.isPop = false;
	}

	protected onOpenHandler(): void {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickThisHandler, this);
	}
	protected onCloseHandler(): void {
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickThisHandler, this);
		if (this.panelSkin) {
			this.panelSkin.removeEventListener(EventName.WIN_CLOSE, this.onCloseBtnClick, this);
		}
		this.removeEventListener(eui.UIEvent.COMPLETE, this.uiCompHandler, this);
		RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onReGroupLoadComplete, this);
		super.onCloseHandler();
	}
	public setImageTitle(resName: string): void {
		if (resName.indexOf('_json') != -1) {
			if (this.panelSkin) {
				this.panelSkin.imageTitle.source = RES.getRes(resName + '');
			}
		} else {
			if (this.panelSkin) {
				this.panelSkin.imageTitle.source = RES.getRes(this._resGroupName + "_json." + resName + '');
			}
		}
	}
	public setImageWindowTitle(name: string): void {
		if (this.panelSkin) this.panelSkin.imageTitle.source = UrlUtil.getWindowTitlePicURL(name);
	}
	//加载本模块资源组，value为资源组的名字
	public set resGroupName(value: string) {
		this._resGroupName = value;
		if (!RES.isGroupLoaded(this._resGroupName)) {
			RES.loadGroup(this._resGroupName);
			RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onReGroupLoadComplete, this);
		} else {
			this.onReGroupLoadComplete();
		}
	}
	//本模块的资源组加载完成
	protected onReGroupLoadComplete(): void {
		//由子类重载
	}

	protected onReturnButtonClick(): void {
		if (this.panelSkin) this.panelSkin.dispatchEvent(new ParamEvent(EventName.WIN_CLOSE));
	}

	protected getBtnReturn(): CustomButton {
		return this.panelSkin ? this.panelSkin.getBtnReturn() : null;
	}

	//返回按钮最高层次
	protected onBtnReturnSetIndex(): void {
		this.panelSkin.onBtnReturnSetIndex();
	}

	protected set windowBgBottom(value: number) {
		if (this.panelSkin) this.panelSkin.setWindowBgBottom(value);
	}

	protected set windowBgSource(value: string) {
		if (this.panelSkin) this.panelSkin.setWindowBgSource(value);
	}
	protected set imageTitleTop(value: number) {
		if (this.panelSkin) this.panelSkin.setImageTitleTop(value);
	}

	protected onClickThisHandler(e: egret.TouchEvent): void {
		if (this.getBtnReturn() == null || this.getBtnReturn() == undefined) return;
		var localPos: Point;
		
		if (!this.getBtnReturn()) {
			return;
		}
		
		localPos = this.getBtnReturn().globalToLocal(e.stageX, e.stageY);
		// var hitPoint: Point = new Point(localPos.x - this.getBtnReturn().x, localPos.y - this.getBtnReturn().y);
		if (localPos.x > 0 && localPos.x < this.getBtnReturn().width && localPos.y > 0 && localPos.y < this.getBtnReturn().height) {
			// this.isPop = false;
			this.onCloseBtnClick(new ParamEvent(EventName.WIN_CLOSE, { type: 1 }))
		}
	}

	public dispose(): void {
		super.dispose();
		// if (this.panelSkin) {
		// 	this.panelSkin.dispose();
		// 	this.panelSkin = null;
		// }
	}
}