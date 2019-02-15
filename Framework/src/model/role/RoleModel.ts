class RoleModel extends egret.EventDispatcher {
	private static _instance: RoleModel;
	private _roleBaseInfo: PlayerBaseVO;//当前角色的基本信息
	private _roleInfo: PlayerInfoVO;
	private _roleCommon: SCMD10200;
	private _roleList: Array<PlayerBaseVO>;
	private _petList: Array<PetBaseVO>;
	private _expDic: Object;
	public serverTime: number = 0;//服务器当前时间
	public offlineRewardData: SCMD10203;//离线奖励数据

	public static ROLE_LV_EXP_CHANGE: string = "ROLE_LV_EXP_CHANGE";
	public static ROLE_LV_UP: string = "ROLE_LV_UP";
	public static ROLE_LV_CHANGE: string = "ROLE_LV_CHANGE";
	public static ROLE_ROUND_CHANGE: string = "ROLE_ROUND_CHANGE";
	public static ROLE_PARTNERLIST_CHANGE: string = "ROLE_PARTNERLIST_CHANGE";
	public static UPDATE_PARTNER_INFO: string = "UPDATE_PARTNER_INFO";
	public static UPDATE_ROLE_NAME: string = "UPDATE_ROLE_NAME";
	public static ROLE_HEAD_CHANGE: string = "ROLE_HEAD_CHANGE";
	private _showPet: number = 0;
	public constructor() {
		super();
		this.init();
	}

	private init(): void {
		this._roleInfo = new PlayerInfoVO();
	}

	//获取伙伴列表
	public getPartnerList(): Array<PlayerBaseVO> {
		return this._roleList;
	}

	//获取某个伙伴的技能列
	public getPartnerSkillList(parnerID: number): Array<NodeSkill> {
		var playerVo: PlayerBaseVO;
		for (var i: number = 0; i < this._roleList.length; i++) {
			playerVo = this._roleList[i];
			if (playerVo.parnerID == parnerID) {
				return playerVo.getSkillList();
			}
		}
	}
	private updatePetHandler(): void {
		var pvo: PlayerBaseVO;
		var petid: number = 0;
		var weapon: any;
		for (var i: number = 0; i < this._roleList.length; i++) {
			pvo = this._roleList[i];
			if (pvo.getAppVo().pet > 0) {
				petid = pvo.getAppVo().pet;
			}
			if (pvo.getAppVo().getPetWeapon() != null) {
				weapon = pvo.getAppVo().getPetWeapon();
			}
		}
		if (petid <= 0) {
			this.removeMyPet();
		} else {
			if (this._petList == null || this._petList.length <= 0) {
				this.addMyPet(petid, weapon);
			} else {
				this._petList[0].setSkinId(petid);
				this._petList[0].setWeapon(weapon);
			}
		}
		this.dispatchEvent(new ParamEvent(EventName.PETFIGURE_CHANGE));
	}
	public addMyPet(showId: number, weapon: any = null): void {
		if (this._petList == null) {
			this._petList = [];
		}
		if (this._roleList == null) return;
		var pvo: PlayerBaseVO = this._roleList[0];
		if (pvo == null) return;

		var petVO: PetBaseVO = this.changeMyPetPartnerToVo(pvo, showId, weapon);
		petVO.x = pvo.x + 2;
		petVO.y = pvo.y + 2;
		this._petList.push(petVO);
		SceneModel.getInstance().addPet(petVO, true);
	}
	public removeMyPet(): void {
		if (this._petList == null) return;
		var pvo: PetBaseVO = this._petList.shift();
		if (pvo == null) return;
		SceneModel.getInstance().removePet(pvo.uid);

	}
	//获取宠物列表
	public getPetList(): Array<PetBaseVO> {
		return this._petList;
	}
	public static getInstance(): RoleModel {
		if (RoleModel._instance == null) {
			RoleModel._instance = new RoleModel();
		}
		return RoleModel._instance;
	}

	//读取登录信息
	public readLoginInfo(scmd: SCMD10200): void {
		this._roleCommon = scmd;
	}

	//玩家基础信息
	public getRoleBaseInfo(): PlayerBaseVO {
		return this._roleBaseInfo;
	}

	//获取活着的伙伴
	public getAliveRole(): PlayerBaseVO {
		var list: Array<PlayerBaseVO> = this._roleList;
		var vo: PlayerBaseVO;
		var i: number = 0;
		var result: PlayerBaseVO;
		for (i = 0; i < list.length; i++) {
			vo = list[i];
			if (vo.getCareer() == this._roleCommon.career) {
				if (vo.getHp() > 0) {
					result = vo;
					break;
				}
			}
		}
		if (result == null) {
			for (i = 0; i < list.length; i++) {
				vo = list[i];
				if (vo.getHp() > 0) {
					result = vo;
					break;
				}
			}
		}
		return result;
	}

	public getRoleInfo(): PlayerInfoVO {
		return this._roleInfo;
	}
	public setRoleList(roleList: SCMD10300): void {
		var node: NodePartner_list;
		var baseVo: PlayerBaseVO;
		var i: number = 0;
		//初始化的时候收到协议是登录的时候来的，再收到的话，就是新加的小伙伴了
		if (this._roleList == null) {
			this._roleList = new Array();
			for (i = 0; i < roleList.partner_list.length; i++) {
				node = roleList.partner_list[i];
				baseVo = this.changeMyNodePartnerToVo(node);
				baseVo.setRound(this._roleCommon.round);
				baseVo.setLev(this._roleCommon.level);
				if (baseVo.getCareer() == this._roleCommon.career) {
					this._roleBaseInfo = baseVo;
				}
				this._roleList.push(baseVo);
			}
			SkillModel.getInstance().updateSkillDic();
		}
		else {
			var oldLen: number = this._roleList.length;
			var oldFightValue: number = this.getAllPartnerFight();
			for (i = 0; i < roleList.partner_list.length; i++) {
				node = roleList.partner_list[i];
				var uid = PlayerBaseVO.makeUid(Tools.getPageParams("platform"), node.partner_id);
				baseVo = this.getPartnerInfo(uid);
				if (baseVo == null) {
					baseVo = this.changeMyNodePartnerToVo(node);
					if (this._roleBaseInfo) {
						baseVo.x = this._roleBaseInfo.x + 1;
						baseVo.y = this._roleBaseInfo.y + 1;
					}
					this._roleList.push(baseVo);
				}
				else {
					this.updatePartner(node);
					this.dispatchEvent(new ParamEvent(RoleModel.UPDATE_PARTNER_INFO, { id: node.partner_id }));
				}
			}
			SkillModel.getInstance().updateSkillDic();
			var nowLen: number = this._roleList.length;
			var nowFightValue: number = this.getAllPartnerFight();
			if (nowLen > oldLen) {
				this.dispatchEvent(new ParamEvent(RoleModel.ROLE_PARTNERLIST_CHANGE, { vo: baseVo }));
			}
			if (nowFightValue != oldFightValue) {
				GameDispatcher.getInstance().dispatchEvent(new ParamEvent(PlayerBaseVO.CHANGE_FIGHTVALUE));
			}
		}
		this.updatePetHandler();
	}

	//更新伙伴信息
	public updatePartner(node: NodePartner_list): void {
		var uid = PlayerBaseVO.makeUid(null, node.partner_id);
		var baseVo: PlayerBaseVO = this.getPartnerInfo(uid);
		if (baseVo) {
			var proVo: PropertyVO = PropertyUtil.changeProListToVo(node.attr);
			baseVo.setPropertyVo(proVo);
			baseVo.setMaxHp(proVo.getValue(PropertyVO.HP));
			baseVo.setHp(proVo.getValue(PropertyVO.HP));
			baseVo.setMaxMp(proVo.getValue(PropertyVO.MP));
			baseVo.setMp(proVo.getValue(PropertyVO.MP));
			baseVo.setSkillList(node.skill);
			baseVo.setFightValue(node.power);
			var appVo = AppearanceUtil.changeAppListToVo(node.appearance);
			baseVo.setAppVo(appVo);
		}
	}

	//自己的伙伴专用信息
	private changeMyNodePartnerToVo(node: NodePartner_list): PlayerBaseVO {
		var baseVo: PlayerBaseVO = new PlayerBaseVO();
		baseVo.id = this._roleCommon.role_id;
		baseVo.name = this._roleCommon.name;
		baseVo.setLev(this._roleCommon.level);
		baseVo.setRound(this._roleCommon.round);
		baseVo.setGM(this._roleCommon.gm);
		baseVo.setExp(this._roleCommon.exp);
		baseVo.parnerID = node.partner_id;
		baseVo.setCareer(node.career);
		baseVo.setSex(node.sex);
		baseVo.setSpeed(PlayerBaseVO.SPEED);
		baseVo.guildName = this._roleCommon.guild_name;
		baseVo.setBangID(this._roleCommon.guild_id);
		var proVo: PropertyVO = PropertyUtil.changeProListToVo(node.attr);
		baseVo.setPropertyVo(proVo);
		baseVo.setMaxHp(proVo.getValue(PropertyVO.HP));
		baseVo.setHp(proVo.getValue(PropertyVO.HP));
		baseVo.setMaxMp(proVo.getValue(PropertyVO.MP));
		baseVo.setMp(proVo.getValue(PropertyVO.MP));
		baseVo.setSkillList(node.skill);
		baseVo.setFightValue(node.power);
		var appVo: AppearanceVO = AppearanceUtil.changeAppListToVo(node.appearance);
		baseVo.setAppVo(appVo);
		baseVo.isRole = true;
		baseVo.platform = this._roleCommon.platform;
		if (appVo.pet > 0) {
			this.setPetFigure(appVo.pet);
		}
		return baseVo;
	}
	//自己的伙伴专用信息
	private changeMyPetPartnerToVo(node: PlayerBaseVO, showId: number, weapon: any = null): PetBaseVO {
		var baseVo: PetBaseVO = new PetBaseVO();
		baseVo.id = this._roleCommon.role_id;
		baseVo.name = this._roleCommon.name;
		baseVo.setLev(this._roleCommon.level);
		baseVo.petId = node.parnerID;
		baseVo.setSpeed(PlayerBaseVO.SPEED);
		baseVo.setSkinId(showId);
		baseVo.setWeapon(weapon);
		// var proVo: PropertyVO = PropertyUtil.changeProListToVo(node.attr);
		// baseVo.setPropertyVo(proVo);
		// var appVo: AppearanceVO = AppearanceUtil.changeAppListToVo(node.appearance);
		// baseVo.setAppVo(appVo);
		// baseVo.isRole = true;
		baseVo.platform = this._roleCommon.platform;
		return baseVo;
	}

	//其他人的
	public changeOtherNodePartnerToVo(node: NodePartner_list, meetVo: NodeMeet_roles): PlayerBaseVO {
		var baseVo: PlayerBaseVO = new PlayerBaseVO();
		baseVo.id = meetVo.role_id;
		baseVo.name = meetVo.name;
		baseVo.setLev(meetVo.level);
		baseVo.setRound(meetVo.round);
		baseVo.parnerID = node.partner_id;
		baseVo.setCareer(node.career);
		baseVo.setSex(node.sex);
		baseVo.setSpeed(PlayerBaseVO.SPEED);
		var proVo: PropertyVO = PropertyUtil.changeProListToVo(node.attr);
		baseVo.setPropertyVo(proVo);
		baseVo.setMaxHp(proVo.getValue(PropertyVO.HP));
		baseVo.setHp(proVo.getValue(PropertyVO.HP));
		baseVo.setMaxMp(proVo.getValue(PropertyVO.MP));
		baseVo.setMp(proVo.getValue(PropertyVO.MP));
		baseVo.setSkillList(node.skill);
		baseVo.setFightValue(node.power);
		var appVo: AppearanceVO = AppearanceUtil.changeAppListToVo(node.appearance);
		baseVo.setAppVo(appVo);
		baseVo.isRole = false;
		return baseVo;
	}

	public changeScenePartnerToVo(node: NodeScene_partner): PlayerBaseVO {
		var vo: PlayerBaseVO = new PlayerBaseVO();
		vo.parnerID = node.partner_id;
		vo.id = node.own_id;
		vo.name = node.name;
		vo.setCareer(node.career);
		vo.setSex(node.sex);
		vo.setHp(node.hp);
		vo.setMaxHp(node.max_hp);
		vo.setSkillList(node.skill);
		vo.setSpeed(PlayerBaseVO.SPEED);
		vo.setBangID(node.guild_id);
		vo.guildName = node.guild_name;
		var appVo: AppearanceVO = AppearanceUtil.changeAppListToVo(node.appearance);
		vo.setAppVo(appVo);
		vo.platform = node.plat_name;
		return vo;
	}

	private changeRobotPartnerToVo(): PlayerBaseVO {
		var baseVo: PlayerBaseVO = new PlayerBaseVO();
		baseVo.id = 99999 + PlayerBaseVO.ROBOT_COUNT;
		baseVo.setRound(this._roleCommon.round);
		baseVo.setExp(this._roleCommon.exp);
		baseVo.parnerID = baseVo.id;
		baseVo.setCareer(Tools.randRange(1, 3));
		baseVo.setSex(Tools.randRange(1, 2));
		baseVo.name = Tools.randomName(baseVo.getSex());
		baseVo.setSpeed(PlayerBaseVO.SPEED);
		baseVo.setMaxHp(100);
		baseVo.setHp(100);
		baseVo.setMaxMp(100);
		baseVo.setMp(100);
		var nodeSkill: NodeSkill = new NodeSkill();
		nodeSkill.cd = 400;
		nodeSkill.level = 1;
		nodeSkill.partner_id = baseVo.parnerID;
		nodeSkill.skill_id = SkillModel.getInstance().getBaseSkillByCareer(baseVo.getCareer());
		baseVo.setSkillList([nodeSkill]);
		var appVo: AppearanceVO = new AppearanceVO();
		baseVo.setAppVo(appVo);
		baseVo.isRole = false;
		PlayerBaseVO.ROBOT_COUNT++;
		return baseVo;
	}

	public getRoleCommon(): SCMD10200 {
		return this._roleCommon;
	}

	public getExpConfig(lv: number): RoleExpVo {
		if (this._expDic == null) {
			this._expDic = new Object();
			var config: Object = DataManager.getInstance().getObj("data_exp");
			var list: Array<any> = config["data_exp"];
			var obj: Object;
			var vo: RoleExpVo;
			for (var i: number = 0; i < list.length; i++) {
				obj = list[i];
				vo = new RoleExpVo();
				vo.level = obj["template_id"];
				vo.exp = obj["exp"];
				this._expDic[vo.level] = vo;
			}
		}
		return this._expDic[lv];
	}

	//获取当前等级的经验最大值，如果返回0，就表示已经是最高级了
	public getExpMax(): number {
		var lv: number = this._roleCommon.level;
		var nextVo: RoleExpVo = this.getExpConfig(lv + 1);
		if (nextVo == null) {
			return 0;
		}
		var expVo: RoleExpVo = this.getExpConfig(lv);
		return expVo.exp;
	}

	//设置玩家的等级或者经验
	private _lastLev: number = 0;
	public setRoleLevAndExp(lv: number, exp: number): void {
		this._roleCommon.level = lv;
		this._roleCommon.exp = exp;
		if (this._lastLev != this._roleCommon.level && this._lastLev != 0) {
			this.dispatchEvent(new ParamEvent(RoleModel.ROLE_LV_CHANGE));
			if (lv > this._lastLev) {
				this.dispatchEvent(new ParamEvent(RoleModel.ROLE_LV_UP));
			}
		}
		this._lastLev = lv;
		this.dispatchEvent(new ParamEvent(RoleModel.ROLE_LV_EXP_CHANGE));
	}

	//获取角色战斗力（就是所有伙伴的战力之和）
	public roleFight(): number {
		var result: number = 0;
		var list: Array<PlayerBaseVO> = this._roleList;
		var vo: PlayerBaseVO;
		for (var i: number = 0; i < list.length; i++) {
			vo = list[i];
			result += vo.getFightValue();
		}
		return result;
	}

	//找出伙伴
	public getPartnerInfo(id: string): PlayerBaseVO {
		var vo: PlayerBaseVO;
		for (var i: number = 0; i < this._roleList.length; i++) {
			vo = this._roleList[i];
			if (vo.uid == id) {
				return vo;
			}
		}
		return null;
	}

	//判断是否是自己的伙伴
	public isMyPartner(id: string): boolean {
		var vo: PlayerBaseVO;
		for (var i: number = 0; i < this._roleList.length; i++) {
			vo = this._roleList[i];
			if (vo.uid == id) {
				return true;
			}
		}
		return false;
	}

	private _skinObj: Object;
	private parseSkinConfig(): void {
		if (this._skinObj == null) {
			this._skinObj = new Object();
			var config: Object = DataManager.getInstance().getObj("data_config_skin");
			var list: Array<Object> = config["data_config_skin"];
			var obj: Object;
			var vo: RoleSkinVo;
			for (var i: number = 0; i < list.length; i++) {
				obj = list[i];
				vo = new RoleSkinVo();
				vo.id = obj["template_id"];
				vo.type = obj["type"];
				vo.skinID = obj["skin_id"];
				this._skinObj[vo.id] = vo;
			}
		}
	}

	//获取物品id对应的形象
	public getSkinVo(id: number): RoleSkinVo {
		this.parseSkinConfig();
		return this._skinObj[id];
	}

	//获取伙伴的某个技能信息
	public getPartnerSkillInfo(parnerID: string, skillID: number): NodeSkill {
		var vo: PlayerBaseVO = SceneModel.getInstance().getPlayer(parnerID);
		if (vo == null) {
			return null;
		}
		var skillList: Array<NodeSkill> = vo.getSkillList();
		var node: NodeSkill;
		for (var j: number = 0; j < skillList.length; j++) {
			node = skillList[j];
			if (node.skill_id == skillID) {
				return node;
			}
		}
		return null;
	}

	//根据职业找伙伴id
	public getPartnerIdByCareer(job: number): string {
		var playerVo: PlayerBaseVO;
		var list: Array<PlayerBaseVO> = this._roleList;
		for (var i: number = 0; i < list.length; i++) {
			playerVo = list[i];
			if (playerVo.getCareer() == job) {
				return playerVo.uid;
			}
		}
		return "";
	}

	//根据职业找伙伴
	public getPartnerByCareer(job: number): PlayerBaseVO {
		var playerVo: PlayerBaseVO;
		var list: Array<PlayerBaseVO> = this._roleList;
		for (var i: number = 0; i < list.length; i++) {
			playerVo = list[i];
			if (playerVo.getCareer() == job) {
				return playerVo;
			}
		}
		return null;
	}

	public setAllPartnerPos(p: Point): void {
		for (var i: number = 0; i < this._roleList.length; i++) {
			var node = this._roleList[i];
			node.x = p.x + Math.ceil(i / 2);
			node.y = p.y + Math.pow(-1, i);
			// node.x = p.x + Math.ceil(i / 2);
			// node.y = p.y + Math.pow(-1, i);
		}
	}

	public getMainRolePos(): Point {
		for (var i: number = 0; i < this._roleList.length; i++) {
			var node = this._roleList[i];
			if (node.getCareer() == this._roleCommon.career) {
				return new Point(node.x, node.y);
			}
		}
		return null;
	}

	//改变公会id
	public changeGuildID(guildID: number): void {
		if (this._roleCommon.guild_id != guildID) {
			this._roleCommon.guild_id = guildID;
			this.setAllPartnerGuildID();
			this.dispatchEvent(new ParamEvent(EventName.CHANGE_GUILD_ID))
		}
	}

	private setAllPartnerGuildID(): void {
		var vo: PlayerBaseVO;
		for (var i: number = 0; i < this._roleList.length; i++) {
			vo = this._roleList[i];
			vo.setBangID(this._roleCommon.guild_id);
		}
	}

	private setAllPartnerGuildName(): void {
		var vo: PlayerBaseVO;
		for (var i: number = 0; i < this._roleList.length; i++) {
			vo = this._roleList[i];
			vo.guildName = this._roleCommon.guild_name;
		}
	}

	//改变公会名称
	public changeGuildName(guildName: string): void {
		if (this._roleCommon.guild_name != guildName) {
			this._roleCommon.guild_name = guildName;
			this.setAllPartnerGuildName();
			this.dispatchEvent(new ParamEvent(EventName.CHANGE_GUILD_NAME))
		}
	}

	//改变公会职位
	public changeGuildPosition(guildPosition: number): void {
		if (this._roleCommon.guild_position != guildPosition) {
			this._roleCommon.guild_position = guildPosition;
			this.dispatchEvent(new ParamEvent(EventName.CHANGE_GUILD_POSITION))
		}
	}

	public getAllMaxHP(): number {
		var maxHp: number = 0;
		var node: PlayerBaseVO;
		var list: Array<PlayerBaseVO> = this._roleList;
		for (var i: number = 0; i < list.length; i++) {
			node = list[i];
			maxHp += node.getMaxHp();
		}
		return maxHp;
	}

	public getAllHP(): number {
		var maxHp: number = 0;
		var node: PlayerBaseVO;
		var list: Array<PlayerBaseVO> = this._roleList;
		for (var i: number = 0; i < list.length; i++) {
			node = list[i];
			maxHp += node.getHp();
		}
		return maxHp;
	}

	public getAllMaxMP(): number {
		var maxMp: number = 0;
		var node: PlayerBaseVO;
		var list: Array<PlayerBaseVO> = this._roleList;
		for (var i: number = 0; i < list.length; i++) {
			node = list[i];
			maxMp += node.getMaxMp();
		}
		return maxMp;
	}

	public getAllMP(): number {
		var maxMp: number = 0;
		var node: PlayerBaseVO;
		var list: Array<PlayerBaseVO> = this._roleList;
		for (var i: number = 0; i < list.length; i++) {
			node = list[i];
			maxMp += node.getMp();
		}
		return maxMp;
	}

	//判断伙伴是否有该魔宠
	public hasPet(showId: number): boolean {
		var pvo: PlayerBaseVO;
		var petid: number = 0;
		for (var i: number = 0; i < this._roleList.length; i++) {
			pvo = this._roleList[i];
			if (pvo.getAppVo().pet > 0) {
				petid = pvo.getAppVo().pet;
				if (petid == showId) return true;
			}
		}
		return false;
	}
	//判断伙伴是否有该魔宠武器
	public hasPetWeapon(showId: number): boolean {
		var pvo: PlayerBaseVO;
		var petid: number = 0;
		for (var i: number = 0; i < this._roleList.length; i++) {
			pvo = this._roleList[i];
			if (pvo.getAppVo().getPetWeapon() != null) {
				petid = pvo.getAppVo().pet;
				if (petid == showId) return true;
			}
		}
		return false;
	}

	//判断伙伴是否有该称号
	public hasChengHao(parnerID: string, titleID: number): boolean {
		var vo: PlayerBaseVO = this.getPartnerInfo(parnerID);
		if (vo == null) {
			return false;
		}
		return vo.getAppVo().title == titleID;
	}
	//判断伙伴是否有该时装
	public hasFashionCloth(parnerID: string, clothID: number): boolean {
		var vo: PlayerBaseVO = this.getPartnerInfo(parnerID);
		if (vo == null) {
			return false;
		}
		return vo.getAppVo().clothFashion == clothID;
	}
	//判断伙伴是否有该武器时装
	public hasFashionWeapon(parnerID: string, weaponID: number): boolean {
		var vo: PlayerBaseVO = this.getPartnerInfo(parnerID);
		if (vo == null) {
			return false;
		}
		return vo.getAppVo().weaponFashion == weaponID;
	}
	//判断伙伴是否有该翅膀时装
	public hasFashionWing(parnerID: string, wingID: number): boolean {
		var vo: PlayerBaseVO = this.getPartnerInfo(parnerID);
		if (vo == null) {
			return false;
		}
		return vo.getAppVo().wingFashion == wingID;
	}

	public getAllPartnerFight(): number {
		var result: number = 0;
		var list: Array<PlayerBaseVO> = this._roleList;
		if (list == null) {
			return result;
		}
		for (var i: number = 0; i < list.length; i++) {
			result += list[i].getFightValue();
		}
		return result;
	}

	//检查铜钱是否足够
	public CheckCoin(value: number): boolean {
		// if (value > this._roleInfo.getCoin()) {
		// 	var evt: ParamEvent = new ParamEvent(EventName.OPEN_GETMATERIAL_WINDOW);
		// 	var linkArr: Array<any> = [];
		// 	linkArr.push({ type: GetMaterialItem.OPEN_PK, linkStr: "<u><a href = 'event:1'>遭遇pk</a></u>" });
		// 	linkArr.push({ type: GetMaterialItem.OPEN_FUBEN_TIAOZHAN, linkStr: "<u><a href = 'event:2'>打开副本--挑战副本</a></u>" });
		// 	linkArr.push({ type: GetMaterialItem.OPEN_CHECKPOINTBOSS, linkStr: "<u><a href = 'event:2'>打开关卡boss</a></u>" });
		// 	linkArr.push({ type: GetMaterialItem.OPEN_FAST_FIGHT, linkStr: "<u><a href = 'event:2'>快速战斗</a></u>" });
		// 	if (HuoDongDailyModel.getInstance().checkOneRmbFinished() == false) {
		// 		linkArr.push({ type: GetMaterialItem.OPEN_ONE_RMB, linkStr: "<u><a href = 'event:2'>一元购</a></u>" });
		// 	}
		// 	evt.data = {
		// 		typeId: 1, type: 0, linkStrArr: linkArr
		// 	};
		// 	GameDispatcher.getInstance().dispatchEvent(evt);
		// 	return;
		// }
		return true;
	}

	//检查元宝钱是否足够
	public CheckGold(value: number): boolean {
		if (value > this._roleInfo.getGold()) {
			// GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.CHARGE_OPEN));
			return;
		}
		return true;
	}

	public setName(str: string): void {
		if (this._roleCommon) {
			this._roleCommon.name = str;
			this.dispatchEvent(new ParamEvent(RoleModel.UPDATE_ROLE_NAME));
			// PhpHttpStatisticsManager.updateLoad(RoleModel.getInstance().getRoleCommon());
		}
	}

	public setHead(value: number): void {
		this._roleCommon.icon = value;
		this.dispatchEvent(new ParamEvent(RoleModel.ROLE_HEAD_CHANGE));
	}

	//设置玩家要攻击的玩家的角色id
	public hunZhanTargetID: string = "";
	public setAllPartnerChangeTarget(roleID: string): boolean {
		var list = this._roleList;
		if (list) {
			var isChange: boolean = false;
			for (var i = 0; i < list.length; i++) {
				var vo = list[i];
				//没有目标或者要把目标设置为0的时候才赋值
				if (vo.hunZhanTargetID == "" || roleID == "") {
					vo.hunZhanTargetID = roleID;
					this.hunZhanTargetID = roleID;
					isChange = true;
				}
			}
			return isChange;
		}
		return false;
	}

	//判断一下离开场景的玩家是否是玩家本身的攻击目标
	public checkHunZhanReset(roleID: string): boolean {
		var list = this._roleList;
		var result: boolean = false;
		if (list) {
			for (var i = 0; i < list.length; i++) {
				var vo = list[i];
				if (vo.hunZhanTargetID == roleID) {
					vo.hunZhanTargetID = "";
					this.hunZhanTargetID = "";
					result = true;
				}
			}
		}
		return result;
	}

	//重置所有技能
	public resetAllSkill(): void {
		var roleList = this._roleList;
		if (roleList) {
			for (var i = 0; i < roleList.length; i++) {
				var vo = roleList[i];
				var skillList = vo.getSkillList();
				if (skillList) {
					for (var j = 0; j < skillList.length; j++) {
						var nodeSkill = skillList[j];
						nodeSkill.cd = 0;
					}
				}
			}
		}
	}

	/**
	 * 服务器时间
	 */
	public getServerDate(): Date {
		// var nextDay: Date = new Date(this.serverTime * 1000);// 通过加上或减去时区偏移量，将 Date 转换为 UTC
		// var offsetMilliseconds: number = nextDay.getTimezoneOffset() * 60 * 1000;
		// nextDay.setTime(nextDay.getTime() + offsetMilliseconds + 8 * 60 * 1000);//中国时区8
		return new Date(this.serverTime * 1000);
		// return nextDay;
	}

	public setPetFigure(value: number): void {
		if (value != this._showPet) {
			this._showPet = value;
			this.dispatchEvent(new ParamEvent(EventName.PETFIGURE_CHANGE));
		}
	}

	public get petFigure() {
		return this._showPet;
	}
}