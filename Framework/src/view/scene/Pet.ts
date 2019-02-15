class Pet extends LiveThing {
	public petVo: PetBaseVO;
	public dis: number = 0;
	public lastPoint: Point;

	private _owner: Player;

	private _nameWidth: number = 0;
	private _canUpdateName: boolean = true;//是否要更新名字
	private _clothLoading: boolean = false;
	public constructor(type: string = "Pet") {
		super(type);
	}

	protected init(): void {
		super.init();
	}

	public setPetBaseVo(vo: PetBaseVO): void {
		var a = this;
		a.isUsing = true;
		a.isPicking = false;
		a.petVo = vo;
		// a.petVo.poseState.ownerID = vo.uid;
		a.initNameTxt();
		a.initBitmapMovieClip();
		a.setDefaultState();
		a.setSpeed(a.petVo.getSpeed());
		a.addEvent();
		a.updateName(false);
		a.petVo.addEventListener(PetBaseVO.CHANGE_PET_CLOTH, a.changeClothHandle, a);
		// a.petVo.addEventListener(PetBaseVO.CHANGE_PET_WEAPON, a.changeWeaponHandle, a);
		a.redraw();
	}

	private initBitmapMovieClip(): void {
		var a = this;
		if (a._bodyMovieClip == null) {
			a._bodyMovieClip = new BitmapMovieClip("Pet_body");
		}
		a.bodyLayer.addChild(a._bodyMovieClip);

		if (a._weaponMovieClip == null) {
			a._weaponMovieClip = new BitmapMovieClip("Pet_weapon");
		}
		a.bodyLayer.addChild(a._weaponMovieClip);
	}

	//获取玩家id
	public getId(): string {
		if (this.petVo) {
			return this.petVo.uid;
		}
		return "";
	}

	public setOwner(value: Player): void {
		var a = this;
		a._owner = value;
		if (a._owner && a._owner.playerVo) a._owner.playerVo.addEventListener(PlayerBaseVO.CHANGE_PET_WEAPON, a.changeWeaponHandle, a);
	}
	public getOwner(): Player {
		return this._owner;
	}

	private addEvent(): void {
		SourceCache.getInstance().addEventListener(SourceCache.LOAD_ANIMATION_COMPLETE, this.loadResComplete, this);
	}

	protected updateAction(): void {
		super.updateAction();
		var a = this;
		let poseState: PoseState = this.getPoseState();
		if (poseState == null) {
			return;
		}
		a.updateCloth(false);
		a.updateWeapon(false);
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
		a.setScale(a.getDirState().getScale());
		a.bodyLayer.addChildAt(a._bodyMovieClip, 0);
		if (a._weaponMovieClip) a.bodyLayer.addChildAt(a._weaponMovieClip, 1);
		var dirstate: number = a.getDirState().getState();
		if (dirstate < 4) {
			if (a._weaponMovieClip && a.bodyLayer.contains(a._weaponMovieClip)) {
				a.bodyLayer.swapChildren(a._bodyMovieClip, a._weaponMovieClip);
			}
		}
		var dirstate: number = this.getDirState().getState();
	}

	private updateCloth(isRedraw: boolean = true): void {
		var url: string = this.petVo.getBodyURL(this.isPicking);
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
				SourceCache.getInstance().load(this._bodyURL, ResourceType.ANIMATION);
			}
		}
	}
	private updateWeapon(isRedraw: boolean = true): void {
		var url: string = this.petVo.getWeaponURL(this.isPicking);
		var a = this;
		if (url == null) {
			if (this._weaponMovieClip && this._weaponMovieClip.parent != null) {
				this._weaponMovieClip.parent.removeChild(this._weaponMovieClip);
				this._weaponMovieClip.dispose();
				this._weaponMovieClip = null;
			}
			this._weaponURL = null;
			return;
		}
		if (url == this._weaponURL) return;
		if (a._weaponMovieClip == null) {
			a._weaponMovieClip = new BitmapMovieClip("Pet_weapon");
		}
		a.bodyLayer.addChild(a._weaponMovieClip);
		if (this._weaponMovieClip && this._weaponMovieClip.parent == null) {
			this.bodyLayer.addChild(this._weaponMovieClip);
		}
		this._weaponURL = url;
		this.redraw();
		if (SourceCache.getInstance().has(this._weaponURL)) {
			this._weaponMovieClip.setMovieClipData(SourceCache.getInstance().getAnimation(this._weaponURL));
			// this._clothLoading = false;
			if (isRedraw) {
				this.redraw();
			}
		}
		else {
			// this._clothLoading = true;
			if (SourceCache.getInstance().isLoading(this._weaponURL) == false) {
				SourceCache.getInstance().load(this._weaponURL, ResourceType.ANIMATION);
			}
		}
	}
	private playStandAction(): void {
		var startFrame: number = 1;
		var endFrame: number = PetFrame["STAND"];
		this._bodyMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);
		if (this._weaponMovieClip) this._weaponMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);
	}

	private playMoveAction(): void {
		var startFrame: number = 1;
		var endFrame: number = PetFrame["RUN"];
		this._bodyMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);
		if (this._weaponMovieClip) this._weaponMovieClip.gotoAndPlay(startFrame, true, startFrame, endFrame);
		// startFrame = 1;
		// endFrame = 6;
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
			if (a._weaponMovieClip) a._weaponMovieClip.setMovieClipData(mc);
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
			this._nameTxt.text = this.petVo.name + "的魔宠";
		}
	}

	protected layout(): void {
		this._nameWidth = this._nameTxt.textWidth;
		this.nameLayer.x = -this._nameWidth >> 1;
		this.nameLayer.y = -this.getBodyHeight() - 30;
		this.canLayout = false;
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
		if (this.petVo == null) {
			return;
		}
		if (this._nameTxt == null) {
			return;
		}
		this._nameTxt.text = StringUtil.substitute("{0}", this.petVo.name + "的魔宠");
	}



	// public has0hp(): Boolean {
	// 	return this.playerVo.getHp() <= 0;
	// }

	public getPoseState(): PoseState {
		if (this.petVo) {
			return this.petVo.poseState;
		}
		return null;
	}

	public getDirState(): DirState {
		if (this.petVo != null) {
			return this.petVo.dirState;
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

	private _n: number = 0;
	public step(): void {
		var a = this;
		a._n++;
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
		if (a._n % 50 == 0) {
			a.followTo();
		}
	}


	public followTo(point: Point = null, changeSpeed: number = 0): void {
		var a = this;
		if (a.getPoseState().getState() == PoseState.ATTACK)
			return;
		if (point == null) {
			point = new Point(this._owner.x, this._owner.y)
		}
		var dis: Number = Point.distance(point, new Point(this.x, this.y));
		if (changeSpeed > 0) {
			a.setSpeed(changeSpeed);
		}
		else if (dis < 150) {
			if (a.getPoseState().getState() == PoseState.MOVE) {
				a.getPoseState().setState(PoseState.STAND);
			}
			return;
		}
		else if (dis < 220) {
			if (dis < 150) {
				a.setSpeed(this._owner.getSpeed() * 0.8);
				// speed = owner.speed * 0.8;
			}
			else {
				// speed = owner.speed;
				a.setSpeed(this._owner.getSpeed());
			}
		}
		else if (dis >= 220) {
			// speed = owner.speed * 2;
			a.setSpeed(this._owner.getSpeed());
		}

		var angle: number = Math.atan2(point.y - this.y, point.x - this.x);
		var ppoint: Point = new Point(this._owner.x + (TileUtil.GRID_WIDTH * 2) * Math.cos(angle), this._owner.y + (TileUtil.GRID_HEIGHT * 3) * Math.sin(angle));
		var tmpdir: number = MapUtil.judgeDir(this.x, this.y, ppoint.x, ppoint.y);
		// dirState.state = tmpdir;
		this.getDirState().setState(tmpdir);

		this.move(ppoint);
	}

	private setScale(scale: number): void {
		this._bodyMovieClip.scaleX = scale;
		if (this._weaponMovieClip) this._weaponMovieClip.scaleX = scale;
	}

	public toDead(): void {
		super.toDead();
		this.dispatchEvent(new ParamEvent(SceneEvtName.DEAD));
	}

	//完全销毁
	public dispose() {
		var a = this;
		super.dispose();
		SourceCache.getInstance().removeEventListener(SourceCache.LOAD_ANIMATION_COMPLETE, a.loadResComplete, a);
		// a.petVo.removeEventListener(PetBaseVO.CHANGE_PET_WEAPON, a.changeWeaponHandle, a);
		a.petVo.removeEventListener(PetBaseVO.CHANGE_PET_CLOTH, a.changeClothHandle, a);
		if (a._owner && a._owner.playerVo) a._owner.playerVo.removeEventListener(PlayerBaseVO.CHANGE_PET_WEAPON, a.changeWeaponHandle, a);
		a._n = 0;
	}

	public clear(): void {
		var a = this;
		super.clear();
		SourceCache.getInstance().removeEventListener(SourceCache.LOAD_ANIMATION_COMPLETE, a.loadResComplete, a);
		a.petVo.removeEventListener(PetBaseVO.CHANGE_PET_CLOTH, a.changeClothHandle, a);
		// a.petVo.removeEventListener(PetBaseVO.CHANGE_PET_WEAPON, a.changeWeaponHandle, a);
		if (a._owner && a._owner.playerVo) a._owner.playerVo.removeEventListener(PlayerBaseVO.CHANGE_PET_WEAPON, a.changeWeaponHandle, a);
		a._n = 0;
	}
	public getVo(): PetBaseVO {
		return this.petVo;
	}

	private _skillEffect: UIEffect;
	public playSkillEffect(url: string, px: number, py: number, delay: number, isLoop: boolean, childIndex: number = -1): void {
		if (this._skillEffect) {
			this._skillEffect.dispose();
			this._skillEffect = null;
		}
		this._skillEffect = EffectManager.getInstance().showEffect(url, px, py, this, delay, isLoop, false, 0, false, 0, true, 1, -1, 0, childIndex);
	}


	private changeClothHandle(event: ParamEvent): void {
		this.updateCloth();
	}
	private changeWeaponHandle(event: ParamEvent): void {
		var a = this;
		if (a._owner != null && a._owner.playerVo != null && a.petVo != null) {
			a.petVo.setWeapon(a._owner.playerVo.getAppVo().getPetWeapon());
		}
		this.updateWeapon();
	}


	public getPropertyVo(): PropertyVO {
		return this.petVo.getPropertyVo();
	}
	// public get ownerID() {
	// 	if (this.petVo) {
	// 		return this.petVo.petId;
	// 	}
	// 	return "";
	// }

	// public getBelongID(): string {
	// 	return this.ownerID;
	// }
}