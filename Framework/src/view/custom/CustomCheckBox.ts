class CustomCheckBox extends eui.CheckBox implements eui.UIComponent {
	private static _classDic: Object = new Object();
	private _type: string;
	public constructor(type: string = 'CustomCheckBox') {
		super();
		this._type = type;
		if (CustomCheckBox._classDic[type] == undefined || CustomCheckBox._classDic[type] == null) {
			CustomCheckBox._classDic[type] = 1;
		} else {
			CustomCheckBox._classDic[type] = CustomCheckBox._classDic[type] + 1;
		}
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		super.childrenCreated();
	}
}
