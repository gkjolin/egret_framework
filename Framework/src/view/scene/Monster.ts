class Monster extends LiveThing {
	public monsterVo: MonsterVO;
	private _frameCls: any;		//怪物的帧定义
	public ownerID: string = "";
	public constructor() {
		super("Monster");
		// this.monsterVo = monsterVo;
		// this.setDefaultState();
	}

	public setMonsterVo(vo: MonsterVO): void {
		this.monsterVo = vo;
		this.setDefaultState();
		this.init2();
		this.isUsing = true;
	}

	protected init2(): void {
		var a = this;
		var apperanceVo = a.monsterVo.appVo;
		if (a.monsterVo.isPetMonster) {
			// var rID: number = a.monsterVo.getResId();
			// if (rID == MonsterVO.DOG_RES) {
			// 	a._frameCls = PetMonsterFrame;
			// }
			// else if (rID == MonsterVO.YUELING_RES) {
			// 	a._frameCls = PetMonsterFrame2;
			// }
			a._frameCls = PetMonsterFrame2;
			//把血条层和名字层去掉
			if (a.contains(a.hpLayer)) {
				a.removeChild(a.hpLayer);
			}
			if (a.contains(a.nameLayer)) {
				a.removeChild(a.nameLayer);
			}
		}
		else {
			if (apperanceVo) {
				a._frameCls = PlayerFrame;
			}
			else {
				a._frameCls = MonsterFrame;
			}
			if (!a.contains(a.nameLayer)) {
				a.addChild(a.nameLayer);
			}
			if (!a.contains(a.hpLayer)) {
				a.addChild(a.hpLayer);
			}
		}
		a.getDirState().setState(DirState.dirList[Math.floor(Math.random() * DirState.dirList.length)]);
		if (a.monsterVo.guildName != "") {
			a._nameTxt.text = StringUtil.substitute("{0}\n{1}", a.monsterVo.guildName, a.monsterVo.getName());
		}
		else {
			a._nameTxt.text = a.monsterVo.getName();
		}
		a._nameTxt.x = - Math.ceil(a._nameTxt.textWidth >> 1);
		a._hpTxt.text = a.monsterVo.getHp() + "/" + a.monsterVo.getMaxHp();
		if (a._bodyMovieClip == null) {
			a._bodyMovieClip = new BitmapMovieClip("Monster_Body");
		}
		a.bodyLayer.addChild(a._bodyMovieClip);
		if (apperanceVo) {
			if (a._weaponMovieClip == null) {
				a._weaponMovieClip = new BitmapMovieClip("Monster_weapon");
			}
			a.bodyLayer.addChild(a._weaponMovieClip);
			if (apperanceVo.wing > 0) {
				if (a._wingMovieClip == null) {
					a._wingMovieClip = new BitmapMovieClip("Monster_wing");
				}
				a.bodyLayer.addChild(a._wingMovieClip);
			}
			if (apperanceVo.ring > 0) {
				if (a._ringMovieClip == null) {
					a._ringMovieClip = new BitmapMovieClip("Monster_ring");
				}
				a.bodyLayer.addChild(a._ringMovieClip);
			}
			a.addTitle(apperanceVo.title);
			if (SceneModel.getInstance().isMineFuBen()) {
				a.getDirState().setState(4);
			}
			else if (SceneModel.getInstance().isUnKnowPalace()) {
				a.getDirState().setState(1);
			}
		}
		a.setSpeed(a.monsterVo.getSpeed());
		if (a._hp == null) {
			a._hp = new BloodBar(2);
		}
		a._hp.configUI();
		a._hp.addEventListener(BloodBar.BLOOD_MCEND, a.bloodMCEnd, a);
		a.hpLayer.addChild(a._hp);
		a.monsterVo.addEventListener(LiveThingVo.CHANGEHP, a.changeHPHandler, a);
		a.monsterVo.addEventListener(LiveThingVo.CHANGEMAXHP, a.changeHPHandler, a);
		a.monsterVo.addEventListener(MonsterVO.CHANGERESID, a.changeResIdHandler, a);
		a.getPoseState().setState(PoseState.STAND);
		if (a.monsterVo.typeId == 9000001) {
			a.addEventListener(egret.Event.ADDED_TO_STAGE, a.addToStage, a);
		}
		a = null;
	}

	private addToStage(event: egret.Event): void {
		if (this.monsterVo.typeId == 9000001) {
			this.parent.setChildIndex(this, 0);
		}
	}

	public getPoseState(): PoseState {
		if (this.monsterVo) {
			return this.monsterVo.poseState;
		}
		return null;
	}

	public getDirState(): DirState {
		if (this.monsterVo) {
			return this.monsterVo.dirState;
		}
		return null;
	}

	private changeHPHandler(e: Event): void {
		if (this._hp) {
			this._hp.showHpMC(this.monsterVo.getHp(), this.monsterVo.getMaxHp());
		}
		// if (this.has0hp()) {
		// 	this.dispatchEvent(new ParamEvent(SceneEvtName.DEAD));
		// }
		// else {
		// 	if (this._hp != null) {
		// 		this._hp.setProgress(this.monsterVo.getHp() / this.monsterVo.getMaxHp());
		// 		this._hpTxt.text = this.monsterVo.getHp() + "/" + this.monsterVo.getMaxHp();
		// 	}
		// }
	}

	public has0hp(): boolean {
		return this.monsterVo.getHp() == 0;
	}

	private changeResIdHandler(e: ParamEvent): void {
		this.updateRes();
	}

	private updateRes(): boolean {
		if (this.getPoseState() == null) return false;
		var bodyUrl: string = this.getBodyActionURL();
		var wingUrl: string = this.getWingURL();
		var weaponUrl: string = this.getWeaponURL();
		var ringUrl: string = this.getRingUrl();
		if (bodyUrl == null) {
			if (this._bodyMovieClip && this._bodyMovieClip.parent != null) {
				this._bodyMovieClip.parent.removeChild(this._bodyMovieClip);
				this._bodyMovieClip.dispose();
			}
			this._bodyURL = null;
			return false;
		}
		if (bodyUrl == this._bodyURL) return true;
		if (this._bodyMovieClip && this._bodyMovieClip.parent == null) {
			this.bodyLayer.addChild(this._bodyMovieClip);
		}
		this._bodyURL = bodyUrl;
		this._wingURL = wingUrl;
		this._weaponURL = weaponUrl;
		this._ringURL = ringUrl;
		if (SourceCache.getInstance().has(this._bodyURL)) {
			this._bodyMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(this._bodyURL));
			this.redraw();
		}
		else {
			SourceCache.getInstance().addEventListener(SourceCache.LOAD_ANIMATION_COMPLETE, this.loadCompleteHandler2, this);
			if (SourceCache.getInstance().isLoading(this._bodyURL) == false) {
				SourceCache.getInstance().load(this._bodyURL, ResourceType.ANIMATION);
			}
		}
		if (this._wingURL) {
			if (SourceCache.getInstance().has(this._wingURL)) {
				this._wingMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(this._wingURL));
				this.redraw();
			}
			else {
				SourceCache.getInstance().addEventListener(SourceCache.LOAD_ANIMATION_COMPLETE, this.loadCompleteHandler2, this);
				if (SourceCache.getInstance().isLoading(this._wingURL) == false) {
					SourceCache.getInstance().load(this._wingURL, ResourceType.ANIMATION);
				}
			}
		}
		if (this._weaponURL) {
			if (SourceCache.getInstance().has(this._weaponURL)) {
				this._weaponMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(this._weaponURL));
				this.redraw();
			}
			else {
				SourceCache.getInstance().addEventListener(SourceCache.LOAD_ANIMATION_COMPLETE, this.loadCompleteHandler2, this);
				if (SourceCache.getInstance().isLoading(this._weaponURL) == false) {
					SourceCache.getInstance().load(this._weaponURL, ResourceType.ANIMATION);
				}
			}
		}
		if (this._ringURL) {
			if (SourceCache.getInstance().has(this._ringURL)) {
				this._ringMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(this._ringURL));
				this.redraw();
			}
			else {
				SourceCache.getInstance().addEventListener(SourceCache.LOAD_ANIMATION_COMPLETE, this.loadCompleteHandler2, this);
				if (SourceCache.getInstance().isLoading(this._ringURL) == false) {
					SourceCache.getInstance().load(this._ringURL, ResourceType.ANIMATION);
				}
			}
		}
		return true;
	}

	private getBodyActionURL(): string {
		var url: string = null;
		var actionStr: string = "stand";
		var state: number = this.getPoseState().getState();
		var mVo = this.monsterVo;
		if (state == PoseState.MOVE) {
			actionStr = "run";
		}
		else if (state == PoseState.ATTACK) {
			if (mVo.job == Tools.ZHANSHI || mVo.job == 0) {
				actionStr = "attack";
			}
			else {
				actionStr = "magic";
			}
		}
		else if (state == PoseState.HITED || state == PoseState.MOVEBACK) {
			actionStr = "stand";
		}
		if (this._frameCls == MonsterFrame || this._frameCls == PetMonsterFrame || this._frameCls == PetMonsterFrame2) {
			url = UrlUtil.getMonsterURL(this.monsterVo.getResId()) + actionStr;
		}
		else if (this._frameCls == PlayerFrame) {
			var mVo = this.monsterVo;
			var appVo = mVo.appVo;
			url = UrlUtil.getClothURL(mVo.job, mVo.sex, appVo.cloth) + actionStr;
		}
		url += this.getDirState().getFrame();
		return url;
	}

	private getWeaponURL(): string {
		var mVo = this.monsterVo;
		var appVo = mVo.appVo;
		if (!appVo) {
			return null;
		}
		if (appVo.weapon == 0) {
			return null;
		}
		var url: string = null;
		var actionStr: string = "stand";
		var state: number = this.getPoseState().getState();
		if (state == PoseState.MOVE) {
			actionStr = "run";
		}
		else if (state == PoseState.ATTACK) {
			if (mVo.job == Tools.ZHANSHI) {
				actionStr = "attack";
			}
			else {
				actionStr = "magic";
			}
		}
		else if (state == PoseState.HITED || state == PoseState.MOVEBACK) {
			actionStr = "stand";
		}
		url = UrlUtil.getWeaponURL(mVo.sex, appVo.weapon) + actionStr + this.getDirState().getFrame();
		// url = UrlUtil.getWeaponURL(mVo.sex, appVo.weapon) + actionStr;
		return url;
	}

	private getRingUrl(): string {
		var appVo = this.monsterVo.appVo;
		if (appVo == null || appVo.ring == 0) {
			return null;
		}
		var url = UrlUtil.getRingURL(appVo.ring);
		return url;
	}

	private getWingURL(): string {
		var mVo = this.monsterVo;
		var appVo = mVo.appVo;
		if (!appVo) {
			return null;
		}
		if (appVo.wing == 0) {
			return null;
		}
		var url: string = null;
		var actionStr: string = "stand";
		var state: number = this.getPoseState().getState();
		if (state == PoseState.MOVE) {
			actionStr = "run";
		}
		else if (state == PoseState.ATTACK) {
			if (mVo.job == Tools.ZHANSHI) {
				actionStr = "attack";
			}
			else {
				actionStr = "magic";
			}
		}
		else if (state == PoseState.HITED || state == PoseState.MOVEBACK) {
			actionStr = "stand";
		}
		url = UrlUtil.getWingURL(appVo.wing) + actionStr + this.getDirState().getFrame();
		// url = UrlUtil.getWingURL(appVo.wing) + actionStr;
		return url;
	}

	private loadCompleteHandler2(e: ParamEvent): void {
		var a = this;
		var url = e.data.url;
		var mc: MovieClipData = e.data.mc;
		if (url == a._bodyURL && a._bodyMovieClip) {
			// a._bodyMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(a._bodyURL));
			a._bodyMovieClip.setMovieClipData(mc);
			a.redraw();
		}
		else if (url == a._wingURL) {
			if (a._wingMovieClip) {
				// a._wingMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(a._wingURL));
				a._wingMovieClip.setMovieClipData(mc);
				a.redraw();
			}
		}
		else if (url == a._weaponURL) {
			if (a._weaponMovieClip) {
				// a._weaponMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(a._weaponURL));
				a._weaponMovieClip.setMovieClipData(mc);
				a.redraw();
			}
		}
		else if (url == a._ringURL) {
			if (a._ringMovieClip) {
				// a._ringMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(a._ringURL));
				a._ringMovieClip.setMovieClipData(mc);
				a.redraw();
			}
		}
		a = null;
	}

	protected moveComplete(): void {
		super.moveComplete();
		var poseState: PoseState = this.getPoseState();
		var dirState: DirState = this.getDirState();
		if (poseState.getState() == PoseState.ATTACK) return;
		if (poseState.getState() == PoseState.MOVEBACK) return;
		if (this.monsterVo.path != null) {
			this.completeHandler();
		}
		else {
			poseState.setState(PoseState.STAND);
		}
		this.updateAction();
		if (this.attackObj != null) {
			this.dispatchEvent(new ParamEvent(EventName.MONSTERATTACK, this.attackObj));
		}
	}

	public isDead: boolean;
	protected updateAction(): void {
		super.updateAction();
		this.updateRes();
		var poseState: PoseState = this.getPoseState();
		var dirState: DirState = this.getDirState();
		var startFrame: number;
		var endFrame: number;
		//城门怪和红龙
		if (this.monsterVo.typeId == 9000001 || this.monsterVo.getResId() == 600100) {
			this._bodyMovieClip.scaleX = 1;
		}
		else {
			this._bodyMovieClip.scaleX = dirState.getScale();
			if (this._wingMovieClip) {
				this._wingMovieClip.scaleX = dirState.getScale();
			}
			if (this._weaponMovieClip) {
				this._weaponMovieClip.scaleX = dirState.getScale();
			}
		}
		var state = poseState.getState();
		if (state == PoseState.MOVE) {
			if (this.monsterVo.typeId == 9000001) {
				this._bodyMovieClip.gotoAndPlay(1, true, 1, 1);
			}
			else if (this.monsterVo.getResId() == 600100) {
				this._bodyMovieClip.gotoAndPlay(1, true, 1, 1);
			}
			else {
				startFrame = 1;
				endFrame = this._frameCls["RUN"];
				this._bodyMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);
				if (this._wingMovieClip) {
					this._wingMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);
				}
				if (this._weaponMovieClip) {
					this._weaponMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);
				}
			}
		}
		else if (state == PoseState.STAND) {
			startFrame = 1;
			endFrame = this._frameCls["STAND"];
			if (this.monsterVo.typeId == 600100 || this._frameCls == PetMonsterFrame || this._frameCls == PetMonsterFrame2) {
				this._bodyMovieClip.gotoAndPlay(1, true, 1, 4);
			}
			else {
				this._bodyMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);
			}
			if (this._wingMovieClip) {
				this._wingMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);
			}
			if (this._weaponMovieClip) {
				this._weaponMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);
			}
		}
		else if (state == PoseState.MOVEBACK) {
			startFrame = 1;
			this._bodyMovieClip.gotoAndStop(startFrame);
			if (this._wingMovieClip) {
				this._wingMovieClip.gotoAndStop(startFrame);
			}
			if (this._weaponMovieClip) {
				this._weaponMovieClip.gotoAndStop(startFrame);
			}
		}
		else if (state == PoseState.DEAD) {
			this.isDead = true;
			this.dispatchEvent(new ParamEvent(SceneEvtName.DEAD));
		}
		else if (state == PoseState.ATTACK) {
			this.playAttackAction();
		}
		// else if (state == PoseState.HITED) {
		// 	this.playHitAction();
		// }
	}

	private _attackObj: Object;
	private playAttackAction(): void {
		var startFrame = 1;
		var endFrame = this._frameCls["ATTACK"];
		if (this.monsterVo.getResId() == 600100) {
			endFrame = 6;
		}
		if (this._attackObj == null) {
			this._attackObj = { func: this.endAttackFun, thisObj: this };
		}
		this._bodyMovieClip.gotoAndPlay(startFrame, false, startFrame, endFrame, this._attackObj);
		if (this._wingMovieClip && this._wingMovieClip.parent) {
			this._wingMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);
		}
		if (this._weaponMovieClip && this._weaponMovieClip.parent) {
			this._weaponMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);
		}
	}

	private _attackSi: number;
	private endAttackFun(): void {
		clearTimeout(this._attackSi);
		var mType: number = this.monsterVo.monsterType;
		if (mType == MonsterVO.SMALL || mType == MonsterVO.MEET_BOSS) {
			this._attackSi = setTimeout2(() => {
				if (this.attackObj != null) {
					this.dispatchEvent(new ParamEvent(EventName.MONSTERATTACK, this.attackObj));
				}
			}, 900);
		}
		if (this.getPoseState() == null) return;
		if (this.getPoseState().getState() == PoseState.ATTACK) {
			this.getPoseState().setState(PoseState.STAND);
		}
	}

	private playHitAction(): void {

	}

	private _path: Array<Point>;
	private completeHandler(): void {
		if (this._path == null || this._path.length == 0) {
			this.getPoseState().setState(PoseState.STAND);
			this.dispatchEvent(new ParamEvent(SceneEvtName.WALK_COMPLETE));
		}
		else {
			this.dispatchEvent(new ParamEvent(SceneEvtName.WALK_COMPLETE_NODE));
			this.move(this._path.shift());
		}
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
			this.dispatchEvent(new ParamEvent(SceneEvtName.WALK_START));
			this.move(this._path.shift());
		}
	}

	public step(): void {
		this.nextPosition();
		if (this._hp) {
			this._hp.step();
		}
	}

	public getId(): number {
		if (this.monsterVo) {
			return this.monsterVo.id;
		}
		return 0;
	}

	protected layout(): void {
		super.layout();
		this.nameLayer.y = this.hpLayer.y - 40;
		if (this.monsterVo.guildName != "") {
			this.nameLayer.y = this.hpLayer.y - 60;
		}
		else {
			this.nameLayer.y = this.hpLayer.y - 40;
		}
		this.titleLayer.y = this.nameLayer.y - 15;
		this.canLayout = false;
	}

	public toAttack(): void {
		if (this.getPoseState() == null) return;
		this.getPoseState().setState(PoseState.ATTACK);
		if (this.getPoseState().isChanged()) {
			this.redraw();
		}
	}

	public setHp(value: number): void {
		super.setHp(value);
		this.monsterVo.setHp(value);
	}

	public getBodyHeight(): number {
		if (this._bodyMovieClip == null) return 0;
		var bodyFrame: BitmapFrame = this._bodyMovieClip.getBitmapFrame();
		if (bodyFrame == null) {
			return 0;
		}
		return bodyFrame.height;
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

	public getVo(): MonsterVO {
		return this.monsterVo;
	}

	public canBeAttack(): boolean {
		if (this.monsterVo.useType == MonsterVO.VIRTUAL) {
			return false;
		}
		if (this.monsterVo.isPetMonster) {
			return false;
		}
		if (this.monsterVo.monsterType == MonsterVO.MEET_BOSS && !SceneModel.getInstance().toFightBossMeet) {
			return false;
		}
		return true;
	}

	public getPropertyVo(): PropertyVO {
		return this.monsterVo.getPropertyVo();
	}

	public getHp(): number {
		return this.monsterVo.getHp();
	}

	private bloodMCEnd(event: ParamEvent): void {
		if (this.has0hp()) {
			this.dispatchEvent(new ParamEvent(SceneEvtName.DEAD));
		}
		else {
			if (this._hp != null) {
				this._hp.setProgress(this.monsterVo.getHp() / this.monsterVo.getMaxHp());
				this._hpTxt.text = this.monsterVo.getHp() + "/" + this.monsterVo.getMaxHp();
			}
		}
	}

	public dispose(): void {
		if (this._hp) {
			this._hp.removeEventListener(BloodBar.BLOOD_MCEND, this.bloodMCEnd, this);
		}
		super.dispose();
		clearTimeout(this._attackSi);
		if (this._hpTxt) {
			this._hpTxt.dispose();
			this._hpTxt = null;
		}
		if (this._nameTxt) {
			this._nameTxt.dispose();
			this._nameTxt = null;
		}
		this.monsterVo.removeEventListener(LiveThingVo.CHANGEHP, this.changeHPHandler, this);
		this.monsterVo.removeEventListener(LiveThingVo.CHANGEMAXHP, this.changeHPHandler, this);
		this.monsterVo.removeEventListener(MonsterVO.CHANGERESID, this.changeResIdHandler, this);
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
		SourceCache.getInstance().removeEventListener(SourceCache.LOAD_ANIMATION_COMPLETE, this.loadCompleteHandler2, this);
	}

	public clear(): void {
		super.clear();
		if (this._hp) {
			this._hp.removeEventListener(BloodBar.BLOOD_MCEND, this.bloodMCEnd, this);
		}
		clearTimeout(this._attackSi);
		this.monsterVo.removeEventListener(LiveThingVo.CHANGEHP, this.changeHPHandler, this);
		this.monsterVo.removeEventListener(LiveThingVo.CHANGEMAXHP, this.changeHPHandler, this);
		this.monsterVo.removeEventListener(MonsterVO.CHANGERESID, this.changeResIdHandler, this);
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
		SourceCache.getInstance().removeEventListener(SourceCache.LOAD_ANIMATION_COMPLETE, this.loadCompleteHandler2, this);
	}

}