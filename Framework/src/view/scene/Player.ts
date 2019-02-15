class Player extends LiveThing {
	public playerVo: PlayerBaseVO;
	public dis: number = 0;

	private _walkTimes: number = 0;

	private _nameWidth: number = 0;
	private _canUpdateName: boolean = true;//是否要更新名字
	private _clothLoading: boolean = false;
	public constructor(type: string = "Player") {
		super(type);
	}

	protected init(): void {
		super.init();
	}

	public setPlayerVo(vo: PlayerBaseVO): void {
		var a = this;
		a.isUsing = true;
		a.isPicking = false;
		a.playerVo = vo;
		a.playerVo.poseState.ownerID = vo.uid;
		a.initNameTxt();
		a.initBitmapMovieClip();
		a.setDefaultState();
		a.setSpeed(a.playerVo.getSpeed());
		a.changeHPHandler(null);
		a.addEvent();
		if (a._hp == null) {
			a._hp = new BloodBar(1, "LiveThing_blood");
		}
		a._hp.configUI();
		a.hpLayer.addChild(a._hp);
		a.addTitle(vo.getAppVo().title);
		a.updateName(a.playerVo.getBangID() > 0);
		a.playerVo.addEventListener(LiveThingVo.CHANGEHP, a.changeHPHandler, a);
		a.playerVo.addEventListener(LiveThingVo.CHANGEMAXHP, a.changeHPHandler, a);
		if (a.playerVo.isRole) {
			a.playerVo.addEventListener(LiveThingVo.CHANGEMP, a.changeMPHandler, a);
			a.playerVo.addEventListener(LiveThingVo.CHANGEMAXMP, a.changeMPHandler, a);
		}
		a.playerVo.addEventListener(PlayerBaseVO.CHANGE_CLOTH, a.changeClothHandle, a);
		a.playerVo.addEventListener(PlayerBaseVO.CHANGE_WEAPON, a.changeWeaponHandle, a);
		a.playerVo.addEventListener(PlayerBaseVO.CHANGE_WING, a.changeWingHandle, a);
		a.playerVo.addEventListener(PlayerBaseVO.CHANGE_GONGHUI, a.guildChange, a);
		GameDispatcher.getInstance().addEventListener(EventName.CHANGE_TITLE, a.changeTitleHandler, a);
		GameDispatcher.getInstance().addEventListener(EventName.CHANGE_RING, a.changeRingHandler, a);
		a.halfMask = false;
		a.redraw();
	}

	private initBitmapMovieClip(): void {
		var a = this;
		if (a._wingMovieClip == null) {
			a._wingMovieClip = new BitmapMovieClip("Player_wing");
		}
		a.bodyLayer.addChild(a._wingMovieClip);
		if (a._bodyMovieClip == null) {
			a._bodyMovieClip = new BitmapMovieClip("Player_body");
		}
		a.bodyLayer.addChild(a._bodyMovieClip);
		if (a._weaponMovieClip == null) {
			a._weaponMovieClip = new BitmapMovieClip("Player_weapon");
		}
		a.bodyLayer.addChild(a._weaponMovieClip);
		if (a._ringMovieClip == null) {
			a._ringMovieClip = new BitmapMovieClip("Player_ring");
		}
		a.bodyLayer.addChildAt(a._ringMovieClip, 0);
		if (!a.playerVo.isRealFigure && !RoleModel.getInstance().isMyPartner(a.playerVo.uid)) {
			a._wingMovieClip.visible = false;
			a._bodyMovieClip.visible = false;
			a._weaponMovieClip.visible = false;
			a._ringMovieClip.visible = false;
		}
		else {
			a._wingMovieClip.visible = true;
			a._bodyMovieClip.visible = true;
			a._weaponMovieClip.visible = true;
			a._ringMovieClip.visible = true;
		}
	}

	//获取玩家id
	public getId(): string {
		if (this.playerVo) {
			return this.playerVo.uid;
		}
		return "";
	}

	private addEvent(): void {
		SourceCache.getInstance().addEventListener(SourceCache.LOAD_ANIMATION_COMPLETE, this.loadResComplete, this);
	}

	protected updateAction(): void {
		super.updateAction();
		var a = this;
		let poseState: PoseState = a.getPoseState();
		if (poseState == null) {
			return;
		}
		a.updateCloth(false);
		a.updateWing(false);
		a.changeWeapon(false);
		a.changeRing(false);
		var state: number = poseState.getState();
		if (state == PoseState.MOVE) {
			a.playMoveAction();
		}
		else if (state == PoseState.STAND) {
			if (a._clothLoading == false) {
				if (a.isPicking) {
					a.playMoveAction();
				}
				else {
					a.playStandAction();
				}
			}
		}
		else if (state == PoseState.ATTACK) {
			a.playAttackAction();
		}
		a.setScale(a.getDirState().getScale());
		a.bodyLayer.addChildAt(a._bodyMovieClip, 0);
		a.bodyLayer.addChildAt(a._weaponMovieClip, 1);
		if (a._hasWing) {
			a.bodyLayer.addChildAt(a._wingMovieClip, 2);
		}
		var dirstate: number = a.getDirState().getState();
		if (dirstate < 4) {
			if (a.bodyLayer.contains(a._wingMovieClip)) {
				a.bodyLayer.swapChildren(a._bodyMovieClip, a._wingMovieClip);
				a.bodyLayer.swapChildren(a._bodyMovieClip, a._weaponMovieClip);
			}
		}
		a.bodyLayer.setChildIndex(a._ringMovieClip, 0);
	}

	private updateCloth(isRedraw: boolean = true): void {
		var url: string = this.playerVo.getBodyURL(this.isPicking);
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
		this._bodyURL = url;
		this.redraw();
		if (SourceCache.getInstance().has(this._bodyURL)) {
			this._bodyMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(this._bodyURL));
			this._clothLoading = false;
			if (isRedraw) {
				this.redraw();
			}
		}
		else {
			this._clothLoading = true;
			if (SourceCache.getInstance().isLoading(this._bodyURL) == false) {
				if (this.playerVo.isRole == true) {
					//如果是主角，优先加载
					SourceCache.getInstance().load(this._bodyURL, ResourceType.ANIMATION, true);
				}
				else {
					SourceCache.getInstance().load(this._bodyURL, ResourceType.ANIMATION);
				}
			}
		}
	}

	private _hasWing: boolean;
	public updateWing(isRedraw: boolean = true): void {
		var url: string = this.playerVo.getWingURL(this.isPicking);
		if (url == null) {
			if (this._wingMovieClip && this._wingMovieClip.parent) {
				this._wingMovieClip.parent.removeChild(this._wingMovieClip);
			}
			this._wingMovieClip.dispose();
			this._wingURL = null;
			this._hasWing = false;
			return;
		}
		if (url == this._wingURL) return;
		this._wingURL = url;
		if (this._wingMovieClip == null) {
			this._wingMovieClip = new BitmapMovieClip();
		}
		this.bodyLayer.addChild(this._wingMovieClip);
		this._hasWing = true;
		if (SourceCache.getInstance().has(this._wingURL)) {
			this._wingMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(this._wingURL));
			if (isRedraw) {
				this.redraw();
			}
		}
		else {
			if (SourceCache.getInstance().isLoading(this._wingURL) == false) {
				if (this.playerVo.isRole == true) {
					//如果是主角，优先加载
					SourceCache.getInstance().load(this._wingURL, ResourceType.ANIMATION, true);
				}
				else {
					SourceCache.getInstance().load(this._wingURL, ResourceType.ANIMATION);
				}
			}
		}
	}

	public changeWeapon(isRedraw: Boolean = true): void {
		var url: string = this.playerVo.getWeaponURL(this.isPicking);
		if (url == null) {
			this._weaponURL = "";
			if (this._weaponMovieClip && this._weaponMovieClip.parent) {
				this._weaponMovieClip.parent.removeChild(this._weaponMovieClip);
				this._weaponMovieClip.dispose();
			}
			this._weaponURL = null;
		}
		if (url == this._weaponURL) return;
		if (this._weaponMovieClip && this._weaponMovieClip.parent == null) {
			this.bodyLayer.addChild(this._weaponMovieClip);
		}
		this._weaponURL = url;
		if (this._weaponURL != null) {
			if (SourceCache.getInstance().has(this._weaponURL)) {
				this._weaponMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(this._weaponURL));
				if (isRedraw) {
					this.redraw();
				}
			}
			else {
				if (SourceCache.getInstance().isLoading(this._weaponURL) == false) {
					if (this.playerVo.isRole == true) {
						SourceCache.getInstance().load(this._weaponURL, ResourceType.ANIMATION, true);
					}
					else {
						SourceCache.getInstance().load(this._weaponURL, ResourceType.ANIMATION);
					}
				}
			}
		}
	}

	private changeRing(isRedraw: boolean = false): void {
		var a = this;
		var url: string = a.playerVo.getRingUrl();
		if (url == null) {
			a._ringURL = "";
			if (a._ringMovieClip && a._ringMovieClip.parent) {
				a._ringMovieClip.parent.removeChild(a._ringMovieClip);
				a._ringMovieClip.dispose();
			}
		}
		if (url == a._ringURL) return;
		if (a._ringMovieClip && a._ringMovieClip.parent == null) {
			a.bodyLayer.addChildAt(a._ringMovieClip, 0);
		}
		a._ringURL = url;
		if (a._ringURL != null) {
			if (SourceCache.getInstance().has(a._ringURL)) {
				a._ringMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(a._ringURL));
				if (isRedraw) {
					a.redraw();
				}
			}
			else {
				if (SourceCache.getInstance().isLoading(a._ringURL) == false) {
					if (a.playerVo.isRole == true) {
						SourceCache.getInstance().load(a._ringURL, ResourceType.ANIMATION, true);
					}
					else {
						SourceCache.getInstance().load(a._ringURL, ResourceType.ANIMATION);
					}
				}
			}
		}
		a = null;
	}

	private playStandAction(): void {
		var startFrame: number = 1;
		var endFrame: number = PlayerFrame["STAND"];
		this._bodyMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);
		this._weaponMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);
		this._wingMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);
	}

	private playMoveAction(): void {
		var startFrame: number = 1;
		var endFrame: number = PlayerFrame["RUN"];
		this._bodyMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);
		this._weaponMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);
		this._wingMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);
		startFrame = 1;
		endFrame = 6;
		this._ringMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);
	}

	private _attackEndObj: Object;
	private playAttackAction(): void {
		var startFrame: number = 1;
		var endFrame: number = PlayerFrame["ATTACK"];
		if (this._attackEndObj == null) {
			this._attackEndObj = { func: this.endAttack, thisObj: this };
		}
		this._bodyMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame, this._attackEndObj);
		this._weaponMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);
		this._wingMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);
	}

	private loadResComplete(event: ParamEvent): void {
		let url: string = event.data.url;
		let mc: MovieClipData = event.data.mc;
		var a = this;
		if (url == a._bodyURL) {
			a._clothLoading = false;
			a._bodyMovieClip.setMovieClipData(mc);
			// a._bodyMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(a._bodyURL));
			a.redraw();
		}
		else if (url == a._wingURL) {
			a._wingMovieClip.setMovieClipData(mc);
			// a._wingMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(a._wingURL));
			a.redraw();
		}
		else if (url == a._weaponURL) {
			a._weaponMovieClip.setMovieClipData(mc);
			// a._weaponMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(a._weaponURL));
			a.redraw();
		}
		else if (url == a._ringURL) {
			a._ringMovieClip.setMovieClipData(mc);
			// a._ringMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(a._ringURL));
			a.redraw();
		}
	}

	private initNameTxt(): void {
		if (this._nameTxt) {
			this._nameTxt.text = this.playerVo.name;
		}
	}

	protected layout(): void {
		super.layout();
		//if (this._nameTxt == null) {
		//traceByTime(StringUtil.substitute("Player layout nameTxt null id = {0}", this._type));
		//}
		var a = this;
		a._nameWidth = a._nameTxt.textWidth;
		a.nameLayer.x = -a._nameWidth >> 1;
		if (a.playerVo.getBangID() > 0) {
			a.nameLayer.y = a.hpLayer.y - 60;
		}
		else {
			a.nameLayer.y = a.hpLayer.y - 40;
		}
		a.titleLayer.y = a.nameLayer.y - 15;
		a.canLayout = false;
	}

	private updateName(hasBang: Boolean = false): void {
		if (hasBang) {
			this.setName(true);
			this.layout();
			this._canUpdateName = false;
		}
		else {
			this._canUpdateName = true;
		}
	}

	private setName(hasBang: Boolean = false): void {
		if (this.playerVo == null) {
			return;
		}
		if (this._nameTxt == null) {
			return;
		}
		if (hasBang) {
			this._nameTxt.text = StringUtil.substitute("{0}\n{1}", this.playerVo.guildName, this.playerVo.name);
		}
		else {
			this._nameTxt.text = StringUtil.substitute("{0}", this.playerVo.name);
		}
	}

	private changeHPHandler(e: Event): void {
		var a = this;
		if (a.has0hp()) {
			if (a.getPoseState() && a.getPoseState().getState() != PoseState.DEAD) {
				a.toDead();
			}
		}
		if (a._hp != null) {
			a._hp.setProgress(a.playerVo.getHp() / a.playerVo.getMaxHp());
		}
		if (a._hpTxt) {
			a._hpTxt.text = `${a.playerVo.getHp()}/${a.playerVo.getMaxHp()}`
		}
		if (a.playerVo.isRole) {
			GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.CHANGE_ROLE_HP, { id: a.getId() }));
		}
	}

	private changeMPHandler(e: Event): void {
		if (this.playerVo.isRole) {
			GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.CHANGE_ROLE_MP, { id: this.getId() }));
		}
	}

	public has0hp(): Boolean {
		return this.playerVo.getHp() <= 0;
	}

	public getPoseState(): PoseState {
		if (this.playerVo) {
			return this.playerVo.poseState;
		}
		return null;
	}

	public getDirState(): DirState {
		if (this.playerVo != null) {
			return this.playerVo.dirState;
		}
		return null;
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

	public getBodyWidth(): number {
		if (this._bodyMovieClip == null) return 0;
		var bodyFrame: BitmapFrame = this._bodyMovieClip.getBitmapFrame();
		if (bodyFrame == null) {
			return 0;
		}
		return bodyFrame.width;
	}

	public step(): void {
		this.nextPosition();
		if (this._canUpdateName) {
			this.setName();
			if (!this.canLayout) {
				this.layout();
			}
			this._canUpdateName = false;
		}
		if (this._hp != null) {
			this._hp.step();
		}
	}

	//判断玩家是否人形怪
	public isMonster(): boolean {
		return false;
	}

	private _path: Array<Point>;
	public stopPath(setState: boolean = true): void {
		this._path = null;
		if (setState) {
			this.getPoseState().setState(PoseState.STAND);
		}
		// if (this.getPoseState().getPreState() == PoseState.MOVE && this.getPoseState().getState() == PoseState.STAND) {
		// 	this.dispatchEvent(new ParamEvent(SceneEvtName.WALK_COMPLETE));
		// }
	}

	public movePath(path: Array<Point>): void {
		this._path = path;
		if (this._path == null) return;
		if (this._path.length == 0) {
			this.getPoseState().setState(PoseState.STAND);
			this.dispatchEvent(new ParamEvent(SceneEvtName.WALK_COMPLETE));
			return;
		}
		else {
			this._walkTimes = 0;
			var point: Point = this._path.shift();
			this.moveTo(point);
		}
	}

	private moveTo(point: Point): void {
		this.move(point);
		var a = this;
		if ((a._walkTimes % 15 == 0 || a._path.length <= 0) && SceneModel.getInstance().isMainCity()) {
			// a.dispatchEvent(new ParamEvent(SceneEvtName.WALK_START_NODE, { path: [point] }));
		}
		a._walkTimes++;
	}

	private completeHandler(): void {
		if (this.getPoseState().getState() == PoseState.ATTACK) return;
		if (this._path == null || this._path.length == 0) {
			this.getPoseState().setState(PoseState.STAND);
			this.dispatchEvent(new ParamEvent(SceneEvtName.WALK_COMPLETE));
		}
		else {
			this.dispatchEvent(new ParamEvent(SceneEvtName.WALK_COMPLETE_NODE));
			if (this._path == null || this._path.length == 0) return;
			this.moveTo(this._path.shift());
		}
	}

	protected moveComplete(): void {
		super.moveComplete();
		// traceByTime("---------- Player moveComplete");
		this.completeHandler();
		if (this.isInZSCZ && (this._path == null || this._path.length == 0)) {
			this.isInZSCZ = false;
			this.stopZSCZEffect();
			this.dispatchEvent(new ParamEvent(EventName.ZSCZ_FINISH, { skillID: this._toAttackSkillID }));
		}
	}

	public getCurrentPath(): Array<Point> {
		return this._path;
	}

	private setScale(scale: number): void {
		this._bodyMovieClip.scaleX = scale;
		this._weaponMovieClip.scaleX = scale;
		this._wingMovieClip.scaleX = scale;
	}

	private _toAttackSkillID: number = 0;//纯粹存储一下，战神冲撞的原版和觉醒版会用得着
	public toAttack(skillId: number = 0, targetPoint: Point = null, targetObj: LiveThing = null): void {
		var poseState: PoseState = this.getPoseState();
		if (poseState == null) {
			return;
		}
		this.lastAttackTime = getTimer();
		this._toAttackSkillID = skillId;
		if (skillId == 101004 || skillId == 101009) {
			//战士冲撞
			// traceByTime("------- Player toAttack Move");
			poseState.setState(PoseState.MOVE);
		}
		else {
			// traceByTime("------- Player toAttack Attack");
			poseState.setState(PoseState.ATTACK);
		}
	}

	private _stopFrameSi: number = 0;
	// private endAttackToStop(): void {
	// 	if (this._bodyMovieClip) {
	// 		this._bodyMovieClip.gotoAndStop(1);
	// 		// this._bodyMovieClip.gotoAndStop(PlayerFrame["ATTACK"]);
	// 	}
	// 	if (this._weaponMovieClip) {
	// 		this._weaponMovieClip.gotoAndStop(1);
	// 	}
	// 	if (this._wingMovieClip) {
	// 		this._wingMovieClip.gotoAndStop(1);
	// 	}
	// 	this.clearStopFrameSi();
	// 	this._stopFrameSi = setTimeout2(() => { this.endAttack() }, 350);
	// }

	private clearStopFrameSi(): void {
		if (this._stopFrameSi > 0) {
			clearTimeout(this._stopFrameSi);
		}
	}

	public endAttack(): void {
		var poseState: PoseState = this.getPoseState();
		if (poseState == null) {
			return;
		}
		if (poseState.getState() == PoseState.ATTACK) {
			poseState.setState(PoseState.STAND);
		}
	}

	public toDead(): void {
		super.toDead();
		this.dispatchEvent(new ParamEvent(SceneEvtName.DEAD));
	}

	public setHp(value: number): void {
		super.setHp(value);
		this.playerVo.setHp(value);
	}

	//完全销毁
	public dispose() {
		var a = this;
		if (a._zsczSi > 0) {
			clearTimeout(a._zsczSi);
		}
		super.dispose();
		a.clearStopFrameSi();
		a.stopZSCZEffect();
		if (a._skillEffect) {
			a._skillEffect.dispose();
			a._skillEffect = null;
		}
		SourceCache.getInstance().removeEventListener(SourceCache.LOAD_ANIMATION_COMPLETE, a.loadResComplete, a);
		a.playerVo.removeEventListener(PlayerBaseVO.CHANGE_CLOTH, a.changeClothHandle, a);
		a.playerVo.removeEventListener(PlayerBaseVO.CHANGE_WEAPON, a.changeWeaponHandle, a);
		a.playerVo.removeEventListener(PlayerBaseVO.CHANGE_WING, a.changeWingHandle, a);
		a.playerVo.removeEventListener(PlayerBaseVO.CHANGE_GONGHUI, a.guildChange, a);
		a.playerVo.removeEventListener(LiveThingVo.CHANGEHP, a.changeHPHandler, a);
		a.playerVo.removeEventListener(LiveThingVo.CHANGEMAXHP, a.changeHPHandler, a);
		a.playerVo.removeEventListener(LiveThingVo.CHANGEMP, a.changeMPHandler, a);
		a.playerVo.removeEventListener(LiveThingVo.CHANGEMAXMP, a.changeMPHandler, a);
		GameDispatcher.getInstance().removeEventListener(EventName.CHANGE_TITLE, a.changeTitleHandler, a);
		GameDispatcher.getInstance().removeEventListener(EventName.CHANGE_RING, a.changeRingHandler, a);
		a._attackEndObj = null;
	}

	public clear(): void {
		var a = this;
		if (a._zsczSi > 0) {
			clearTimeout(a._zsczSi);
		}
		super.clear();
		a.clearStopFrameSi();
		a.stopZSCZEffect();
		if (a._skillEffect) {
			a._skillEffect.dispose();
			a._skillEffect = null;
		}
		SourceCache.getInstance().removeEventListener(SourceCache.LOAD_ANIMATION_COMPLETE, a.loadResComplete, a);
		a.playerVo.removeEventListener(PlayerBaseVO.CHANGE_CLOTH, a.changeClothHandle, a);
		a.playerVo.removeEventListener(PlayerBaseVO.CHANGE_WEAPON, a.changeWeaponHandle, a);
		a.playerVo.removeEventListener(PlayerBaseVO.CHANGE_WING, a.changeWingHandle, a);
		a.playerVo.removeEventListener(PlayerBaseVO.CHANGE_GONGHUI, a.guildChange, a);
		a.playerVo.removeEventListener(LiveThingVo.CHANGEHP, a.changeHPHandler, a);
		a.playerVo.removeEventListener(LiveThingVo.CHANGEMAXHP, a.changeHPHandler, a);
		a.playerVo.removeEventListener(LiveThingVo.CHANGEMP, a.changeMPHandler, a);
		a.playerVo.removeEventListener(LiveThingVo.CHANGEMAXMP, a.changeMPHandler, a);
		GameDispatcher.getInstance().removeEventListener(EventName.CHANGE_TITLE, a.changeTitleHandler, a);
		GameDispatcher.getInstance().removeEventListener(EventName.CHANGE_RING, a.changeRingHandler, a);
		a._attackEndObj = null;
	}

	private changeTitleHandler(event: ParamEvent): void {
		if (this.playerVo.parnerID != event.data.id) {
			return;
		}
		var title: number = this.playerVo.getAppVo().title;
		this.addTitle(title);
	}

	private guildChange(event: ParamEvent): void {
		this.updateName(this.playerVo.getBangID() > 0);
	}

	public getVo(): PlayerBaseVO {
		return this.playerVo;
	}

	private _skillEffect: UIEffect;
	public playSkillEffect(url: string, px: number, py: number, delay: number, isLoop: boolean, childIndex: number = -1): void {
		if (this._skillEffect) {
			this._skillEffect.dispose();
			this._skillEffect = null;
		}
		this._skillEffect = EffectManager.getInstance().showEffect(url, px, py, this, delay, isLoop, false, 0, false, 0, true, 1, -1, 0, childIndex);
	}

	//战神冲撞，不会有位移的，有位移的直接用movePath就好了,默认时间是1250ms
	private _zsczSi: number = 0;
	public playZhanShenChongZhuang(time: number = 1250): void {
		this.playMoveAction();
		if (this._zsczSi > 0) {
			clearTimeout(this._zsczSi);
		}
		this._zsczSi = setTimeout2(() => { this.moveComplete() }, time);
	}

	private changeClothHandle(event: ParamEvent): void {
		this.updateCloth();
	}

	private changeWeaponHandle(event: ParamEvent): void {
		this.changeWeapon();
	}

	private changeWingHandle(event: ParamEvent): void {
		this.updateWing();
	}

	public getPropertyVo(): PropertyVO {
		return this.playerVo.getPropertyVo();
	}

	public getHp(): number {
		return this.playerVo.getHp();
	}

	private _zsczEff: UIEffect;
	public setZSCZEff(eff: UIEffect): void {
		if (this._zsczEff) {
			this._zsczEff.dispose();
			this._zsczEff = null;
		}
		this._zsczEff = eff;
	}

	public stopZSCZEffect(): void {
		if (this._zsczEff) {
			this._zsczEff.dispose();
			this._zsczEff = null;
		}
		if (this.playerVo) {
			this.playerVo.setSpeed(240);
			this.setSpeed(240);
		}
	}

	public get ownerID() {
		if (this.playerVo) {
			return this.playerVo.pid;
		}
		return "";
	}

	public getBelongID(): string {
		return this.ownerID;
	}

	private changeRingHandler(event: ParamEvent): void {
		if (this.playerVo.parnerID != event.data.id) {
			return;
		}
		this.changeRing();
	}

	//移除技能效果
	public removeSkillEffect(id: number): void {
		if (this._skillEffect) {
			this._skillEffect.dispose();
			this._skillEffect = null;
		}
	}

	public GetIsRole(): boolean {
		return this.playerVo.isRole;
	}

	public lastAttackTime: number = 0;
}