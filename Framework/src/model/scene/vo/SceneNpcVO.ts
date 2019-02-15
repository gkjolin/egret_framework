class SceneNpcVO {
	public constructor() {
	}
	public template_id: number;
	public name: string;
	public type: number;
	public icon: number;
	public model: number;
	public funName: string;
	public x: number;
	public y: number;


	private _bodyURL: string = "";
	public getBodyURL(): string {
		this._bodyURL = null;
		var actionStr: string = "stand";
		this._bodyURL = UrlUtil.getNpcClothURL(this.model) + actionStr;
		return this._bodyURL;
	}
}