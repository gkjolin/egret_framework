class DaoJiShiInScene extends egret.DisplayObjectContainer {
	private _txt: CustomLabel;
	private _leftTimes: number = 0;
	public constructor() {
		super();
		this.init();
	}

	private init(): void {
		this._txt = new CustomLabel();
		this._txt.addMiaoBian();
		this._txt.textColor = 0xE7D0B7;
		this._txt.size = 24;
		this._txt.bold = true;
		this._txt.textAlign = "center";
		this.addChild(this._txt);
	}

	public show(): void {
		if (!this.parent) {
			GameContent.gameLayers.mainUILayer.addChild(this);
		}
		this.y = GameContent.stageHeight - 240;
		this.x = GameContent.stageWidth - 270 >> 1;
	}

	public addTimes(leftTimes: number): void {
		if (leftTimes == 0) {
			return;
		}
		this._leftTimes = leftTimes;
		TimerManager.getInstance().remove(1000, this.daoJiShi, this);
		TimerManager.getInstance().add(1000, this.daoJiShi, this);
		this.daoJiShi();
	}

	private daoJiShi(): void {
		if (this._leftTimes <= 0) {
			this.remove();
			return;
		}
		this._txt.htmlText = StringUtil.substitute("本关剩余时间：<font color='#ff0000'>{0}</font>", TimeUtil.getTime(this._leftTimes));
		this._leftTimes--;
	}

	public remove(): void {
		this.dispatchEvent(new ParamEvent(EventName.WINDOW_DISPOSE));
	}

	public dispose(): void {
		if (this.parent) {
			this.parent.removeChild(this);
		}
		this._txt.dispose();
		this._txt = null;
		TimerManager.getInstance().remove(1000, this.daoJiShi, this);
	}
}