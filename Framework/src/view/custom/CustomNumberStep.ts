class CustomNumberStep extends Csprite implements eui.UIComponent {
	private btnAdd: eui.Button;
	private btnRedu: eui.Button;
	private btnMax: CustomButton;
	private btnMin: CustomButton;
	private txtNum: eui.EditableText;
	private _num: number = 0;
	private _minNum: number = 1;
	private _maxNum: number = 99;

	public _step: number = 1;

	private _type: number = 0;
	public static CHANGE: string = "CustomNumberStepChange";
	public constructor(type: number = 0) {
		super();
		this.skinName = "resource/game_skins/custom/CustomNumberStepSkin.exml";
		this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompHandler, this);
		this._type = type;
	}

	private uiCompHandler(): void {
        if (this._type == 0) {
			this.btnMin.visible = this.btnMax.visible = false;
		} else {
			this.btnMin.visible = this.btnMax.visible = true;
		}
		this.setValue(1);
	}
	public set type(value: number) {
		if (this._type == value) return;
		if (this._type == 0) {
			this.btnMin.visible = this.btnMax.visible = false;
		} else {
			this.btnMin.visible = this.btnMax.visible = true;
		}
	}
	private onReduBtnClick(): void {
		var temNum: number = this._num;
		temNum -= this._step;
		if (temNum < this._minNum) {
			temNum = this._minNum;
		} else if (temNum > this._maxNum) {
			temNum = this._maxNum;
		}
		this.setValue(temNum);
	}
	private onAddBtnClick(): void {
		var temNum: number = this._num;
		temNum += this._step;
		if (temNum < this._minNum) {
			temNum = this._minNum;
		} else if (temNum > this._maxNum) {
			temNum = this._maxNum;
		}
		this.setValue(temNum);
	}
	private onMaxBtnClick(): void {
        var temNum: number = this._maxNum;
		this.setValue(temNum);
	}
	private onMinBtnClick(): void {
		var temNum: number = this._minNum;
		this.setValue(temNum);
	}
	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}
	public set MaxNum(num: number) {
		this._maxNum = num;
	}
	public get MaxNum(): number {
		return this._maxNum;
	}
	public set MinNum(num: number) {
		this._minNum = num;
	}
	public get MinNum(): number {
		return this._minNum;
	}
	public setValue(num: number): void {
		if (this._num == num) {
			return;
		}
		this._num = num;
		if (this.txtNum) this.txtNum.text = this._num.toString();
		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(CustomNumberStep.CHANGE));
	}
	public getValue(): number {
		return this._num;
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this.btnAdd.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAddBtnClick, this);
		this.btnRedu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReduBtnClick, this);
		this.btnMax.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMaxBtnClick, this);
		this.btnMin.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMinBtnClick, this);
	}

}