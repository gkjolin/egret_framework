class SceneModel extends egret.EventDispatcher {
	private static _instance: SceneModel;
	public sceneWidth: number;
	public sceneHeight: number;
	public id: number;
	public resID: number;
	public isStart: boolean = true;
	public isLock: boolean = false;//是否锁定所有操作
	public lockFocusPos: boolean = false;
	public area: SceneArea;
	public stopPlayfight: boolean;
	public rolePath: Array<Point> = [];
	public moveToAttackPlayerId: number;
	public isFirstScene: boolean = true;//是否进入了第一个场景，这个变量默认是true，当收到第一波小怪信息后，就当做进入了场景了，这时候设置为false
	public lastSceneID: number = 0;//上一个场景的资源ID
	private _isAutoKillBoss: boolean = false;//是否自动挑战boss

	public static ADDPLAYER: string = "ADDPLAYER";
	public static REMOVEPLAYER: string = "REMOVEPLAYER";
	public static ROLE_POS_CHANGE: string = "ROLEPOSCHANGE";
	public static FOCUS_POS_CHANGE: string = "FOCUS_POS_CHANGE";
	public static ROLEMOVE: string = "ROLEMOVE";
	public static ADDMONSTER: string = "ADDMONSTER";
	public static REMOVEMONSTER: string = "REMOVEMONSTER";
	public static REMOVEALLMONSTER: string = "REMOVEALLMONSTER";
	public static ADDPET: string = "ADDPET";
	public static REMOVEPET: string = "REMOVEPET";
	public static UPDATE_SCENE_WAVE: string = "UPDATE_SCENE_WAVE";
	public static CREATE_WAVE_MONSTER_FINISH: string = "CREATE_WAVE_MONSTER_FINISH";
	public static CREATE_MATERIAL_MONSTER_FINISH: string = "CREATE_MATERIAL_MONSTER_FINISH";
	public static CREATE_NOVICE_MONSTER_FINISH: string = "CREATE_NOVICE_MONSTER_FINISH";
	public static CLEAR_ELEMENT: string = "CLEAR_ELEMENT";
	public static ISHIDE_CHANGE: string = "ISHIDE_CHANGE";
	public static ADD_DROP_ITEM: string = "ADD_DROP_ITEM";
	public static CREATE_MONSTER_LIST_FINISH: string = "CREATE_MONSTER_LIST_FINISH";
	public static SCENEWAVE_CHANGE: string = "SCENEWAVE_CHANGE";
	public static SCENEKILL_CHANGE: string = "SCENEKILL_CHANGE";
	/******************私有成员变量****************************/
	private _rolePos: Point = new Point();//像素坐标
	private _focusPos: Point;
	private _playerDic: Object;
	private _monsterDic: Object;
	private _petDic: Object;
	private _dropItemDic: Object;
	private _waveMonsterList: Array<number>;//记录当前波数怪物的id,用来判断当前这波怪物是否已经打完
	private _noviceMonsterList: Array<number>;
	private _loadingList: Array<any>;
	private _sceneInfoVo: SceneInfoVo;
	private _sceneWaveInfo: SCMD10600;
	private _currentWaveID: number;//当前关卡ID
	private _wavePosList: Array<Point>;//普通挂机场景要生成怪物的坐标的列表
	// private _materialPosList: Array<FBMonsterVo>;//材料副本要生成怪物的坐标的列表
	// private _materialMonsterList: Array<number>;//记录当前材料副本怪物的id,用来判断当前这波怪物是否已经打完
	private _currentSmallMonID: number = 0;//当前挂机场景的小怪id
	//场景配置信息
	private _sceneConfig: Object;
	private _sceneInfoDic: Object;
	private _sceneNpcDic: Object;
	private _monsterConfigDic: Object;
	private _sceneWaveConfigDic: Object;
	private _sceneLevelDic: Object;
	private _hideOhters: boolean = false;
	public toFightBossMeet: boolean = false;//去攻击遭遇boss
	public hasPetMonster: boolean = false;
	public rebuildScene: boolean = false;//是否需要重新构造场景
	private _oneKeyLunHuiObj: Object;
	public _allPartnerInSceneDic: Object;

	private static MAX_PLAYER: number = 9;
	private _realFigureNum: number = 0;//当前真实形象的人物数量
	public static MAX_REALFIGURE: number = 3;
	private _pathDic: Object;
	private _findPath: FindPath8;
	public constructor() {
		super();
		this.init();
	}

	private init(): void {
		var a = this;
		a._waveMonsterList = new Array();
		a._noviceMonsterList = new Array();
		a._pathDic = new Object();
		// this._materialMonsterList = new Array();
	}

	/**********************************对外使用函数******************************************** */
	public static getInstance(): SceneModel {
		if (SceneModel._instance == null) {
			SceneModel._instance = new SceneModel();
		}
		return SceneModel._instance;
	}

	//获取场景中的最大玩家数量
	public getSceneMaxPlayerNum(): number {
		var a = this;
		if (a.isGuildBoss()) {
			return 30;
		}
		else if (a.isMainCity()) {
			return 999;
		}
		return SceneModel.MAX_PLAYER;
	}

	//设置场景的配置信息
	public setSceneObj(obj: Object): void {
		this._sceneConfig = obj;
	}

	//获取场景信息
	public getSceneInfo(id: number): SceneInfoVo {
		if (this._sceneInfoDic == null) {
			this._sceneInfoDic = new Object();
			var config: Object = DataManager.getInstance().getObj("data_scene");
			var list: Array<any> = config["data_scene"];
			var sceneVo: SceneInfoVo;
			var sceneObj: Object;
			for (var i: number = 0; i < list.length; i++) {
				sceneObj = list[i];
				sceneVo = new SceneInfoVo();
				sceneVo.id = (sceneObj["template_id"]);
				sceneVo.sceneName = sceneObj["name"];
				sceneVo.type = (sceneObj["type"]);
				sceneVo.resID = (sceneObj["mod"]);
				sceneVo.desc = sceneObj["describe"];
				sceneVo.setNpc(sceneObj["scene_npc"]);
				sceneVo.setBorn(sceneObj["born"]);
				this._sceneInfoDic[sceneVo.id] = sceneVo;
			}
		}
		return this._sceneInfoDic[id];
	}
	//获取场景NPC信息
	public getSceneNpcInfo(id: number): SceneNpcVO {
		if (this._sceneNpcDic == null) {
			this._sceneNpcDic = new Object();
			var config: Object = DataManager.getInstance().getObj("data_npc");
			var list: Array<any> = config["data_npc"];
			var npcVO: SceneNpcVO;
			var npcObj: Object;
			for (var i: number = 0; i < list.length; i++) {
				npcObj = list[i];
				npcVO = new SceneNpcVO();
				npcVO.template_id = (npcObj["template_id"]);
				npcVO.name = npcObj["name"];
				npcVO.type = (npcObj["type"]);
				npcVO.model = (npcObj["model"]);
				npcVO.icon = npcObj["icon"];
				npcVO.funName = npcObj["function"];
				this._sceneNpcDic[npcVO.template_id] = npcVO;
			}
		}
		return this._sceneNpcDic[id];
	}

	public buildScene(id: number): void {
		// if (this._sceneInfoVo == null) {
		// 	trace("场景信息不存在");
		// 	return;
		// } 
		var sm: SceneModel = this;
		sm.sceneInit();
		sm.lastSceneID = sm.id;
		sm.id = id;
		var sceneVo: SceneInfoVo = sm.getSceneInfo(id);
		sm.sceneWidth = this.getSceneWH(sceneVo.type).x;
		sm.sceneHeight = this.getSceneWH(sceneVo.type).y;
		sm.resID = sceneVo.resID;
		sm.area = new SceneArea(0, 0, 0, 0);
		if (sm.isCanFind8Scene(sm.resID)) {
			if (sm._pathDic[sm.resID] == undefined) {
				var url: string = UrlUtil.getScenePathFile(sm.resID);
				RES.getResByUrl(url, sm.loadScenePathComplete, sm, RES.ResourceItem.TYPE_JSON);
			}
			else {
				var pathList: Array<Array<number>> = sm._pathDic[sm.resID];
				this._findPath = new FindPath8(pathList);
			}
		}
		sm.dispatchEvent(new egret.Event(EventName.SCENE_BUILD));
	}

	public getFocusPos(): Point {
		return this._focusPos;
	}

	private setFocusPos(value: Point): void {
		if (value == null) {
			this._focusPos = value;
			return;
		}
		if (this._focusPos == null || Point.distance(this._focusPos, value) != 0) {
			this._focusPos = value.clone();
			this.dispatchEvent(new ParamEvent(SceneModel.FOCUS_POS_CHANGE));
		}
	}

	//暂时设定是每个点都可以行走
	public findPoint(pendPoint: Point): Point {
		if (this._rolePos == null || pendPoint == null) return null;
		return pendPoint;
		// var startPoint: Point = this.changeToTilePoint(this._rolePos);
		// var endPoint: Point = this.changeToTilePoint(pendPoint);
		// if (startPoint.equals(endPoint)) return this._rolePos;
		// var flag: number = this.checkTilePoint(endPoint);
		// if ((flag == -1 || flag == 1 || flag == 3)) {
		// 	var hasBlank: boolean = false;
		// 	var obj: Object = MapUtil.getDirXY(endPoint.x, endPoint.y, startPoint.x, startPoint.y);
		// 	for (var n: number = 0; n < 20; n++) {
		// 		endPoint.x = endPoint.x + obj["x"];
		// 		endPoint.y = endPoint.y + obj["y"];
		// 		flag = this.checkTilePoint(endPoint)
		// 		if (flag == 0 || flag == 2 || flag == 5 || flag == 6 || flag == 7 || flag == 8) {
		// 			if (endPoint.equals(startPoint) == true) {
		// 				return null;
		// 			}
		// 			var endScenePoint: Point = this.changeToPixsPoint(endPoint);
		// 			return endScenePoint;
		// 		}
		// 	}
		// 	return null;
		// }
		// return pendPoint;

	}

	//转换格子坐标到场景坐标
	public changeToPixsPoint(point: Point): Point {
		return point == null ? null : new Point(TileUtil.changeXToPixs(point.x), TileUtil.changeYToPixs(point.y));
	}

	public changeToTilePoint(point: Point): Point {
		return point == null ? null : new Point(TileUtil.changeXToTile(point.x), TileUtil.changeYToTile(point.y));
	}

	public setRolePos(value: Point): void {
		if (value == null) {
			this._rolePos = value;
			return;
		}
		if (this._rolePos != null && value.x == this._rolePos.x && value.y == this._rolePos.y) {
			return;
		}
		this._rolePos = value.clone();
		this.dispatchEvent(new ParamEvent(SceneModel.ROLE_POS_CHANGE));
		this.setFocusPos(this.getRolePosToFocusPos());
	}

	//主角的像素坐标
	public getRolePos(): Point {
		return this._rolePos;
	}

	public getRolePosToFocusPos(): Point {
		if (this._rolePos == null) {
			return null;
		}
		var screenWidth: number = GameContent.stageWidth;		//视口宽高
		var screenHeight: number = GameContent.stageHeight;
		var sceneWidth: number = this.sceneWidth * TileUtil.scale;		//缩放后场景宽高
		var sceneheight: number = this.sceneHeight * TileUtil.scale;
		var right: number = this.area.getRight() * TileUtil.tileWidth;
		var left: number = this.area.getLeft() * TileUtil.tileWidth;
		var top: number = this.area.getTop() * TileUtil.tileHeight;
		var buttom: number = this.area.getButtom() * TileUtil.tileHeight;
		var pos: Point = new Point();
		var rolePoint: Point = new Point();
		rolePoint.x = this._rolePos.x * TileUtil.scale;							//场景缩放后的角色点
		rolePoint.y = this._rolePos.y * TileUtil.scale;
		if (screenWidth > sceneWidth) {
			pos.x = -((screenWidth - sceneWidth) >> 1);
		}
		else if (rolePoint.x < ((screenWidth >> 1) + left)) {					//如果人物位置小于最小屏幕宽的一半
			pos.x = left;
		}
		else if (rolePoint.x > sceneWidth - right - (screenWidth >> 1)) {			//如果屏幕宽大于宽
			pos.x = sceneWidth - (screenWidth) - right;
		}
		else {
			pos.x = (rolePoint.x - (screenWidth >> 1));
		}
		if (screenHeight > sceneheight) {
			pos.y = -((screenHeight - sceneheight) >> 1);
		}
		else if (rolePoint.y < (screenHeight >> 1) + top) {
			pos.y = top;
		}
		else if (rolePoint.y > sceneheight - (screenHeight >> 1) - buttom) {
			pos.y = sceneheight - (screenHeight) - buttom;
		}
		else {
			pos.y = (rolePoint.y - (screenHeight >> 1))
		}
		return pos;
	}

	public findPath(startPoint: Point, endPoint: Point): Array<Point> {
		if (this._findPath == null) {
			return null;
		}
		var prePath: Array<Point> = this._findPath.find(endPoint, startPoint);
		if (prePath != null) prePath.reverse();
		return prePath;
	}

	public roleMove(path: Array<Point>): void {
		this.rolePath = path.concat();
		this.dispatchEvent(new ParamEvent(SceneModel.ROLEMOVE, this.rolePath));
	}

	public isCanPK(playerVo: PlayerBaseVO, showMSG: boolean = false): boolean {
		return true;
	}

	public removePlayer(uid: string, isSendEvt: boolean = true): void {
		var player: PlayerBaseVO = this.getPlayer(uid);
		if (player == null) {
			for (var i: number = 0; i < this._loadingList.length; i++) {
				if (is(this._loadingList[i], "PlayerBaseVO") && (this._loadingList[i] as PlayerBaseVO).uid == uid) {
					this._loadingList.splice(i, 1);
					return;
				}
			}
			return;
		}
		delete this._playerDic[uid];
		if (isSendEvt) {
			this.dispatchEvent(new ParamEvent(SceneModel.REMOVEPLAYER, { id: uid }));
		}
	}

	public getPlayer(id: string): PlayerBaseVO {
		if (this._playerDic == null) return null;
		// if (id == RoleModel.getInstance().getRoleBaseInfo().parnerID) {
		// 	return RoleModel.getInstance().getRoleBaseInfo();
		// }
		if (this._playerDic[id] != undefined) {
			return this._playerDic[id];
		}
		return null;
	}

	public checkInScreen(px: number, py: number, extraLength: number = 100): Boolean {
		if (this._focusPos == null) return false;
		var screenWidth: number;
		var screenHeight: number;
		screenWidth = GameContent.stageWidth + extraLength;
		screenHeight = GameContent.stageHeight + extraLength;
		if (px - this._focusPos.x < screenWidth
			&& px - this._focusPos.x > 0
			&& py - this._focusPos.y < screenHeight
			&& py - this._focusPos.y > 0) {
			return true;
		}
		return false;
	}

	public findLine(pendPoint: Point, ranger: number = 0, moveLine: boolean = true, startPoint: Point = null): Array<Point> {
		if (startPoint == null) {
			startPoint = this._rolePos;
		}
		var endPoint: Point = pendPoint;
		if (startPoint == null || pendPoint == null) return null;
		var list: Array<Point> = new Array();
		var dis: number = Point.distance(startPoint, endPoint);
		var n: number = Math.ceil(dis / TileUtil.STEP);
		var tx: number;
		var ty: number;
		var tmpPoint: Point;
		var flag: number;
		for (var i: number = 0; i <= n - ranger; i++) {
			tx = startPoint.x + (endPoint.x - startPoint.x) * (i / n);
			ty = startPoint.y + (endPoint.y - startPoint.y) * (i / n);
			tmpPoint = new Point(tx, ty);
			list.push(tmpPoint);
		}
		return list;
	}

	public removeMonster(id: number, justRemove: boolean = false): void {
		if (this._monsterDic == null) {
			if (this._loadingList != null) {
				for (var i: number = 0; i < this._loadingList.length; i++) {
					if (is(this._loadingList[i], "MonsterVO") && (this._loadingList[i] as MonsterVO).id == id) {
						this._loadingList.splice(i, 1);
						return;
					}
				}
			}
			return;
		}
		var obj: MonsterVO = this._monsterDic[id];
		if (obj == null) return;
		delete this._monsterDic[obj.id];
		this.dispatchEvent(new ParamEvent(SceneModel.REMOVEMONSTER, { id: obj.id, typeId: obj.typeId, monstertype: obj.monsterType }));
		if (justRemove) {
			this._waveMonsterList = new Array();
			return;
		}
		var index: number = 0;
		var eventName: string = "";
		var dataList: Array<number>;
		if (this.isHookSmall()) {//普通场景获取下一波挂机怪物
			dataList = this._waveMonsterList;
			eventName = EventName.WAVE_MONSTER_END;
		}
		// else if (this.isMaterialFuBen()) {//材料副本生成下一波挂机怪物
		// 	dataList = this._materialMonsterList;
		// 	eventName = EventName.MATERIAL_WAVE_END;
		// }
		if (dataList) {
			index = dataList.indexOf(id);
			if (index >= 0) {
				dataList.splice(index, 1);
			}
			if (dataList.length == 0) {
				GameDispatcher.getInstance().dispatchEvent(new ParamEvent(eventName));
			}
		}
	}

	//创建怪物
	public createWaveMonster(): void {
		if (this._sceneWaveInfo == null) {
			return;
		}
		var waveConfig: SceneWaveVo = this.getWaveConfig(this._sceneWaveInfo.wave_id);
		if (this._wavePosList == null || this._wavePosList.length == 0) {
			this._wavePosList = waveConfig.monPosList.concat();
			// this._wavePosList = [new Point(23, 40), new Point(30, 40)];
		}
		var monsterNum: number = waveConfig.monsterNum;
		var monsterVo: MonsterVO;
		var createPoint: Point = this._wavePosList.shift();
		var dropList: Array<NodeDrop_list> = this._sceneWaveInfo.drop_list;
		var dropInfo: NodeDrop_list;
		var bornPoint: Point;
		this._currentSmallMonID = waveConfig.monsterID;
		for (var i: number = 0; i < monsterNum; i++) {
			monsterVo = this.makeMonsterVo(this._currentSmallMonID);
			bornPoint = new Point(createPoint.x + Math.floor(Math.random() * 8), createPoint.y + Math.floor(Math.random() * 10));
			monsterVo.x = bornPoint.x;
			monsterVo.y = bornPoint.y;
			//dropInfo = this.getWaveDropItem();
			if (dropInfo) {
				monsterVo.dropInfo = [dropInfo];
			}
			this._waveMonsterList.push(monsterVo.id);
			this.addMonster(monsterVo);
		}
		this.dispatchEvent(new ParamEvent(SceneModel.CREATE_WAVE_MONSTER_FINISH));
	}
	
	//创建新手地图的怪物
	public createNoviceSceneMonster(id: number): void {
		var a = this;
		var taskVO: TaskVo = TaskModel.getInstance().getTaskInfoById(id);
		if (taskVO == null) return;
		var monsterList: Array<TaskNoviceMonsterVO> = taskVO.monsterList;
		var monsterPosList: Array<Point> = taskVO.monsterPos;
		if (monsterList == null) return;
		if (monsterPosList == null) return;
		// this.dispatchEvent(new ParamEvent(SceneModel.REMOVEALLMONSTER));
		var pos: Point;
		for (var i: number = 0; i < monsterPosList.length; i++) {
			pos = monsterPosList[i];
			a.createNoviceSceneMonsterByPos(pos, monsterList);
		}
		this.dispatchEvent(new ParamEvent(SceneModel.CREATE_NOVICE_MONSTER_FINISH, { monsterId: monsterList[0].id }));
	}

	private createNoviceSceneMonsterByPos(pos: Point, monsterList: Array<TaskNoviceMonsterVO>): void {
		var taskMonsterVO: TaskNoviceMonsterVO;
		var monsterVo: MonsterVO;
		for (var i: number = 0; i < monsterList.length; i++) {
			taskMonsterVO = monsterList[i];
			for (var j: number = 0; j < 1; j++) {
				monsterVo = this.makeMonsterVo(taskMonsterVO.id);
				monsterVo.x = pos.x;
				monsterVo.y = pos.y;
				this._noviceMonsterList.push(monsterVo.id);
				this.addMonster(monsterVo);
			}
		}
	}

	//创建材料副本的怪物
	// public createMaterialMonster(): void {
	// 	var id: number = FubenModel.getInstance().fuBenID;
	// 	var config: FubenVO = FubenModel.getInstance().getInfoById(id);
	// 	if (this._materialPosList == null || this._materialPosList.length == 0) {
	// 		this._materialPosList = config.monsterList.concat();
	// 	}
	// 	var monVo: MonsterVO;
	// 	var bornPoint: Point;
	// 	var createPoint: Point;
	// 	//判断普通一波波的怪物打完没有，打完就要加boss来打
	// 	if (this._materialPosList.length > 0) {
	// 		var vo: FBMonsterVo = this._materialPosList.shift();
	// 		var monsterNum: number = vo.num;
	// 		createPoint = new Point(vo.x, vo.y);
	// 		for (var i: number = 0; i < monsterNum; i++) {
	// 			monVo = this.makeMonsterVo(vo.id);
	// 			bornPoint = new Point(createPoint.x + Math.floor(Math.random() * 8), createPoint.y + Math.floor(Math.random() * 10));
	// 			monVo.x = bornPoint.x;
	// 			monVo.y = bornPoint.y;
	// 			this._materialMonsterList.push(monVo.id);
	// 			this.addMonster(monVo);
	// 		}
	// 	}
	// 	else {
	// 		createPoint = new Point(config.boss_pos.x, config.boss_pos.y);
	// 		monVo = this.makeMonsterVo(config.boss_id);
	// 		monVo.x = createPoint.x;
	// 		monVo.y = createPoint.y;
	// 		this.addMonster(monVo);
	// 	}
	// 	this.dispatchEvent(new ParamEvent(SceneModel.CREATE_MATERIAL_MONSTER_FINISH));
	// }

	//添加怪物
	public addMonster(vo: MonsterVO): void {
		if (this._monsterDic == null) {
			return;
		}
		if (this._monsterDic[vo.id] == undefined || this._monsterDic[vo.id] == null) {
			this._monsterDic[vo.id] = vo;
			this.dispatchEvent(new ParamEvent(SceneModel.ADDMONSTER, vo));
		}
	}

	//添加玩家
	public addPlayer(vo: PlayerBaseVO, sendEvt: boolean = true): void {
		if (!this._playerDic[vo.uid]) {
			this._playerDic[vo.uid] = vo;
			if (sendEvt) {
				this.dispatchEvent(new ParamEvent(SceneModel.ADDPLAYER, { vo: vo }));
			}
		}
	}
	
	//添加宠物
	public addPet(vo: PetBaseVO, sendEvt: boolean = true): void {
		if (this._petDic == null || this._petDic == undefined) return;
		if (!this._petDic[vo.uid]) {
			this._petDic[vo.uid] = vo;
			if (sendEvt) {
				this.dispatchEvent(new ParamEvent(SceneModel.ADDPET, { vo: vo }));
			}
		}
	}
	public removePet(uid: string, isSendEvt: boolean = true): void {
		var pet: PetBaseVO = this.getPet(uid);
		if (pet == null) {
			for (var i: number = 0; i < this._loadingList.length; i++) {
				if (is(this._loadingList[i], "PetBaseVO") && (this._loadingList[i] as PetBaseVO).uid == uid) {
					this._loadingList.splice(i, 1);
					return;
				}
			}
			return;
		}
		delete this._petDic[uid];
		if (isSendEvt) {
			this.dispatchEvent(new ParamEvent(SceneModel.REMOVEPET, { id: uid }));
		}
	}
	public getPet(id: string): PetBaseVO {
		if (this._petDic == null) return null;
		if (this._petDic[id] != undefined) {
			return this._petDic[id];
		}
		return null;
	}


	//利用定时器去添加玩家
	public addPlayerByTimer(vo: PlayerBaseVO): void {
		// this._playerDic[vo.parnerID] = vo;
		this._loadingList.push(vo);
	}

	//添加怪物列表
	public addMonsterByList(list: Array<NodeScene_mon>, randomPos: boolean = false): void {
		var bornPoint: Point;
		for (var i: number = 0; i < list.length; i++) {
			var node = list[i];
			var mVO = this.makeMonsterVo(node.template_id);
			mVO.id = node.mon_id;
			mVO.setHp(node.hp);
			mVO.setMaxHp(node.max_hp);
			mVO.job = node.career;
			mVO.sex = node.sex;
			if (randomPos) {
				bornPoint = new Point(node.pos_x + Math.floor(Math.random() * 8), node.pox_y + Math.floor(Math.random() * 10));
			}
			else {
				bornPoint = new Point(node.pos_x, node.pox_y);
			}
			if (this.isMineFuBen() || this.isUnKnowPalace()) {
				mVO.x = bornPoint.x + Math.ceil(Math.random() * 3);
				mVO.y = bornPoint.y + Math.ceil(Math.random() * 5);
			}
			else {
				mVO.x = bornPoint.x;
				mVO.y = bornPoint.y;
			}
			if (node.sex > 0) {
				mVO.appVo = AppearanceUtil.changeAppListToVo(node.appearance);
			}
			else {
				mVO.appVo = null;
			}
			mVO.setName(node.name);
			mVO.guildName = node.guild_name;
			if (this.isCityWarInner()) {
				this._loadingList.push(mVO);
				trace(StringUtil.substitute("mon id={0} x={1} y={2}", mVO.id, mVO.x, mVO.y));
			}
			else {
				this.addMonster(mVO);
			}
		}
		if (!(this.isBossScene() || this.isChanllengeFuBen())) {
			this.dispatchEvent(new ParamEvent(SceneModel.CREATE_MONSTER_LIST_FINISH));
		}
	}

	//初始化场景用到的一些数据结构
	private sceneInit(): void {
		var a = this;
		a._rolePos = null;
		a._focusPos = null;
		a._playerDic = new Object();
		a._monsterDic = new Object();
		a._petDic = new Object();
		a._dropItemDic = new Object();
		a._loadingList = new Array();
		a._mpPointDic = new Object();
		a._allPartnerInSceneDic = new Object();
		TimerManager.getInstance().add(20, a.loadingElementHandler, a);
	}

	private loadingElementHandler(): void {
		if (this._loadingList.length > 0) {
			var vo: any = this._loadingList.shift();
			if (is(vo, "MonsterVO")) {
				this.addMonster(vo);
			}
			else if (is(vo, "DropItemVo")) {
				this.addDropItem(vo);
			}
			else if (is(vo, "PlayerBaseVO")) {
				this.addPlayer(vo);
			}
		}
	}

	public getMonsterVo(id: number): MonsterVO {
		if (this._monsterDic != null) {
			return this._monsterDic[id];
		}
		return null;
	}

	//设置关卡信息
	public setSceneWave(vo: SCMD10600): void {
		var isWaveChange: boolean = false;
		var waveConfig: SceneWaveVo = this.getWaveConfig(vo.wave_id);
		if (this._sceneWaveInfo && this._sceneWaveInfo.wave_id != vo.wave_id) {
			isWaveChange = true;
		}
		var isKillNumChange: boolean = false;
		if (this._sceneWaveInfo && this._sceneWaveInfo.kill_num != vo.kill_num && vo.kill_num <= waveConfig.passNum) {
			isKillNumChange = true;
		}
		this._sceneWaveInfo = vo;
		//设置玩家在关卡里面的坐标
		this._currentWaveID = vo.wave_id;
		// var tmpSceneInfo: SceneInfoVo = this.getSceneInfo(waveConfig.sceneID);
		// if (this._sceneInfoVo == null || this._sceneInfoVo.resID != tmpSceneInfo.resID) {
		// 	this.rebuildScene = true;
		// }
		// else {
		// 	this.rebuildScene = false;
		// }
		// this._sceneInfoVo = tmpSceneInfo;
		// this._sceneInfoVo.width = this.getSceneWH(this._sceneInfoVo.type).x;
		// this._sceneInfoVo.height = this.getSceneWH(this._sceneInfoVo.type).y;
		// RoleModel.getInstance().setAllPartnerPos(new Point(this._sceneInfoVo.x, this._sceneInfoVo.y));
		this.dispatchEvent(new ParamEvent(SceneModel.UPDATE_SCENE_WAVE));
		if (isWaveChange) {
			this.dispatchEvent(new ParamEvent(SceneModel.SCENEWAVE_CHANGE));
		}
		if (isKillNumChange) {
			this.dispatchEvent(new ParamEvent(SceneModel.SCENEKILL_CHANGE));
		}
	}
	public getSceneWave(): SCMD10600 {
		return this._sceneWaveInfo;
	}

	//获取怪物配置信息
	public getMonsterConfig(typeID: number): MonConfigVo {
		if (this._monsterConfigDic == null) {
			this._monsterConfigDic = new Object();
			var config: Object = DataManager.getInstance().getObj("data_monster");
			var list: Array<any> = config["data_monster"];
			var monVo: MonConfigVo;
			var monObj: Object;
			for (var i: number = 0; i < list.length; i++) {
				monObj = list[i];
				monVo = new MonConfigVo();
				monVo.typeID = (monObj["template_id"]);
				monVo.name = monObj["name"];
				monVo.monsterType = (monObj["type"]);
				monVo.resID = (monObj["icon"]);
				monVo.lev = (monObj["level"]);
				monVo.hp = monObj["hp"];
				monVo.attSpeed = monObj["att_spd"];
				monVo.attType = monObj["att_type"];
				monVo.moveSpeed = monObj["mov_spd"];
				monVo.propertyVo.attack = monObj["att"];
				monVo.propertyVo.att_def = monObj["att_def"];
				monVo.propertyVo.magic_def = monObj["magic_def"];
				monVo.propertyVo.crit = monObj["crit"];
				monVo.propertyVo.crit_hurt = monObj["crit_hurt"];
				monVo.propertyVo.crit_def = monObj["crit_def"];
				monVo.propertyVo.palsy_rate = monObj["palsy_rate"];
				monVo.propertyVo.palsy_def = monObj["palsy_def"];
				monVo.propertyVo.hurt_up = monObj["hurt_up"];
				monVo.propertyVo.hurt_def = monObj["hurt_def"];
				monVo.propertyVo.attack = monObj["att"];
				this._monsterConfigDic[monVo.typeID] = monVo;
			}
		}
		return this._monsterConfigDic[typeID];
	}

	//获取关卡配置信息
	public getWaveConfig(waveID: number): SceneWaveVo {
		if (this._sceneWaveConfigDic == null) {
			this._sceneWaveConfigDic = new Object();
			var config: Object = DataManager.getInstance().getObj("data_hook_wave");
			var list: Array<any> = config["data_hook_wave"];
			var waveObj: Object;
			var waveVo: SceneWaveVo;
			for (var i: number = 0; i < list.length; i++) {
				waveObj = list[i];
				waveVo = new SceneWaveVo();
				waveVo.waveID = waveObj["template_id"];
				waveVo.nextID = waveObj["next_id"];
				waveVo.masterLev = waveObj["master_level"];
				waveVo.masterWave = waveObj["master_wave"];
				waveVo.monsterID = waveObj["mon_id"];
				waveVo.monsterNum = waveObj["mon_num"];
				waveVo.passNum = waveObj["pass_num"];
				waveVo.bossID = waveObj["boss_id"];
				waveVo.sceneID = waveObj["common_scene_id"];
				waveVo.bossSceneID = waveObj["boss_scene_id"];
				waveVo.copper = waveObj["show_add_coin"];
				waveVo.exp = waveObj["show_add_exp"];
				waveVo.setMonPosList(waveObj["mon_pos"]);
				waveVo.setPlayerPosList(waveObj["player_pos"]);
				this._sceneWaveConfigDic[waveVo.waveID] = waveVo;
			}
		}
		return this._sceneWaveConfigDic[waveID];
	}

	//根据场景类型，获取场景的像素宽高
	public getSceneWH(type: number): Point {
		var p: Point = new Point();
		switch (type) {
			case SceneInfoVo.MATERIAL:
			case SceneInfoVo.SMALL:
			case SceneInfoVo.CITY_WAR:
				p.x = 2130;
				p.y = 2130;
				break;
			case SceneInfoVo.PERSON_BOSS:
			case SceneInfoVo.CHANLLENGE:
			case SceneInfoVo.WAVE_BOSS:
			case SceneInfoVo.PEOPLE_BOSS:
			case SceneInfoVo.ROUND_BOSS:
			case SceneInfoVo.GUILD_FUBEN:
			case SceneInfoVo.MINE:
			case SceneInfoVo.UNKNOW_PALACE:
			case SceneInfoVo.SHADOW_FUBEN:
			case SceneInfoVo.WZZB:
			case SceneInfoVo.GUILD_BOSS:
			case SceneInfoVo.KFBOSS_SCENE:
			case SceneInfoVo.BOSS_HOME:
			case SceneInfoVo.ELITE_BOSS:
			case SceneInfoVo.WILD_BOSS:
			case SceneInfoVo.EQUIP_FUBEN:
				p.x = 1024;
				p.y = 1024;
				break;
			case SceneInfoVo.MAIN_CITY:
				p.x = 2900;
				p.y = 2450;
				break;
			case SceneInfoVo.NOVICE_SCENE:
				p.x = 3120;
				p.y = 5327;
				break;
		}
		return p;
	}

	//根据怪物配置ID构造怪物vo
	private static MONSTER_ID: number = 1;
	public makeMonsterVo(typeID: number): MonsterVO {
		var vo: MonsterVO = new MonsterVO();
		var config: MonConfigVo = this.getMonsterConfig(typeID);
		if (!config) {
			Message.show(StringUtil.substitute("没有找到{0}的怪物配置"));
			return;
		}
		vo.typeId = typeID;
		vo.id = SceneModel.MONSTER_ID++;
		vo.setName(config.name);
		vo.setMaxHp(config.hp);
		vo.setHp(config.hp);
		vo.setResId(config.resID);
		vo.monsterType = config.monsterType;
		vo.setLev(config.lev);
		vo.setSpeed(config.moveSpeed);
		vo.propertyVo = config.propertyVo;
		vo.poseState.useType = vo.monsterType;
		return vo;
	}

	//获取场景等级配置
	public getSceneLevelVo(id: number): SceneLevelVo {
		if (this._sceneLevelDic == null) {
			this._sceneLevelDic = new Object();
			var config: Object = DataManager.getInstance().getObj("data_hook_level");
			var list: Array<any> = config["data_hook_level"];
			var vo: SceneLevelVo;
			var lvObj: Object;
			var addItemRegMatchList: RegExpMatchArray;
			var str: string;
			for (var i: number = 0; i < list.length; i++) {
				lvObj = list[i];
				vo = new SceneLevelVo();
				vo.id = lvObj["template_id"];
				vo.name = lvObj["name"];
				str = lvObj["add_item"];
				addItemRegMatchList = str.match(/\d+/g);
				vo.itemID = parseInt(addItemRegMatchList[0]);
				vo.itemNum = parseInt(addItemRegMatchList[1]);
				this._sceneLevelDic[vo.id] = vo;
			}
		}
		return this._sceneLevelDic[id];
	}

	//获取当前场景信息
	public setCurrentSceneInfo(id: number, bornPoint: Point = null): void {
		var tmpSceneInfo: SceneInfoVo = this.getSceneInfo(id);
		if (this._sceneInfoVo == null || this._sceneInfoVo.resID != tmpSceneInfo.resID) {
			this.rebuildScene = true;
		}
		else {
			this.rebuildScene = false;
		}
		this._sceneInfoVo = tmpSceneInfo;
		this._sceneInfoVo.width = this.getSceneWH(this._sceneInfoVo.type).x;
		this._sceneInfoVo.height = this.getSceneWH(this._sceneInfoVo.type).y;
		if (bornPoint == null) {
			bornPoint = new Point(this._sceneInfoVo.x, this._sceneInfoVo.y);
		}
		RoleModel.getInstance().setAllPartnerPos(bornPoint);
	}
	public getCurrentSceneInfo(): SceneInfoVo {
		return this._sceneInfoVo;
	}

	//获取当前关卡id
	public getCurrentWaveID(): number {
		return this._currentWaveID;
	}

	//获取当前关卡每小时的铜钱收益
	public getWaveCoin(id: number = 0): number {
		if (id == 0) {
			id = this._currentWaveID
		}
		var waveConfig: SceneWaveVo = SceneModel.getInstance().getWaveConfig(id);
		return waveConfig.copper;
	}

	//获取当前关卡每小时的经验收益
	public getWaveExp(id: number = 0): number {
		if (id == 0) {
			id = this._currentWaveID
		}
		var waveConfig: SceneWaveVo = SceneModel.getInstance().getWaveConfig(id);
		return waveConfig.exp;
	}

	//新的一波数据来临，判断上一个场景和当前场景做对比，要销毁哪些数据
	public checkSceneDispose(newWave: SCMD10600): void {
		//关卡ID一样，不用销毁什么了
		if (this._currentWaveID == newWave.wave_id) {
			return;
		}
		var oldWaveConfig: SceneWaveVo = this.getWaveConfig(this._currentWaveID);
		var newWaveConfig: SceneWaveVo = this.getWaveConfig(newWave.wave_id);
		//同一个场景的话
		if (oldWaveConfig.sceneID == newWaveConfig.sceneID) {
			return;
		}
	}

	//判断当前关卡能否进去打boss
	public checkCanKillWaveBoss(): boolean {
		if (this._sceneWaveInfo == null) {
			return false;
		}
		//已经匹配到王者对象的话，就不能打关卡boss
		// if (KingModel.getInstance().goToPK) {
		// 	return false;
		// }
		var waveConfig: SceneWaveVo = this.getWaveConfig(this._sceneWaveInfo.wave_id);
		if (this._sceneWaveInfo.kill_num < waveConfig.passNum) {
			return false;
		}
		//判断背包空间是否足够去打boss，要加上当前这波小怪掉落的物品的装备数量
		// var needNum: number = 20 + Tools.getGoodsNumInDropList(this._sceneWaveInfo.drop_list);
		// if (GoodsListProxy.getInstance().checkBagGridResNum(needNum, 20) == false && this.isAutoKillBoss) {
		// 	this.isAutoKillBoss = false;
		// 	return false;
		// }
		return true;
	}

	//清理元素
	public clearElement(): void {
		TimerManager.getInstance().remove(20, this.loadingElementHandler, this);
		this._playerDic = new Object();
		this._monsterDic = new Object();
		this._dropItemDic = new Object();
		this._waveMonsterList = new Array();
		this._wavePosList = new Array();
		this._findPath = null;
		// this._materialMonsterList = new Array();
		this.dispatchEvent(new ParamEvent(SceneModel.CLEAR_ELEMENT));
	}

	public getCurrentSceneType(): number {
		if (this.id == 101) {
			return SceneInfoVo.WAVE_BOSS;
		}
		var sceneConfig: SceneInfoVo = this.getSceneInfo(this.id);
		if (sceneConfig == null) {
			return SceneInfoVo.SMALL;
		}
		return sceneConfig.type;
	}

	//添加掉落物品
	public addDropItem(vo: DropItemVo): void {
		this.dispatchEvent(new ParamEvent(SceneModel.ADD_DROP_ITEM, { data: vo }));
		if (this._isAutoFly) {
			this._dropLeftNum--;
			if (this._dropLeftNum <= 0) {
				setTimeout2(() => {
					GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.AUTO_FLY_GOODS));
				}, 400);
			}
		}
	}

	public dispose(): void {

	}

	//设置掉落物品列表,Point是像素坐标
	private _dropLeftNum: number = 0;//要添加的掉落物品剩余个数
	private _isAutoFly: boolean;
	public setDropList(dropList: Array<NodeDrop_list>, point: Point = null, autoFly: boolean = false): void {
		this._isAutoFly = autoFly;
		if (!this._isAutoFly) {
			this._dropLeftNum = 0;
		}
		var node: NodeDrop_list;
		var vo: DropItemVo;
		var len: number = dropList.length;
		if (point == null) {
			point = this.getBossPos();
			point.x -= 150;
		}
		var n: number = 0;
		var rowNum: number = 5;
		for (var i: number = 0; i < len; i++) {
			vo = new DropItemVo();
			node = dropList[i];
			if (!this.checkDropVisible(node.asset_id)) {
				continue;
			}
			vo.id = node.asset_id;
			vo.num = node.value;
			var tx = point.x + n % rowNum * 70;
			var ty = point.y + Math.floor(n / rowNum) * 70;
			var cp: Point = this.changeToRightPoint(new Point(tx, ty));
			vo.x = cp.x;
			vo.y = cp.y;
			if (len < 3) {
				this.addDropItem(vo);
			}
			else {
				this._loadingList.push(vo);
			}
			n++;
		}
	}

	//获取boss的坐标
	private getBossPos(): Point {
		var i: any;
		var mVo: MonsterVO;
		var point: Point
		for (i in this._monsterDic) {
			mVo = this._monsterDic[i];
			if (mVo.monsterType == MonsterVO.WAVE_BOSS) {
				point = new Point(mVo.x, mVo.y)
				break;
			}
		}
		//如果找不到boss的坐标，就用人物坐标
		if (point == null) {
			point = new Point();
			point.x = RoleModel.getInstance().getRoleBaseInfo().x;
			point.y = RoleModel.getInstance().getRoleBaseInfo().y;
		}
		return this.changeToPixsPoint(point);
	}

	//判断当前场景是否是普通小怪挂机场景
	public isHookSmall(): boolean {
		return this.getCurrentSceneType() == SceneInfoVo.SMALL;
	}

	//判断当前场景是否是关卡boss挂机场景
	public isHookWaveBoss(): boolean {
		return this.getCurrentSceneType() == SceneInfoVo.WAVE_BOSS;
	}

	//判断当前场景是否是个人boss挂机场景
	public isPersonBoss(): boolean {
		return this.getCurrentSceneType() == SceneInfoVo.PERSON_BOSS;
	}

	//判断当前场景是否挑战副本场景
	public isChanllengeFuBen(): boolean {
		return this.getCurrentSceneType() == SceneInfoVo.CHANLLENGE;
	}

	//判断当前场景是否是材料副本挂机场景
	public isMaterialFuBen(): boolean {
		return this.getCurrentSceneType() == SceneInfoVo.MATERIAL;
	}

	//判断当前场景是否是公会副本场景
	public isGuildFuben(): boolean {
		return this.getCurrentSceneType() == SceneInfoVo.GUILD_FUBEN;
	}

	//判断当前场景是否是王者争霸
	public isWZZB(): boolean {
		return this.getCurrentSceneType() == SceneInfoVo.WZZB;
	}

	//判断是否矿洞副本
	public isMineFuBen(): boolean {
		return this.getCurrentSceneType() == SceneInfoVo.MINE;
	}

	//判断是否暗战副本
	public isUnKnowPalace(): boolean {
		return this.getCurrentSceneType() == SceneInfoVo.UNKNOW_PALACE;
	}

	//判断是否光环副本
	public isShadowFuben(): boolean {
		return this.getCurrentSceneType() == SceneInfoVo.SHADOW_FUBEN;
	}

	//判断是否是公会副本场景
	public isGuildBoss(): boolean {
		return this.getCurrentSceneType() == SceneInfoVo.GUILD_BOSS;
	}

	//判断当前场景是否是全民boss
	public isPeopleBoss(): boolean {
		return this.getCurrentSceneType() == SceneInfoVo.PEOPLE_BOSS;
	}

	//判断当前场景是否是转生boss
	public isRoundBoss(): boolean {
		return this.getCurrentSceneType() == SceneInfoVo.ROUND_BOSS;
	}

	//判断当前场景是不是没有伤害排行的场景
	public isNoHitListScene(): boolean {
		return this.isGuildBoss() || this.isBossHome() || this.isWildBoss() || this.isEliteBoss() || this.isPersonBoss();
	}

	//判断当前场景是否攻城战
	public isCityWar(): boolean {
		return this.getCurrentSceneType() == SceneInfoVo.CITY_WAR;
	}

	//获取当前波怪物的可见的掉落，id小于1k的话，只有1（铜钱）可见
	private getWaveDropItem(): NodeDrop_list {
		var list: Array<NodeDrop_list> = this._sceneWaveInfo.drop_list;
		var vo: NodeDrop_list = list.shift();
		while (true) {
			if (list.length == 0 || this.checkDropVisible(vo.asset_id)) {
				break;
			}
			else {
				vo = list.shift();
			}
		}
		if (vo && this.checkDropVisible(vo.asset_id)) {
			return vo;
		}
		return null;
	}

	private checkDropVisible(id: number): boolean {
		return id == WelfareType.ADD_COIN || id == WelfareType.ADD_GOLD || id > 1000;
	}

	//自动挑战boss
	public get isAutoKillBoss(): boolean {
		return this._isAutoKillBoss;
	}
	public set isAutoKillBoss(value: boolean) {
		if (this._isAutoKillBoss != value) {
			this._isAutoKillBoss = value;
			GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.AUTOBOSSCHANGE));
		}
	}

	//检查传入的点是否是在地图范围内
	public changeToRightPoint(p: Point): Point {
		var result: Point = new Point();
		if (p.x < 0) {
			result.x = 60;
		}
		else if (p.x > this.sceneWidth - 120) {
			result.x = this.sceneWidth - 120;
		}
		else {
			result.x = p.x;
		}
		if (p.y < 0) {
			result.y = 30;
		}
		else if (p.y > this.sceneHeight - 100) {
			result.y = this.sceneHeight - 100;
		}
		else {
			result.y = p.y;
		}
		result.x = Math.floor(result.x);
		result.y = Math.floor(result.y);
		return result;
	}

	//获取场景中心点(逻辑坐标)
	public getSceneCenter(): Point {
		var x: number = TileUtil.changeXToTile(this.sceneWidth / 2);
		var y: number = TileUtil.changeYToTile(this.sceneHeight / 2);
		return new Point(x, y);
	}

	//判断场景中是否有小怪
	public checkSceneHasSmallMonster(): boolean {
		var n: any;
		var mVo: MonsterVO;
		for (n in this._monsterDic) {
			mVo = this._monsterDic[n];
			if (mVo.monsterType == MonsterVO.SMALL && !mVo.isPetMonster && mVo.useType != MonsterVO.VIRTUAL) {
				return true;
			}
		}
		return false;
	}

	//计算遭遇到的玩家在场景中的坐标
	//有参数的话，就是用在场景上面的假人
	public getMeetPlayerPos(index: number = -1): Point {
		var p: Point = new Point();
		var waveConfig: SceneWaveVo = this.getWaveConfig(this._sceneWaveInfo.wave_id);
		var list: Array<Point> = waveConfig.playerList;
		if (index > -1) {
			return list[index];
		}
		var monPos: Point;
		var result: Point;
		for (var i: number = 0; i < list.length; i++) {
			monPos = list[i];
			if (!this._mpPointDic[monPos.x + "_" + monPos.y]) {
				result = monPos;
				break;
			}
		}
		if (result == null) {
			result = list[0];
		}
		return result;
	}

	//创建假的怪物
	public createVirtualMonster(point: Point, id: number = 0): MonsterVO {
		if (id == 0) {
			id = this._currentSmallMonID;
		}
		var vo: MonsterVO = this.makeMonsterVo(id);
		vo.useType = MonsterVO.VIRTUAL;
		vo.x = point.x;
		vo.y = point.y;
		this.addMonster(vo);
		return vo;
	}

	//移除某种类型的小怪
	public removeTypeMon(type: number): void {
		var n: any;
		var monVo: MonsterVO;
		for (n in this._monsterDic) {
			monVo = this._monsterDic[n];
			if (monVo.useType == type) {
				this.removeMonster(monVo.id, true);
			}
		}
	}

	//移除某类型的玩家
	public removeTypePlayer(type: number): void {
		var n: any;
		var playerVo: PlayerBaseVO;
		for (n in this._playerDic) {
			playerVo = this._playerDic[n];
			if (playerVo.useType == type) {
				if (RoleModel.getInstance().getPartnerInfo(playerVo.uid)) {
					trace(StringUtil.substitute("removeTypePlayer remove my partner id = {0}", playerVo.parnerID));
				}
				this.removePlayer(playerVo.uid);
			}
		}
	}

	//判断场景中是否还有遭遇玩家
	public checkMeetPlayerFinish(): boolean {
		var result: boolean = true;
		var n: any;
		var vo: PlayerBaseVO;
		for (n in this._playerDic) {
			vo = this._playerDic[n];
			if (vo.useType == PlayerBaseVO.MEET) {
				result = false;
				break;
			}
		}
		return result;
	}

	private _mpPointDic: Object;
	public saveMPUsePoint(point: Point): void {
		this._mpPointDic[point.x + "_" + point.y] = true;
	}

	public clearMPUsePoint(point: Point): void {
		if (this._mpPointDic[point.x + "_" + point.y] = true) {
			delete this._mpPointDic[point.x + "_" + point.y];
		}
	}

	//获取某个职业的随机技能，暂时用于假人播放特效
	public getRandomSkill(job: number): number {
		var random: number = Math.random();
		var result: number = 0;
		if (random > 0.7) {
			var list = SkillModel.getInstance().getSkillListByJob(job, false);
			var index: number = Math.floor(list.length * Math.random()) + 1;
			index = Math.min(index, list.length - 1);
			var vo: SkillVo = list[index];
			if (vo.id == 101004 || vo.id == 101009) {
				result = SkillModel.getInstance().getCarrerSkill(job);
			}
			else {
				result = vo.id;
			}
		}
		else {
			result = SkillModel.getInstance().getCarrerSkill(job);
		}
		return result;
	}

	public get hideOhters() {
		return this._hideOhters;
	}

	public set hideOhters(value: boolean) {
		if (value != this._hideOhters) {
			this._hideOhters = value;
			this.dispatchEvent(new ParamEvent(SceneModel.ISHIDE_CHANGE));
		}
	}

	public isKFBossScene(): boolean {
		return this.getCurrentSceneType() == SceneInfoVo.KFBOSS_SCENE;
	}

	public isBossHome(): boolean {
		return this.getCurrentSceneType() == SceneInfoVo.BOSS_HOME;
	}

	public isEliteBoss(): boolean {
		return this.getCurrentSceneType() == SceneInfoVo.ELITE_BOSS;
	}

	public isWildBoss(): boolean {
		return this.getCurrentSceneType() == SceneInfoVo.WILD_BOSS;
	}

	public isEquipFuBen(): boolean {
		return this.getCurrentSceneType() == SceneInfoVo.EQUIP_FUBEN;
	}
	public isMainCity(): boolean {
		return this.getCurrentSceneType() == SceneInfoVo.MAIN_CITY;
	}
	public isNoviceScene(): boolean {
		return this.getCurrentSceneType() == SceneInfoVo.NOVICE_SCENE;
	}

	//判断是否攻城战内城
	public isCityWarInside(): boolean {
		return this.id == SceneInfoVo.CITYWAR_INSIDE;
	}

	//判断是不是前殿
	public isCityWarFrontPalace(): boolean {
		return this.id == SceneInfoVo.CITYWAR_FRONTPALACE;
	}

	//判断是否在宫殿
	public isCityWarPalace(): boolean {
		return this.id == SceneInfoVo.CITYWAR_PALACE;
	}

	//判断是否在攻城战的内城
	public isCityWarInner(): boolean {
		return this.isCityWarInside() || this.isCityWarFrontPalace() || this.isCityWarPalace();
	}

	//判断是否在攻城战的外面
	public isCityWarOutSide(): boolean {
		return this.id == SceneInfoVo.CITYWAR_OUTSIDE;
	}

	//根据怪物的类型ID
	public getMonsterVoByTypeID(id: number): MonsterVO {
		var n: any;
		for (n in this._monsterDic) {
			var vo: MonsterVO = this.getMonsterVo(n);
			if (vo.typeId == id) {
				return vo;
			}
		}
		return null;
	}

	//以r为半径，point为中心，找出圆上的一个随机点
	public getRandomPointOfRound(point: Point, r: number): Point {
		var result: Point = new Point();
		var d: number = Math.random();
		result.x = point.x + (d * 2 - 1) * r;
		result.y = point.y + (d * 2 - 1) * r;
		result = this.changeToRightPoint(result);
		return result;
	}

	private _roleList: Array<SCMD10810>;
	public addRole(scmd: SCMD10810): void {
		var a = this;
		if (a._roleList == null) {
			a._roleList = new Array();
		}
		for (var i: number = 0; i < a._roleList.length; i++) {
			var vo: SCMD10810 = a._roleList[i];
			if (vo.role_id == scmd.role_id && vo.plat_name == scmd.plat_name) {
				return;
			}
		}
		a._roleList.push(scmd);
	}

	//id是角色id
	public removeRole(id: string): void {
		var a = this;
		if (a._roleList == null) {
			return;
		}
		for (var i: number = 0; i < a._roleList.length; i++) {
			var vo: SCMD10810 = a._roleList[i];
			if (PlayerBaseVO.makeUid(vo.plat_name, vo.role_id) == id) {
				a._roleList.splice(i, 1);
				break;
			}
		}
	}

	public get roleList() {
		if (this._roleList == null) {
			this._roleList = new Array();
		}
		return this._roleList;
	}

	//用于判断场景地图是否加载过
	private _sceneResDic: Object;
	public storeSceneRes(): void {
		if (this._sceneResDic == null) {
			this._sceneResDic = new Object();
		}
		this._sceneResDic[this.resID] = true;
	}
	public isSceneMapResLoaded(): boolean {
		if (this._sceneResDic == null) {
			return false;
		}
		return this._sceneResDic[this.resID];
	}

	//quadrant象限代号
	public getQuadrantPoint(quadrant: number): Point {
		var center: Point = this.getSceneCenter();
		var p: Point = new Point();
		var size: Point = this.getSceneWH(this.getCurrentSceneType());
		var mq: number = this.getMyQuadrant();
		var oq: number = this.getOppositequadrant(mq);
		return null;
	}

	//获取象限里面的一个随机坐标
	public getRandomPointInQuadrant(quadrant: number = 0): Point {
		if (quadrant == 0) {
			quadrant = this.getMyQuadrant();
		}
		var result: Point = new Point();
		var center: Point = this.getSceneCenter();
		center = this.changeToPixsPoint(center);
		var size: Point = this.getSceneWH(this.getCurrentSceneType());
		var w2: number = size.x / 2;
		var h2: number = size.y / 2;
		var vx: number = 0;
		var vy: number = 0;
		switch (quadrant) {
			case 1:
				vx = w2 / 2;
				vy = - h2 / 2;
				break;
			case 2:
				vx = -w2 / 2;
				vy = - h2 / 2;
				break;
			case 3:
				vx = -w2 / 2;
				vy = h2 / 2;
				break;
			case 4:
				vx = w2 / 2;
				vy = h2 / 2;
				break;
		}
		result.x = center.x + vx;
		result.y = center.x + vy;
		return result;
	}

	//获取自己对角的象限代号
	public getMyQuadrant(): number {
		if (this._focusPos == null) {
			return 1;
		}
		var p: Point = this._focusPos;
		var size: Point = this.getSceneWH(this.getCurrentSceneType());
		var w2: number = size.x / 2;
		var h2: number = size.y / 2;
		if (p.x >= w2 && p.y <= h2) {
			return 1;
		}
		else if (p.x >= w2 && p.y >= h2) {
			return 4;
		}
		else if (p.x <= w2 && p.y <= h2) {
			return 2;
		}
		return 3;
	}

	//获取对面的象限
	public getOppositequadrant(q: number): number {
		if (q == 1) {
			return 3;
		}
		else if (q == 2) {
			return 4
		}
		else if (q == 3) {
			return 1
		}
		else if (q == 4) {
			return 2;
		}
		return - 1;
	}

	//获取当前波数怪物剩余数量
	public getCurrentWaveLeft(): number {
		if (this._waveMonsterList == null) {
			return 0;
		}
		return this._waveMonsterList.length;
	}

	//是否boss场景(关卡，个人，全民，转生,公会，觉醒，boss之家，精英，野外，装备的总和)
	public isBossScene(): boolean {
		if (this.isPersonBoss() || this.isPeopleBoss() || this.isHookWaveBoss() || this.isRoundBoss() || this.isGuildBoss()
			|| this.isKFBossScene() || this.isBossHome() || this.isEliteBoss() || this.isWildBoss() || this.isEquipFuBen()) {
			return true;
		}
		return false;
	}

	public getRandomPosByR(p1: Point, p2: Point, r: number = 150, angle: number = 120): Point {
		// var value = (-(Math.floor(p2.y) - p1.y)) / (Math.floor(p2.x) - p1.x);
		var aAngle = Math.atan2((Math.floor(p2.y) - p1.y), Math.floor(p2.x) - p1.x) * 180 / Math.PI;
		// if(this.isBossScene()){
		// 	trace("9");
		// }
		// if (aAngle < 0) {
		// 	aAngle = 180 - aAngle;
		// }
		var n = Math.ceil(Math.random() * 100);
		var randomAngle = Math.ceil(Math.random() * angle);
		var nowAngle = (aAngle + Math.pow(-1, n) * randomAngle) * Math.PI / 180;
		var result: Point = new Point();
		result.x = p1.x + Math.cos(nowAngle) * r;
		result.y = p1.y + Math.sin(nowAngle) * r;
		result = this.changeToRightPoint(result);
		return result;
	}

	//isLunHuiSuccess是否刚刚轮回成功
	public calculateBackRewardContent(isLunHuiSuccess: boolean): string {
		var content: string = "";
		var waveVo: SCMD10600 = this.getSceneWave();
		if (waveVo == null) {
			return content;
		}
		var startIndex: number = waveVo.wave_id;
		if (isLunHuiSuccess) {
			startIndex = 1;
		}
		var endIndex: number = waveVo.total_wave_id;
		var goodsDic: Object = new Object();
		var coin: number = 0;
		var gold: number = 0;
		var exp: number = 0;
		for (var i = startIndex; i <= endIndex; i++) {
			var vo: LunHuiOneKeyVo = this.getOneKeyLunHuiVo(i);
			coin += vo.add_coin;
			gold += vo.add_gold;
			exp += vo.add_exp;
			var list = vo.goodsList;
			for (var j = 0; j < list.length; j++) {
				var goodsNode = list[j]
				if (goodsDic[goodsNode.asset_id]) {
					goodsDic[goodsNode.asset_id] = goodsDic[goodsNode.asset_id] + goodsNode.value;
				}
				else {
					goodsDic[goodsNode.asset_id] = goodsNode.value;
				}
			}
		}
		//添加金币，元宝，经验
		content = StringUtil.substitute("{0}、{1}、{2}", ColorUtil.getGoodsHtmlName(WelfareType.ADD_COIN, coin)
			, ColorUtil.getGoodsHtmlName(WelfareType.ADD_GOLD, gold), ColorUtil.getGoodsHtmlName(WelfareType.ADD_EXP, exp));
		//添加物品
		for (var n in goodsDic) {
			content += ("、" + ColorUtil.getGoodsHtmlName(parseInt(n), parseInt(goodsDic[n])));
		}
		//关卡信息
		var currentWave = waveVo.wave_id;
		if (isLunHuiSuccess) {
			currentWave = 1;
		}
		content += StringUtil.substitute("\n当前关卡：{0}	历史最高关卡：{1}", currentWave, waveVo.total_wave_id);
		content += StringUtil.substitute("\n实际花费以回归时关卡为准");
		return content;
	}

	public getOneKeyLunHuiVo(id: number): LunHuiOneKeyVo {
		if (this._oneKeyLunHuiObj == null) {
			this._oneKeyLunHuiObj = new Object();
			var obj: Object = DataManager.getInstance().getObj("data_hook_auto_circle");
			var list: Array<Object> = obj["data_hook_auto_circle"];
			for (var i = 0; i < list.length; i++) {
				var node = list[i];
				var vo: LunHuiOneKeyVo = new LunHuiOneKeyVo();
				vo.template_id = node["template_id"];
				vo.add_coin = node["add_coin"];
				vo.add_gold = node["add_gold"];
				vo.goodsList = Tools.changeToNodeDropList(node["add_item"]);
				vo.add_exp = node["add_exp"];
				this._oneKeyLunHuiObj[vo.template_id] = vo;
			}
		}
		return this._oneKeyLunHuiObj[id];
	}

	//轮回回归
	//isLunHuiSuccess true的话，就是刚刚轮回到第一关的时候
	public lunHuiBack(isLunHuiSuccess: boolean = false): void {
		// if (!VipModel.getInstance().isLife) {
		// 	return;
		// }
		// var title: string = "是否一键回到最高关卡？可立即获得以下奖励：";
		// var content: string = SceneModel.getInstance().calculateBackRewardContent(isLunHuiSuccess);
		// GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.SHOW_TIPS, {
		// 	title: title, content: content, func: () => {
		// 		EffectManager.getInstance().showEffect(UrlUtil.getCommonEffectURL("jiasu"), 310, 570, GameContent.gameLayers.windowLayer, 200);
		// 		setTimeout2(() => {
		// 			GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.LUNHUI_ONEKEY));
		// 		}, 2000);
		// 	}, autoCloseView: false, type: LunhuiModel.LUNHUIBACK
		// }));
	}

	public getPlayerNum(): number {
		var result: number = 0;
		for (var n in this._playerDic) {
			result++;
		}
		return result;
	}

	//添加伙伴信息
	public storePartner(vo: PlayerBaseVO): void {
		this._allPartnerInSceneDic[vo.uid] = vo;
	}

	//根据伙伴id移除伙伴
	public removePartnerInHunZhan(id: string): void {
		delete this._allPartnerInSceneDic[id];
	}

	//根据玩家id移除伙伴
	public removePlayerInHunZhan(playerID: string): void {
		for (var n in this._allPartnerInSceneDic) {
			var vo: PlayerBaseVO = this._allPartnerInSceneDic[playerID];
			if (vo && vo.pid == playerID) {
				delete this._allPartnerInSceneDic[n];
			}
		}
	}

	//根据伙伴id找出对应的vo
	public getPartnerInScene(id: string): PlayerBaseVO {
		return this._allPartnerInSceneDic[id];
	}

	//根据伙伴ID找玩家ID
	public findPlayerIDByPartnerID(partnerID: string): string {
		for (var n in this._allPartnerInSceneDic) {
			var vo: PlayerBaseVO = this._allPartnerInSceneDic[n];
			if (vo.uid == partnerID) {
				return vo.pid;
			}
		}
		return "";
	}

	//判断玩家是否已经添加在场景上面，只要玩家的其中一个伙伴在场景上，就返回true
	public hasPlayerInScene(id: string): boolean {
		for (var n in this._allPartnerInSceneDic) {
			var vo = this._allPartnerInSceneDic[n];
			if (vo && vo.pid == id) {
				if (this.getPlayer(vo.uid)) {
					return true;
				}
			}
		}
		return false;
	}

	//根据玩家id找出对应的所有伙伴
	public findPartnersByPlayerID(playerID: string): Array<PlayerBaseVO> {
		var list: Array<PlayerBaseVO> = new Array();
		for (var n in this._allPartnerInSceneDic) {
			if (list.length >= 3) {
				return list;
			}
			var vo: PlayerBaseVO = this._allPartnerInSceneDic[n];
			if (vo.pid == playerID) {
				list.push(vo);
			}
		}
		return list;
	}

	//获取一个距离主角某个距离的点， p1是像素坐标
	public getRandomPosNearPoint(p1: Point, r: number = 150, angle: number = 180): Point {
		var result: Point = new Point();
		var nowAngle: number = Tools.makeCustomRandom(angle);
		nowAngle = nowAngle / Math.PI;
		result.x = p1.x + Math.cos(nowAngle) * r;
		result.y = p1.y + Math.sin(nowAngle) * r;
		result = this.changeToRightPoint(result);
		return result;
	}

	//判断是否客户端群战场景
	public isClientHunZhan(): boolean {
		return this.isGuildBoss() || this.isKFBossScene() || this.isBossHome() || this.isWildBoss() || this.isEliteBoss();
	}

	//是否个人混战
	public isClientPersonHunZhan(): boolean {
		return this.isBossHome() || this.isWildBoss() || this.isEliteBoss();
	}

	//是否展示自动复活勾选框
	public isShowBossRight(): boolean {
		return this.isGuildBoss() || this.isKFBossScene() || this.isRoundBoss();
	}

	//在混战场景中找出非自己公会的敌人
	public findPlayerInClientHunZhan(): PlayerBaseVO {
		var n;
		for (n in this._allPartnerInSceneDic) {
			var vo: PlayerBaseVO = this._allPartnerInSceneDic[n];
			if (vo.getBangID() != RoleModel.getInstance().getRoleCommon().guild_id) {
				return vo;
			}
		}
		return null;
	}

	//把某个角色的伙伴都添加到场景上,id是角色id
	public addPartnersToScene(id: string, pos: Point, immediate: boolean = false): void {
		var list: Array<PlayerBaseVO> = this.findPartnersByPlayerID(id);
		for (var i = 0; i < list.length; i++) {
			var vo: PlayerBaseVO = list[i];
			var gap: number = 0;
			if (i > 0) {
				gap = Math.pow(-1, i);
			}
			vo.x = pos.x + gap;
			vo.y = pos.y + gap;
			if (this.getPlayer(vo.uid)) {
				GameDispatcher.getInstance().dispatchEvent(new ParamEvent(CityWarEvtName.SET_ENERMY_POS, { id: id, pos: new Point(vo.x, vo.y) }));
			}
			else {
				if (immediate) {
					this.addPlayer(vo);
				}
				else {
					this.addPlayerByTimer(vo);
				}
			}
		}
	}

	//是否简单的形象
	public isSimpleFigure(): boolean {
		return this.isGuildBoss();
	}

	public addOneRealFigure(): void {
		this._realFigureNum++;
	}
	public removeOneRealFigure(): void {
		this._realFigureNum--;
	}

	public getCurrentRealFigureNum(): number {
		return this._realFigureNum;
	}

	public resetRealFigureNum(): void {
		this._realFigureNum = 0;
	}

	// private _showResultSi: number = 0;
	private _resultGoodsList: Array<NodeDrop_list>;
	private _dropRewardSi: number = 0;
	public showResult(isWin: number, goodsList: Array<NodeDrop_list>): void {
		if (isWin > 0) {
			this._resultGoodsList = goodsList;
			SceneModel.getInstance().setDropList(goodsList, null, true);
			this.clearRewardSi();
			this._dropRewardSi = setTimeout2(() => { this.showDropReward() }, 1200);
		}
		else {
			GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.SHOW_FR_FAIL, { dropList: [] }));
		}
	}

	//部分功能，收到结算协议后，服务端会把所有人丢出场景，如boss之家
	// public showResultOfExit(isWin: number, goodsList: Array<NodeDrop_list>): void {
	// 	if (isWin > 0) {
	// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.SHOW_FR_SUCCESS, { list: goodsList }));
	// 	}
	// 	else {
	// 		GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.SHOW_FR_FAIL, { list: goodsList }));
	// 	}
	// }

	//获取的掉落奖励结算界面
	private showDropReward(): void {
		if (this._resultGoodsList) {
			GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.SHOW_FR_SUCCESS, { list: this._resultGoodsList }));
			this._resultGoodsList = null;
		}
		if (this.isHookWaveBoss()) {
			var waveID: number = this.getCurrentWaveID();
			GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.REQUEST_10604, { id: waveID }));
		}
	}

	public clearRewardSi(): void {
		if (this._dropRewardSi > 0) {
			clearTimeout(this._dropRewardSi);
		}
	}

	public isClientMakeBossBloodScene(): boolean {
		return this.isPersonBoss() || this.isGuildFuben();
	}

	private loadScenePathComplete(json: JSON): void {
		if (json) {
			var id: number = parseInt(json["id"]);
			var a = this;
			var pathList = json["mask"];
			a._pathDic[id] = pathList;
			a._findPath = new FindPath8(pathList);
		}
	}

	//获取场景中的一个其他人
	public getOther(): PlayerBaseVO {
		for (var n in this._playerDic) {
			var vo: PlayerBaseVO = this._playerDic[n];
			if (vo && vo.id != RoleModel.getInstance().getRoleCommon().role_id) {
				return vo;
			}
		}
		return null;
	}

	private _canFind8Scene: Array<number> = [2101, 2001];
	public isCanFind8Scene(id: number = 0): boolean {
		var a = this;
		if (id == 0) {
			id = a.resID;
		}
		return a._canFind8Scene.indexOf(id) > -1;
	}

	//检查格子的区域属性
	public checkPixsXY(x: number, y: number): number {
		var tx: number = TileUtil.changeXToTile(x);
		var ty: number = TileUtil.changeYToTile(y);
		var a = this;
		var mapData = a._pathDic[a.resID];
		if (mapData == null || mapData[ty] == null || mapData[ty][tx] == null) return -1;
		return mapData[ty][tx];
	}

	//检查点能否到达
	public checkPointCanMove(p: Point): boolean {
		if (p == null) {
			return false;
		}
		var value: number = this.checkPixsXY(p.x, p.y);
		return value == 0;
	}
}