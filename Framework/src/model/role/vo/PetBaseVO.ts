class PetBaseVO extends LiveThingVo {
	public static CHANGE_PET_CLOTH: string = "CHANGE_PET_CLOTH";
	public static CHANGE_PET_WEAPON: string = "CHANGE_PET_WEAPON";

	public poseState: PoseState;
	public dirState: DirState;
	public name: string = "";
	public petId: number = 0;
	public platform: string = "";
	private _skinId: number = 0;
	private _weapon: any;
	public constructor() {
		super();
		this.poseState = new PoseState();
		this.init();
	}
	protected init(): void {
		this.poseState = new PoseState();
		this.dirState = new DirState();
		this.dirState.setState(2);
	}
	public getPetId(): string {
		return this.petId + "";
	}

	//拼上平台标识的伙伴id
	public get uid(): string {
		return this.platform + "_" + this.petId;
	}


	//获取衣服url
	private _bodyURL: string = "";
	public getBodyURL(isPicking: boolean = false): string {
		this._bodyURL = null;
		var actionStr: string = "stand";
		if (this.poseState.getState() == PoseState.STAND) {
			actionStr = "stand";
		}
		else if (this.poseState.getState() == PoseState.MOVE) {
			actionStr = "run";
		}
		else if (this.poseState.getState() == PoseState.ATTACK) {
			actionStr = "attack";
		}
		else if (this.poseState.getState() == PoseState.HITED) {
			actionStr = "behit";
		}
		else if (this.poseState.getState() == PoseState.DEAD) {
			actionStr = "dead";
		}
		this._bodyURL = UrlUtil.getPetClothURL(this._skinId) + actionStr + this.dirState.getFrame();
		return this._bodyURL;
	}
	//获取weapon url
	private _weaponURL: string = "";
	public getWeaponURL(isPicking: boolean = false): string {
		this._bodyURL = null;
		var actionStr: string = "stand";
		if (this.poseState.getState() == PoseState.STAND) {
			actionStr = "stand";
		}
		else if (this.poseState.getState() == PoseState.MOVE) {
			actionStr = "run";
		}
		else if (this.poseState.getState() == PoseState.ATTACK) {
			actionStr = "attack";
		}
		else if (this.poseState.getState() == PoseState.HITED) {
			actionStr = "behit";
		}
		else if (this.poseState.getState() == PoseState.DEAD) {
			actionStr = "dead";
		}
		var type: number = 0;
		if (this._weapon == null) return null;
		if (this._weapon.type == 10) {
			type = 1;
		} else if (this._weapon.type == 11) {
			type = 2;
		} else if (this._weapon.type == 12) {
			type = 3;
		}
		this._bodyURL = UrlUtil.getPetWeaponURL(type, this._weapon.value) + actionStr + this.dirState.getFrame();
		return this._bodyURL;
	}
	public setSkinId(value: number): void {
		if (this._skinId == value) return;
		this._skinId = value;
		this.dispatchEvent(new ParamEvent(PetBaseVO.CHANGE_PET_CLOTH));
	}
	public getSkinId(): number {
		return this._skinId;
	}
	public setWeapon(value: any): void {
		this._weapon = value;
		// this.dispatchEvent(new ParamEvent(PetBaseVO.CHANGE_PET_WEAPON));
	}
	public getWeapon(): any {
		return this._weapon;
	}
}