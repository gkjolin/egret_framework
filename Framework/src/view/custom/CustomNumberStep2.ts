class CustomNumberStep2 extends eui.Component implements eui.UIComponent {
	public static CHANGE: string = "CHANGE"
	private btnAdd: eui.Button;
	private btnRedu: eui.Button;
	private btnMax: CustomButton;
	private btnMin: CustomButton;
	private txtNum: eui.EditableText;
	private _num: number = 1;
	private _minNum: number = 1;
	private _maxNum: number = 999;
	private _type: number;
	public constructor(type: number = 0) {
		super();
		this.skinName = "resource/game_skins/custom/CustomNumberStepSkin2.exml";
		this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompHandler, this);
		this._type = type;
	}

	private uiCompHandler(): void {
        if (this._type == 0) {
			this.btnMin.visible = this.btnMax.visible = false;
		} else {
			this.btnMin.visible = this.btnMax.visible = true;
		}
	}
	private onReduBtnClick(): void {
		this._num--;
		this.updateData();
	}
	private onAddBtnClick(): void {
		this._num++;
		this.updateData();
	}
	private onMaxBtnClick(): void {
		this._num += 10;
		this.updateData();
	}
	private onMinBtnClick(): void {
		this._num -= 10;
		this.updateData();
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
		this.updateData();
	}
	public getValue(): number {
		return this._num;
	}

	public onTxtNumChange(): void {
		this._num = Number(this.txtNum.text);
		this.updateData();
	}

	private updateData() {
		if (this._num < this._minNum) {
			this._num = this._minNum;
		} else if (this._num > this._maxNum) {
			this._num = this._maxNum;
		}
		if (this.txtNum) this.txtNum.text = this._num.toString();
		this.dispatchEvent(new ParamEvent(CustomNumberStep2.CHANGE));
	}
	protected childrenCreated(): void {
		super.childrenCreated();
		this.btnAdd.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAddBtnClick, this);
		this.btnRedu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReduBtnClick, this);
		this.btnMax.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMaxBtnClick, this);
		this.btnMin.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMinBtnClick, this);
		this.txtNum.addEventListener(egret.Event.CHANGE, this.onTxtNumChange, this);
	}

}