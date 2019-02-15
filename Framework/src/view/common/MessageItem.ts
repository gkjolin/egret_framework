class MessageItem extends CommonSprite {
	private _str: string;
	private _color: number;
	private _delay: number;
	private _size: number;
	private _font: string;
	private _bold: boolean;
	private _filter: number;
	public isRemove: boolean;
	public preItem: MessageItem;
	public setTimeOutId: number;
	private _si: number;
	public speed: number = 5;
	public targetY: number = 41;

	private _index: number = 1;

	private _bg: CustomImage;

	private txt: CustomLabel;
	public constructor() {
		super();
		this._bg = new CustomImage();
		this._bg.source = RES.getRes("share_json.share_messageItem");
		this._bg.scale9Grid = new egret.Rectangle(12, 10, 160, 12);
		this.addChild(this._bg);
		this.touchEnabled = this.touchChildren = false;
		// this.setIndex(1);
	}
	public init(str: string, color: number, delay: number, size: number = 20, font: string = "Microsoft YaHei", bold: boolean = false, filter: number = 0x000000): void {
		this._str = str;
		this._color = color;
		this._delay = delay;
		this._size = size;
		this._font = font;
		this._bold = bold;
		this._filter = filter;
		this.configUI();
	}
	private configUI(): void {
		this.txt = new CustomLabel();
		this.txt.fontFamily = this._font;
		this.txt.size = this._size;
		this.txt.bold = this._bold;
		this.txt.horizontalCenter = 0;
		this.txt.verticalCenter = 0;
		this.txt.wordWrap = false;
		this.txt.htmlText = this._str;
		this.addChild(this.txt);

		this._bg.width = this.txt.textWidth + 50;
		this._bg.height = this.txt.textHeight + 20;
		this.setTxtCenter();
	}
	public setTxtCenter(): void {
		this.txt.x = this._bg.width - this.txt.textWidth >> 1;
		this.txt.y = this._bg.height - this.txt.height >> 1;
	}
	public getMyWidth(): number {
		return this._bg.width;
	}
	public getMyHeight(): number {
		return this._bg.height;
	}
	public setBgHeight(value: number): void {
		this._bg.height = value;
	}
	public setBgWidth(value: number): void {
		this._bg.width = value;
	}
	public setIndex(value: number): void {
		this._index = value;
		this.targetY = this._index * Message.GAP;
		// if(this.targetY > 300)this.targetY = 300;
		// trace(this.targetY)
	}
	public getIndex(value: number): number {
		return this._index;
	}
	public destroy(): void {
		if (this.txt != null) {
			this.txt.filters = null;
		}
		while (this.numChildren > 0) {
			this.removeChildAt(0);
		}
	}

	public remove(): void {
		this.isRemove = true;
		this._si = setTimeout2(() => { this.removeComplete(); }, 1000);
	}
	public removeComplete(): void {
		clearTimeout(this._si);
		if (this.parent != null) {
			this.parent.removeChild(this);
		}
	}
}