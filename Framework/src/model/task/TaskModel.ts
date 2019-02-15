class TaskModel extends egret.EventDispatcher {
	public static TYPE_GUIZU: string = "guizu";//
	public static TYPE_RANK: string = "rank";//
	public static TYPE_SHOPCHEAP: string = "shopcheap";//
	public static TYPE_SHADOW: string = "shadow";//
	public static TYPE_AWAKE: string = "awake";//
	public static TYPE_LUNHUI: string = "lunhui";//
	public static TYPE_FULI: string = "fuli";//
	public static TYPE_LILIAN: string = "lilian";//

	public static TYPE_DIALOG: number = 10002;
	public static TYPE_KILL_MONSTER: number = 10001;

	public isNoviceTaskExit: boolean = false;
	public isGuildGuide: boolean = false;
	public guildGuideLvl: number = 80;

	private _taskObj: Object = new Object();
	private _noviceTaskConfig: Array<TaskVo> = [];
	public autoTime: number = 1300;
	public taskMonster: number = 0;
	// private _taskNewConfigList: Array<TaskNewVO> = [];
	private static _instance: TaskModel;
	private _taskInfo: SCMD11400;
	public static getInstance(): TaskModel {
		if (this._instance == null) {
			this._instance = new TaskModel();
		}
		return this._instance;
	}
	public constructor() {
		super();
		this.createBasic();
	}

	private createBasic(): void {
		var jsonObj: Object = DataManager.getInstance().getObj("data_task");
		let list: Array<Object> = jsonObj["data_task"];
		let itemObj: Object;
		var result: TaskVo;
		var addItemRegMatchList: RegExpMatchArray;
		for (let i: number = 0; i < list.length; i++) {
			itemObj = list[i];
			result = new TaskVo();
			result.template_id = itemObj["template_id"];
			result.name = itemObj["name"];
			result.next_id = itemObj["next_id"];
			result.type = itemObj["type"];
			result.need = itemObj["need"];
			result.add_coin = itemObj["add_coin"];
			result.add_exp = itemObj["add_exp"];
			result.xs = itemObj["xs"];
			result.desc = itemObj["desc"];
			result.is_rookie = itemObj["is_rookie"];
			result.add_item = itemObj["add_item"];
			result.end_npc = itemObj["end_npc"];
			result.start_talk = itemObj["start_talk"];
			result.end_talk = itemObj["end_talk"];
			if (itemObj["mon_pos"] != "" && itemObj["mon_pos"] != "0")
				result.setMonsterPos(itemObj["mon_pos"]);
			if (itemObj["mon_list"] != "" && itemObj["mon_list"] != "0")
				result.setMonster(itemObj["mon_list"]);
			if (result.add_item != "" && result.add_item != "0") {
				addItemRegMatchList = result.add_item.match(/\d+/g);
				result.itemID = parseInt(addItemRegMatchList[0]);
				result.itemNum = parseInt(addItemRegMatchList[1]);
				result.itemList = Tools.changeToItemData(itemObj["add_item"]);
			} else {
				result.itemID = 0;
				result.itemNum = 0;
			}
			result.event = itemObj["event"];
			if (result.event != "" && result.event != "0") {
				addItemRegMatchList = result.event.split(",")
				result.moduleType = addItemRegMatchList[0];
				result.moduleIndex = parseInt(addItemRegMatchList[1]);
			} else {
				result.moduleType = "";
				result.moduleIndex = 0;
			}
			this._taskObj[result.template_id] = result;
			if (result.is_rookie == 1) {
				this._noviceTaskConfig.push(result);
			}
		}
	}

	// private createTaskNewConfig(): Array<TaskNewVO> {
	// 	var jsonObj: Object = DataManager.getInstance().getObj("data_task_new");
	// 	let list: Array<Object> = jsonObj["data_task_new"];
	// 	let itemObj: Object;
	// 	var result: TaskNewVO;
	// 	var xmlObj: Array<TaskNewVO> = [];
	// 	for (let i: number = 0; i < list.length; i++) {
	// 		itemObj = list[i];
	// 		result = new TaskNewVO();
	// 		result.id = itemObj["id"];
	// 		result.name = itemObj["name"];
	// 		result.desc = itemObj["desc"];
	// 		result.type = itemObj["type"];
	// 		result.prev = itemObj["prev"];
	// 		result.transfer = itemObj["transfer"];
	// 		result.next = itemObj["next"];
	// 		result.start_talk = itemObj["start_talk"];
	// 		result.end_talk = itemObj["end_talk"];
	// 		result.exp = itemObj["exp"];
	// 		result.coin = itemObj["coin"];
	// 		result.levellimimt = itemObj["levellimimt"];
	// 		result.setMonsterPos(itemObj["mon_pos"]);
	// 		result.setMonster(itemObj["mon_list"]);
	// 		if (itemObj["add_item"] != "" && itemObj["add_item"] != "0") {
	// 			result.awardList = Tools.changeToNodeDropList(itemObj["add_item"]);
	// 		}
	// 		xmlObj.push(result);
	// 	}
	// 	return xmlObj;
	// }

	public isNovicePlayer(): boolean {
		var a = this;
		var lvl: number = RoleModel.getInstance().getRoleCommon().level;
		var vo: TaskVo = a.getCurNoviceTask();
		if (lvl <= 20 && (vo != null && vo != undefined)) return true;
		return false;
	}
	public isNoviceTaskFinished(): boolean {
		var isFinished: boolean =false// FixedNumModel.getInstance().getFixedNum(FixedNumModel.FIXED_NUM_TYPE24302) == 1;
		return isFinished;
	}
	public isNoviceTaskFinishedById(id: number): boolean {
		// var a = this;
		// var vo: TaskVo = a.getTaskInfoById(id);
		// var finishedId: number = FixedNumModel.getInstance().getFixedNum(FixedNumModel.FIXED_NUM_TYPE24301);
		// var index: number = a._noviceTaskConfig.indexOf(vo);
		// if (finishedId > index) return true;
		return false;
	}
	//当前新手指引任务
	public getCurNoviceTask(): TaskVo {
		// var a = this;
		// // var taskId: number = FixedNumModel.getInstance().getFixedNum(FixedNumModel.FIXED_NUM_TYPE24301);
		// var vo: TaskVo = a._noviceTaskConfig[taskId];
		// return vo;
		return null;
	}
	private _killCount: number = 0;
	public killMonsterAddCount(id: number): void {
		var a = this;
		var vo: TaskVo = a.getCurNoviceTask();
		if (vo == null || vo == undefined) return;
		if (vo.monsterList != null && vo.monsterList.length > 0) {
			if (vo.monsterList[0].id == id) {
				a._killCount++;
				// GameDispatcher.getInstance().dispatchEvent(new ParamEvent(TaskEvtName.NOVICE_TASK_KILLNUM_UPDATE));
			}
			if (a._killCount >= vo.monsterList[0].count) {
				GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.WALK_TO_NPC, { id: vo.end_npc }))
				a._killCount = 0;
			}
		}
	}
	public getKillMonsterCount(): number {
		var a = this;
		return a._killCount;
	}

	public getTaskInfoById(value: number): TaskVo {
		return this._taskObj[value];
	}

	public setCurTaskInfo(value: SCMD11400): void {
		this._taskInfo = value;
	}

	public getCurTaskInfo(): SCMD11400 {
		var a = this;
		return a._taskInfo;
	}

	public getCurTaskXS(): number {
		if (this._taskInfo) {
			var vo: TaskVo = this._taskObj[this._taskInfo.task_id];
			if (vo && vo.need > this._taskInfo.num) {
				return vo.xs;
			}
		}
		return -1;
	}

	public get curTaskId() {
		var id: number = 0;
		if (this._taskInfo) id = this._taskInfo.task_id
		return id;
	}

	public getTaskOpenView(vo: TaskVo): void {
		this.getTaskOpen(vo.moduleType, vo.moduleIndex);
	}
	public getTaskOpen(moduleType: string, moduleIndex: number): void {
		// switch (moduleType) {
		// 	case "skill":
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.MAINUI_CLICK_SKILL, moduleIndex));
		// 		break;
		// 	case "figure":
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.MAINUI_CLICK_FIGURE, { index: moduleIndex, isOpen: true }));
		// 		break;
		// 	case "build":
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.MAINUI_CLICK_BUILD, moduleIndex));
		// 		break;
		// 	case "fuben":
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(FubenEvtName.OPEN_FUBEN_VIEW, moduleIndex));
		// 		break;
		// 	case "ronglian"://熔炼
		// 		// GameDispatcher.getInstance().dispatchEvent(new ParamEvent(RongLianEvtName.RONGLIAN_OPEN_VIEW, { state: true }));
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.MAINUI_CLICK_PACK, { index: 0, isOpen: true }));
		// 		break;
		// 	case "boss"://个人、全民、转生Boss
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(BossEvtName.OPEN_BOSS_WINDOW, moduleIndex));
		// 		break;
		// 	case "meetBoss"://遭遇Boss
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(BossEvtName.OPEN_MEET_BOSS_WINDOW));
		// 		break;
		// 	case "speedpk"://快速战斗
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.MAINUI_SPEED_PK));
		// 		break;
		// 	case "checkPointBoss"://关卡
		// 		var scmd: SCMD10600 = SceneModel.getInstance().getSceneWave();
		// 		if (scmd.award_id > scmd.awarded_id) GameDispatcher.getInstance().dispatchEvent(new ParamEvent(CheckPointBossEvtName.NOVICECG_OPEN_WINDOW));
		// 		else GameDispatcher.getInstance().dispatchEvent(new ParamEvent(CheckPointBossEvtName.CHECKPOINTBOSS_OPEN_WINDOW));
		// 		break;
		// 	case "specialEquip"://龙魂
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(FigureEvtName.FIGURE_OPEN_SPECIALEQUIPWINDOW, { state: true, type: 3 }));
		// 		break;
		// 	case "guild"://公会
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.MAINUI_CLICK_GUILD));
		// 		break;
		// 	case "mall"://
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.MAINUI_CLICK_MALL, moduleIndex));
		// 		break;
		// 	case TaskModel.TYPE_GUIZU://贵族,月卡
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(VipEvtName.OPEN_VIP_MONTH, moduleIndex));
		// 		break;
		// 	case TaskModel.TYPE_RANK://排行榜
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(RankEvtName.RANK_OPEN_VIEW, moduleIndex));
		// 		break;
		// 	case TaskModel.TYPE_SHOPCHEAP://
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(MallEvtName.OPEN_SHOPCHEAP, moduleIndex));
		// 		break;
		// 	case TaskModel.TYPE_SHADOW://
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(ShadowEvtName.OPEN_SHADOW, moduleIndex));
		// 		break;
		// 	case TaskModel.TYPE_AWAKE://
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(AwakeEvtName.OPEN_AWAKE, moduleIndex));
		// 		break;
		// 	case TaskModel.TYPE_LUNHUI://
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.OPEN_LUNHUI_WINDOW, moduleIndex));
		// 		break;
		// 	case TaskModel.TYPE_LILIAN:
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(ArtifactEvtName.ARTIFACT_OPEN_WINDOW, { index: moduleIndex, isOpen: true }));
		// 		break;
		// 	case "king":
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(KingEvtName.OPEN_VIEW_SELECT));
		// 		break;
		// 	case "kuafu":
		// 		// TipsWordManager.getInstance().isCity = false;
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.MAINUI_SHOW_RIGHTTOP, { state: true }));
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(SceneEvtName.MAIN_CITY_CHANGE));
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(KuaFuEvtName.KUAFU_OPEN_MAP));
		// 		break;
		// 	case "cityWar":
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(CityWarEvtName.SHOW_CITYWAR_VIEW));
		// 		break;
		// 	case "partner":
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(FigureEvtName.FIGURE_OPEN_OPENPARTNERWINDOW));
		// 		break;
		// 	case "fightUp":
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.OPEN_FIGHT_UP_WINDOW));
		// 		break;
		// 	case "magicPet":
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.PET_OPEN_WINDOW, moduleIndex));
		// 		break;
		// 	case "shenqi":
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(ArtifactEvtName.ARTIFACT_OPEN_SINGLE_WINDOW, moduleIndex));
		// 		break;
		// 	case "pk":
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(MeetPlayerEvtName.SHOW_MEETPLAYER_VIEW, { index: moduleIndex }));
		// 		break;
		// 	default:
		// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(moduleType, moduleIndex));
		// 		break;
		// }
	}

}