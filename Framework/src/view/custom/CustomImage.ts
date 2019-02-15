class CustomImage extends eui.Image implements eui.UIComponent {
	private static _classDic: Object = new Object();
	private _type: string;
	public data: any;
	public constructor(type: string = 'CustomImage') {
		super();
		this._type = type;
		if (CustomImage._classDic[type] == undefined || CustomImage._classDic[type] == null) {
			CustomImage._classDic[type] = 1;
		} else {
			CustomImage._classDic[type] = CustomImage._classDic[type] + 1;
		}
	}

	public dispose(): void {
		if (this.parent) {
			this.parent.removeChild(this);
		}
		CustomImage._classDic[this._type] = CustomImage._classDic[this._type]--;
		this.$bitmapData = null;
		this.source = null;
	}

	protected partAdded(partName: string, instance: any): void {}

	protected childrenCreated(): void {
		super.childrenCreated();
	}
}
