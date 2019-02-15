class MeetPlayerModel extends egret.EventDispatcher {
	private static _instance: MeetPlayerModel;
	private _configDic: Object;
	private _pkInfo: SCMD13300;
	private _pkLog: SCMD13303;

	public gotoFightMeetPlayerID: number = 0;
	public meetPlayerReward: number = 0;
	public fightMPID: number = 0;//正在挑战的遭遇玩家id
	public testList: Array<PlayerBaseVO>;
	private _mpPosDic: Object;
	public static UPDATE_MPPK_INFO: string = "UPDATE_MPPK_INFO";

	public static ROBOT_INDEX:number = 10000;
	public constructor() {
		super();
		this.init();
	}

	private init(): void {
		this.testList = new Array();
		this._mpPosDic = new Object();
	}

	public static getInstance(): MeetPlayerModel {
		if (MeetPlayerModel._instance == null) {
			MeetPlayerModel._instance = new MeetPlayerModel();
		}
		return MeetPlayerModel._instance;
	}

	//获取遭遇玩家的奖励配置
	public getMeetPlayerConfig(round: number, lv: number): MeetPlayerConfigVo {
		var vo: MeetPlayerConfigVo;
		if (this._configDic == null) {
			this._configDic = new Object();
			var config: Object = DataManager.getInstance().getObj("data_pk_reward");
			var list: Array<Object> = config["data_pk_reward"];
			var obj: Object;
			for (var i: number = 0; i < list.length; i++) {
				obj = list[i];
				vo = new MeetPlayerConfigVo();
				vo.template_id = obj["template_id"];
				vo.exp = obj["add_exp"];
				vo.coin = obj["add_coin"];
				vo.goodsList = Tools.changeToNodeDropList(obj["add_item"]);
				vo.round = obj["round"];
				vo.lvMin = obj["min"];
				vo.lvMax = obj["max"];
				this._configDic[vo.template_id] = vo;
			}
		}
		var n: any;
		for (n in this._configDic) {
			vo = this._configDic[n];
			if (vo.round == round && vo.lvMin <= lv && lv <= vo.lvMax) {
				return vo;
			}
		}
		return null;
	}

	//设置遭遇PK信息
	public setPKInfo(scmd: SCMD13300): void {
		this._pkInfo = scmd;
		var node: NodeMeet_roles;
		var pos: Point;
		for (var i: number = 0; i < this._pkInfo.meet_roles.length; i++) {
			node = this._pkInfo.meet_roles[i];
			pos = SceneModel.getInstance().getMeetPlayerPos();
			SceneModel.getInstance().saveMPUsePoint(pos);
			if (!this._mpPosDic[node.role_id]) {
				this._mpPosDic[node.role_id] = pos;
			}
		}
		this.dispatchEvent(new ParamEvent(MeetPlayerModel.UPDATE_MPPK_INFO));
	}
	public getPkInfo(): SCMD13300 {
		return this._pkInfo;
	}

	//设置PK日志
	public setPKLog(scmd: SCMD13303): void {
		this._pkLog = scmd;
		this.dispatchEvent(new ParamEvent(MeetPlayerEvtName.UPDATE_MP_RECORD));
	}
	public getPKLog(): SCMD13303 {
		return this._pkLog;
	}

	//删除掉某个挑战玩家
	public deletePkInfoByID(id: number): void {
		var list: Array<NodeMeet_roles> = this._pkInfo.meet_roles;
		var node: NodeMeet_roles;
		var index: number = -1;
		for (var i: number = 0; i < list.length; i++) {
			node = list[i]
			if (node.role_id == id) {
				index = i;
				break;
			}
		}
		if (index >= 0) {
			list.splice(index, 1);
		}
		this._pkInfo.meet_roles = list;
		this.dispatchEvent(new ParamEvent(MeetPlayerModel.UPDATE_MPPK_INFO));
	}

	public getMpPos(roleID: number): Point {
		return this._mpPosDic[roleID];
	}
}