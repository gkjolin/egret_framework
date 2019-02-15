class BossModel extends egret.EventDispatcher {
	private _meetBossInfo: SCMD13100;
	private _meetBossConfigDic: Object;
	private _bossConfigDic: Object;
	private _bossAllConfigDic: Object;
	private _bossGuildConfigDic: Object;
	private _bossAwakeConfigDic: Object;
	private _bossRoundConfigDic: Object;
	private _bossRoundRewardConfig: Array<BossRoundRewardVo>;
	private _homeDic: Object;
	private _homeTypeDic: Object;
	private _homeTypeArr: Array<BossHomeVo>;
	private _eliteDic: Object;
	private _fieldDic: Object;
	public bossAllInfo: SCMD14400;
	private _bossData: Object;
	private _bossGuildData: Object;
	private _bossAllTipsStauts: Object;
	private _bossDamageInfo: BossDamageInfo;
	private _bossRoundInfo: Array<NodeBoss_rounds>;
	private _bossAwakeData: Object;
	private _bossHomeData: Object;
	public bossHomeCD: SCMD20500;
	private _bossEliteData: Object;
	private _bossFieldData: Object;
	private static _instance: BossModel;
	public currentPersonBoss: number = 0;//当前个人boss
	public currentPeopleBossID: number = 0;//当前全民boss
	public guildBossID: number = 0;//公会bossID
	public kfBossID: number = 0;//跨服bossID
	public BossID_home: number = 0;//boss之家bossID
	public BossID_elite: number = 0;//精英bossID
	public BossID_field: number = 0;//野外bossID
	public BossGuildCallArr: Array<SCMD19430> = [];//保存公会boss召请
	public static UPDATE_BOSS_DAMAGEINFO: string = "UPDATE_BOSS_DAMAGEINFO";
	public isShowBossGuildCall:boolean=true;
	public constructor() {
		super();
		this.init();
	}

	private init(): void {

	}

	public static getInstance(): BossModel {
		if (BossModel._instance == null) {
			BossModel._instance = new BossModel();
		}
		return BossModel._instance;
	}

	public setMeetBossInfo(scmd: SCMD13100): void {
		this._meetBossInfo = scmd;
	}

	public getMeetBossInfo(): SCMD13100 {
		return this._meetBossInfo;
	}

	//获取遭遇boss配置信息
	public getMeetBossConfig(id: number): BossMeetVo {
		if (this._meetBossConfigDic == null) {
			this._meetBossConfigDic = new Object();
			var config: Object = DataManager.getInstance().getObj("data_boss_meet");
			var list: Array<Object> = config["data_boss_meet"];
			var vo: BossMeetVo;
			var node: Object;
			for (var i: number = 0; i < list.length; i++) {
				node = list[i];
				vo = new BossMeetVo();
				vo.id = node["template_id"];
				vo.bossID = node["boss_id"];
				vo.goodsList = Tools.changeToNodeDropList(node["show_award"]);
				this._meetBossConfigDic[vo.id] = vo;
			}
		}
		return this._meetBossConfigDic[id];
	}

	//在场景上面添加遭遇boss
	public addMeetBoss(): void {
		var scmd: SCMD13100 = this.getMeetBossInfo();
		if (scmd && scmd.template_id > 0) {
			var configVo: BossMeetVo = BossModel.getInstance().getMeetBossConfig(scmd.template_id);
			var monVo: MonsterVO = SceneModel.getInstance().makeMonsterVo(configVo.bossID);
			monVo.useType = MonsterVO.MEETBOSS;
			var centerPoint: Point = SceneModel.getInstance().getSceneCenter();
			monVo.x = centerPoint.x;
			monVo.y = centerPoint.y;
			monVo.dropInfo = Tools.convertDropList(scmd.drop_list);
			SceneModel.getInstance().addMonster(monVo);
		}
	}


	//获取个人boss配置信息
	public getBossPersonalConfig(): Object {
		if (this._bossConfigDic == null) {
			this._bossConfigDic = new Object();
			var config: Object = DataManager.getInstance().getObj("data_boss_single");
			var list: Array<Object> = config["data_boss_single"];
			var vo: BossVo;
			var node: Object;
			for (var i: number = 0; i < list.length; i++) {
				node = list[i];
				vo = new BossVo();
				vo.template_id = node["template_id"];
				vo.boss_id = node["boss_id"];
				vo.boss_name = node["boss_name"];
				vo.open_level = node["open_level"];
				vo.open_round = node["open_round"];
				vo.time = node["time"];
				vo.itemList = Tools.changeToItemData(node["show_award"]);
				vo.boss_scene_id = node["boss_scene_id"];
				vo.boss_pos = node["boss_pos"];
				this._bossConfigDic[vo.boss_id] = vo;
			}
		}
		return this._bossConfigDic;
	}

	//获取个人boss配置信息
	public getBossAllConfig(): Object {
		if (this._bossAllConfigDic == null) {
			this._bossAllConfigDic = new Object();
			var config: Object = DataManager.getInstance().getObj("data_boss_all");
			var list: Array<Object> = config["data_boss_all"];
			var vo: BossVo;
			var node: Object;
			for (var i: number = 0; i < list.length; i++) {
				node = list[i];
				vo = new BossVo();
				vo.template_id = node["template_id"];
				vo.boss_id = node["boss_id"];
				vo.boss_name = node["boss_name"];
				vo.open_level = node["open_level"];
				vo.open_round = node["open_round"];
				vo.revive_sec = node["revive_sec"];
				vo.itemList = Tools.changeToItemData(node["show_award"]);
				vo.boss_scene_id = node["boss_scene_id"];
				vo.setBossPos(node["boss_pos"]);
				vo.setRandomPath(node["random_birth"]);
				this._bossAllConfigDic[vo.template_id] = vo;
			}
		}
		return this._bossAllConfigDic;
	}


	//获取转生boss配置信息
	public getBossRoundConfig(): Object {
		if (this._bossRoundConfigDic == null) {
			this._bossRoundConfigDic = new Object();
			var config: Object = DataManager.getInstance().getObj("data_boss_round");
			var list: Array<Object> = config["data_boss_round"];
			var vo: BossRoundVo;
			var node: Object;
			for (var i: number = 0; i < list.length; i++) {
				node = list[i];
				vo = new BossRoundVo();
				vo.template_id = node["template_id"];
				vo.boss_id = node["boss_id"];
				vo.boss_name = node["boss_name"];
				vo.min_round = node["min_round"];
				vo.max_round = node["max_round"];
				vo.boss_scene_id = node["boss_scene_id"];
				vo.setBossPos(node["boss_pos"]);
				vo.itemList = Tools.changeToItemData(node["show_award"]);
				vo.kill_award = Tools.changeToItemData(node["kill_award"]);
				vo.luck_award = Tools.changeToItemData(node["luck_award"]);
				vo.setRandomPath(node["random_birth"]);
				this._bossRoundConfigDic[vo.template_id] = vo;
			}
		}
		return this._bossRoundConfigDic;
	}

	//获取转生boss奖励配置信息
	public getBossRoundRewardConfig(): Array<BossRoundRewardVo> {
		if (this._bossRoundRewardConfig == null) {
			this._bossRoundRewardConfig = [];
			var config: Object = DataManager.getInstance().getObj("data_boss_roundaward");
			var list: Array<Object> = config["data_boss_roundaward"];
			var vo: BossRoundRewardVo;
			var node: Object;
			for (var i: number = 0; i < list.length; i++) {
				node = list[i];
				vo = new BossRoundRewardVo();
				vo.template_id = node["template_id"];
				vo.boss_id = node["boss_id"];
				vo.type = node["type"];
				vo.min = node["min"];
				vo.max = node["max"];
				vo.itemList = Tools.changeToItemData(node["add_item"]);
				this._bossRoundRewardConfig.push(vo);
			}
		}
		return this._bossRoundRewardConfig;
	}

	//获取公会boss配置信息
	public getBossGuildConfig(): Object {
		if (this._bossGuildConfigDic == null) {
			this._bossGuildConfigDic = new Object();
			var config: Object = DataManager.getInstance().getObj("data_boss_guild");
			var list: Array<Object> = config["data_boss_guild"];
			var vo: BossVo;
			var node: Object;
			for (var i: number = 0; i < list.length; i++) {
				node = list[i];
				vo = new BossVo();
				vo.template_id = node["template_id"];
				vo.boss_id = node["boss_id"];
				vo.boss_name = node["boss_name"];
				vo.open_level = node["open_level"];
				vo.open_round = node["open_round"];
				vo.itemList = Tools.changeToItemData(node["show_award"]);
				vo.boss_scene_id = node["boss_scene_id"];
				vo.setBossPos(node["boss_pos"]);
				vo.setRandomPath(node["random_birth"]);
				this._bossGuildConfigDic[vo.template_id] = vo;
			}
		}
		return this._bossGuildConfigDic;
	}
	//获取跨服觉醒boss配置信息
	public getBossKFAwakeConfig(): Object {
		if (this._bossAwakeConfigDic == null) {
			this._bossAwakeConfigDic = new Object();
			var config: Object = DataManager.getInstance().getObj("data_kfboss_awake");
			var list: Array<Object> = config["data_kfboss_awake"];
			var vo: BossKfbossAwakeVo;
			var node: Object;
			for (var i: number = 0; i < list.length; i++) {
				node = list[i];
				vo = new BossKfbossAwakeVo();
				vo.template_id = node["template_id"];
				vo.boss_id = node["boss_id"];
				vo.boss_name = node["boss_name"];
				vo.open_level = node["open_level"];
				vo.open_round = node["open_round"];
				vo.itemList = Tools.changeToItemData(node["show_award"]);
				vo.boss_scene_id = node["boss_scene_id"];
				vo.setBossPos(node["boss_pos"]);
				vo.setRandomPath(node["random_birth"]);
				vo.limit_class = node["limit_class"];
				this._bossAwakeConfigDic[vo.template_id] = vo;
			}
		}
		return this._bossAwakeConfigDic;
	}

	//boss之家配置信息
	public getBossHomeConfig(): Object {
		if (this._homeDic == null) {
			this._homeDic = new Object();
			var config: Object = DataManager.getInstance().getObj("data_boss_home");
			var list: Array<Object> = config["data_boss_home"];
			var vo: BossVo;
			var node: Object;
			for (var i: number = 0; i < list.length; i++) {
				node = list[i];
				vo = new BossVo();
				vo.template_id = node["template_id"];
				vo.boss_id = node["boss_id"];
				vo.type = node["type"];
				vo.boss_name = node["boss_name"];
				vo.open_level = node["open_level"];
				vo.open_round = node["open_round"];
				vo.itemList = Tools.changeToItemData(node["show_award"]);
				vo.boss_scene_id = node["boss_scene_id"];
				vo.setBossPos(node["boss_pos"]);
				vo.setRandomPath(node["random_birth"]);
				this._homeDic[vo.template_id] = vo;
			}
		}
		return this._homeDic;
	}
	//boss之家配置信息
	public getBossHomeTypeConfig(): Object {
		if (this._homeTypeDic == null) {
			this._homeTypeDic = new Object();
			this._homeTypeArr = [];
			var config: Object = DataManager.getInstance().getObj("data_boss_home_type");
			var list: Array<Object> = config["data_boss_home_type"];
			var vo: BossHomeVo;
			var node: Object;
			for (var i: number = 0; i < list.length; i++) {
				node = list[i];
				vo = new BossHomeVo();
				vo.template_id = node["template_id"];
				vo.live_time = node["live_time"];
				vo.refresh_cd = node["refresh_cd"];
				vo.flee_cd = node["flee_cd"];
				vo.vip = node["vip"];
				vo.open_level = node["open_level"];
				vo.open_round = node["open_round"];
				vo.con_item = Tools.changeToItemData(node["con_item"]);
				this._homeTypeDic[vo.template_id] = vo;
				this._homeTypeArr.push(vo);
			}
		}
		return this._homeTypeDic;
	}

	//精英boss配置信息
	public getBossEliteConfig(): Object {
		if (this._eliteDic == null) {
			this._eliteDic = new Object();
			var config: Object = DataManager.getInstance().getObj("data_boss_elite");
			var list: Array<Object> = config["data_boss_elite"];
			var vo: BossEliteVo;
			var node: Object;
			for (var i: number = 0; i < list.length; i++) {
				node = list[i];
				vo = new BossEliteVo();
				vo.template_id = node["template_id"];
				vo.boss_id = node["boss_id"];
				vo.live_time = node["live_time"];
				vo.refresh_cd = node["refresh_cd"];
				vo.flee_cd = node["flee_cd"];
				vo.con_item = Tools.changeToItemData(node["con_item"]);
				vo.boss_name = node["boss_name"];
				vo.open_level = node["open_level"];
				vo.open_round = node["open_round"];
				vo.itemList = Tools.changeToItemData(node["show_award"]);
				vo.boss_scene_id = node["boss_scene_id"];
				vo.setBossPos(node["boss_pos"]);
				vo.setRandomPath(node["random_birth"]);
				this._eliteDic[vo.template_id] = vo;
			}
		}
		return this._eliteDic;
	}

	//精英boss配置信息
	public getBossFieldConfig(): Object {
		if (this._fieldDic == null) {
			this._fieldDic = new Object();
			var config: Object = DataManager.getInstance().getObj("data_boss_field");
			var list: Array<Object> = config["data_boss_field"];
			var vo: BossFieldVo;
			var node: Object;
			for (var i: number = 0; i < list.length; i++) {
				node = list[i];
				vo = new BossFieldVo();
				vo.template_id = node["template_id"];
				vo.boss_id = node["boss_id"];
				vo.live_time = node["live_time"];
				vo.refresh_cd = node["refresh_cd"];
				vo.flee_cd = node["flee_cd"];
				vo.boss_name = node["boss_name"];
				vo.open_level = node["open_level"];
				vo.open_round = node["open_round"];
				vo.itemList = Tools.changeToItemData(node["show_award"]);
				vo.boss_scene_id = node["boss_scene_id"];
				vo.setBossPos(node["boss_pos"]);
				vo.setRandomPath(node["random_birth"]);
				this._fieldDic[vo.template_id] = vo;
			}
		}
		return this._fieldDic;
	}
	//根据boss id和奖励类型获取boss的奖励配置
	public getBossRoundTypeReward(id: number, type: number): BossRoundRewardVo {
		var vo: BossRoundRewardVo;
		for (var i: number = 0; i < this.getBossRoundRewardConfig().length; i++) {
			vo = this._bossRoundRewardConfig[i];
			if (vo.boss_id == id && vo.type == type) {
				return vo;
			}
		}
		return null;
	}

	//获取个人boss列表
	public getBossPersonalList(): Array<BossVo> {
		var list: Array<BossVo> = [];
		// var obj = this.getBossPersonalConfig();
		// var vo: BossVo;
		// var arr: Array<BossVo> = [];
		// var arr2: Array<BossVo> = [];
		// for (var key in obj) {
		// 	if (obj.hasOwnProperty(key)) {
		// 		vo = obj[key];
		// 		if ((RoleModel.getInstance().getRoleCommon().level >= vo.open_level) && (RoleModel.getInstance().getRoleCommon().round >= vo.open_round)) {
		// 			if (vo.time > DailyModel.getInstance().getCountByTypeId(DailyModel.DAILY_TYPE_5, vo.template_id)) {
		// 				list.push(vo);
		// 			} else {
		// 				arr.push(vo);
		// 			}
		// 		} else {
		// 			arr2.push(vo);
		// 		}

		// 	}
		// }
		// return list.concat(arr).concat(arr2);
		return list;
	}

	//获取全民boss列表
	public getBossAllList(): Array<BossVo> {
		var list: Array<BossVo> = [];
		var obj = this.getBossAllConfig();
		var vo: BossVo;
		var arr: Array<BossVo> = [];
		var arr2: Array<BossVo> = [];
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				vo = obj[key];
				if (this.getBossAllDataById(vo.template_id)) {
					if ((RoleModel.getInstance().getRoleCommon().level >= vo.open_level) && (RoleModel.getInstance().getRoleCommon().round >= vo.open_round)) {
						if (this.getBossAllDataById(vo.template_id).hp_rate > 0) {
							list.push(vo);
						} else {
							arr.push(vo);
						}
					} else {
						arr2.push(vo);
					}
				}
			}
		}
		return list.concat(arr).concat(arr2);
	}

	public getBossAllDataById(value: number): NodeBoss_alls {
		return this._bossData[value];
	}

	public setBossAllTipStauts(value: Array<NodeBoss_all_notices>): void {
		if (!this._bossAllTipsStauts) this._bossAllTipsStauts = new Object();
		var info: NodeBoss_all_notices;
		for (var i = 0; i < value.length; i++) {
			info = value[i];
			this._bossAllTipsStauts[info.template_id] = info.flag > 0
		}
	}

	public getBossAllTipStautsById(value: number): boolean {
		if (this._bossAllTipsStauts) {
			return this._bossAllTipsStauts[value];
		}
		return true
	}

	//设置boss伤害信息
	public setBossDamageInfo(info: BossDamageInfo): void {
		this._bossDamageInfo = info;
		this.dispatchEvent(new ParamEvent(BossModel.UPDATE_BOSS_DAMAGEINFO));
	}

	public getBossDamageInfo(): BossDamageInfo {
		return this._bossDamageInfo;
	}

	//全民boss伤害列表格式转换
	public changePeopleToBossDamageVo(scmd: SCMD14412): BossDamageInfo {
		var vo: BossDamageInfo = new BossDamageInfo();
		vo.bossID = scmd.boss_id;
		vo.hp = scmd.hp;
		vo.maxHp = scmd.max_hp;
		vo.myHit = scmd.my_hit;
		vo.hitsList = new Array();
		var hit: BossHitInfo;
		for (var i: number = 0; i < scmd.boss_all_hits.length; i++) {
			hit = new BossHitInfo();
			hit.hit = scmd.boss_all_hits[i].hit;
			hit.name = scmd.boss_all_hits[i].name;
			hit.rank = scmd.boss_all_hits[i].ctime;
			vo.hitsList.push(hit);
		}
		return vo;
	}

	//转生boss伤害列表格式转换
	public changeRoundToBossDamageVo(scmd: SCMD14811): BossDamageInfo {
		var vo: BossDamageInfo = new BossDamageInfo();
		vo.bossID = scmd.boss_id;
		vo.hp = scmd.hp;
		vo.maxHp = scmd.max_hp;
		vo.shieldRate = scmd.shield_rate;
		vo.myHit = scmd.my_hit;
		vo.hitsList = new Array();
		var hit: BossHitInfo;
		for (var i: number = 0; i < scmd.boss_round_hits.length; i++) {
			hit = new BossHitInfo();
			hit.hit = scmd.boss_round_hits[i].hit;
			hit.name = scmd.boss_round_hits[i].name;
			hit.rank = scmd.boss_round_hits[i].ctime;
			vo.hitsList.push(hit);
		}
		return vo;
	}

	//跨服boss伤害列表格式转换
	public changeKFBossToBossDamageVo(scmd: SCMD20112): BossDamageInfo {
		var vo: BossDamageInfo = new BossDamageInfo();
		vo.bossID = scmd.boss_id;
		vo.hp = scmd.hp;
		vo.maxHp = scmd.max_hp;
		vo.myHit = scmd.my_hit;
		vo.hitsList = new Array();
		var hit: BossHitInfo;
		for (var i: number = 0; i < scmd.kfboss_awake_hits.length; i++) {
			hit = new BossHitInfo();
			hit.hit = scmd.kfboss_awake_hits[i].hit;
			hit.name = scmd.kfboss_awake_hits[i].name;
			hit.rank = scmd.kfboss_awake_hits[i].ctime;
			vo.hitsList.push(hit);
		}
		return vo;
	}

	//公会boss伤害列表格式转换
	public changeGuildBossToBossDamageVo(scmd: SCMD19412): BossDamageInfo {
		var vo: BossDamageInfo = new BossDamageInfo();
		vo.bossID = scmd.boss_id;
		vo.hp = scmd.hp;
		vo.maxHp = scmd.max_hp;
		vo.hitsList = new Array();
		vo.myHit = 0;
		return vo;
	}

	//boss之家伤害列表格式转换
	public changeNoHitListBossDamageVo(id: number, hp: number, maxHp: number): BossDamageInfo {
		var vo: BossDamageInfo = new BossDamageInfo();
		vo.bossID = id;
		vo.hp = hp;
		vo.maxHp = maxHp;
		vo.hitsList = new Array();
		vo.myHit = 0;
		return vo;
	}

	//普通的10700协议转变成BossDamageInfo
	public change10700ToBssDamageVo(scmd: SCMD10700): BossDamageInfo {
		var vo: BossDamageInfo = new BossDamageInfo();
		var targetVo: NodeBattle_result = scmd.battle_result[0];
		if (targetVo == null) {
			return vo;
		}
		var mVo = SceneModel.getInstance().getMonsterVo(targetVo.obj_id);
		if (mVo == null) {
			return vo;
		}
		vo.bossID = mVo.typeId;
		vo.hp = targetVo.hp;
		vo.maxHp = targetVo.max_hp;
		return vo;
	}


	public get isHasBoss(): boolean {
		if (this.isHasBossPersonal) return true;
		if (this.isHasBossAll) return true;
		return false;
	}
	public get isHasBossPersonal(): boolean {
		var listdata: Array<BossVo> = this.getBossPersonalList();
		// var vo: BossVo;
        // for (var i = 0; i < listdata.length; i++) {
		// 	vo = listdata[i];
		// 	var dailyCount: number = DailyModel.getInstance().getCountByTypeId(DailyModel.DAILY_TYPE_5, vo.template_id)
		// 	if (vo.time > dailyCount
		// 		&& RoleModel.getInstance().getRoleCommon().level >= vo.open_level
		// 		&& RoleModel.getInstance().getRoleCommon().round >= vo.open_round) {
		// 		return true;
		// 	}
        // }
		return false;
	}

	public get isHasBossAll(): boolean {
		if (this.bossAllInfo == null) {
			return false;
		}
		// if (this.bossAllInfo.bat_num >= Number(SingleModel.getInstance().getSingVO(SingleModel.KEY_46).value)) return false;
		// var listdata: Array<BossVo> = this.getBossAllList();
		// var vo: BossVo;
		// var bossData: NodeBoss_alls;
        // for (var i = 0; i < listdata.length; i++) {
		// 	vo = listdata[i];
		// 	bossData = this.getBossAllDataById(vo.template_id);
		// 	if (bossData && bossData.hp_rate > 0
		// 		&& RoleModel.getInstance().getRoleCommon().level >= vo.open_level
		// 		&& RoleModel.getInstance().getRoleCommon().round >= vo.open_round) {
		// 		return true;
		// 	}
        // }
		return false;
	}

	public setBossAllData(value: Array<NodeBoss_alls>): void {
		if (!this._bossData) {
			this._bossData = new Object();
		}

		var idx: number;
		var objNew: NodeBoss_alls;
		for (var i: number = 0; i < value.length; i++) {
			objNew = value[i];
			this._bossData[objNew.template_id] = objNew;
		}
	}

	public getRoundVO(value: number): BossRoundVo {
		return this.getBossRoundConfig()[value];
	}

	public setRoundData(value: Array<NodeBoss_rounds>): void {
		this._bossRoundInfo = value;
	}

	public getRoundHitData(value: number): Array<NodeBoss_round_hits> {
		var listData: Array<NodeBoss_round_hits> = [];
		if (this._bossRoundInfo) {
			for (var i = 0; i < this._bossRoundInfo.length; i++) {
				if (this._bossRoundInfo[i].template_id == value) {
					listData = this._bossRoundInfo[i].boss_round_hits;
				}
			}
		}
		return listData;
	}

	public getRoundRewardVO(id: number, type: number): Array<BossRoundRewardVo> {
		var listData: Array<BossRoundRewardVo> = [];
		var vo: BossRoundRewardVo;
		var config: Array<BossRoundRewardVo> = this.getBossRoundRewardConfig();
		for (var i = 0; i < config.length; i++) {
			vo = config[i];
			if (vo.boss_id == id && vo.type == type) {
				listData.push(vo);
			}

		}
		return listData;
	}

	//获取当前的全民boss
	public getCurrentPeopleBossVo(): BossVo {
		var n: any;
		var vo: BossVo;
		for (n in this.getBossAllConfig()) {
			vo = this._bossAllConfigDic[n];
			if (vo.template_id == this.currentPeopleBossID) {
				return vo;
			}
		}
		return null;
	}

	//获取当前公会bossVo
	public getCurrentGuildBoss(): BossVo {
		var obj = this.getBossGuildConfig();
		if (obj) {
			return obj[this.guildBossID];
		}
		return null;
	}

	//获取当前的转生boss
	public getCurrentRoundBossVo(): BossRoundVo {
		var n: any;
		var vo: BossRoundVo;
		var myRound: number = RoleModel.getInstance().getRoleCommon().round;
		for (n in this.getBossRoundConfig()) {
			vo = this._bossRoundConfigDic[n];
			if (vo.min_round <= myRound && myRound <= vo.max_round) {
				return vo;
			}
		}
		return null;
	}

	//转生boss转成普通bossvo
	public changeRoundBossToCommon(vo: BossRoundVo): BossVo {
		var result: BossVo = new BossVo();
		result.boss_id = vo.boss_id;
		result.boss_name = vo.boss_name;
		result.boss_pos = vo.boss_pos;
		result.randomPath = vo.randomPath;
		return result;
	}

	//攻城战城门怪伤害列表格式转换
	public changeCWOutToBossDamageVo(scmd: SCMD15300): BossDamageInfo {
		var vo: BossDamageInfo = new BossDamageInfo();
		vo.bossID = scmd.boss_id;
		vo.hp = scmd.hp;
		vo.maxHp = scmd.max_hp;
		vo.myHit = scmd.my_hit;
		vo.hitsList = new Array();
		var hit: BossHitInfo;
		for (var i: number = 0; i < scmd.boss_round_hits.length; i++) {
			hit = new BossHitInfo();
			hit.hit = scmd.boss_round_hits[i].hit;
			hit.name = scmd.boss_round_hits[i].name;
			hit.rank = scmd.boss_round_hits[i].ctime;
			vo.hitsList.push(hit);
		}
		return vo;
	}

	public setBossGuildData(value: Array<NodeBoss_guilds>): void {
		if (!this._bossGuildData) {
			this._bossGuildData = new Object();
		}

		var idx: number;
		var objNew: NodeBoss_guilds;
		for (var i: number = 0; i < value.length; i++) {
			objNew = value[i];
			this._bossGuildData[objNew.template_id] = objNew;
		}
	}

	public getBossGuildDataById(value: number): NodeBoss_guilds {
		return this._bossGuildData[value];
	}

	//获取公会boss列表
	public getBossGuildList(): Array<BossVo> {
		var list: Array<BossVo> = [];
		var obj = this.getBossGuildConfig();
		var vo: BossVo;
		var arr: Array<BossVo> = [];
		var arr2: Array<BossVo> = [];
		var data: NodeBoss_guilds;
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				vo = obj[key];
				data = this.getBossGuildDataById(vo.template_id);
				if (data) {
					if ((RoleModel.getInstance().getRoleCommon().level >= vo.open_level) && (RoleModel.getInstance().getRoleCommon().round >= vo.open_round)) {
						if (data.hp_rate > 0) {
							list.push(vo);
						} else {
							arr.push(vo);
						}
					} else {
						arr2.push(vo);
					}
				}
			}
		}
		return list.concat(arr).concat(arr2);
	}

	public setBossAwakeData(value: Array<NodeKfboss_awakes>): void {
		if (!this._bossAwakeData) {
			this._bossAwakeData = new Object();
		}

		var idx: number;
		var objNew: NodeKfboss_awakes;
		for (var i: number = 0; i < value.length; i++) {
			objNew = value[i];
			this._bossAwakeData[objNew.template_id] = objNew;
		}
	}
	public getBossAwakeDataById(value: number): NodeKfboss_awakes {
		return this._bossAwakeData ? this._bossAwakeData[value] : null;
	}
	//获取公会boss列表
	public getBossAwakeList(): Array<BossKfbossAwakeVo> {
		var list: Array<BossKfbossAwakeVo> = [];
		var obj = this.getBossKFAwakeConfig();
		var vo: BossKfbossAwakeVo;
		var arr: Array<BossKfbossAwakeVo> = [];
		var arr2: Array<BossKfbossAwakeVo> = [];
		var data: NodeKfboss_awakes;
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				vo = obj[key];
				data = this.getBossAwakeDataById(vo.template_id);
				if (data) {
					if ((RoleModel.getInstance().getRoleCommon().level >= vo.open_level) && (RoleModel.getInstance().getRoleCommon().round >= vo.open_round)) {
						if (data.hp_rate > 0) {
							list.push(vo);
						} else {
							arr.push(vo);
						}
					} else {
						arr2.push(vo);
					}
				} else {
					list.push(vo);
				}
			}
		}
		return list.concat(arr).concat(arr2);
	}

	public getBossAwakeVo(value: number): BossKfbossAwakeVo {
		return this.getBossKFAwakeConfig()[value]
	}

	public setBossHomeData(value: Array<NodeBoss_homes>): void {
		if (!this._bossHomeData) {
			this._bossHomeData = new Object();
		}
		var idx: number;
		var objNew: NodeBoss_homes;
		for (var i: number = 0; i < value.length; i++) {
			objNew = value[i];
			this._bossHomeData[objNew.template_id] = objNew;
		}
	}

	public getBossHomeDataById(value: number): NodeBoss_homes {
		return this._bossHomeData[value];
	}
	public getBossHomeCDByType(type: number): number {
		var a = this;
		if (a.bossHomeCD) {
			var info: NodeEnter_last_time;
			for (var i = 0; i < a.bossHomeCD.enter_last_time.length; i++) {
				info = a.bossHomeCD.enter_last_time[i];
				if (info.type == type) {
					return info.num;
				}
			}
		}
		return 0;
	}
	public getBossHomeList(type: number = 0): Array<BossVo> {
		var list: Array<BossVo> = [];
		var obj = this.getBossHomeConfig();
		var vo: BossVo;
		var arr: Array<BossVo> = [];
		var arr2: Array<BossVo> = [];
		var data: NodeBoss_homes;
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				vo = obj[key];
				data = this.getBossHomeDataById(vo.template_id);
				if ((vo.type == type || type == 0) && data) {
					if ((RoleModel.getInstance().getRoleCommon().level >= vo.open_level) && (RoleModel.getInstance().getRoleCommon().round >= vo.open_round)) {
						if (data.last_time > 0) {
							list.push(vo);
						} else {
							arr.push(vo);
						}
					} else {
						arr2.push(vo);
					}
				}
			}
		}
		list.sort(this.sortBoss)
		arr.sort(this.sortBoss);
		return list.concat(arr).concat(arr2);
	}

	public sortBoss(a: BossVo, b: BossVo): number {
		var flag: number = 0;
		if (a.open_round > b.open_round) {
			flag = -1;
		} else if (a.open_round < b.open_round) {
			flag = 1;
		} else if (a.open_level > b.open_level) {
			flag = -1;
		} else if (a.open_level < b.open_level) {
			flag = 1;
		}
		return flag;
	}
	public getBossHomeTypeList(): Array<BossHomeVo> {
		if (!this._homeTypeArr) this.getBossHomeTypeConfig();
		return this._homeTypeArr;
	}
	public getBossHomeVo(value: number): BossVo {
		return this.getBossHomeConfig()[value]
	}
	public getBossHomeTypeVo(value: number): BossHomeVo {
		return this.getBossHomeTypeConfig()[value]
	}

	public setBossEliteData(value: Array<NodeBoss_elites>): void {
		if (!this._bossEliteData) {
			this._bossEliteData = new Object();
		}
		var idx: number;
		var objNew: NodeBoss_elites;
		for (var i: number = 0; i < value.length; i++) {
			objNew = value[i];
			this._bossEliteData[objNew.template_id] = objNew;
		}
	}

	public getBossEliteDataById(value: number): NodeBoss_elites {
		return this._bossEliteData[value];
	}

	public getBossEliteList(): Array<BossEliteVo> {
		var list: Array<BossEliteVo> = [];
		var obj = this.getBossEliteConfig();
		var vo: BossEliteVo;
		var arr: Array<BossEliteVo> = [];
		var arr2: Array<BossEliteVo> = [];
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				vo = obj[key];
				if (this.getBossEliteDataById(vo.template_id)) {
					if ((RoleModel.getInstance().getRoleCommon().level >= vo.open_level) && (RoleModel.getInstance().getRoleCommon().round >= vo.open_round)) {
						if (this.getBossEliteDataById(vo.template_id).last_time > 0) {
							list.push(vo);
						} else {
							arr.push(vo);
						}
					} else {
						arr2.push(vo);
					}
				}
			}
		}
		list.sort(this.sortBoss)
		arr.sort(this.sortBoss);
		return list.concat(arr).concat(arr2);
	}
	public getBossEliteVo(value: number): BossEliteVo {
		return this.getBossEliteConfig()[value]
	}


	public setBossFieldData(value: Array<NodeBoss_fields>): void {
		if (!this._bossFieldData) {
			this._bossFieldData = new Object();
		}
		var idx: number;
		var objNew: NodeBoss_fields;
		for (var i: number = 0; i < value.length; i++) {
			objNew = value[i];
			this._bossFieldData[objNew.template_id] = objNew;
		}
	}

	public getBossFieldDataById(value: number): NodeBoss_fields {
		return this._bossFieldData[value];
	}

	public getBossFieldList(): Array<BossFieldVo> {
		var list: Array<BossFieldVo> = [];
		var obj = this.getBossFieldConfig();
		var vo: BossFieldVo;
		var arr: Array<BossFieldVo> = [];
		var arr2: Array<BossFieldVo> = [];
		var data: NodeBoss_fields
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				vo = obj[key];
				data = this.getBossFieldDataById(vo.template_id);
				if (data) {
					if ((RoleModel.getInstance().getRoleCommon().level >= vo.open_level) && (RoleModel.getInstance().getRoleCommon().round >= vo.open_round)) {
						if (data.last_time > 0) {
							list.push(vo);
						} else {
							arr.push(vo);
						}
					} else {
						arr2.push(vo);
					}
				}
			}
		}
		list.sort(this.sortBoss)
		arr.sort(this.sortBoss);
		return list.concat(arr).concat(arr2);
	}
	public getBossFieldVo(value: number): BossFieldVo {
		return this.getBossFieldConfig()[value]
	}

	public setBossGuildCall(value: SCMD19430): void {
		var a = this;
		var info: SCMD19430;
		for (var i = 0; i < a.BossGuildCallArr.length; i++) {
			info = a.BossGuildCallArr[i];
			if (info.name == value.name) {
				if (value.is_show > 0) {
					a.BossGuildCallArr[i] = value;
				} else {
					a.BossGuildCallArr.splice(i, 1)
				}
				return;
			}

		}
		if (value.is_show > 0) {
			a.BossGuildCallArr.push(value);
		}
	}
}