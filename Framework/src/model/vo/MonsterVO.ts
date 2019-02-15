class MonsterVO extends LiveThingVo {
	public typeId: number;
	public realm: number;
	public attackType: number;
	public monsterType: number;
	public bossType: number = 0;
	public path: Array<any>;
	public resType: number;//0怪物  1坐骑
	public startDirstate: number = 0;
	public resID: number = 0;//资源id
	private _hasShodow: boolean = true;
	/**使用monsterVo的名字*/
	public toAttackId: number = 0;
	public born: boolean = false;
	public poseState: PoseState;
	public dirState: DirState;
	public useType: number = 0;
	/**buff列表*/
	public buffDic: Object;
	public static CHANGERESID: string = "changeResId";
	//怪物类型，1普通怪，2关卡BOSS，3个人BOSS，4全民boss，5转生boss，6遭遇boss,7副本怪物
	public static SMALL: number = 1;
	public static WAVE_BOSS: number = 2;
	public static PERSON_BOSS: number = 3;
	public static PEOPLE_BOSS: number = 4;
	public static ROUND_BOSS: number = 5;
	public static MEET_BOSS: number = 6;
	public static COPY_MONSTER: number = 7;

	//怪物用途类型，0是普通怪物，1是假的怪物
	public static VIRTUAL: number = 1;
	public static COMMON: number = 0;
	public static PET: number = 2;//道士的宝宝
	public static MEETBOSS: number = 3;

	public propertyVo: PropertyVO;
	public dropInfo: Array<NodeDrop_list>;
	public isPetMonster: boolean = false;

	private _body: number = 0;
	private _resId: number;
	private _color: number = 0;
	private _isCanBeAttack: boolean = true;
	public appVo: AppearanceVO;//外观vo，有这个值的，就是人形怪物
	public job: number = 0;
	public sex: number = 0;
	public guildName: string = "";
	public static YUELING_RES: number = 102;
	public static DOG_RES: number = 101;
	public constructor() {
		super();
	}

	protected init(): void {
		super.init();
		this.buffDic = new Object();
		this.poseState = new PoseState();
		this.dirState = new DirState();
	}

	/**
		 *是否可被攻击 
		 */
	public getIsCanBeAttack(): boolean {
		return this._isCanBeAttack;
	}

	/**
	 * @private
	 */
	public setIsCanBeAttack(value: boolean): void {
		this._isCanBeAttack = value;
	}

	public getResId(): number {
		return this._resId;
	}

	public setResId(value: number): void {
		if (this._resId != value) {
			this._resId = value;
			this.dispatchEvent(new ParamEvent(MonsterVO.CHANGERESID));
		}
	}

	public getPropertyVo(): PropertyVO {
		return this.propertyVo;
	}
}