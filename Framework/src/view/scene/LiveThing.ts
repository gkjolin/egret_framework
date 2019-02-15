class LiveThing extends SceneElement {
	protected chatLayer: CommonSprite;			// * 聊天层
	protected buffStateLayer: CommonSprite;		// * 状态层
	protected titleLayer: CommonSprite;			// * 称号
	protected nameLayer: CommonSprite;			// * 名字层
	protected hpLayer: CommonSprite;			// * 血条层
	protected bodyLayer: CommonSprite;			// * 身体层
	protected shadowLayer: CommonSprite;		// * 阴影层
	// protected effectUpLayer: CommonSprite;		// * 效果上层
	// protected effectDownLayer: CommonSprite;	// * 效果下层
	// protected faceLayer: CommonSprite;
	protected speed: number = 200;	//速度（像素/秒）
	protected canLayout: boolean = false;
	protected canUpdateAction: boolean = false;
	protected _bodyMovieClip: BitmapMovieClip;
	protected _bodyURL: string;
	protected _wingMovieClip: BitmapMovieClip
	protected _wingURL: string;
	protected _weaponMovieClip: BitmapMovieClip;
	protected _weaponURL: string;
	protected _ringMovieClip: BitmapMovieClip;
	protected _ringURL: string;
	protected _moveBackSi: number;
	protected _onFighting: boolean;
	protected nowTime: number;
	protected timelen: number;
	protected _angle: number;		//移动的角度
	protected _endPoint: Point;		//移动的目的点
	protected _stepX: number = 0;		//每次移动的偏移量x
	protected _stepY: number = 0;		//每次移动的偏移量y
	protected _moveTime: number = 0;		//移动次数
	protected _run: number = 0;
	protected _nameTxt: CustomTextField;
	protected _hpTxt: CustomTextField;
	protected _hp: BloodBar;
	protected _sceneCommonURL: string;
	protected _shadowPic: Bitmap;
	protected _hasPutShadow: boolean = false;
	protected _titleEffect: UIEffect;

	private _oldTime: number;
	private _tmpx: number;
	private _tmpy: number;
	private _onFightingSi: number;
	private _buffStateDic: Object;
	public attackObj: Object;
	public backAngle: number = 0;
	public belongTo: string = "";//正在被谁打
	public isInZSCZ: boolean = false;//是否正处于战神冲撞中
	public isYun: boolean = false;//是否被麻痹或者眩晕
	public isUsing: boolean = false;//是否正在使用中
	public isPicking: boolean = false;//是否正在捡掉落
	public constructor(type: string = "LiveThing") {
		super(type);
		this.init();
	}

	protected init(): void {
		this.configMC();
		this._angle = 0;
		this._stepX = 0;
		this._stepY = 0;
		this._moveTime = 0;
		this._endPoint = null;
		this._oldTime = getTimer();
		this.initshadow();
	}

	public setSpeed(speed: number): void {
		if (this.speed != speed) {
			this.speed = speed;
		}
	}
	public getSpeed(): number {
		return this.speed;
	}

	public redraw(): void {
		this.canUpdateAction = true;
		this.canLayout = true;
	}

	public getDirState(): DirState {
		return null;
	}

	public getPoseState(): PoseState {
		return null;
	}

	//配置层次
	protected configMC(): void {
		var a = this;
		a.shadowLayer = new CommonSprite();
		a.addChild(a.shadowLayer);
		a.bodyLayer = new CommonSprite();
		a.addChild(a.bodyLayer);
		a.hpLayer = new CommonSprite();
		a.addChild(a.hpLayer);
		a.nameLayer = new CommonSprite();
		a.addChild(a.nameLayer);
		a.titleLayer = new CommonSprite();
		a.titleLayer.touchChildren = false;
		a.titleLayer.touchEnabled = false;
		a.addChild(a.titleLayer);
		//添加名字
		if (a._nameTxt == null) {
			a._nameTxt = new CustomTextField("LiveThing_name");
		}
		a._nameTxt.size = 18;
		a._nameTxt.bold = true;
		a._nameTxt.addMiaoBian();
		a._nameTxt.cacheAsBitmap = true;
		a._nameTxt.textAlign = "center";
		a.nameLayer.addChild(a._nameTxt);
		a._hpTxt = new CustomTextField("LiveThing_hpTxt");
		a._hpTxt.size = 18;
		a._hpTxt.y = -20;
		a._hpTxt.bold = true;
		a._hpTxt.addMiaoBian();
		a.hpLayer.addChild(a._hpTxt);
	}

	protected updateAction(): void {

	}

	//战神冲撞，不会有位移的，有位移的直接用movePath就好了
	public playZhanShenChongZhuang(): void {

	}

	//设置默认状态
	protected setDefaultState(): void {
		let poseState: PoseState = this.getPoseState();
		let dirState = this.getDirState();
		if (poseState == null || dirState == null) return;
		dirState.revert();
		poseState.revert();
		poseState.addEventListener(PoseState.CHANGE, this.changePoseHandler, this);
		dirState.addEventListener(DirState.CHANGE, this.changeDirHandler, this);
		poseState.setState(PoseState.STAND);
		dirState.setState(2);
	}

	//改变姿势
	protected changePoseHandler(e: egret.Event): void {
		this.redraw();
	}

	//改变方向
	protected changeDirHandler(e: egret.Event): void {
		this.redraw();
	}

	
	protected initshadow(): void {
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

	private addShadow(sp: CustomSpriteSheet): void {
		if (!this._shadowPic) {
			var texture: egret.Texture = sp.getTexture("shadow");
			this._shadowPic = new Bitmap(texture);
			this._shadowPic.x = - this._shadowPic.width >> 1;
			this._shadowPic.y = - this._shadowPic.height >> 1;
		}
		this.shadowLayer.addChild(this._shadowPic);
	}

	private loadCompleteHandler(e: ParamEvent): void {
		if (e.data.url == this._sceneCommonURL) {
			SourceCache.getInstance().removeEventListener(SourceCache.LOAD_TEXTURE_COMPLETE, this.loadCompleteHandler, this);
			var sp: CustomSpriteSheet = e.data.texture;
			this.addShadow(sp);
		}
	}

	public reLayout(): void {
		this.canLayout = true;
	}

	protected removeAllTimer(): void {
		clearTimeout(this._moveBackSi);
		clearTimeout(this._onFightingSi);
	}

	protected updatePosition(): void {
		this.x = Math.ceil(this._tmpx + 0.5 >> 0);
		this.y = Math.ceil(this._tmpy + 0.5 >> 0);
	}

	public nextPosition(): void {
		this.getDirState().stepState();
		this.nowTime = getTimer();
		this.timelen = this.nowTime - this._oldTime;
		this._oldTime = this.nowTime;
		if (this.stage != null) {
			if (this.canUpdateAction == true) {
				this.updateAction();
				this.canUpdateAction = false;
			}
			if (this.canLayout == true) {
				this.layout();
				this.canLayout = false;
			}
		}
		//主角在捡东西的时候要特殊点
		if (this._moveTime <= 10 && !this.isPicking) {
			return;
		}
		if (this.getPoseState() == null) {
			return;
		}
		if (this.getPoseState().getLockMove()) {
			return;
		}
		this._moveTime -= this.timelen;
		if (this._moveTime <= 10) {
			if (this._endPoint) {
				this.x = Math.ceil(this._endPoint.x);
				this.y = Math.ceil(this._endPoint.y);
			}
			this.moveComplete();
		}
		else {
			this._tmpx = (this._tmpx + this._stepX * this.timelen);
			this._tmpy = (this._tmpy + this._stepY * this.timelen);
			this.updatePosition();
		}
	}

	//移动
	public move(point: Point): void {
		var a = this;
		let poseState: PoseState = a.getPoseState();
		if (poseState == null || point == null) {
			return;
		}
		var state: number = poseState.getState();
		if (state == PoseState.DEAD || state == PoseState.MOVEBACK) {
			return;
		}
		a._endPoint = point;
		let dis: number = Point.distance(new Point(a.x, a.y), point);
		let n: number = Math.ceil(dis / (a.speed / 1000));
		let stepLen: number = dis / n;
		a._stepX = stepLen * (point.x - a.x) / dis;
		a._stepY = stepLen * (point.y - a.y) / dis;
		a._moveTime = n;
		//不是主角在捡掉落的话
		if (a._moveTime <= 10 && !a.isPicking) {
			a.moveComplete();
			return;
		}
		a._tmpx = a.x;
		a._tmpy = a.y;
		if (poseState.getState() == PoseState.STAND) {
			a._oldTime = getTimer();
		}
		poseState.setState(PoseState.MOVE);
		if (poseState.getState() == PoseState.MOVE) {
			let tmpdir: number = MapUtil.judgeDir(a.x, a.y, point.x, point.y);
			a.getDirState().setState(tmpdir);
		}
		else {
			a._moveTime = 0;
		}
	}

	public moveBack(point: Point, sp: number = 900): void {
		var poseState: PoseState = this.getPoseState();
		if (poseState == null || poseState.getState() == PoseState.DEAD) {
			return;
		}
		if (this._bodyMovieClip == null) {
			return;
		}
		this._angle = Math.atan2(point.y - this.y, point.x - this.x);
		this._endPoint = point;
		var dis: number = Point.distance(new Point(this.x, this.y), point);
		var n: number = Math.round(dis / (sp / 1000));
		var stepLen: number = dis / n;
		this._stepX = stepLen * Math.cos(this._angle);
		this._stepY = stepLen * Math.sin(this._angle);
		this._moveTime = n;
		if (this._moveTime <= 10) {
			this.moveComplete();
			return;
		}
		this._tmpx = this.x;
		this._tmpy = this.y;
		poseState.setState(PoseState.MOVEBACK);
	}

	//面向某点 	
	public dirToPoint(point: Point): void {
		let dirState: DirState = this.getDirState();
		if (dirState == null) return;
		var tmpdir: number = MapUtil.judgeDir(this.x, this.y, point.x, point.y);
		dirState.setState(tmpdir);
	}

	//走完了
	protected moveComplete(): void {
		this._moveTime = 0;
		this._endPoint = null;
		let poseState: PoseState = this.getPoseState();
		if (poseState.getState() == PoseState.MOVEBACK) {
			clearTimeout(this._moveBackSi);
			this._moveBackSi = setTimeout2(() => { this.moveBackComplete() }, 150);
		}
	}

	private moveBackComplete(): void {
		clearTimeout(this._moveBackSi);
		this.getPoseState().setState(PoseState.STAND);
		this.dispatchEvent(new ParamEvent(EventName.MONSTERMOVEBACK));
	}

	protected layout(): void {
		if (this._type.indexOf("Player") >= 0) {
			this.hpLayer.y = -Math.ceil(this.getBodyHeight() + 30);
		}
		else {
			this.hpLayer.y = -Math.ceil(this.getBodyHeight());
		}
		this._hpTxt.x = -this._hpTxt.textWidth >> 1;
		this._hp.x = -Math.ceil(this._hp.width >> 1);
	}

	public stop(): void {
		this.moveComplete();
	}

	//得到整个身体的高
	public getBodyHeight(): number {
		return 0;
	}

	public getBodyWidth(): number {
		return 0;
	}

	public getBodyPoint(): Point {
		return new Point();
	}

	public getAttackType(): number {
		return 0;
	}

	public toAttack(skillId: number = 0, targetPoint: Point = null, targetObj: LiveThing = null): void { }

	public toHited(): void { }

	public toDead(): void { }

	public setHp(value: number): void { }

	public getHp(): number {
		return 0;
	}

	public setFighting(time: number = 10000): void {
		this._onFighting = true;
		clearTimeout(this._onFightingSi);
		this._onFightingSi = setTimeout2(this.cancelFighting, time);
	}

	private cancelFighting(): void {
		clearTimeout(this._onFightingSi);
		this._onFighting = false;
	}

	public getOnFighting(): boolean {
		return this._onFighting;
	}

	private getBuffStateDic(): Object {
		if (this._buffStateDic == null) {
			this._buffStateDic = new Object();
		}
		return this._buffStateDic;
	}

	public GetIsRole(): boolean {
		return false;
	}

	//完全销毁
	public dispose(): void {
		super.dispose();
		var a = this;
		a.isPicking = false;
		a.removeSpeak();
		a._moveTime = 0;
		a.removeAllTimer();
		a.removeTitle();
		a.setSelect(false);
		if (a.parent != null) {
			a.parent.removeChild(a);
		}
		SourceCache.getInstance().removeEventListener(SourceCache.LOAD_ANIMATION_COMPLETE, a.loadCompleteHandler, a);
		SourceCache.getInstance().removeEventListener(SourceCache.LOAD_TEXTURE_COMPLETE, a.loadCompleteHandler, a);
		if (a.getPoseState() != null) {
			a.getPoseState().removeEventListener(PoseState.CHANGE, a.changePoseHandler, a);
		}
		if (a.getDirState() != null) {
			a.getDirState().removeEventListener(DirState.CHANGE, a.changeDirHandler, a);
		}
		if (a._bodyMovieClip) {
			if (a._bodyMovieClip.parent) {
				a._bodyMovieClip.parent.removeChild(a._bodyMovieClip);
			}
			a._bodyMovieClip.dispose();
			a._bodyMovieClip = null;
		}
		if (a._weaponMovieClip) {
			if (a._weaponMovieClip.parent) {
				a._weaponMovieClip.parent.removeChild(a._weaponMovieClip);
			}
			a._weaponMovieClip.dispose();
			a._weaponMovieClip = null;
		}
		if (a._wingMovieClip) {
			if (a._wingMovieClip.parent) {
				a._wingMovieClip.parent.removeChild(a._wingMovieClip);
			}
			a._wingMovieClip.dispose();
			a._wingMovieClip = null;
		}
		if (a._ringMovieClip) {
			if (a._ringMovieClip.parent) {
				a._ringMovieClip.parent.removeChild(a._ringMovieClip);
			}
			a._ringMovieClip.dispose();
			a._ringMovieClip = null;
		}
		if (a.hpLayer && a.hpLayer.parent) {
			a.hpLayer.parent.removeChild(a.hpLayer);
		}
		if (a.nameLayer && a.nameLayer.parent) {
			a.nameLayer.parent.removeChild(a.nameLayer);
		}
		if (a._hp) {
			a._hp.dispose();
			a._hp = null;
		}
		if (a._nameTxt) {
			a._nameTxt.dispose();
			a._nameTxt = null;
		}
		a = null;
	}

	//移除所有事件监听，停掉所有帧动画
	public clear(): void {
		var a = this;
		a.isPicking = false;
		a.isUsing = false;
		a.removeSpeak();
		a._moveTime = 0;
		a.removeAllTimer();
		a.removeTitle();
		if (a.parent != null) {
			a.parent.removeChild(a);
		}
		SourceCache.getInstance().removeEventListener(SourceCache.LOAD_ANIMATION_COMPLETE, a.loadCompleteHandler, a);
		SourceCache.getInstance().removeEventListener(SourceCache.LOAD_TEXTURE_COMPLETE, a.loadCompleteHandler, a);
		if (a.getPoseState() != null) {
			a.getPoseState().removeEventListener(PoseState.CHANGE, a.changePoseHandler, a);
		}
		if (a.getDirState() != null) {
			a.getDirState().removeEventListener(DirState.CHANGE, a.changeDirHandler, a);
		}
		if (a._bodyMovieClip) {
			if (a._bodyMovieClip.parent) {
				a._bodyMovieClip.parent.removeChild(a._bodyMovieClip);
			}
		}
		if (a._weaponMovieClip) {
			if (a._weaponMovieClip.parent) {
				a._weaponMovieClip.parent.removeChild(a._weaponMovieClip);
			}
		}
		if (a._wingMovieClip) {
			if (a._wingMovieClip.parent) {
				a._wingMovieClip.parent.removeChild(a._wingMovieClip);
			}
		}
		if (a._ringMovieClip) {
			if (a._ringMovieClip.parent) {
				a._ringMovieClip.parent.removeChild(a._ringMovieClip);
			}
		}
		if (a._hp) {
			a._hp.clear();
		}
		a = null;
	}

	public movePath(path: Array<Point>): void {

	}

	public getVo(): any {
		return null;
	}

	public playSkillEffect(url: string, px: number, py: number, delay: number, isLoop: boolean): void {

	}

	public getPropertyVo(): PropertyVO {
		return null;
	}

	public setZSCZEff(eff: UIEffect): void {

	}

	public getBelongID(): string {
		return "";
	}

	protected _speakContainer: CommonSprite;
	protected _txt: CustomTextField;
	protected _speakSi: number = 0;
	public speak(str: string, time: number): void {
		if (this._speakContainer == null) {
			this._speakContainer = new CommonSprite("livingSpeak");
			this._speakContainer.y = -180;
			this._speakContainer.x = -100;
			var image: CustomImage = new CustomImage();
			image.source = "share_json.share_guildAlertBg";
			this._speakContainer.addChild(image);
			this._txt = new CustomTextField();
			this._txt.width = 178;
			this._txt.height = 50;
			this._txt.wordWrap = true;
			this._txt.multiline = true;
			this._txt.x = 6;
			this._txt.y = 4;
			this._txt.addMiaoBian();
			this._speakContainer.addChild(this._txt);
		}
		this._txt.text = str;
		this.addChild(this._speakContainer);
		if (this._speakSi > 0) {
			clearTimeout(this._speakSi);
		}
		this._speakSi = setTimeout2(() => { this.removeSpeak(); }, time * 1000);
	}

	public removeSpeak(): void {
		if (this._speakContainer && this._speakContainer.parent) {
			this._speakContainer.parent.removeChild(this._speakContainer);
		}
		if (this._speakSi > 0) {
			clearTimeout(this._speakSi);
		}
	}

	public addTitle(title: number): void {
		this.removeTitle();
		if (title > 0) {
			var url: string = UrlUtil.getTitleURL(title);
			this._titleEffect = EffectManager.getInstance().showEffect(url, 0, 0, this.titleLayer, 60, true);
		}
	}

	public removeTitle(): void {
		if (this._titleEffect) {
			this._titleEffect.dispose();
			this._titleEffect = null;
		}
	}

	public showBuff(id: number): void {
		var buffVo: BuffVo = null;
		if (id == BuffVo.HUSHEN) {
			buffVo = new BuffVo();
			buffVo.id = BuffVo.HUSHEN;
			buffVo.showID = buffVo.id;
		}
		else {
			buffVo = SkillModel.getInstance().getBUffVo(id);
		}
		if (buffVo == null) {
			return;
		}
		var url = UrlUtil.getBuffIcon(buffVo.showID);
		var pic = new PicLoader();
		pic.load(url);
		var h = this.getBodyHeight();
		pic.x = -Math.ceil(this.getBodyWidth() / 2);
		pic.y = -Math.ceil(h * 0.75);
		this.addChild(pic);
		var tween = egret.Tween.get(pic);
		tween.to({ y: -h - 20 }, 1500);
		tween.call(this.showBuffEnd, this, [pic]);
	}

	protected showBuffEnd(pic: PicLoader): void {
		if (pic) {
			egret.Tween.removeTweens(pic);
			pic.dispose();
			pic = null;
		}
	}
}