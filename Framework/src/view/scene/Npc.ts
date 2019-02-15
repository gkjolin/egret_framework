class Npc extends SceneElement {
	public npcVo: SceneNpcVO;
	public isUsing: boolean = false;

	private nameLayer: CommonSprite;
	private titleLayer: CommonSprite;
	private bodyLayer: CommonSprite;			// * 身体层
	private shadowLayer: CommonSprite;		// * 阴影层
	private _nameTxt: CustomTextField;
	private _nameWidth: number = 0;
	private _shadowPic: Bitmap;

	private _bodyMovieClip: BitmapMovieClip;
	private _bodyURL: string;
	private _sceneCommonURL: string;

	private _iconFun: PicLoader;
	public constructor(npcVO: SceneNpcVO) {
		super();
		this.npcVo = npcVO;
		this.init();
	}
	private init(): void {
		var a = this;
		a.shadowLayer = new CommonSprite();
		a.addChild(a.shadowLayer);
		a.bodyLayer = new CommonSprite();
		a.addChild(a.bodyLayer);
		a.nameLayer = new CommonSprite();
		a.addChild(a.nameLayer);
		a.titleLayer = new CommonSprite();
		a.titleLayer.touchChildren = false;
		a.titleLayer.touchEnabled = false;
		a.addChild(a.titleLayer);

		a.bodyLayer.touchChildren = false;
		a.bodyLayer.touchEnabled = false;

		a.nameLayer.touchChildren = false;
		a.nameLayer.touchEnabled = false;

		//添加名字
		if (a._nameTxt == null) {
			a._nameTxt = new CustomTextField("LiveThing_name");
		}
		a._nameTxt.size = 18;
		a._nameTxt.bold = true;
		a._nameTxt.addMiaoBian();
		a._nameTxt.cacheAsBitmap = true;
		a._nameTxt.textAlign = "center";
		a._nameTxt.text = a.npcVo.name;
		a.nameLayer.addChild(a._nameTxt);

		a._iconFun = new PicLoader();
		a._iconFun.touchEnabled = false;
		a._iconFun.load(UrlUtil.getNpcFunIconURL(a.npcVo.icon));
		a.titleLayer.addChild(a._iconFun);

		var a = this;
		if (a._bodyMovieClip == null) {
			a._bodyMovieClip = new BitmapMovieClip("Npc_body");
		}
		a.bodyLayer.addChild(a._bodyMovieClip);
		a.addEvent();

		a.isUsing = true;

		a.updateCloth();
		a.initshadow();

	}
	private initshadow(): void {
		this._sceneCommonURL = UrlUtil.getCommonSceneURL();
		if (SourceCache.getInstance().has(this._sceneCommonURL)) {
			var sp = SourceCache.getInstance().getSP(this._sceneCommonURL);
			if (sp) {
				this.addShadow(sp);
			}
		}
		else {
			SourceCache.getInstance().addEventListener(SourceCache.LOAD_TEXTURE_COMPLETE, this.loadCompleteHandler, this);
			if (SourceCache.getInstance().isLoading(this._sceneCommonURL) == false) {
				SourceCache.getInstance().load(this._sceneCommonURL, ResourceType.TEXTURE);
			}
		}
	}
	private loadCompleteHandler(e: ParamEvent): void {
		if (e.data.url == this._sceneCommonURL) {
			SourceCache.getInstance().removeEventListener(SourceCache.LOAD_TEXTURE_COMPLETE, this.loadCompleteHandler, this);
			var sp: CustomSpriteSheet = e.data.texture;
			this.addShadow(sp);
		}
	}
	private addShadow(sp: CustomSpriteSheet): void {
		if (!this._shadowPic) {
			var texture: egret.Texture = sp.getTexture("shadow");
			this._shadowPic = new Bitmap(texture);
			this._shadowPic.x = - this._shadowPic.width >> 1;
			this._shadowPic.y = - this._shadowPic.height >> 1;
		}
		this.shadowLayer.addChild(this._shadowPic);
	}
	private layout(): void {
		var a = this;
		a._nameWidth = a._nameTxt.textWidth;
		a.nameLayer.x = -a._nameWidth >> 1;
		if(a.npcVo.name == null || a.npcVo.name == ""){
			a.nameLayer.y = -a.getBodyHeight() + 120;
		}else{
			a.nameLayer.y = -a.getBodyHeight() - 30;
		}
		// a.nameLayer.y = -a.getBodyHeight() - 30;
		a.titleLayer.x = -a._iconFun.width >> 1;
		a.titleLayer.y = a.nameLayer.y - 30;
	}
	private _bodyHeight: number = 0;
	public getBodyHeight(): number {
		if (this._bodyMovieClip == null) return 0;
		var bodyFrame: BitmapFrame = this._bodyMovieClip.getBitmapFrame();
		if (bodyFrame == null) {
			return 0;
		}
		this._bodyHeight = bodyFrame.height;
		return this._bodyHeight;
		// return -this._bodyMovieClip.bitmap.y;
	}
	private addEvent(): void {
		SourceCache.getInstance().addEventListener(SourceCache.LOAD_ANIMATION_COMPLETE, this.loadResComplete, this);
		SourceCache.getInstance().addEventListener(SourceCache.LOAD_PIC_COMPLETE, this.loadTitleComplete, this);
	}
	private loadResComplete(event: ParamEvent): void {
		let url: string = event.data.url;
		let mc: MovieClipData = event.data.mc;
		var a = this;
		if (url == a._bodyURL) {
			a._bodyMovieClip.setMovieClipData(mc);
			a.stand();
			a.layout();
		}
	}
	private loadTitleComplete(event: ParamEvent): void {
		var a = this;
		let url: string = event.data.url;
		if (UrlUtil.getNpcFunIconURL(a.npcVo.icon) == url) {
			a.layout();
		}
	}
	private updateCloth(isRedraw: boolean = true): void {
		var a = this;
		var url: string = a.npcVo.getBodyURL();
		if (url == null) {
			if (this._bodyMovieClip && this._bodyMovieClip.parent != null) {
				this._bodyMovieClip.parent.removeChild(this._bodyMovieClip);
			}
			this._bodyURL = null;
			return;
		}
		if (url == this._bodyURL) return;
		if (this._bodyMovieClip && this._bodyMovieClip.parent == null) {
			this.bodyLayer.addChildAt(this._bodyMovieClip, 0);
		}
		a._bodyURL = url;
		a.stand();
		if (SourceCache.getInstance().has(this._bodyURL)) {
			this._bodyMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(this._bodyURL));
			if (isRedraw) {
				a.stand();
				a.layout();
			}
		}
		else {
			if (SourceCache.getInstance().isLoading(this._bodyURL) == false) {
				SourceCache.getInstance().load(this._bodyURL, ResourceType.ANIMATION);
			}
		}
	}
	private stand(): void {
		var a = this;
		if (a._bodyMovieClip == null) return;

		var startFrame: number = 1;
		var endFrame: number = NpcFrame["STAND"];
		a._bodyMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);


	}
	//是否碰撞
	private _localPoint: Point;
	public isHit(point: Point): boolean {
		var a = this;
		if (!a.visible || parent == null)
			return false;
		if (a._localPoint == null) {
			a._localPoint = new Point();
		}
		a._localPoint.x = point.x - a.x;
		a._localPoint.y = point.y - a.y;
		if (a._bodyMovieClip.getCurrentBitmapFrame() != null) {
			a._localPoint.x = a._localPoint.x - a._bodyMovieClip.getCurrentBitmapFrame().getBitmapData().$offsetX;
			a._localPoint.y = a._localPoint.y - a._bodyMovieClip.getCurrentBitmapFrame().getBitmapData().$offsetY;
		}
		if (a._bodyMovieClip != null && a._bodyMovieClip.isHit(a._localPoint)) {
			return true;
		}
		// if (point.x > this.x && point.x < a.x + a.width && point.y > a.y && point.y < a.y + a.height) {
		// 	return true;
		// }
		return false;
	}
	public dispose(): void {
		super.dispose();
		var a = this;
		SourceCache.getInstance().removeEventListener(SourceCache.LOAD_ANIMATION_COMPLETE, a.loadResComplete, a);
		SourceCache.getInstance().removeEventListener(SourceCache.LOAD_PIC_COMPLETE, a.loadTitleComplete, this);

		if (a._bodyMovieClip) {
			if (a._bodyMovieClip.parent) {
				a._bodyMovieClip.parent.removeChild(a._bodyMovieClip);
			}
		}
		if (a._iconFun) {
			a._iconFun.dispose();
			a._iconFun = null;
		}
		if (a._nameTxt) {
			if (a._nameTxt.parent) a._nameTxt.parent.removeChild(a._nameTxt);
			a._nameTxt = null;
		}


		if (a.shadowLayer && a.shadowLayer.parent) {
			a.shadowLayer.parent.removeChild(a.shadowLayer);
		}
		a.shadowLayer = null;
		if (a.nameLayer && a.nameLayer.parent) {
			a.nameLayer.parent.removeChild(a.nameLayer);
		}
		a.nameLayer = null;
		if (a.bodyLayer && a.bodyLayer.parent) {
			a.bodyLayer.parent.removeChild(a.bodyLayer);
		}
		a.bodyLayer = null;
		if (a.titleLayer && a.titleLayer.parent) {
			a.titleLayer.parent.removeChild(a.titleLayer);
		}
		a.titleLayer = null;
	}
}