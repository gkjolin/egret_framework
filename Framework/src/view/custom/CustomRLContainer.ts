class CustomRLContainer extends egret.Sprite {
	private _picLeft: PicLoader;
	private _picRight: PicLoader;
	private _itemContainer: egret.Sprite;
	private _type: number = 0;
	private _currentIndex: number = 0;
	private _showNum: number = 0;
	private _itemList: Array<egret.DisplayObject>;
	private _gap: number = 0;
	private _px: number = 0;
	static PAGE_CHANGE: string = "CustomRLContainer_PAGE_CHANGE";
	public constructor(type: number = 0, gap: number = 0, px: number = -30) {
		super();
		this._type = type;
		this._gap = gap;
		this._px = px;
		this.init();
	}

	private init(): void {
		var a = this;
		a._itemContainer = new egret.Sprite();
		a.addChild(a._itemContainer);
		a._picLeft = new PicLoader();
		a._picLeft.touchEnabled = true;
		a.addChild(a._picLeft);
		a._picRight = new PicLoader();
		a._picRight.touchEnabled = true;
		a.addChild(a._picRight);
		switch (a._type) {
			case 0:
				a._picLeft.loadByJsonName("share_json.share_leftBtn");
				a._picLeft.x = this._px;
				a._picRight.loadByJsonName("share_json.share_rightBtn");
				break;
		}
		a._picRight.x = a._picLeft.x + this._gap;
		a._picLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, a.onClickLeft, a);
		a._picRight.addEventListener(egret.TouchEvent.TOUCH_TAP, a.onClickRight, a);
		a = null;
	}

	private onClickLeft(event: egret.TouchEvent): void {
		this._currentIndex--;
		if (this._currentIndex < 0) {
			this._currentIndex = 0;
		}
		this.dispatchEvent(new ParamEvent(CustomRLContainer.PAGE_CHANGE));
		this.update();
	}

	private onClickRight(event: egret.TouchEvent): void {
		this._currentIndex++;
		if (this._currentIndex > (this._itemList.length - this._showNum)) {
			this._currentIndex = this._itemList.length - this._showNum;
		}
		this.dispatchEvent(new ParamEvent(CustomRLContainer.PAGE_CHANGE));
		this.update();
	}
	public getCurrentIndex(): number {
		return this._currentIndex;
	}
	private update(): void {
		this.clearContainer();
		var index: number = this._currentIndex;
		for (var i: number = 0; i < this._showNum; i++) {
			var item: egret.DisplayObject = this._itemList[index + i];
			item.x = i * item.width;
			this._itemContainer.addChild(item);
		}
	}

	private clearContainer(): void {
		while (this._itemContainer.numChildren > 0) {
			this._itemContainer.removeChildAt(0);
		}
	}

	public setItemList(list: Array<egret.DisplayObject>, showNum: number): void {
		this._itemList = list;
		this._showNum = showNum;
		this.update();
	}

	public setBtnY(value: number): void {
		if (this._picLeft) {
			this._picLeft.y = value;
			this._picRight.y = value;
		}
	}
}