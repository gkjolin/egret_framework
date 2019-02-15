class CustomTextInput extends eui.TextInput implements  eui.UIComponent {
	private static _classDic: Object = new Object();
	private _type: string;
	public constructor(type: string = "CustomTextInput") {
		super();
		this._type = type;
		if (CustomTextInput._classDic[type] == undefined || CustomTextInput._classDic[type] == null) {
			CustomTextInput._classDic[type] = 1;
		}
		else {
			CustomTextInput._classDic[type] = CustomTextInput._classDic[type] + 1;
		}
	}

	public dispose(): void {
		CustomTextInput._classDic[this._type] = CustomTextInput._classDic[this._type]--;
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
	}
	
}