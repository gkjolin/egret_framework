class BaseWindow extends Csprite implements IBaseWindow {
	protected _isPop: boolean = false;

	public constructor(typeName: string = "BaseWindow") {
		super(typeName);
	}

	public set isPop(value: boolean) {
        if (this._isPop == value) {
			if (value == true)
				this.parent.setChildIndex(this, this.parent.numChildren - 1);
			return;
		}
		this._isPop = value;
		if (value == true) {
			PopManager.getInstance().popUp(this);
			this.onOpenHandler();
			this.setCenter();
		} else {
			PopManager.getInstance().popBack(this);
			this.onCloseHandler();
			// this.dispose();
		}
	}

	/*
	带黑色背景的弹窗
	*/
	public set isPop2(value: boolean) {
        if (this._isPop == value) return;
		this._isPop = value;
		if (value == true) {
			PopManager.getInstance().popUp(this, true);
			this.onOpenHandler();
			this.setCenter();
		} else {
			PopManager.getInstance().popBack(this);
			this.onCloseHandler();
			// this.dispose();
		}
	}

	public get isPop(): boolean {
		return this._isPop;
	}
	protected onOpenHandler(): void {

	}
	protected onCloseHandler(): void {
		this.dispatchEvent(new ParamEvent(EventName.WINDOW_DISPOSE));
	}
	public setCenter(): void {
		this.x = GameContent.stageWidth - this.width >> 1;
		this.y = 45;
	}
	public dispose(): void {
		super.dispose();
	}
}