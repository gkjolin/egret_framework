class RandCircle extends BaseView {
	private container: eui.Group;
	private state: number;//0停止，1加速，2减速
	private _keep: number;
	private _total: number;
	private _url: string;
	private _tartget: number;
	private curSpeed: number;
	private itemList: Array<PicLoader>;

	private START_Y: number = 50;
	private GAP: number = 80;
	private MAX_SPEED: number = 10;
	private MIN_SPEED: number = 1;
	private ACCELERATE: number = 0.35;
	public static STOP: string = "STOP";
	public constructor(url: string, total: number, keep: number = 3, itemH: number = 100, itemY: number = 0) {
		super();
		var a = this;
		a.START_Y = itemY;
		a.GAP = itemH;
		this.container = new eui.Group();
		this.addChild(this.container);
		this._total = total;
		this._url = url;
		this._keep = keep;
		this.itemList = [];
		for (var i: number = 0; i <= this._total; i++) {
			var item: PicLoader = new PicLoader();
			item.load(rURL(url + i + ".png"));
			item.y = this.START_Y - this.GAP * i;
			this.container.addChild(item);
			this.itemList.push(item);
		}
		this.curSpeed = 0;
		this.state = 0;
		this.addEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
	}

	private onFrame(): void {
		if (this.state != 0) {
			if (this.state == 1) {
				if (this.curSpeed < this.MAX_SPEED) {
					this.curSpeed += this.ACCELERATE + this._keep;
				}
			} else if (this.state == 2) {
				if (this.START_Y > this.getTargetY() && this.START_Y - this.getTargetY() < 180) {
					this.curSpeed = this.curSpeed > this.MIN_SPEED ? (this.curSpeed - this.ACCELERATE) : this.MIN_SPEED;
				}
			}
			for (var i: number = 0; i < this.itemList.length; i++) {
				var item: PicLoader = this.itemList[i];
				item.y += this.curSpeed;
				if (item.y > 150) {
					item.y = this.getHighestOne().y - this.GAP;
				}
				if (i == this._tartget) {//减速状态
					/**低速时接近中央，在中央停下*/
					if (this.curSpeed <= this.MIN_SPEED && (this.START_Y - this.MIN_SPEED) <= Math.floor(item.y) && Math.floor(item.y) <= this.START_Y) {
						item.y = this.START_Y;
						this.state = 0;
						this.dispatchEvent(new ParamEvent(RandCircle.STOP));
					}
				}
			}
		}
	}

	/**获取位置处于最上方的子元素*/
	private getHighestOne(): PicLoader {
		var highest: PicLoader = this.itemList[0];
		for (var i: number = 0; i < this.itemList.length; i++) {
			if (this.itemList[i].y <= highest.y) {
				highest = this.itemList[i];
			}
		}
		return highest;
	}

	public play(): void {
		this.state = 1;
	}

	/**依序号为X的某元素对齐到中央*/
	public alignToTarget(index: number): void {
		this._tartget = index;
		this.state = 2;
	}

	private getTargetY(): number {
		return this.itemList[this._tartget].y;
	}

	public dispose(): void {
		super.dispose();
		this.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
		if (this.container) {
			this.container.removeChildren();
			this.container = null;
		}
	}
}