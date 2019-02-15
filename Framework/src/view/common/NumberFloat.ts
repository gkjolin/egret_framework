class NumberFloat extends CommonSprite {
	/**增加的经验*/
	private _numAddCell: eui.BitmapLabel;
	private _numCell: eui.BitmapLabel;
	private _imageBg: CustomImage;
	private _num: number = 0;
	private _addNum: number = 0;
	private _delay: number = 0;
	private _changingNum: number;
	private _changeTimeOut: number;
	private _closeTimeOut: number;
	private startY: number = 0;

	private _posX: number = 0;
	private _posY: number = 0;
	private _isShowResult: boolean = true;

	static CLOSE: string = "CLOSE_NUMBERFLOAT";
	public constructor(bgSource: string = "share_json.share_fpowerBg", numberSource: string = "number_0_fnt", numberX: number = 100, numberY: number = 22, isShowResult: boolean = true) {
		super();
		this.touchEnabled = this.touchChildren = false;
		if (bgSource != "") {
			this._imageBg = new CustomImage();
			// this._imageBg.x = 10;
			this.addChild(this._imageBg);
			this._imageBg.source = RES.getRes(bgSource);
		}
		this._numCell = new eui.BitmapLabel();
		this._numCell.font = numberSource;
		this.addChild(this._numCell);
		this._numCell.x = numberX;
		this._numCell.y = numberY;
		this._isShowResult = isShowResult;
		// if (this._num > 0) this.showNumber(this._num);
	}
	private showNumberAdd(value: number): void {
		if (value == 0) return;
		if (this._numAddCell) {
			egret.Tween.removeTweens(this._numAddCell);
			if (this._numAddCell.parent) this._numAddCell.parent.removeChild(this._numAddCell);
			this._numAddCell = null;
		}
		if (this._numAddCell == null) {
			this._numAddCell = new eui.BitmapLabel();
			this._numAddCell.font = "number_5_fnt";
		}
		if (this._numAddCell.parent == null) {
			GameContent.gameLayers.topLayer.addChild(this._numAddCell);
			this._numAddCell.x = this.x + 133;
			this._numAddCell.y = this.y;
			this.startY = this.y;
		}
		if (value > 0) this._numAddCell.text = "+" + value.toString();
		else this._numAddCell.text = value.toString();
		egret.Tween.get(this._numAddCell).to({ y: this.startY - 35 }, 500).wait(600).call(() => {
			this.onCompleteFunction1(this._numAddCell);
		});
	}
	private onCompleteFunction1(txt: eui.BitmapLabel): void {
		if (txt)
			egret.Tween.removeTweens(txt);
		if (txt) {
			if (txt.parent) txt.parent.removeChild(txt);
			txt = null;
		}
		this.dispose();
		this.dispatchEvent(new ParamEvent(NumberFloat.CLOSE));
	}
	public dispose(): void {
		super.dispose();
		if (this._numAddCell)
			egret.Tween.removeTweens(this._numAddCell);
		if (this._imageBg) {
			if (this._imageBg.parent) this._imageBg.parent.removeChild(this._imageBg);
			this._imageBg.source = null;
			this._imageBg = null;
		}
		if (this._numAddCell) {
			if (this._numAddCell.parent) this._numAddCell.parent.removeChild(this._numAddCell);
			this._numAddCell = null;
		}
		if (this._numCell) {
			if (this._numCell.parent) this._numCell.parent.removeChild(this._numCell);
			this._numCell = null;
		}
		clearTimeout(this._changeTimeOut);
		clearTimeout(this._closeTimeOut);
	}
	private _isShowAddChar: boolean = false;
	public showNumber(value: number, addValue: number = 0, posX: number, posY: number, delay: number = 1000, isShowAddChar: boolean = false): void {
		if (value < 1) return;
		this._num = value;
		this._addNum = addValue;
		GameContent.gameLayers.topLayer.addChild(this);
		this.x = posX;
		this.y = posY;
		this._delay = delay;
		this._isShowAddChar = isShowAddChar;
		clearTimeout(this._changeTimeOut);
		clearTimeout(this._closeTimeOut);

		this._changingNum = 0;
		this._numCell.text = this._changingNum.toString();
		this._changeTimeOut = setTimeout2(() => {
			this.onNumChange();
		}, 30);
	}
	private onNumChange(): void {
		this._changingNum += Math.ceil(this._num / 10);
		var addChar: string = "+";
		if (this._isShowAddChar == false) {
			addChar = "";
		}
		if (this._changingNum < this._num) {
			this._numCell.text = addChar + this._changingNum.toString();
			this._changeTimeOut = setTimeout2(() => { this.onNumChange(); }, 30);
		} else {
			this._numCell.text = addChar + this._num.toString();
			this._closeTimeOut = setTimeout2(() => { this.onClose(); }, this._delay);
			if (this._isShowResult) {
				this.showNumberAdd(this._addNum);
			}
			// else {
			// 	this.dispose();
			// 	this.dispatchEvent(new ParamEvent(NumberFloat.CLOSE));
			// }
		}

	}

	private onClose(): void {
		if (GameContent.gameLayers.topLayer.contains(this)) {
			GameContent.gameLayers.topLayer.removeChild(this);
		}
		this.dispose();
		this.dispatchEvent(new ParamEvent(NumberFloat.CLOSE));
	}

	private showRunEffect(): void {

	}

	public hide(): void {
		if (GameContent.gameLayers.topLayer.contains(this)) {
			GameContent.gameLayers.topLayer.removeChild(this);
		}

	}
}