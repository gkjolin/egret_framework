class CustomProgressBar extends eui.ProgressBar implements eui.UIComponent {
	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();
	}

	private _tween: egret.Tween;
	public showAnimation(time: number): void {
		this._tween = egret.Tween.get(this.thumb).to({ scaleX: 1 }, time * 1000);
	}

	public stopAnimation(): void {
		if (this._tween) {
			egret.Tween.removeTweens(this.thumb);
			this._tween = null;
		}
	}

}