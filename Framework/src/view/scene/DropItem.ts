class DropItem extends SceneElement {
	private _image: PicLoader;
	private _txtNum: CustomLabel;
	private _eff1: UIEffect;
	public dropVo: DropItemVo;
	public constructor() {
		super("DropItem");
		this.init();
	}

	private init(): void {
		this._image = new PicLoader();
		this._image.x = -15;
		this.addChild(this._image);
	}

	//设置数据
	public setData(vo: DropItemVo): void {
		this.dropVo = vo;
		// var goodsBasic: GoodsBasic = GoodsListProxy.getInstance().getBasicGood(vo.id);
		// if (goodsBasic == null) {
		// 	trace("goodsBasic == null, id = ", vo.id);
		// }
		// var url: string;
		// if (goodsBasic.quality > 2) {
		// 	url = UrlUtil.getCommonEffectURL(StringUtil.substitute("dg{0}", goodsBasic.quality));
		// 	this._eff1 = EffectManager.getInstance().showEffect(url, this._image.x + 30, this._image.y - 40, this, 40, true);
		// }
		// url = UrlUtil.getGoodsDropURL(goodsBasic.pic);
		// this._image.load(url);
		// if (this._txtNum == null) {
		// 	this._txtNum = new CustomLabel("DropTxt");
		// }
		// this._txtNum.size = 16;
		// this._txtNum.bold = true;
		// this._txtNum.addMiaoBian();
		// this._txtNum.x = Math.floor(this.getHalfW() * 2 - this._txtNum.textWidth >> 1);
		// this._txtNum.y = -30;
		// this.addChild(this._txtNum);
		// if (vo.id == WelfareType.ADD_COIN || vo.id == WelfareType.ADD_GOLD) {
		// 	this._txtNum.text = vo.num.toString();
		// }
		// else {
		// 	this._txtNum.text = goodsBasic.name;
		// 	this._txtNum.textColor = ColorUtil.getGoodColorNumber(goodsBasic.quality - 1);
		// }
		// this._txtNum.x = -this._txtNum.textWidth >> 1;
	}

	public getHalfW(): number {
		return 30;
	}

	public getHalfH(): number {
		return 30;
	}

	public dispose(): void {
		super.dispose();
		if (this.parent) {
			this.parent.removeChild(this);
		}
		if (this._image) {
			if (this.contains(this._image)) {
				this.removeChild(this._image);
			}
			this._image.dispose();
			this._image = null;
		}
		if (this._txtNum) {
			if (this.contains(this._txtNum)) {
				this.removeChild(this._txtNum);
			}
			this._txtNum.dispose();
			this._txtNum = null;
		}
		if (this._eff1) {
			this._eff1.dispose();
			this._eff1 = null;
		}
	}
}