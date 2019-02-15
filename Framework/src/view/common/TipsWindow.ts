class TipsWindow extends LayeroutWindow {
	private _btnOk: CustomButton;
	private _btnCancel: CustomButton;
	private _txtTitle: CustomLabel;
	private _txtContent: CustomLabel;
	private _txtCost: CustomLabel;
	private _txtDes: CustomLabel;
	private _func: Function;
	private _autoClose: boolean;
	private _type: string;
	private _yuanBaoPic: PicLoader;
	public constructor() {
		super();
		this.skinName = "resource/game_skins/common/TipsWindowSkin.exml";
	}

	protected uiCompHandler(): void {
		super.uiCompHandler();
		this._btnOk.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		this._btnCancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCancel, this);
		this.setImageWindowTitle("title_tips");
	}

	public setData(title: string, content: string, callBack: Function = null, autoCloseView: boolean = true, type: string = null): void {
		this._txtTitle.htmlText = title;
		this._txtContent.htmlText = content;
		this._func = callBack;
		this._autoClose = autoCloseView;
		this._type = type;
	}

	public setCenter(): void {
		super.setCenter();
		this.y = 386;
	}

	private onCancel(event: ParamEvent): void {
		this.isPop = false;
	}

	private onClick(event: egret.TouchEvent): void {
		if (this._func) {
			this._func();
		}
		if (this._autoClose) {
			this.isPop = false;
		}
	}

	public dispose(): void {
		super.dispose();
		this._func = null;
		if (this._yuanBaoPic) {
			this._yuanBaoPic.dispose();
			this._yuanBaoPic = null;
		}
	}
}