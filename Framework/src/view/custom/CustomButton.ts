class CustomButton extends eui.Button implements eui.UIComponent {
	private static _classDic: Object = new Object();
	private _type: string;
	public data: any;
	private _imageRed: CustomImage;
	private _showRedDot: boolean = false;
	public isStopTouch: boolean = false;
	public constructor(type: string = 'CustomButton') {
		super();
		this._type = type;
		if (CustomButton._classDic[type] == undefined || CustomButton._classDic[type] == null) {
			CustomButton._classDic[type] = 1;
		} else {
			CustomButton._classDic[type] = CustomButton._classDic[type] + 1;
		}
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	public setImageSource(value: string): void {
		(this.getChildAt(0) as eui.Image).source = RES.getRes(value);
	}
	public setImageSourceUrl(value: string): void {
		(this.getChildAt(0) as eui.Image).source = value;
	}

	/**
	 * @language zh_CN
	 * 触碰事件处理。
	 * @param event 事件 <code>egret.TouchEvent</code> 的对象。
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web,Native
	 */
	// private _srcX: number = 0;
	// private _srcY: number = 0;
	// private _endX: number = 0;
	// private _endY: number = 0;
	private isPressed: boolean;
	protected onTouchBegin(event: egret.TouchEvent): void {
		if (this.isStopTouch) {
			return;
		}
		this.$stage.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
		this.$stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
		// this.touchCaptured = true;
		this.invalidateState();
		event.updateAfterEvent();
		// if (this._srcX == 0) {
		// 	this._srcX = this.x;
		// 	this._srcY = this.y;
		// 	this._endX = this._srcX + 5;
		// 	this._endY = this._srcY + 5;
		// }
		// this.x = this._endX;
		// this.y = this._endY;
		if (this.isPressed) {
			this.x -= 5;
			this.y -= 5;
			this.isPressed = false;
		} else {
			this.x += 5;
			this.y += 5;
			this.isPressed = true;
		}
		// this.isPressed = true;
	}
	private onTouchEnd(event: egret.TouchEvent): void {
		if (this.isStopTouch) {
			return;
		}
		var stage = event.$currentTarget;
		stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
		stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
		if (this.contains(event.target)) {
			this.buttonReleased();
		}
		// this.touchCaptured = false;
		this.invalidateState();
		if (this.isPressed) {
			this.x -= 5;
			this.y -= 5;
		}

		this.isPressed = false;
		// this.x = this._srcX;
		// this.y = this._srcY;
	}

	public set showRedDot(value: boolean) {
		if (this._showRedDot == value) return;
		this._showRedDot = value;
		if (this._showRedDot == true) {
			if (this._imageRed == null) {
				this._imageRed = new CustomImage();
				this._imageRed.source = RES.getRes('share_json.share_alert');
				this.addChild(this._imageRed);
				this._imageRed.top = 1;
				this._imageRed.left = 1;
			}
			return;
		}
		if (this._imageRed) {
			if (this._imageRed.parent) this._imageRed.parent.removeChild(this._imageRed);
			this._imageRed.dispose();
			this._imageRed = null;
		}
	}

	public get showRedDot(): boolean {
		return this._showRedDot;
	}

	public setRedDotPoint(top: number = 1, left: number = 1): void {
		if (this._imageRed) {
			this._imageRed.top = top;
			this._imageRed.left = left;
		}
	}

	protected childrenCreated(): void {
		super.childrenCreated();
	}

	public dispose(): void {
		CustomButton._classDic[this._type] = CustomButton._classDic[this._type] - 1;
		this.showRedDot = false;
	}
}
