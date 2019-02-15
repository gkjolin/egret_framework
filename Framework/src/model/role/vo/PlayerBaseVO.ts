class PlayerBaseVO extends LiveThingVo {
	public static CHANGE_HEAD: string = "change_head";
	public static CHANGE_GONGHUI: string = "change_gonghui";
	public static CHANGE_GONGHUI_POSITION: string = "change_gonghui_position";
	public static CHANGE_VIP: string = "changevip";
	public static CHANGE_ZHANGONG: string = "changeZhanGong";
	public static CHANGE_WEAPON: string = "changeWeapon";
	public static CHANGE_CLOTH: string = "changeCloth";
	public static CHANGE_IMAGEID: string = "changeImageId";
	public static CHANGE_WING: string = "CHANGE_WING";
	public static CHANGE_PET_WEAPON: string = "CHANGE_PET_WEAPON";
	public static CHANGE_FIGHTVALUE: string = "CHANGE_FIGHTVALUE";
	public static CHANGE_SIN: string = "change_sin";
	public static CHANGE_CAREER: string = "change_career";
	public static CHANGE_SEX: string = "CHANGE_SEX";

	public isRole: boolean = false;
	public ranger: number = 2;//射程
	public poseState: PoseState;
	public dirState: DirState;
	public parnerID: number;//伙伴ID(一个玩家只有一个玩家id，不过一个玩家会有几个伙伴)
	public name: string;//角色名字
	public buffDic: Object;
	public useType: number = 0;//0是真实的玩家，1是假玩家，在场景中作为pk玩家在假打小怪的
	public attackVirtualMon: MonsterVO;//假人攻击的假怪物

	private _bangID: number;  // 公会id
	private _fightValue: number = 0;//战斗力
	private _bangCareer: number;	//公会职位 0没有公会 1会长 2副会长 3长老 4堂主 5帮众
	private _sinValue: number; // 罪恶值
	private _career: number = 0;	//职业 1单剑(女) 2:双剑(男) 3:弓(女) 4:火枪(男)
	private _sex: number = 0;//性别1是男，2是女
	private _vip: number;
	private _weaponUrl: string;
	private _bodyURL: string;
	private _wingUrl: string;
	private _ringUrl: string;
	private _propertyVo: PropertyVO;
	private _appVo: AppearanceVO;
	private _exp: number;//经验
	private _round: number;//转生
	private _gm: number;//是否gm
	private _level: number;//等级
	private _skillList: Array<NodeSkill>;
	private _guildName: string = "";
	public platform: string;

	public static ROBOT_COUNT: number = 1;
	// public autoKillId:number = 0;

	public static SPEED: number = 240;
	public static COMMON: number = 0;
	public static MEET: number = 1;
	public static VIRTUAL: number = 2;
	public static FIGHTER: number = 3;//添加出来要去打怪物的，同屏场景的时候用到，暂时用于全民boss
	public static REAL: number = 4;//添加出来是受玩家控制的，暂时用于攻城战的里面3个场景
	public static HELP_FIGHTER: number = 5;//添加出来是帮玩家打架的，暂时用于公会副本
	public constructor() {
		super();
		this.init();
	}

	protected init(): void {
		this.poseState = new PoseState();
		this.dirState = new DirState();
		this.dirState.setState(2);
		this.buffDic = new Object();
		this._skillList = new Array();
	}

	//公会改变
	public setBangID(value: number): void {
		if (this._bangID != value) {
			this._bangID = value;
			this.dispatchEvent(new egret.Event(PlayerBaseVO.CHANGE_GONGHUI));
		}
	}
	public getBangID(): number {
		return this._bangID;
	}

	//公会职位改变
	public getBangCareer(): number {
		return this._bangCareer;
	}
	public setBangCareer(value: number): void {
		if (value != this._bangCareer) {
			this._bangCareer = value;
			this.dispatchEvent(new ParamEvent(PlayerBaseVO.CHANGE_GONGHUI_POSITION));
		}
	}

	//战斗力改变
	public getFightValue(): number {
		return this._fightValue;
	}

	public setFightValue(value: number): void {
		if (this._fightValue == value) return;
		this._fightValue = value;
	}

	//罪恶值
	public setSinValue(value: number): void {
		if (this._sinValue != value) {
			this._sinValue = value;
			this.dispatchEvent(new ParamEvent(PlayerBaseVO.CHANGE_SIN));
		}
	}
	public getSinValue(): number {
		return this._sinValue;
	}

	//职业改变
	public getCareer(): number {
		return this._career;
	}
	public setCareer(value: number): void {
		if (this._career != value) {
			this._career = value;
			this.dispatchEvent(new egret.Event(PlayerBaseVO.CHANGE_CAREER));
		}
	}

	//性别改变
	public getSex(): number {
		return this._sex;
	}
	public setSex(value: number): void {
		if (this._sex != value) {
			this._sex = value;
			this.dispatchEvent(new egret.Event(PlayerBaseVO.CHANGE_SEX));
		}
	}

	//设置武器
	// public setWeapon(value: number): void {
	// 	if (this._weapon != value) {
	// 		this._weapon = value;
	// 		this.dispatchEvent(new egret.Event(PlayerBaseVO.CHANGE_WEAPON));
	// 	}
	// }
	public getWeapon(): number {
		if (this._appVo.weaponFashion > 0) return this._appVo.weaponFashion;
		return this._appVo.weapon;
	}

	//设置衣服
	// public setCloth(value: number): void {
	// 	if (this._cloth != value) {
	// 		this._cloth = value;
	// 		this.dispatchEvent(new egret.Event(PlayerBaseVO.CHANGE_CLOTH));
	// 	}
	// }
	public getCloth(): number {
		if (this._appVo.clothFashion > 0) return this._appVo.clothFashion;
		return this._appVo.cloth;
	}

	//设置vip
	public setVip(value: number): void {
		if (this._vip != value) {
			this._vip = value;
			this.dispatchEvent(new egret.Event(PlayerBaseVO.CHANGE_VIP));
		}
	}
	public getVip(): number {
		return this._vip;
	}

	//获取武器的url
	public getWeaponURL(isPicking: boolean = false): string {
		if (this._appVo == null || this._appVo.weapon == 0) {
			return null;
		}
		this._weaponUrl = null;
		var actionStr: string = "stand";
		if (this.poseState.getState() == PoseState.STAND) {
			actionStr = "stand";
		}
		else if (this.poseState.getState() == PoseState.MOVE) {
			actionStr = "run";
		}
		else if (this.poseState.getState() == PoseState.ATTACK) {
			if (this._career == Tools.ZHANSHI) {
				actionStr = "attack";
			}
			else {
				actionStr = "magic";
			}
		}
		else if (this.poseState.getState() == PoseState.HITED) {
			actionStr = "behit";
		}
		else if (this.poseState.getState() == PoseState.DEAD) {
			actionStr = "dead";
		}
		var id: number = this._appVo.weapon;
		if (this._appVo.weaponFashion > 0) {
			id = this._appVo.weaponFashion;
		}
		if (isPicking) {
			actionStr = "run";
		}
		this._weaponUrl = UrlUtil.getWeaponURL(this._sex, id) + actionStr + this.dirState.getFrame();
		// this._weaponUrl = UrlUtil.getWeaponURL(this._sex, id) + actionStr;
		return this._weaponUrl;
	}

	public getRingUrl(): string {
		var appVo = this.getAppVo();
		if (appVo == null || appVo.ring == 0) {
			return null;
		}
		this._ringUrl = UrlUtil.getRingURL(appVo.ring);
		return this._ringUrl;
	}

	//获取衣服url
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
			if (this._career == Tools.ZHANSHI) {
				actionStr = "attack";
			}
			else {
				actionStr = "magic";
			}
		}
		else if (this.poseState.getState() == PoseState.HITED) {
			actionStr = "behit";
		}
		else if (this.poseState.getState() == PoseState.DEAD) {
			actionStr = "dead";
		}
		var id: number = this._appVo.cloth;
		if (this._appVo.clothFashion > 0) {
			id = this._appVo.clothFashion;
		}
		if (isPicking) {
			actionStr = "run";
		}
		this._bodyURL = UrlUtil.getClothURL(this._career, this._sex, id) + actionStr + this.dirState.getFrame();
		// this._bodyURL = UrlUtil.getClothURL(this._career, this._sex, id) + actionStr;
		return this._bodyURL;
	}

	//获取翅膀url
	public getWingURL(isPicking: boolean = false): string {
		if (this._appVo == null || this._appVo.wing == 0) {
			return null;
		}
		var wingID: number = this.getWingID();
		this._wingUrl = null;
		var actionStr: string = "stand";
		if (this.poseState.getState() == PoseState.STAND) {
			actionStr = "stand";
		}
		else if (this.poseState.getState() == PoseState.MOVE) {
			actionStr = "run";
		}
		else if (this.poseState.getState() == PoseState.ATTACK) {
			if (this._career == Tools.ZHANSHI) {
				actionStr = "attack";
			}
			else {
				actionStr = "magic";
			}
		}
		else if (this.poseState.getState() == PoseState.HITED) {
			actionStr = "behit";
		}
		else if (this.poseState.getState() == PoseState.DEAD) {
			actionStr = "dead";
		}
		if (isPicking) {
			actionStr = "run";
		}
		this._wingUrl = UrlUtil.getWingURL(wingID) + actionStr + this.dirState.getFrame();
		// this._wingUrl = UrlUtil.getWingURL(wingID) + actionStr;
		return this._wingUrl;
	}

	public getTypeActionUrl(type: string, actionStr: string): string {
		if (this._appVo == null) {
			return null;
		}
		var url: string;
		switch (type) {
			case "body":
				var id: number = this._appVo.cloth;
				if (this._appVo.clothFashion > 0) {
					id = this._appVo.clothFashion;
				}
				url = UrlUtil.getClothURL(this._career, this._sex, id);
				break;
			case "wing":
				var wingID: number = this.getWingID();
				url = UrlUtil.getWingURL(wingID);
				break;
			case "weapon":
				var id: number = this._appVo.weapon;
				if (this._appVo.weaponFashion > 0) {
					id = this._appVo.weaponFashion;
				}
				url = UrlUtil.getWeaponURL(this._sex, id);
				break;
			default:
				url = null;
				break;
		}
		if (url) {
			url += actionStr + this.dirState.getFrame();
		}
		return url;
	}

	//获取攻击距离
	public getAttackRange(): number {
		if (this._career == Tools.FASHI || this._career == Tools.DAOSHI)//如果法师或者道士
		{
			return 192;
		}
		return 112;
	}
	// public getAttackRange(): Point {
	// 	var rangerX: number = 0;
	// 	if (this._career == 2 || this._career == 3)//如果法师或者道士
	// 	{
	// 		rangerX = 4;
	// 	} else {
	// 		rangerX = 3;
	// 	}
	// 	return new Point(rangerX, rangerX * 1.5);
	// }

	public getWingID(): number {
		if (this._appVo.wingFashion > 0) {
			return this._appVo.wingFashion;
		}
		return this._appVo.wing;
		// var config: WingDataVO = WingModel.getInstance().getWingDataVOByTemplateId(this._appVo.wing);
		// if (config == null) {
		// 	return 0;
		// }
		// return config.advance_lev;
	}

	//设置属性列表
	public setPropertyVo(vo: PropertyVO): void {
		if (PropertyUtil.checkProVoDiff(this._propertyVo, vo)) {
			this._propertyVo = vo;
			GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.PRO_LIST_CHANGE, { id: this.parnerID }));
		}
	}
	public getPropertyVo(): PropertyVO {
		return this._propertyVo;
	}

	public setExp(value: number): void {
		this._exp = value;
	}
	public getExp(): number {
		return this._exp;
	}

	public setRound(value: number): void {
		this._round = value;
	}
	public getRound(): number {
		return this._round;
	}

	public setGM(value: number): void {
		this._gm = value;
	}
	public getGM(): number {
		return this._gm;
	}

	public setSkillList(list: Array<NodeSkill>): void {
		//设置技能cd
		// var newList = new Array();
		// for (var k = 0; k < list.length; k++) {
		// 	var node = list[k];
		// 	var sVo: SkillVo = SkillModel.getInstance().getSkill(node.skill_id);
		// 	if (sVo.replace > 0) {
		// 		continue;
		// 	}
		// 	newList.push(node);
		// }
		var newList = list;
		this._skillList = newList;
		for (var i: number = 0; i < newList.length; i++) {
			var node: NodeSkill = newList[i];
			SkillModel.getInstance().cdSkill(this.uid, node.skill_id);
		}
		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.SKILL_INFO_CHANGE, { id: this.parnerID }));
	}
	public getSkillList(): Array<NodeSkill> {
		return this._skillList;
	}

	//设置外观列表
	public setAppVo(vo: AppearanceVO): void {
		if (AppearanceUtil.checkAppVoDiff(this._appVo, vo)) {
			var isUpdateCloth: boolean;
			var isUpdateWeapon: boolean;
			var isUpdateWing: boolean;
			var isUpdateTitle: boolean;
			var isUpdateRing: boolean;
			var isUpdatePetWeapon: boolean;

			if (this._appVo != null) {
				isUpdateCloth = (this._appVo.cloth != vo.cloth || this._appVo.clothFashion != vo.clothFashion);
				isUpdateWeapon = (this._appVo.weapon != vo.weapon || this._appVo.weaponFashion != vo.weaponFashion);
				isUpdateWing = (this._appVo.wing != vo.wing || this._appVo.wingFashion != vo.wingFashion);
				isUpdateTitle = this._appVo.title != vo.title;
				isUpdateRing = this._appVo.ring != vo.ring;
				isUpdatePetWeapon = (this._appVo.pet_weapon_10 != vo.pet_weapon_10 || this._appVo.pet_weapon_11 != vo.pet_weapon_11 || this._appVo.pet_weapon_12 != vo.pet_weapon_12);
			}
			this._appVo = vo;
			if (isUpdateCloth) {
				this.dispatchEvent(new ParamEvent(PlayerBaseVO.CHANGE_CLOTH));
				GameDispatcher.getInstance().dispatchEvent(new ParamEvent(PlayerBaseVO.CHANGE_CLOTH, { id: this.parnerID }));
			}
			if (isUpdateWeapon) {
				this.dispatchEvent(new ParamEvent(PlayerBaseVO.CHANGE_WEAPON));
				GameDispatcher.getInstance().dispatchEvent(new ParamEvent(PlayerBaseVO.CHANGE_WEAPON, { id: this.parnerID }));
			}
			if (isUpdateWing) {
				this.dispatchEvent(new ParamEvent(PlayerBaseVO.CHANGE_WING));
				GameDispatcher.getInstance().dispatchEvent(new ParamEvent(PlayerBaseVO.CHANGE_WING, { id: this.parnerID }));
			}
			if (isUpdateTitle) {
				GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.CHANGE_TITLE, { id: this.parnerID }));
			}
			if (isUpdateRing) {
				GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.CHANGE_RING, { id: this.parnerID }));
			}
			if (isUpdatePetWeapon) {
				this.dispatchEvent(new ParamEvent(PlayerBaseVO.CHANGE_PET_WEAPON));
				// GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.CHANGE_PET_WEAPON, { id: this.parnerID }));
			}
		}
	}
	public getAppVo(): AppearanceVO {
		return this._appVo;
	}

	public clone(percent: number): PlayerBaseVO {
		var baseVo: PlayerBaseVO = new PlayerBaseVO();
		baseVo.id = this.id + 1000;
		baseVo.name = this.name;
		baseVo.setLev(this.getLev());
		baseVo.setRound(this.getRound());
		baseVo.setGM(this.getGM());
		baseVo.parnerID = this.parnerID + 1000;
		baseVo.setCareer(this._career);
		baseVo.setSex(this._sex);
		baseVo.setSpeed(200);
		var proVo: PropertyVO = this._propertyVo.clone();
		baseVo.setPropertyVo(proVo);
		baseVo.setMaxHp(proVo.getValue(PropertyVO.HP));
		baseVo.setHp(proVo.getValue(PropertyVO.HP));
		baseVo.setMaxMp(proVo.getValue(PropertyVO.MP));
		baseVo.setMp(proVo.getValue(PropertyVO.MP));
		baseVo.setSkillList(this.getSkillList());
		baseVo.setFightValue(this._fightValue);
		var appVo: AppearanceVO = this._appVo.clone();
		baseVo.setAppVo(appVo);
		return baseVo;
	}

	public get guildName() {
		return this._guildName;
	}
	public set guildName(str: string) {
		if (this._guildName != str) {
			this._guildName = str;
			this.dispatchEvent(new ParamEvent(PlayerBaseVO.CHANGE_GONGHUI));
		}
	}

	public getHeadIcon(): number {
		return this._career * 1000 + this._sex;
	}

	//拼上平台标识的伙伴id
	public get uid(): string {
		return this.platform + "_" + this.parnerID;
	}

	//拼上平台标识的角色id
	public get pid(): string {
		return this.platform + "_" + this.id;
	}

	public static makeUid(platform: string, id: number): string {
		if (platform == null) {
			platform = Tools.getPageParams("platform");
		}
		if (platform == null || platform == "") {
			platform = RoleModel.getInstance().getRoleCommon().platform;
		}
		return platform + "_" + id;
	}
}