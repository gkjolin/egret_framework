class SkillModel extends egret.EventDispatcher {
	private static _instance: SkillModel;
	private _currentSkillId: number;
	private _skillDic: Object;
	private _skillAwakeDic: Object;
	private _skillMathDic: Object;
	private _skillEffectDic: Object;
	private _featObj: Object;
	private _featOpenObj: Object;
	private _featData: Object;
	private _buffDic: Object;
	//X上增加的攻击距离微调 
	public static ATTACK_RANGER_X: number = 30;
	//Y上增加的攻击距离微调
	public static ATTACK_RANGER_Y: number = 20;

	private _baseSkillList: Array<number> = [101001, 102001, 103001];

	private _parnerSkillDic: Object;//用来记录所有伙伴的技能信息的，伙伴id为key
	public constructor() {
		super();
	}

	public static getInstance(): SkillModel {
		if (this._instance == null) {
			this._instance = new SkillModel();
		}
		return this._instance;
	}

	private getSkillConfig(): Object {
		if (this._skillDic == null) {
			this._skillDic = new Object();
			this._skillAwakeDic = new Object();
			var jsonObj: Object = DataManager.getInstance().getObj("data_skill");
			var list: Array<Object> = jsonObj["data_skill"];
			var itemObj: Object;
			var result: SkillVo;
			for (var i: number = 0; i < list.length; i++) {
				itemObj = list[i];
				result = new SkillVo();
				result.id = itemObj["id"];
				result.name = itemObj["name"];
				result.describe = itemObj["describe"];
				result.type = itemObj["type"];
				result.icon = itemObj["icon"];
				result.prof = itemObj["prof"];
				result.cost = itemObj["cost"];
				result.obj = itemObj["obj"];
				result.target = itemObj["target"];
				result.distance = itemObj["distance"];
				result.cd = itemObj["cd"];
				result.mod = itemObj["mod"];
				result.getbuff = itemObj["getbuff"];
				result.open_lv = itemObj["open_lv"];
				result.power_up = itemObj["power_up"];
				result.born_percent = itemObj["born_percent"];
				result.lv_percent = itemObj["lv_percent"];
				result.replace = itemObj["replace"];
				result.prior = itemObj["prior"];
				this._skillDic[result.id] = result;
				if (result.replace > 0) this._skillAwakeDic[result.replace] = result;
			}
		}
		return this._skillDic;
	}

	private getMathConfig(): Object {
		if (this._skillMathDic == null) {
			this._skillMathDic = new Object();
			var jsonObj: Object = DataManager.getInstance().getObj("data_skill_math");
			var list: Array<Object> = jsonObj["data_skill_math"];
			var itemObj: Object;
			var result: SkillMathVo;
			for (var i: number = 0; i < list.length; i++) {
				itemObj = list[i];
				result = new SkillMathVo();
				result.template_id = itemObj["template_id"];
				result.skill_id = itemObj["skill_id"];
				result.type = itemObj["type"];
				result.min = itemObj["min"];
				result.max = itemObj["max"];
				result.value1 = itemObj["value1"];
				result.value2 = itemObj["value2"];
				result.value3 = itemObj["value3"];
				result.value4 = itemObj["value4"];
				result.value5 = itemObj["value5"];
				result.value6 = itemObj["value6"];
				this._skillMathDic[result.template_id] = result;
			}
		}
		return this._skillMathDic;
	}

	//功勋技能配置信息
	public getFeatConfig(): Object {
		if (this._featObj == null) {
			this._featObj = new Object();
			var config: Object = DataManager.getInstance().getObj("data_skill_feat");
			var list: Array<Object> = config["data_skill_feat"];
			var result: SkillFeatVo;
			var itemObj: Object;
			for (var i: number = 0; i < list.length; i++) {
				itemObj = list[i];
				result = new SkillFeatVo();
				result.template_id = itemObj["template_id"];
				result.type = itemObj["type"];
				result.level = itemObj["level"];
				result.name = itemObj["name"];
				result.description = itemObj["description"];
				result.con_feats = itemObj["con_feats"];
				result.active_item = itemObj["active_item"];
				result.probability = itemObj["probability"];
				result.fail = itemObj["fail"];
				result.power_up = itemObj["power_up"];
				result.add_feats = itemObj["add_feats"];
				result.hp = itemObj["hp"];
				result.mp = itemObj["mp"];
				result.att = itemObj["att"];
				result.att_def = itemObj["att_def"];
				result.magic_def = itemObj["magic_def"];
				result.crit = itemObj["crit"];
				result.crit_hurt = itemObj["crit_hurt"];
				result.crit_def = itemObj["crit_def"];
				result.palsy_rate = itemObj["palsy_rate"];
				result.palsy_def = itemObj["palsy_def"];
				result.hurt_up = itemObj["hurt_up"];
				result.hurt_def = itemObj["hurt_def"];
				result.hp_up = itemObj["hp_up"];
				result.buff_id = itemObj["buff_id"];
				result.radio = itemObj["radio"];
				result.show = itemObj["show"];
				if (!this._featObj[result.type]) this._featObj[result.type] = new Object();
				this._featObj[result.type][result.level] = result;
			}
		}
		return this._featObj;
	}

	//功勋技能配置信息
	public getFeatOpenConfig(): Object {
		if (this._featOpenObj == null) {
			this._featOpenObj = new Object();
			var config: Object = DataManager.getInstance().getObj("data_skill_feat_open");
			var list: Array<Object> = config["data_skill_feat_open"];
			var result: SkillFeatOpenVo;
			var itemObj: Object;
			for (var i: number = 0; i < list.length; i++) {
				itemObj = list[i];
				result = new SkillFeatOpenVo();
				result.template_id = itemObj["template_id"];
				result.open_round = itemObj["open_round"];
				result.vip = itemObj["vip"];
				this._featOpenObj[result.template_id] = result;
			}
		}
		return this._featOpenObj;
	}
	public currentSkill(): SkillVo {
		return this.getSkill(this._currentSkillId);
	}

	public getSkill(id: number): SkillVo {
		if (this.getSkillConfig()[id]) return this.getSkillConfig()[id];
	}

	public getSkillByCareer(career: number): Array<SkillVo> {
		if (!this._skillAwakeDic) this.getSkillConfig();
		var dataArr: Array<SkillVo> = [];
		var obj: SkillVo;
		for (var key in this.getSkillConfig()) {
			obj = this.getSkillConfig()[key];
			if (obj.prof == career && obj.replace == 0) {
				dataArr.push(obj);
			}
		}
		dataArr = dataArr.sort(this.orderSkill);
		var vo: SkillVo;
		for (var i = 0; i < dataArr.length; i++) {
			obj = dataArr[i];
			vo = this._skillAwakeDic[obj.id];
			// if (vo && AwakeModel.getInstance().getIsAwake(vo.id)) {
			// 	dataArr[i] = vo;
			// }
		}
		return dataArr;
	}

	public orderSkill(a: SkillVo, b: SkillVo): number {
		if (a.id > b.id) {
			return 1; // 如果是降序排序，返回-1。
		} else if (a.id === b.id) {
			return 0;
		} else {
			return -1; // 如果是降序排序，返回1。
		}
	}

	public getPartnerBaseSkill(parnerID: string): number {
		var parnerInfo: PlayerBaseVO = RoleModel.getInstance().getPartnerInfo(parnerID);
		var skillList: Array<NodeSkill> = parnerInfo.getSkillList();
		var len: number = skillList.length;
		var baseSkill: number = this.getCarrerSkill(parnerInfo.getCareer());
		for (var i = 0; i < len; i++) {
			var skillNode: NodeSkill = skillList[i];
			var configVo = this.getSkill(skillNode.skill_id);
			if (configVo && this.isBaseSkill(configVo.replace)) {
				return skillNode.skill_id;
			}
		}
		return baseSkill;
	}

	public getCarrerSkill(career: number): number {
		switch (career) {
			case 1: return 101001;
			case 2: return 102001;
			case 3: return 103001;
		}
		return 0;
	}

	//判断是否基础技能
	public isBaseSkill(id: number): boolean {
		return this._baseSkillList.indexOf(id) >= 0;
		// return id == 101001 || id == 102001 || id == 103001;
	}
	public getBaseSkillByCareer(career: number): number {
		return this._baseSkillList[career - 1];
	}

	//获取伙伴当前可以用的技能，先从牛逼的技能找起
	//exceptID：要排除的技能id
	public getPartnerSkillCanUse(partnerID: string, exceptID: number = 0): number {
		if (this._parnerSkillDic == null) {
			this.updateSkillDic();
		}
		var pVo: PlayerBaseVO = SceneModel.getInstance().getPlayer(partnerID);
		if (pVo == null) {
			return 0;
		}
		var skillList: Array<NodeSkill> = pVo.getSkillList();
		// var skillList: Array<NodeSkill> = this._parnerSkillDic[partnerID];
		//一开始必须从小到大排序
		skillList = skillList.sort((a: NodeSkill, b: NodeSkill): number => {
			return a.skill_id - b.skill_id;
		});
		skillList = this.filterSkill(skillList);
		skillList = skillList.sort((a: NodeSkill, b: NodeSkill): number => {
			var aConfig = this.getSkill(a.skill_id);
			var bConfig = this.getSkill(b.skill_id);
			return bConfig.prior - aConfig.prior;
		});
		var minSkill: number = 999999;
		for (var i: number = 0; i < skillList.length; i++) {
			var node: NodeSkill = skillList[i];
			if (node.skill_id == exceptID) {
				continue;
			}
			if (node.skill_id < minSkill) {
				minSkill = node.skill_id;
			}
			if (node.cd <= 0) {
				return node.skill_id;
			}
		}
		//如果没有cd是0的技能，就返回技能id最小的技能，也就是基础技能
		return minSkill;
	}

	//更新技能状态（主要是CD）
	public updateSkillDic(): void {
		this._parnerSkillDic = new Object();
		var roleList: Array<PlayerBaseVO> = RoleModel.getInstance().getPartnerList();
		var playerVo: PlayerBaseVO;
		var partnerSkillList: Array<NodeSkill>;
		for (var i: number = 0; i < roleList.length; i++) {
			playerVo = roleList[i];
			this._parnerSkillDic[playerVo.parnerID] = playerVo.getSkillList();
		}
	}

	//挑选出当前的技能列表
	public filterSkill(list: Array<NodeSkill>): Array<NodeSkill> {
		if (list.length <= 5) {
			return list;
		}
		var result: Array<NodeSkill> = this.copySkills(list, 0, 5);
		for (var i = 0; i < list.length; i++) {
			var node = list[i];
			var skillConfig = this.getSkill(node.skill_id);
			for (var j = 0; j < result.length; j++) {
				var innerNode = result[j];
				if (skillConfig.replace == innerNode.skill_id) {
					innerNode.skill_id = node.skill_id;
					innerNode.level = node.level;
					innerNode.cd = node.cd;
				}
			}
		}
		return result;
	}

	public copySkills(list: Array<NodeSkill>, startIndex: number, endIndex: number): Array<NodeSkill> {
		var result: Array<NodeSkill> = new Array();
		for (var i = startIndex; i < list.length && i < endIndex; i++) {
			var node = list[i];
			var newNode: NodeSkill = new NodeSkill();
			newNode.level = node.level;
			newNode.partner_id = node.partner_id;
			newNode.skill_id = node.skill_id;
			newNode.cd = node.cd;
			result.push(newNode);
		}
		return result;
	}

	//设置某个伙伴的技能cd
	private _skillSiObj: Object = new Object();
	public cdSkill(partnerID: string, skillID: number): void {
		if (this.isBaseSkill(skillID)) {
			return;
		}
		var pVo: PlayerBaseVO = SceneModel.getInstance().getPlayer(partnerID);
		if (pVo == null) {
			return;
		}
		var skillList: Array<NodeSkill> = pVo.getSkillList();
		for (var i: number = 0; i < skillList.length; i++) {
			var node = skillList[i];
			if (node.skill_id == skillID) {
				var skillSi: number = this._skillSiObj[partnerID + "_" + skillID];
				if (skillSi > 0) {
					clearTimeout(skillSi);
				}
				node.cd = this.getSkillConfig()[node.skill_id].cd;
				skillSi = setTimeout2((node: NodeSkill) => {
					node.cd = 0;
				}, node.cd, node);
				this._skillSiObj[partnerID + "_" + skillID] = skillSi;
				// if (node.cd == 0) {
				// 	node.cd = this.getSkillConfig()[node.skill_id].cd;
				// 	setTimeout2((node: NodeSkill) => {
				// 		node.cd = 0;
				// 	}, node.cd, node);
				// }
				break;
			}
		}
	}

	//获取技能效果配置
	public getSKillEffect(skillID: number): SkillEffectVo {
		if (this._skillEffectDic == null) {
			this._skillEffectDic = new Object();
			var config: Object = DataManager.getInstance().getObj("data_skill_effect");
			var list: Array<Object> = config["data_skill_effect"];
			var node: Object;
			var vo: SkillEffectVo;
			var matchList: Array<string>;
			var pointStr: string;
			for (var i: number = 0; i < list.length; i++) {
				node = list[i];
				vo = new SkillEffectVo();
				vo.id = node["template_id"];
				vo.type = node["type"];
				vo.dir = node["dir"];
				vo.speed = node["speed"];
				vo.eff1 = node["effect1"];
				vo.eff2 = node["effect2"];
				vo.showHurtTime = node["show_time"];
				vo.pos = node["pos"];
				pointStr = node["eff1_off"];
				if (pointStr != "") {
					matchList = pointStr.split(",");
					vo.off1 = new Point(parseInt(matchList[0]), parseInt(matchList[1]));
				}
				pointStr = node["eff2_off"];
				if (pointStr != "") {
					matchList = pointStr.split(",");
					vo.off2 = new Point(parseInt(matchList[0]), parseInt(matchList[1]));
				}
				vo.eff1Delay = node["eff1_delay"];
				vo.eff2Delay = node["eff2_delay"];
				this._skillEffectDic[vo.id] = vo;
			}
		}
		return this._skillEffectDic[skillID];
	}

	//获取技能的方向和scale值
	public getSkillEffectDir(x1: number, y1: number, x2: number, y2: number): Object {
		var tmpdir: number = MapUtil.judgeDir(x1, y1, x2, y2);
		var scale: number = 1;
		if (tmpdir == 7) {
			tmpdir = 9;
			scale = -1;
		}
		else if (tmpdir == 4) {
			tmpdir = 6;
			scale = -1;
		}
		else if (tmpdir == 1) {
			tmpdir = 3;
			scale = -1;
		}
		return { dir: tmpdir, scale: scale };
	}

	//获取技能对应的附加攻击力
	public getSkillAttackExt(skillID: number, lv: number): number {
		var result: number = 0;
		var vo: SkillMathVo = this.getSkillMathVo(skillID, lv);
		if (vo == null) {
			return 0;
		}
		var rate: number = Math.floor(lv / 10) + 1;
		switch (vo.type) {
			case 1:
				result = lv * vo.value1 * vo.value2;
				break;
			case 2:
				result = (vo.value1 * (rate * rate - rate) + vo.value2 * rate * (lv % vo.value3) - vo.value4) * vo.value5;
				break;
			case 3:
				result = (vo.value1 + vo.value2 * (lv - vo.value3)) * vo.value4;
				break;
		}
		return result;
	}

	//找出技能当前的SkillMathVo
	public getSkillMathVo(id: number, lv: number): SkillMathVo {
		var result: SkillMathVo;
		var n: any;
		var vo: SkillMathVo;
		for (n in this.getMathConfig()) {
			vo = this.getMathConfig()[n];
			if (vo.skill_id != id) {
				continue;
			}
			if (vo.min > lv || vo.max < lv) {
				continue;
			}
			result = vo;
			break;
		}
		return result;
	}

	//获取技能加成百分比
	public getSkillPercent(id: number, lv: number): number {
		var vo: SkillVo = this.getSkillConfig()[id];
		return 100 + vo.born_percent + lv * vo.lv_percent;
	}

	//获取技能打击数量
	public getSkillTargetNum(id: number): number {
		if (MeetPlayerModel.getInstance().fightMPID > 0) {
			return 1;
		}
		var vo: SkillVo = this.getSkillConfig()[id];
		if (vo) {
			return vo.obj;
		}
		return 0;
	}

	//根据职业获取对应的技能
	public getSkillListByJob(job: number, hasWake: boolean = false): Array<SkillVo> {
		var result: Array<SkillVo> = new Array();
		var vo: SkillVo;
		var n: any;
		for (n in this.getSkillConfig()) {
			vo = this.getSkillConfig()[n];
			if (vo.prof == job) {
				if (vo.replace > 0 && hasWake || vo.replace == 0) {
					result.push(vo);
				}
			}
		}
		return result;
	}

	public get isUpgrade(): boolean {
		if (this.isUpgradeSkill) return true;
		if (this.isUpgradeFeat) return true;
		return false;
	}

	public get isUpgradeSkill(): boolean {
		var roleListData: Array<PlayerBaseVO> = RoleModel.getInstance().getPartnerList();
		if (roleListData) {
			var playerVo: PlayerBaseVO;
			for (var i = 0; i < roleListData.length; i++) {
				playerVo = roleListData[i];
				if (this.isPartenerUpgrade(playerVo)) return true;
			}
		}
		return false;
	}

	public isPartenerUpgrade(value: PlayerBaseVO): boolean {
		var cost: number;
		var skillVoArr: Array<SkillVo> = SkillModel.getInstance().getSkillByCareer(value.getCareer());
		var skillData: Array<NodeSkill> = RoleModel.getInstance().getPartnerSkillList(value.parnerID);
		var vo: SkillVo;
		for (var i = 0; i < skillVoArr.length; i++) {
			vo = skillVoArr[i];
			for (var index = 0; index < skillData.length; index++) {
				if (skillData[index].skill_id == vo.id && skillData[index].level > 0 && skillData[index].level < this.getCurSkillMaxLv()) {
					cost = this.getCost(skillData[index].level);
					if (RoleModel.getInstance().getRoleInfo().getCoin() >= cost) {
						return true;
					}
				}
			}
		}
		return false;
	}

	public get isUpgradeFeat(): boolean {
		var roleListData: Array<PlayerBaseVO> = RoleModel.getInstance().getPartnerList();
		if (roleListData) {
			var playerVo: PlayerBaseVO;
			for (var i = 0; i < roleListData.length; i++) {
				playerVo = roleListData[i];
				if (this.isPartenerFeatUpgrade(playerVo)) return true;
			}
		}
		return false;
	}

	public isPartenerFeatUpgrade(value: PlayerBaseVO): boolean {
		// var dataArr: Array<GoodsInfo> = GoodsListProxy.getInstance().getGoodsByTypeAndSubType(15, 10);
		// if (dataArr.length == 0) return false;
		// if (this._featData && this._featData[value.parnerID]) {
		// 	var skillData: Array<NodeFeat_skills> = this._featData[value.parnerID];
		// 	var has: number = 0
		// 	for (var i = 0; i < skillData.length; i++) {
		// 		if (skillData[i].skill_id > 0) has++;
		// 	}
		// 	var count: number = 0;
		// 	var roleRound: number = RoleModel.getInstance().getRoleCommon().round;
		// 	for (var k = 1; k < 8; k++) {
		// 		var openVo: SkillFeatOpenVo = SkillModel.getInstance().getFeatOpenVo(k);
		// 		if (openVo) {
		// 			if (roleRound >= openVo.open_round) count++;
		// 		}
		// 	}
		// 	return has < count;
		// }
		return false;
	}

	public getCost(value: number): number {
		var cost: number = 5000;
		if (value > 0) {
			cost = 5000 + (value - 1) * 500
		}
		return cost;
	}

	public getCurSkillMaxLv(): number {
		var lv: number = RoleModel.getInstance().getRoleCommon().level;
		if (lv > 80) {
			lv = 80;
		}
		var round: number = RoleModel.getInstance().getRoleCommon().round;
		if (round > 0) {
			lv += round * 10;
		}
		return lv;
	}

	public getFeatOpenVo(value: number): SkillFeatOpenVo {
		return this.getFeatOpenConfig()[value];
	}

	public getFeatVo(type: number, lv: number): SkillFeatVo {
		return this.getFeatConfig()[type][lv];
	}

	public setFeatData(value: SCMD14700): void {
		if (!this._featData) this._featData = new Object();
		if (!this._featData[value.parter_id]) this._featData[value.parter_id] = value.feat_skills;
		var newObj: NodeFeat_skills;
		var obj: NodeFeat_skills;
		for (var i = 0; i < value.feat_skills.length; i++) {
			newObj = value.feat_skills[i];
			for (var k = 0; k < this._featData[value.parter_id].length; k++) {
				obj = this._featData[value.parter_id][k];
				if (obj.slot == newObj.slot) this._featData[value.parter_id][k] = newObj;
			}
		}
	}

	public getFeatData(value: number): Array<NodeFeat_skills> {
		return this._featData[value];
	}

	public getFeatProStr(value: SkillFeatVo): Array<number> {
		var proArr: Array<number> = [];
		if (value.hp > 0) {
			proArr.push(value.hp);
		}
		if (value.mp > 0) {
			proArr.push(value.mp);
		}
		if (value.att > 0) {
			proArr.push(value.att);
		}
		if (value.att_def > 0) {
			proArr.push(value.att_def);
		}
		if (value.magic_def > 0) {
			proArr.push(value.magic_def);
		}
		if (value.crit > 0) {
			proArr.push(value.crit / 100);
		}
		if (value.crit_hurt > 0) {
			proArr.push(value.crit_hurt / 100);
		}
		if (value.crit_def > 0) {
			proArr.push(value.crit_def / 100);
		}
		if (value.palsy_rate > 0) {
			proArr.push(value.palsy_rate / 100);
		}
		if (value.palsy_def > 0) {
			proArr.push(value.palsy_def / 100);
		}
		if (value.hurt_up > 0) {
			proArr.push(value.hurt_up / 100);
		}
		if (value.hurt_def > 0) {
			proArr.push(value.hurt_def / 100);
		}
		if (value.hp_up > 0) {
			proArr.push(value.hp_up / 100);
		}
		return proArr;
	}

	public getBUffVo(id: number): BuffVo {
		if (this._buffDic == null) {
			this._buffDic = new Object();
			var obj = DataManager.getInstance().getObj("data_buff");
			var list = obj["data_buff"];
			for (var i = 0; i < list.length; i++) {
				var vo = new BuffVo();
				var data = list[i];
				vo.id = data["template_id"];
				vo.showID = data["show"];
				vo.type = data["type"];
				vo.time = data["time"];
				this._buffDic[vo.id] = vo;
			}
		}
		return this._buffDic[id];
	}

	public getSkillDes(value: SkillVo): string {
		var str: string = "";
		var sate: number = SkillModel.getInstance().getSkillPercent(value.id, value.lev);
		var attExt: number = SkillModel.getInstance().getSkillAttackExt(value.id, value.lev);
		if (sate > 100) {
			str = StringUtil.substitute(value.describe, attExt, sate);
		} else {
			str = StringUtil.substitute(value.describe, attExt);
		}
		return str;
	}

	//判断技能是否是召唤宝宝技能
	public isCallPetSkill(id: number): boolean {
		return id == 103005 || id == 103010;
	}

	//获取宠物技能id
	public getPetSkillID(): number {
		var partnerID: string = RoleModel.getInstance().getPartnerIdByCareer(Tools.DAOSHI);
		var skillInfo: NodeSkill = RoleModel.getInstance().getPartnerSkillInfo(partnerID, 103010);
		//判断是否有觉醒技能的宠物
		if (skillInfo) {
			return skillInfo.skill_id;
		}
		return 103005;
	}
	//根据召唤兽的技能id来找对应的资源id
	public getResIDBySkillID(skillID: number): number {
		if (skillID == 103005) {
			return 101;
		}
		return 102;
	}
}