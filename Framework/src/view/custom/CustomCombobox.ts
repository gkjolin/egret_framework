class CustomCombobox extends Csprite implements eui.UIComponent {
	public static CHANGE: string = "CustomComboboxChange";
	public static DOWN: number = 1;
	public static UP: number = 2;
	private list: eui.Group;
	private label: CustomLabel;
	private btnShow: CustomButton;
	private _data: Array<any>;
	private _arrayBtn: Array<CustomButton>;
	private _type: number;//1向下2向上
	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompHandler, this);
		this.skinName = "resource/game_skins/custom/CustomComboboxSkin.exml";
	}
	private uiCompHandler(): void {
		this.removeEventListener(eui.UIEvent.COMPLETE, this.uiCompHandler, this);
		this.label.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showList, this);
		this.btnShow.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showList, this);
		this.initialize();
	}
	protected initialize(): void {
		this._arrayBtn = [];
		this.list.visible = false;
		this.btnShow.setImageSource(this._type == 1 ? "comp_json.combobox_down" : "comp_json.combobox_up");
	}

	public set type(value: number) {
		this._type = value;
		this.initialize();
		this.drawLayout();
	}
	/**
	 * [{ label: "", data: * }]
	 */
	public set dataProvider(value: Array<any>) {
		this._data = value;
		this.drawLayout();
	}
	protected drawLayout(): void {
		if (!this._data) return;
		this.clearGroup();
		var btn: CustomButton;
		var idx: number = 0;
		for (var k = 0; k < this._data.length; k++) {
			btn = this._arrayBtn[k];
			if (!btn) {
				btn = new CustomButton();
				btn.width = this.width;
				btn.skinName = "CustomButtonSkin7Skin";
				btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnClick, this);
			}
			btn.y = idx * btn.height;
			btn.label = this._data[k]["label"];
			btn.data = this._data[k];
			this.list.addChild(btn);
			idx++;
			if (this._type == CustomCombobox.UP) {
				this.list.y = -btn.y - btn.height;
			}
		}
	}
	private onBtnClick(e: egret.TouchEvent) {
		var data: Object = e.currentTarget.data;
		this.selectItem(data);
	}
	//设置当前选中子项的索引  
	public set selectedIndex(value: number) {
		if (this._data && this._data.length > 0) {
			this.selectItem(this._data[value])
		}
	}
	public selectItem(value: Object): void {
		if (value) {
			this.label.text = value["label"];
			this.list.visible = false;
			this.dispatchEvent(new ParamEvent(CustomCombobox.CHANGE, value["data"]));
		}
	}
	private showList(): void {
		this.list.visible = !this.list.visible;
	}

	private clearGroup(): void {
		var btn: CustomButton;
		for (var k = 0; k < this._arrayBtn.length; k++) {
			btn = this._arrayBtn[k];
			if (btn) {
				if (btn.parent) btn.parent.removeChild(btn);
				btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnClick, this);
				btn.dispose();
				btn = null;
			}
		}
	}
	public dispose(): void {
		super.dispose();
		if (this.parent) this.parent.removeChild(this);
		this.label.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.showList, this);
		this.btnShow.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.showList, this);
		this.clearGroup();
		this._arrayBtn = null;
	}
}