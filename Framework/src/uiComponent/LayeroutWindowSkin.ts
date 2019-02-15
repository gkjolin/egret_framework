class LayeroutWindowSkin extends eui.Panel implements eui.UIComponent {
    imageTitle: eui.Image;
	win_headBar: eui.Image;
	closeButton: CustomButton;
	win_bg: CustomImage;
	private returnButton: CustomButton;
	public constructor() {
		super();
		this.skinName = "resource/game_skins/custom/LayeroutWindowSkin.exml";
		this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompHandler, this);
	}
    private uiCompHandler(): void {

	}
	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}
	protected onTouchMove(event: egret.TouchEvent): void {
		//屏蔽panel的拖动事件，窗口不可拖动
	}
	protected childrenCreated(): void {
		super.childrenCreated();
		// if (this.returnButton) this.returnButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReturnButtonClick, this)
	}

	protected onCloseButtonClick(e: egret.TouchEvent): void {
		this.dispatchEvent(new ParamEvent(EventName.WIN_CLOSE,{type:0}));
	}
	protected onReturnButtonClick(e: egret.TouchEvent): void {
		this.dispatchEvent(new ParamEvent(EventName.WIN_CLOSE,{type:1}));
	}

	public getBtnReturn(): CustomButton {
		return this.returnButton;
	}

	public onBtnReturnSetIndex(): void {
		this.setChildIndex(this.returnButton, this.numChildren - 1)
	}

	public setWindowBgBottom(value: number): void {
		this.win_bg.bottom = value;
	}

	public setWindowBgSource(value: string): void {
		this.win_bg.source = value;
	}
	public setImageTitleTop(value: number): void {
		this.imageTitle.top = value;
	}

	public dispose(): void {
		var a = this;
		if (a.imageTitle) {
			a.imageTitle.source = null;
			if (a.imageTitle.parent) {
				a.imageTitle.parent.removeChild(a.imageTitle);
			}
		}
		a.imageTitle = null;
		if (a.win_headBar) {
			a.win_headBar.source = null;
			if (a.win_headBar.parent) {
				a.win_headBar.parent.removeChild(a.win_headBar);
			}
			a.win_headBar = null;
		}
		a.removeEventListener(eui.UIEvent.COMPLETE, a.uiCompHandler, a);
		if (a.returnButton) {
			// a.returnButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, a.onReturnButtonClick, a);
			if (a.returnButton.parent) {
				a.returnButton.parent.removeChild(a.returnButton);
			}
		}
		a.skinName = null;
		a = null;
	}
}