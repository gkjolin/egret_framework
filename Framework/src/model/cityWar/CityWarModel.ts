class CityWarModel extends egret.EventDispatcher {
	private static _instance: CityWarModel;
	private _occupyInfo: SCMD15200;

	public fightType: number = 0;
	public fightID: any;
	public isOpenCityWar: boolean = false;
	public static UPDATE_OCCUPYINFO: string = "UPDATE_OCCUPYINFO";
	public static UPDATE_GUILDRANKINFO: string = "UPDATE_GUILDRANKINFO";
	public static UPDATE_PERSONRANKINFO: string = "UPDATE_PERSONRANKINFO";
	public static UPDATE_REWARDSTORAGE: string = "UPDATE_REWARDSTORAGE";
	public static UPDATE_ASSIGN_GOODS: string = "UPDATE_ASSIGN_GOODS";
	public static UPDATE_INNERRANK: string = "UPDATE_INNERRANK";
	public static UPDATE_CANATTACKLIST: string = "UPDATE_CANATTACKLIST";
	public static UPDATE_CITYWAR_POINT: string = "UPDATE_CITYWAR_POINT";
	public static UPDATE_FLAG_STATU: string = "UPDATE_FLAG_STATU";
	public static FIGHT_STATU_CHANGE: string = "FIGHT_STATU_CHANGE";

	private _fightRoomList: Array<CWRoomVo>;
	public isCaiQi: boolean = false;
	private _cwKFOpenDay: number = -1;//攻城战在开服第几天开启
	private _cwOpenWeek: number = -1;//攻城战在周几开启
	private _cwDaysLimit: number = -1;//开服天数内的周六不开启攻城战
	public constructor() {
		super();
	}

	public static getInstance(): CityWarModel {
		if (this._instance == null) {
			this._instance = new CityWarModel();
		}
		return this._instance;
	}

	public setOccupyInfo(scmd: SCMD15200): void {
		this._occupyInfo = scmd;
		this.dispatchEvent(new ParamEvent(CityWarModel.UPDATE_OCCUPYINFO));
	}

	public get occupyInfo() {
		return this._occupyInfo;
	}

	private _cityWarRewardConfigDic: Object;
	public getCityWarRewardConifg(): void {
		if (this._cityWarRewardConfigDic == null) {
			this._cityWarRewardConfigDic = new Object();
			var config: Object = DataManager.getInstance().getObj("data_siege_reward");
			var list: Array<Object> = config["data_siege_reward"];
			for (var i: number = 0; i < list.length; i++) {
				var obj: Object = list[i];
				var vo: CityWarRewardConfigVo = new CityWarRewardConfigVo();
				vo.template_id = obj["template_id"];
				vo.type = obj["type"];
				vo.min = obj["min"];
				vo.max = obj["max"];
				vo.need_point = obj["need_point"];
				vo.goodsList = Tools.changeToNodeDropList(obj["add_item"]);
				this._cityWarRewardConfigDic[vo.template_id] = vo;
			}
		}
	}

	private _cityWarSceneConfigDic: Object;
	public getCityWarSceneConfig(sceneID: number): CWSceneConfigVo {
		if (this._cityWarSceneConfigDic == null) {
			this._cityWarSceneConfigDic = new Object();
			var config: Object = DataManager.getInstance().getObj("data_siege");
			var list: Array<Object> = config["data_siege"];
			for (var i: number = 0; i < list.length; i++) {
				var obj: Object = list[i];
				var vo: CWSceneConfigVo = new CWSceneConfigVo();
				vo.template_id = obj["template_id"];
				vo.con_gold = obj["con_gold"];
				vo.scene_id = obj["scene_id"];
				vo.revive_time = obj["revive_time"];
				vo.go_point = obj["go_point"];
				vo.setRandomPath(obj["player_pos"]);
				vo.setMonPoint(obj["mon_pos"]);
				this._cityWarSceneConfigDic[vo.scene_id] = vo;
			}
		}
		return this._cityWarSceneConfigDic[sceneID];
	}

	public getTypeRewardConfigList(type: number): Array<CityWarRewardConfigVo> {
		var list: Array<CityWarRewardConfigVo> = new Array();
		this.getCityWarRewardConifg();
		var n: any;
		for (n in this._cityWarRewardConfigDic) {
			var vo: CityWarRewardConfigVo = this._cityWarRewardConfigDic[n];
			if (vo.type == type) {
				list.push(vo);
			}
		}
		return list;
	}

	private _guildRank: SCMD15201;

	public setGuildRankInfo(scmd: SCMD15201): void {
		this._guildRank = scmd;
		this._guildRank.siege_scores.sort(
			(a: NodeSiege_scores, b: NodeSiege_scores) => {
				if (a.score > b.score) {
					return 0;
				}
				return 1;
			})
		this.dispatchEvent(new ParamEvent(CityWarModel.UPDATE_GUILDRANKINFO));
	}

	public get guildRankInfo() {
		return this._guildRank;
	}

	private _personRankInfo: SCMD15202;
	public setPersonRankInfo(scmd: SCMD15202): void {
		this._personRankInfo = scmd;
		this._personRankInfo.siege_scores.sort(
			(a: NodeSiege_scores, b: NodeSiege_scores) => {
				if (a.score > b.score) {
					return 0;
				}
				return 1;
			})
		this.dispatchEvent(new ParamEvent(CityWarModel.UPDATE_PERSONRANKINFO));
	}

	public get personRankInfo() {
		return this._personRankInfo;
	}

	private _cityWarStorageInfo: SCMD15210;
	public setCityWarStorageInfo(scmd: SCMD15210): void {
		this._cityWarStorageInfo = scmd;
		this.dispatchEvent(new ParamEvent(CityWarModel.UPDATE_REWARDSTORAGE));
	}

	public get cityWarStorageInfo() {
		return this._cityWarStorageInfo;
	}

	//获取攻城战，奖励仓库中某个物品的剩余数量
	public getLeftNumOfGoods(id: number): number {
		var result: number = 0;
		if (this._cityWarStorageInfo) {
			var list = this._cityWarStorageInfo.siege_depot;
			for (var i: number = 0; i < list.length; i++) {
				var node: NodeSiege_depot = list[i];
				if (node.cfg_id == id) {
					result = node.num;
					break;
				}
			}
		}
		return result;
	}

	//分配仓库中的奖励物品
	private _storageAssignDic: Object;
	public setMemberGoodsNum(roleID: number, goodsID: number, num: number): void {
		if (this._storageAssignDic == null) {
			this._storageAssignDic = new Object();
		}
		var vo: CWAssignVo = this._storageAssignDic[roleID];
		if (vo == null) {
			vo = new CWAssignVo();
			vo.roleID = roleID;
			this._storageAssignDic[vo.roleID] = vo;
		}
		var hasUpdateGoods: boolean;
		var list: Array<NodeDrop_list> = vo.goodsList;
		for (var i: number = 0; i < list.length; i++) {
			var node: NodeDrop_list = list[i];
			if (node.asset_id == goodsID) {
				node.value = num;
				hasUpdateGoods = true;
				break;
			}
		}
		//如果没有找到物品信息来更新，就要添加
		if (!hasUpdateGoods) {
			var node: NodeDrop_list = new NodeDrop_list();
			node.asset_id = goodsID;
			node.value = num;
			vo.goodsList.push(node);
		}
		this.dispatchEvent(new ParamEvent(CityWarModel.UPDATE_ASSIGN_GOODS));
	}

	public getStorageAssignDic(): Object {
		return this._storageAssignDic;
	}

	//根据角色id获取这个角色的分配信息
	public getCWStoreageAssignVo(id: number): CWAssignVo {
		if (this._storageAssignDic == null) {
			return null;
		}
		return this._storageAssignDic[id];
	}

	//设置攻城战内的排行信息
	private _innerRankInfo: SCMD15231; NodeSiege_guild_times
	public setInnerRankInfo(data: SCMD15231): void {
		this._innerRankInfo = data;
		this._innerRankInfo.siege_scores.sort(
			(a: NodeSiege_scores, b: NodeSiege_scores) => {
				if (a.score > b.score) {
					return 0;
				}
				return 1;
			});
		this._innerRankInfo.siege_guild_times.sort(
			(a: NodeSiege_guild_times, b: NodeSiege_guild_times) => {
				if (a.total_time > b.total_time) {
					return -1;
				}
				return 1;
			}
		);
		this.dispatchEvent(new ParamEvent(CityWarModel.UPDATE_INNERRANK));
	}

	public get innerRankInfo() {
		return this._innerRankInfo;
	}

	//设置可攻击的玩家列表
	private _attackPlayerList: Array<CityWarFightVo>;
	public setCanAttackPlayerList(list: Array<CityWarFightVo>): void {
		this._attackPlayerList = list;
		this.dispatchEvent(new ParamEvent(CityWarModel.UPDATE_CANATTACKLIST));
	}

	//根据ID找出敌人信息
	public findEnermyVoByID(id: number): CityWarFightVo {
		var list = this._attackPlayerList;
		if (list) {
			for (var i = 0; i < list.length; i++) {
				var vo = list[i];
				if (vo.roleID == id) {
					return vo;
				}
			}
		}
		return null;
	}

	public convertAttackPlayerList(list: Array<NodeAtt_roles>): Array<CityWarFightVo> {
		var result: Array<CityWarFightVo> = new Array();
		for (var i: number = 0; i < list.length; i++) {
			var node: NodeAtt_roles = list[i];
			var vo: CityWarFightVo = new CityWarFightVo();
			vo.changeFromNode(node);
			result.push(vo);
		}
		return result;
	}

	public get attackPlayerList() {
		if (this._attackPlayerList == null) {
			this._attackPlayerList = new Array();
		}
		return this._attackPlayerList;
	}

	//获取攻城战中刷新可攻击玩家的cd
	public getRefreshCD(): number {
		// var vo: SingleVO = SingleModel.getInstance().getSingVO(SingleModel.KEY_15205);
		// if (vo) {
		// 	return parseInt(vo.value);
		// }
		return 5;
	}

	//判断攻城战是否开启
	public isOpen(): boolean {
		var result: boolean = false;
		// if (HuoDongDailyModel.getInstance().kaiFuDay == this.cwKFOpenDay) {
		// 	result = true;
		// }
		// else if (HuoDongDailyModel.getInstance().kaiFuDay > this.cwDaysLimit) {
		// 	var now: Date = new Date(RoleModel.getInstance().serverTime * 1000);
		// 	if (now.getDay() == this.cwOpenWeek) {
		// 		result = true;
		// 	}
		// }
		return result;
	}

	private _cityWarPoint: number = 0;
	public setCityWarPoint(point: number): void {
		this._cityWarPoint = point;
		this.dispatchEvent(new ParamEvent(CityWarModel.UPDATE_CITYWAR_POINT));
	}

	public get cityWarPoint() {
		return this._cityWarPoint;
	}

	private _flagStatu: SCMD15600;
	public setFlagStatu(scmd: SCMD15600): void {
		this._flagStatu = scmd;
		this.dispatchEvent(new ParamEvent(CityWarModel.UPDATE_FLAG_STATU));
	}
	public get flagStatu(): SCMD15600 {
		return this._flagStatu;
	}

	//在攻城战里面3层中，战斗的时候要屏蔽掉操作界面
	private _isFighting: boolean;
	public setFighting(value: boolean): void {
		if (SceneModel.getInstance().isCityWarInner()) {
			if (this._isFighting != value) {
				this._isFighting = value;
				this.dispatchEvent(new ParamEvent(CityWarModel.FIGHT_STATU_CHANGE));
			}
		}
	}
	public get isFighting() {
		return this._isFighting;
	}

	public clearAssignData(): void {
		this._storageAssignDic = new Object();
		this.dispatchEvent(new ParamEvent(CityWarModel.UPDATE_ASSIGN_GOODS));
	}

	//判断玩家是否在攻击列表中
	public checkRoleInAttackPlayerList(id: number): boolean {
		var a = this;
		if (a._attackPlayerList == null) {
			return false;
		}
		for (var i: number = 0; i < a._attackPlayerList.length; i++) {
			var vo: CityWarFightVo = a._attackPlayerList[i];
			if (vo.roleID == id) {
				return true;
			}
		}
		return false;
	}

	//从攻击列表中移除某个玩家
	public removeRoleFromAttackPlayerList(id: number): void {
		var a = this;
		if (a._attackPlayerList == null) {
			return;
		}
		for (var i: number = 0; i < a._attackPlayerList.length; i++) {
			var vo: CityWarFightVo = a._attackPlayerList[i];
			if (vo.roleID == id) {
				a._attackPlayerList.splice(i, 1);
				return;
			}
		}
	}

	//判断攻城战每日奖励能否领取
	public checkCityWarDailyReweard(): boolean {
		if (this.occupyInfo == null) {
			return false;
		}
		if (RoleModel.getInstance().getRoleCommon().guild_id == 0) {
			return false;
		}
		if (this.occupyInfo.guild_id != RoleModel.getInstance().getRoleCommon().guild_id) {
			return false;
		}
		// var value: number = DailyModel.getInstance().getCountByTypeId(DailyModel.DAILY_TYPE_23);
		// if (value > 0) {
		// 	return false;
		// }
		return true;
	}

	//添加战斗房间关联的ID信息,id是玩家id，不是伙伴id
	public addRoomInfo(attID: string, defID: string): void {
		if (!(SceneModel.getInstance().isCityWarFrontPalace() || SceneModel.getInstance().isCityWarPalace())) {
			return;
		}
		var a = this;
		if (a._fightRoomList == null) {
			a._fightRoomList = new Array();
		}
		var isOK: boolean = false;
		for (var i: number = 0; i < a._fightRoomList.length; i++) {
			var vo: CWRoomVo = a._fightRoomList[i];
			var result: string = vo.checkRelated(attID, defID);
			if (result != "") {
				vo.addRelation(result);
				isOK = true;
				break;
			}
			else if (result == "") {//攻防双方都已经在战斗房间中就直接返回了
				return;
			}
		}
		if (!isOK) {
			var vo: CWRoomVo = new CWRoomVo();
			vo.addRelation(attID);
			vo.addRelation(defID);
			a._fightRoomList.push(vo);
		}
	}

	//移除战斗房间关联的ID信息,id是角色id
	public removeRoomInfo(playerID: string): void {
		if (!(SceneModel.getInstance().isCityWarFrontPalace() || SceneModel.getInstance().isCityWarPalace())) {
			return;
		}
		var a = this;
		if (a._fightRoomList) {
			for (var i = 0; i < a._fightRoomList.length; i++) {
				var vo: CWRoomVo = a._fightRoomList[i];
				if (vo.removeRelation(playerID)) {
					if (vo.num <= 1) {
						a._fightRoomList.splice(i, 1);
					}
					break;
				}
			}
		}
	}

	//根据广播的战斗协议构造战斗房间信息
	public parse10700(scmd: SCMD10700): void {
		if (!(SceneModel.getInstance().isCityWarFrontPalace() || SceneModel.getInstance().isCityWarPalace())) {
			return;
		}
		if (scmd.type != AttackType.PARTNER) {
			return;
		}
		var list: Array<NodeBattle_result> = scmd.battle_result;
		var uid = PlayerBaseVO.makeUid(scmd.plat_name, scmd.att_id);
		var attackID: string = SceneModel.getInstance().findPlayerIDByPartnerID(uid);
		if (attackID == "") {
			return;
		}
		for (var i: number = 0; i < list.length; i++) {
			var node: NodeBattle_result = list[i];
			if (node.obj_type == AttackType.PARTNER) {
				uid = PlayerBaseVO.makeUid(node.plat_name, node.obj_id);
				var defID: string = SceneModel.getInstance().findPlayerIDByPartnerID(uid);
				if (defID == "") {
					break;
				}
				this.addRoomInfo(attackID, defID);
			}
		}
	}

	//根据玩家id找出对应所在的战斗房间,id是玩家id
	public findRoomVoByPlayerID(id: string): CWRoomVo {
		var list: Array<CWRoomVo> = this._fightRoomList;
		if (list == null) {
			return null;
		}
		for (var i: number = 0; i < list.length; i++) {
			var vo: CWRoomVo = list[i];
			if (vo.contains(id)) {
				return vo;
			}
		}
		return null;
	}

	public clearFightRommList(): void {
		this._fightRoomList = null;
	}

	public get cwDaysLimit() {
		if (this._cwDaysLimit < 0) {
			this._cwDaysLimit = 4;
			// var vo: SingleVO = SingleModel.getInstance().getSingVO(SingleModel.KEY_15212);
			// if (vo) {
			// 	this._cwDaysLimit = parseInt(vo.value);
			// }
		}
		return this._cwDaysLimit;
	}

	public get cwKFOpenDay() {
		if (this._cwKFOpenDay < 0) {
			this._cwKFOpenDay = 4;
			// var vo: SingleVO = SingleModel.getInstance().getSingVO(SingleModel.KEY_15201);
			// if (vo) {
			// 	var reg: RegExp = /\d+/g;
			// 	var list = vo.value.match(reg);
			// 	this._cwKFOpenDay = parseInt(list[0]);
			// }
		}
		return this._cwKFOpenDay;
	}

	public get cwOpenWeek() {
		if (this._cwOpenWeek < 0) {
			this._cwOpenWeek = 6;
			// var vo: SingleVO = SingleModel.getInstance().getSingVO(SingleModel.KEY_15201);
			// if (vo) {
			// 	var reg: RegExp = /\d+/g;
			// 	var list = vo.value.match(reg);
			// 	this._cwOpenWeek = parseInt(list[1]);
			// }
		}
		return this._cwOpenWeek;
	}
}