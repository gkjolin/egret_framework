class CustomLabel extends eui.Label implements eui.UIComponent {
	private static _classDic: Object = new Object();
	private _type: string;
	private _htmlTextParser: egret.HtmlTextParser;
	public constructor(useType: string = "CustomLabel") {
		super();
		this._type = useType;
		if (CustomLabel._classDic[useType] == undefined || CustomLabel._classDic[useType] == null) {
			CustomLabel._classDic[useType] = 1;
		}
		else {
			CustomLabel._classDic[useType] = CustomLabel._classDic[useType] + 1;
		}
		// this.fontFamily = "Microsoft YaHei";
		this.textColor = 0xE7D0B7;
	}

	public dispose(): void {
		if (this.parent) {
			this.parent.removeChild(this);
		}
		CustomLabel._classDic[this._type] = CustomLabel._classDic[this._type]--;
	}

	protected partAdded(partName: string, instance: any): void {

	}

	public set htmlText(value: string) {
		if (!this._htmlTextParser) this._htmlTextParser = new egret.HtmlTextParser();
		if (value != null) {
			try {
				this.textFlow = this._htmlTextParser.parser(value);
			}
			catch(e){
				
			}
		}
	}

	public addMiaoBian(): void {
		this.stroke = 1;
		this.strokeColor = 0x000000;
	}

	protected childrenCreated(): void {
		super.childrenCreated();
	}

}