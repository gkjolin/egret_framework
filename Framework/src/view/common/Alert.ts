class Alert extends CommonSprite {
	private _contentSp: CommonSprite;
	private txt: CustomLabel;
	private _okFun: Function;
	private _cancelFun: Function;
	private yesBtn: CustomButton;
	private noBtn: CustomButton;
	public constructor() {
		super();

		this._contentSp = new CommonSprite();

		this.txt = new CustomLabel();
		this.addChild(this.txt);
		this.addChild(this._contentSp);

		this.width = 300;
		this.height = 200;
		// this._txt.init(str, textColor, delay, size, "Microsoft YaHei", false, 0x21290b);
	}
	public static show(str: string, type: number = 0, okFun: Function = null, cancelFun: Function = null, removeTime: number = 0, lLabelStr: string = "确定", rLabelStr: string = "取消"): void {
		var alert: Alert = PopManager.getInstance().create(Alert) as Alert;
		alert.setAlert(str, type, okFun, cancelFun, removeTime, lLabelStr, rLabelStr);
	}
	private setAlert(text: string, type: number = 0, okFun: Function = null, cancelFun: Function = null, removeTime: number = 0, lLabelStr: string = "确定", rLabelStr: string = "取消"): void {
		var a = this;
		while (a._contentSp.numChildren) {
			a._contentSp.removeChildAt(0);
		}
		if (a.txt == null) {
			a.txt = new CustomLabel();
		}
		a.txt.fontFamily = "Microsoft YaHei";
		a.txt.size = 18;
		a.txt.textAlign = "center";
		// a.txt.x = 55;
		a.txt.width = 300;
		a.txt.height = 50;
		a.txt.horizontalCenter = 0;
		a.txt.lineSpacing = 6;
		a.txt.y = 60;
		a.txt.touchEnabled = false;
		// a.txt.verticalCenter = 0;
		a.txt.wordWrap = true;
		a.txt.htmlText = text;
		a.addChild(a.txt);

		var bg: CustomImage = new CustomImage();
		bg.source = RES.getRes("share_json.share_messageItem");
		bg.scale9Grid = new egret.Rectangle(12, 10, 160, 12);
		a._contentSp.addChild(bg);
		bg.width = 300;
		bg.height = 200;

		var offX: number;
		if (type == 0) {
			if (okFun) {
				a._okFun = okFun;
			}
			if (a.yesBtn == null) {
				a.yesBtn = new CustomButton();
			}
			a.yesBtn.label = lLabelStr;
			a._contentSp.addChild(a.yesBtn);
			a.yesBtn.x = bg.width - a.yesBtn.width >> 1;
			a.yesBtn.y = a.txt.y + a.txt.textHeight + 20;
			a.yesBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, a.OkHandler, a);
		}
		else if (type == 1) {
			if (okFun) {
				a._okFun = okFun;
			}
			if (cancelFun) {
				a._cancelFun = cancelFun;
			}
			if (a.yesBtn == null) {
				a.yesBtn = new CustomButton();
			}
			offX = (300 - (122 * 2 + 20)) >> 1;
			a.yesBtn.label = lLabelStr;
			a._contentSp.addChild(a.yesBtn);
			a.yesBtn.x = offX;
			a.yesBtn.y = a.txt.y + a.txt.textHeight + 10;
			a.yesBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, a.OkHandler, a);
			if (a.noBtn == null) {
				a.noBtn = new CustomButton();
			}
			a.noBtn.label = rLabelStr;
			a._contentSp.addChild(a.yesBtn);
			a.noBtn.x = a.yesBtn.x + a.yesBtn.width + 20;
			a.noBtn.y = a.yesBtn.y;
			a.noBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, a.cancelHandler, a);
			a._contentSp.addChild(a.noBtn);
		}
		if (removeTime > 0) {
			this._left = removeTime;
			this.daoJiShi();
			TimerManager.getInstance().add(1000, this.daoJiShi, this);
		}
	}
	private OkHandler(): void {
		this.close();
		if (this._okFun) {
			this._okFun.apply(null);
		}
		this._okFun = null;
	}

	private daoJiShi(): void {
		if (this._left <= 0) {
			TimerManager.getInstance().remove(1000, this.daoJiShi, this);
			this.close();
			return;
		}
		this._left--;
		this.yesBtn.label = this._left.toString();
	}

	private cancelHandler(): void {
		this.close();
		if (this._cancelFun) {
			this._cancelFun.apply(null);
		}
		this._cancelFun = null;
	}

	private _left: number = 0;
	private close(): void {
		if (this.txt && this.txt.parent) {
			this.txt.parent.removeChild(this.txt);
			this.txt = null;
		}
		var alert: egret.DisplayObject = PopManager.getInstance().getWindow(Alert);
		PopManager.getInstance().remove(alert);
	}
}