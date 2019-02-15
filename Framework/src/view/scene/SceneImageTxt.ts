class SceneImageTxt extends CommonSprite {
	private _txt: eui.BitmapLabel;
	private _career: number;
	public constructor(career: number) {
		super("SceneImageTxt");
		this._career = career;
		this.init();
	}

	private init(): void {
		this._txt = new eui.BitmapLabel();
		this._txt.font = "number_fight_" + this._career + "_fnt";
		this.addChild(this._txt);
	}

	public setData(value: number): void {
		this._txt.text = "a" + value;
	}

	public dispose(): void {
		super.dispose();
		if (this.parent) {
			this.parent.removeChild(this.parent);
		}
	}
}