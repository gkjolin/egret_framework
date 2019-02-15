class Scene extends CommonSprite {
	private _map: MapLayer;
	private _sceneUpContainer: CommonSprite;
	private _dropContainer: CommonSprite;//掉落层
	private _effectLayer: CommonSprite;//效果层
	private _elementLayer: CommonSprite;//元素层
	private _imageTxtLayer: CommonSprite;//伤害数字层
	private _model: SceneModel;
	private _isDispose: boolean;
	private _elementList: Array<any>;
	private _addMonsterList: Array<any>;
	private _playerDic: Object;
	private _petDic: Object;
	private _monsterDic: Object;
	private _npcDic: Object;
	private _dropItemList: Array<DropItem>;
	private _walkTimesDic: Object;
	private _fightPlayList: Array<any>;
	private _roleModel: RoleModel;
	private _role: Player;
	private _gameDispatcher: GameDispatcher;
	private _skillManager: SkillModel;
	private _moveBackSiDic: Object;//记录延迟施放效果的si
	private _playMovieDic: Object;//记录延迟播放攻击效果的si
	private _myPartnerList: Array<Player>;//我的伙伴们
	private _petList: Array<Pet>;
	private _npcList: Array<Npc>;
	private _meetPlayerList: Array<Player>;//遭遇到的玩家
	private _petMonster: Monster;//道士召唤的宝宝
	private _partnerClickTargetDic: Object;
	private _meetPlayerTargetDic: Object;
	private _zhanshiSkillSi: number = 0;
	private _buffDic: Object;
	private _playerCachList: Array<Player>;
	private _monsterCachList: Array<Monster>;//真实可以打的怪物缓存
	private _petCachList: Array<Pet>;
	private _npcCachList: Array<Npc>;
	public static playNum: number;
	public static monsterNum: number;
	public static petNum: number;
	private _isClickMap: boolean = false;
	private _roleNextAttackSiDic: Object;

	private _targetMonster: number = 0;

	private _clickTarget: SceneElement = null;
	public constructor() {
		super();
		this.init();
	}

	private init(): void {
		var a = this;
		a._model = SceneModel.getInstance();
		// a._skillManager = SkillModel.getInstance();
		a._playerCachList = new Array();
		a._monsterCachList = new Array();
		a._petCachList = new Array();
		a._npcCachList = new Array();
		a._sceneUpContainer = new CommonSprite("mapContainer");
		a.addChild(a._sceneUpContainer);
		a._map = new MapLayer(a._sceneUpContainer);
		a._sceneUpContainer.addChild(a._map);
		a._dropContainer = new CommonSprite("dropLayer");
		a._sceneUpContainer.addChild(a._dropContainer);
		a._effectLayer = new CommonSprite("effectLayer");
		a._sceneUpContainer.addChild(a._effectLayer);
		a._elementLayer = new CommonSprite("elementLayer");
		a._sceneUpContainer.addChild(a._elementLayer);
		a._imageTxtLayer = new CommonSprite("imageTxtLayer");
		a._sceneUpContainer.addChild(a._imageTxtLayer);
		a._sceneUpContainer.touchChildren = false;
		a._sceneUpContainer.touchEnabled = false;
		a._effectLayer.touchChildren = false;
		a._effectLayer.touchEnabled = false;
		a._elementLayer.touchChildren = false;
		a._elementLayer.touchEnabled = false;
		a._imageTxtLayer.touchChildren = false;
		a._imageTxtLayer.touchEnabled = false;
		a._dropContainer.touchChildren = false;
		a._dropContainer.touchEnabled = false;
		a._roleModel = RoleModel.getInstance();
		a._roleModel.addEventListener(RoleModel.ROLE_PARTNERLIST_CHANGE, a.addPartnerHandler, a);
		a._model.addEventListener(EventName.SCENE_BUILD, a.buildScene, a);
		a._model.addEventListener(SceneModel.ADDPLAYER, a.addPlayerHandler, a);
		// a._model.addEventListener(SceneModel.ROLE_POS_CHANGE, a.rolePosChangeHandler, a);
		this._model.addEventListener(SceneModel.ADDPET, this.addPetHandler, this);
		this._model.addEventListener(SceneModel.REMOVEPET, this.removePetHandler, this);
		a._model.addEventListener(SceneModel.FOCUS_POS_CHANGE, a.focusPosChangeHandler, a);
		a._model.addEventListener(SceneModel.ADDMONSTER, a.addMonsterHandler, a);
		a._model.addEventListener(SceneModel.ADD_DROP_ITEM, a.addDropItemHandler, a);
		a._model.addEventListener(SceneModel.REMOVEMONSTER, a.removeMonsterHandler, a);
		a._model.addEventListener(SceneModel.CREATE_WAVE_MONSTER_FINISH, a.continueFightMonster, a);
		a._model.addEventListener(SceneModel.CREATE_NOVICE_MONSTER_FINISH, a.noviceMonsterCreateFinish, a);
		a._model.addEventListener(SceneModel.CREATE_MONSTER_LIST_FINISH, a.monsterListCreateFinish, a);
		a._model.addEventListener(SceneModel.CLEAR_ELEMENT, a.clearElement, a);
		a._model.addEventListener(SceneModel.REMOVEPLAYER, a.removePlayerHandler, a);
		a._model.addEventListener(SceneModel.CREATE_MATERIAL_MONSTER_FINISH, a.continueFightMonster, a);
		a._model.addEventListener(SceneModel.ISHIDE_CHANGE, a.isHideOtherChange, a);
		a._model.addEventListener(SceneModel.REMOVEALLMONSTER, a.clearAllMonster, a);
		a._gameDispatcher = GameDispatcher.getInstance();
		a._gameDispatcher.addEventListener(EventName.GAME_START, a.onGameStart, a);
		a._gameDispatcher.addEventListener(EventName.SHOW_BUFF, a.showBUff, a);
		a._gameDispatcher.addEventListener(EventName.WAVE_MONSTER_END, a.waveMonsterEnd, a);
		a._gameDispatcher.addEventListener(EventName.ADD_BOSS_MEET, a.addBossMeetHandler, a);
		a._gameDispatcher.addEventListener(EventName.MEET_BOSS_FINISH, a.meetBossFinish, a);
		a._gameDispatcher.addEventListener(EventName.ADD_VIRTUAL_PLAYER, a.addVirtualPlayerHandler, a);
		a._gameDispatcher.addEventListener(EventName.ALL_PARTNER_HP0, a.allPartnerDead, a);
		a._gameDispatcher.addEventListener(EventName.ROLE_POS_CHANGE, a.rolePosChange, a);
		a._gameDispatcher.addEventListener(EventName.SET_ROLES_FIGHT, a.setRolesFightHandler, a);
		a._gameDispatcher.addEventListener(EventName.RANDOM_RUN, a.randomRunHandler, a);
		a._gameDispatcher.addEventListener(CityWarEvtName.ROLES_GOTO_FLAG, a.rolesGotoFlagHandler, a);
		a._gameDispatcher.addEventListener(CityWarEvtName.SET_ENERMY_POS, a.goToFightPlayers, a);
		a._gameDispatcher.addEventListener(EventName.CONTINUEFIGHT, a.continueFightMonster, a);
		a._gameDispatcher.addEventListener(EventName.AUTO_FLY_GOODS, a.autoFlyGoods, a);
		a._gameDispatcher.addEventListener(EventName.CHECK_HUNZHAN_FIGHT, a.checkHunZhanFight, a);
		a._gameDispatcher.addEventListener(EventName.CONTINUEFIGHT_REALPLAYER, a.continueFightRealPlayer, a);
		a._gameDispatcher.addEventListener(EventName.REMOVE_BUFF, a.removeBuff, a);
		a._gameDispatcher.addEventListener(EventName.PLAYER_MOVE, a.playerMove, a);
		a._gameDispatcher.addEventListener(EventName.WALK_TO_NPC, a.walkToNpc, a);
		a._sceneUpContainer.addEventListener(egret.TouchEvent.TOUCH_TAP, a.onClickMap, a);
		a._sceneUpContainer.touchEnabled = true;
		RenderManager.add(a.step, a);
		a._moveBackSiDic = new Object();
		a._playMovieDic = new Object();
		a._myPartnerList = new Array();
		a._meetPlayerList = new Array();
		a._petList = new Array();
		a._npcList = new Array();
		a._partnerClickTargetDic = new Object();
		a._meetPlayerTargetDic = new Object();
		a._buffDic = new Object();
		a._walkTimesDic = new Object();
		a._roleNextAttackSiDic = new Object();
	}

	private onClickMap(event: egret.TouchEvent): void {
		var a = this;
		var px: number = event.localX;
		var py: number = event.localY;
		if (TaskModel.getInstance().isNovicePlayer() == true) return;
		if (a._model.isMainCity()) {
			a.cancelClickTarget();
			var npc: Npc;
			for (var i: number = a._npcList.length - 1; i >= 0; i--) {
				npc = a._npcList[i];
				if (npc.getIsInteractive() == true) {
					if (npc.isHit(new Point(px, py))) {
						a.roleTalkToNPC(npc, 1);
						return;
					}
				}
			}
		}
		if ((a._model.isHookSmall() || a._model.isMainCity()) && a._role) {
			if (a._model.isCanFind8Scene()) {
				var endPoint = new Point(px, py);
				var canMove = a._model.checkPointCanMove(endPoint);
				if (!canMove) {
					Message.show("该处不能行走");
					return;
				}
			}
			a._isClickMap = true;
			this.allPartnerMove(new Point(px, py));
			a.showClickEffect(px, py);
		}
	}

	private showClickEffect(px: number, py: number): void {
		var url: string = UrlUtil.getCommonEffectURL("dian");
		EffectManager.getInstance().showEffect(url, px, py, this._sceneUpContainer);
	}


	private allPartnerMove(p: Point): void {
		var a = this;
		var list = a._myPartnerList;
		for (var i = 0; i < list.length; i++) {
			var player: Player = list[i];
			a.roleMove(player, p);
		}
	}

	private onGameStart(event: ParamEvent): void {
		this._gameDispatcher.removeEventListener(EventName.GAME_START, this.onGameStart, this);
		this.addAllPartner(true);
		this.addAllNpc();
		this.rolesAutoFightMonster();
	}

	//添加全部的小伙伴，一般是在场景初始化的时候进行
	public addAllPartner(updateScenePos: boolean = false): void {
		var list: Array<PlayerBaseVO> = this._roleModel.getPartnerList();
		var petList: Array<PetBaseVO> = this._roleModel.getPetList();
		var node: PlayerBaseVO;
		var partner: Player;
		for (var i: number = 0; i < list.length; i++) {
			node = list[i];
			if (node.parnerID != this._roleModel.getRoleBaseInfo().parnerID && SceneModel.getInstance().isMainCity()) {
				continue;
			}
			this.addPartner(node);
			if (node.parnerID == this._roleModel.getRoleBaseInfo().parnerID) {
				this.addRole(node.uid);
				if (petList && petList.length > 0) {
					petList[0].setWeapon(node.getAppVo().getPetWeapon());
					this.addPet(petList[0]);
				}
				// if (petList && petList.length > 0) this.addPet(petList[0]);
			}
		}
		if (updateScenePos) {
			this._sceneUpContainer.x = -Math.ceil(this._model.getFocusPos().x);
			this._sceneUpContainer.y = -Math.ceil(this._model.getFocusPos().y);
			GameContent.gameLayers.sceneLayer.x = this._sceneUpContainer.x;
			GameContent.gameLayers.sceneLayer.y = this._sceneUpContainer.y;
		}
	}

	//添加一个小伙伴
	private addPartner(node: PlayerBaseVO): void {
		var partner: Player = this.makePlayer(node);
		partner.setPlayerVo(node);
		partner.isYun = false;
		partner.playerVo.useType = PlayerBaseVO.COMMON;
		node.setHp(node.getMaxHp());
		node.setMp(node.getMaxMp());
		partner.x = TileUtil.changeXToPixs(node.x);
		partner.y = TileUtil.changeYToPixs(node.y);
		partner.playerVo.x = node.x;
		partner.playerVo.y = node.y;
		partner.addEventListener(SceneEvtName.DEAD, this.roleDeadHandler, this);
		partner.addEventListener(EventName.ZSCZ_FINISH, this.roleZSCZHandler, this);
		partner.addEventListener(SceneEvtName.WALK_COMPLETE_NODE, this.roleWalkCompleteNodeHandler, this);
		partner.addEventListener(SceneEvtName.WALK_COMPLETE, this.roleWalkCompleteHandler, this);
		partner.getPoseState().addEventListener(PoseState.CHANGE, this.roleStateChangeHandler, this);
		if (this._playerDic == null) {
			this._playerDic = new Object();
		}
		this._playerDic[node.uid] = partner;
		this.addElement(partner);
		this._myPartnerList.push(partner);
		this._model.addPlayer(node, false);
	}
	//添加全部的NPC，一般是在场景初始化的时候进行
	public addAllNpc(updateScenePos: boolean = false): void {
		var sceneInVO: SceneInfoVo = this._model.getCurrentSceneInfo();
		var npcVOList: Array<SceneNpcVO> = sceneInVO.npcList;
		if (npcVOList != null) {
			var node: SceneNpcVO;
			var npc: Npc;
			for (var i: number = 0; i < npcVOList.length; i++) {
				node = npcVOList[i];
				npc = this.makeNpc(node);
				npc.x = TileUtil.changeXToPixs(node.x);
				npc.y = TileUtil.changeYToPixs(node.y);
				this._npcDic[npc.npcVo.template_id] = npc;
				this.addElement(npc);
				this._npcList.push(npc);
			}
		}
	}
	//添加一个宠物
	private addPet(node: PetBaseVO): void {
		if (this._petList.length > 0) return;
		// if (this._model.isMainCity() == true) return;
		var pet: Pet = this.makePet(node);
		pet.setPetBaseVo(node);
		// pet.petVo.useType = PlayerBaseVO.COMMON;
		// pet.x = TileUtil.changeXToPixs(node.x);
		// pet.y = TileUtil.changeYToPixs(node.y);
		pet.x = this._role.x - 25;
		pet.y = this._role.y + 45;
		pet.petVo.x = node.x;
		pet.petVo.y = node.y;
		pet.setOwner(this._role);
		if (this._petDic == null) {
			this._petDic = new Object();
		}
		this._petDic[node.uid] = pet;
		this.addElement(pet);
		pet.redraw();
		this._petList.push(pet);
		this._model.addPet(node, false);
	}

	//构建场景
	private buildScene(event: egret.Event): void {
		this._isDispose = false;
		this._elementList = new Array();
		this._addMonsterList = new Array();
		this._fightPlayList = new Array();
		this._playerDic = new Object();
		this._monsterDic = new Object();
		this._npcDic = new Object();
		this._dropItemList = new Array();
		this.disposeMap();
		this._map.build();
		this._isStartRender = true;
		//不是第一个场景的话，就添加角色，第一个场景的话，添加角色在onGameStart中处理
		if (!this._model.isFirstScene) {
			this.addAllPartner(true);
			this.addAllNpc();
			//不是第一次进入场景就在这里添加遭遇boss
			if (this._model.isHookSmall()) {
				BossModel.getInstance().addMeetBoss();
			}
		}
	}

	//添加角色
	private addPlayerHandler(event: ParamEvent): void {
		var vo: PlayerBaseVO = event.data.vo;
		this.addPlayer(vo);
	}

	private removeRole(): void {
		var a = this;
		if (a._role == null) {
			return;
		}
		if (a._role.getPoseState() != null) {
			a._role.getPoseState().removeEventListener(egret.Event.CHANGE, a.roleStateChangeHandler, a);
		}
		a._role.removeEventListener(SceneEvtName.WALK_COMPLETE, a.roleWalkCompleteHandler, a);
		a._role.removeEventListener(SceneEvtName.WALK_COMPLETE_NODE, a.roleWalkCompleteNodeHandler, a);
		a._role.removeEventListener(SceneEvtName.DEAD, a.roleDeadHandler, a);
		a._role.removeEventListener(EventName.ZSCZ_FINISH, a.roleZSCZHandler, a);
		a.removeElement(a._role);
		// a._role.playerVo.setHp(0);
		a._role.clear();
		// a._role.dispose();
		var index: number = a._myPartnerList.indexOf(a._role);
		if (index >= 0) {
			a._myPartnerList.splice(index, 1);
		}
		var si: number = a._buffDic[a._role.getId()];
		if (si > 0) {
			clearTimeout(si);
		}
		si = a._roleNextAttackSiDic[a._role.getId()];
		if (si > 0) {
			clearTimeout(si);
		}
		delete a._playerDic[a._role.getId()];
		a._role = null;
	}

	private addPetHandler(event: ParamEvent): void {
		// if (this._model.isMainCity()) return;
		var vo: PetBaseVO = event.data.vo;
		this.addPetOnScene(vo);
	}
	private removePetHandler(event: ParamEvent): void {
		this.removePet(event.data.id);
	}
	private addPetOnScene(vo: PetBaseVO): Pet {
		if (this._role == null) {
			return;
		}
		var pet: Pet = this.getPet(vo.uid);
		if (pet != null) {//重生
			this.removePet(vo.uid);
		}
		pet = this.makePet(vo);
		if (this._petDic == null) {
			this._petDic = new Object();
		}
		this._petDic[vo.uid] = pet;
		var realPoint: Point = this._model.changeToPixsPoint(new Point(vo.x, vo.y));
		realPoint = this._model.changeToRightPoint(realPoint);
		pet.x = realPoint.x;
		pet.y = realPoint.y;
		pet.setOwner(this._role);
		pet.setPetBaseVo(vo);
		this.addElement(pet);
		pet.redraw();
		return pet;
	}

	private removeElement(displayObject: egret.DisplayObject): void {
		if (displayObject == null)
			return;
		if (this._elementLayer.contains(displayObject)) {
			this._elementLayer.removeChild(displayObject);
		}
		var n: number = this._elementList.indexOf(displayObject);
		if (n > -1) {
			this._elementList.splice(n, 1);
		}
	}

	//玩家姿势改变
	private roleStateChangeHandler(e: ParamEvent): void {
		// 	var state: number = e.target.getState();
		// 	var preState: number = e.target.getPreState();
		// 	var partnerID: string = e.target.ownerID;
		// 	var rolePlayer: Player = this.getPlayer(partnerID);
		// 	if (rolePlayer && state == PoseState.STAND && preState != PoseState.DEAD) {
		// 		traceByTime("----- roleStateChangeHandler");
		// 		this.roleAttackClickTarget(rolePlayer);
		// 		if (rolePlayer.isPicking) {
		// 			this.autoPick();
		// 		}
		// 		else {
		// 			this.roleAttackClickTarget(rolePlayer);
		// 		}
		// 	}
	}

	//攻击选中的
	private roleAttackClickTarget(rolePlayer: Player, monsterId: number = 0): boolean {
		if (rolePlayer == null) {
			return false;
		}
		if (rolePlayer.playerVo == null) {
			return;
		}
		if (this._clickTarget != null) return;
		// traceByTime("------ roleAttackClickTarget");
		var target: any = this.getPartnerClickTarget(rolePlayer.playerVo.uid);
		if (is(target, "Player")) {
			var targetPlayer: Player = target as Player;
			return this.roleAttackPlayer(rolePlayer, targetPlayer);
		}
		else if (is(target, "Monster")) {
			var monster: Monster = target as Monster;
			if (this._model.isClientHunZhan()) {
				//混战场景中判断是否要打人，没人打就打怪
				var hzID: string = rolePlayer.playerVo.hunZhanTargetID;
				if (hzID != "") {
					this.rolesFightRealPlayer(rolePlayer);
					return true;
				}
				else {
					return this.roleAttackMonster(rolePlayer, monster);
				}
			}
			else {
				if (!target.isDead) {
					this._targetMonster = monster.monsterVo.typeId;;
					return this.roleAttackMonster(rolePlayer, monster);
				}
				else {
					target = null;
				}
			}
		}
		if (target == null) {
			//攻城战中的内城，前殿，宫殿中，打死了怪或者打死了一个玩家的所有小伙伴，就先站着不动了
			if (this._model.isCityWarInner()) {
				if (CityWarModel.getInstance().fightType == AttackType.MONSTER) {
					return false;
				}
				else if (CityWarModel.getInstance().fightType == AttackType.PARTNER) {
					this.rolesFightRealPlayer(rolePlayer);
				}
			}
			else {
				// if (MeetPlayerModel.getInstance().gotoFightMeetPlayerID > 0) {
				// 	this.onePartnerFightPlayer(rolePlayer);
				// }
				// else {
				// 	this.onePartnerFightMonster(rolePlayer, monsterId);
				// }
			}
		}
		return false;
	}

	//一个小伙伴找自己的攻击怪物
	private onePartnerFightMonster(rolePlayer: Player, monsterId: number = 0): void {
		var monster: Monster;
		if (monsterId == 0) {
			monster = this.findNoBelongMonster(rolePlayer.getId());
		} else {
			monster = this.findMonsterByTypeID(monsterId);
		}
		// var monster: Monster = this.findNoBelongMonster(rolePlayer.getId());
		if (monster) {
			monster.belongTo = rolePlayer.getId();
			// trace(StringUtil.substitute("roleID={0} monsterID={1}", rolePlayer.getId(), monster.getId()));
			this.setPartnerClickTarget(rolePlayer.getId(), monster);
			this.roleAttackMonster(rolePlayer, monster);
		}
		else {
			// trace("monster = null ----------------");
		}
	}

	//一个小伙伴找自己的攻击玩家
	private onePartnerFightPlayer(rolePlayer: Player): void {
		var meetList: Array<Player> = this._meetPlayerList;
		if (meetList.length == 0) {
			return;
		}
		var index: number = Math.ceil(Math.random() * meetList.length) - 1;
		if (index < 0) {
			index = 0;
		}
		var target: Player = meetList[index];
		// if (target == null) {
		// 	trace("--- onePartnerFightPlayer target = null");
		// }
		// else {
		// 	trace("--- onePartnerFightPlayer target.id = ", target.playerVo.id);
		// }
		// this.setPartnerClickTarget(rolePlayer.getId(), target);
		this.roleAttackPlayer(rolePlayer, target);
	}

	private addRole(id: string): void {
		if (this._role) {
			return;
		}
		this._role = this.getPlayer(id);
		this._model.setRolePos(new Point(this._role.x, this._role.y));
		this._role.playerVo.x = TileUtil.changeXToTile(this._role.x);
		this._role.playerVo.y = TileUtil.changeYToTile(this._role.y);
		this.addEventListener(SceneEvtName.WALK_START_NODE, this.roleWalkStartHandler, this);
		this._role.addEventListener(SceneEvtName.WALK_COMPLETE_NODE, this.roleWalkCompleteNodeHandler, this);
		this._role.addEventListener(SceneEvtName.WALK_COMPLETE, this.roleWalkCompleteHandler, this);
	}

	public addElement(displayObject: egret.DisplayObject): void {
		if (this._elementLayer.contains(displayObject)) {
			return;
		}
		this._elementLayer.addChild(displayObject);
		this._elementList.push(displayObject);
	}

	public addElementAt(displayObject: egret.DisplayObject, index: number): void {
		if (this._elementLayer.contains(displayObject)) {
			this._elementLayer.setChildIndex(displayObject, index);
			return;
		}
		this._elementLayer.addChildAt(displayObject, index);
		this._elementList.push(displayObject);
	}

	private _isStartRender: boolean;
	private n: number = 0;
	//场景上面的元素step统一控制
	private step(): void {
		if (!this._isStartRender) return;
		var i: any;
		var a = this;
		var extLength: number = 0;
		if (this._model.isPeopleBoss() || this._model.isRoundBoss()) {
			extLength = 800;
		}
		a.n++;
		if (a.n % 8 == 0) {
			a.sortElement(a.n);
		}
		//所有玩家处理
		var player: Player;
		var isHide: boolean = this._model.hideOhters;
		Scene.playNum = 0;
		for (i in a._playerDic) {
			player = a._playerDic[i];
			var use = player.playerVo.useType;
			if (player.parent || use == PlayerBaseVO.FIGHTER || use == PlayerBaseVO.HELP_FIGHTER) {
				player.step();
			}
			if (a.n % 4 == 0) {
				if (!player.playerVo.isRole) {
					if (a._model.checkInScreen(player.x, player.y, extLength)) {
						if (!player.parent && !isHide) {
							a.addElement(player);
						}
					}
					else {
						if (player.parent) {
							a.removeElement(player);
						}
					}
				}
			}
			//新手场景判断是否需要虚化
			if (a.n % 5 == 0) {
				if (a._model.isNoviceScene()) {
					if (player.GetIsRole()) {
						var grid: number = a._model.checkPixsXY(player.x, player.y);
						if (grid == TileUtil.ALPHA) {
							player.halfMask = true;
						}
						else {
							player.halfMask = false;
						}
					}
				}
			}
			Scene.playNum++;
		}
		var mon: Monster;
		Scene.monsterNum = 0;
		for (i in a._monsterDic) {
			mon = a._monsterDic[i];
			if (mon.parent) {
				mon.step();
			}
			//不是宝宝的怪物，每4帧判断一下是否需要添加到场景
			if (a.n % 4 == 0) {
				if (!mon.monsterVo.isPetMonster) {
					if (a._model.checkInScreen(mon.x, mon.y)) {
						if (!mon.parent && mon.monsterVo.typeId != 9000001) {
							a.addElement(mon);
						}
						else if (a.n % 4 == 0) {
							if (mon.monsterVo.typeId == 9000001) {
								a.addElementAt(mon, 0);
							}
						}
					}
					else {
						if (mon.parent) {
							a.removeElement(mon);
						}
					}
				}
			}
			Scene.monsterNum++;
		}
		var pet: Pet;
		var owner: Player;
		for (i in a._petDic) {
			pet = a._petDic[i];
			if (pet.parent) {
				pet.step();
			}
			if (a.n % 4 == 0) {
				owner = pet.getOwner();
				if (this._role != null && this._role.getVo() != null && owner != null && owner.getVo() != null && owner.getVo().pid != this._role.getVo().pid) {
					if (a._model.checkInScreen(pet.x, pet.y, extLength)) {
						if (!pet.parent && !isHide) {
							a.addElement(pet);
						}
					}
					else {
						if (pet.parent) {
							a.removeElement(pet);
						}
					}
				}
			}
			Scene.petNum++;
		}
		if (a.n % 48 == 0) {
			a.monsterRandomWalk();
		}
		a.roleChangePosition();
		a.scrollMap();
	}

	private sortElement(n: number): void {
		if (this._elementList == null)
			return;
		this.sortList2(this._elementList);
		var i: number = this._elementList.length;
		while (i--) {
			var element = this._elementList[i];
			if (this._elementLayer.contains(element) == false) continue;
			//9000001是城门怪
			if (is(element, "Monster") && (element as Monster).monsterVo.typeId == 9000001) {
				continue;
			}
			if (this._elementLayer.getChildIndex(element) != i && i < this._elementLayer.numChildren) {
				this._elementLayer.setChildIndex(element, i);
			}
		}
	}

	private sortList2(arr: Array<any>): void {
		var j: number = 0;
		while (j < arr.length - 1) {
			if (arr[j].y > arr[j + 1].y) {
				var tmp: any = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = tmp;
			}
			j++;
		}
	}

	private roleAttackMonster(player: Player, monster: Monster): boolean {
		if (this._model.isLock || !this._model.isStart) {
			return false;
		}
		if (this.checkRoleCanAttack(player) == false) {
			return false;
		}
		if (monster == null) {
			return false;
		}
		player.attackObj = { type: AttackType.MONSTER, id: monster.getId() };
		var point: Point = new Point(monster.x, monster.y);
		var attackDis: number = player.playerVo.getAttackRange();
		var circleNum: number = Point.distance(new Point(player.x, player.y), point) / attackDis;
		if (circleNum > 1) {
			var p: Point = this._model.findPoint(point);
			var range: number = 0;
			if (player == this._role || this._model.isHookSmall() || this._model.isMaterialFuBen()) {
				range = Math.floor(attackDis / TileUtil.STEP);
			}
			else {
				var randomAngle: number = 60;
				//不是自己角色的
				if (!player.playerVo.isRole) {
					randomAngle = 180;
				}
				p = this._model.getRandomPosByR(p, new Point(player.x, player.y), attackDis - 15, randomAngle);
			}
			if (p == null) {
				return false;
			}
			// traceByTime("------ roleAttackMonster roleMove");
			this.roleMove(player, p, range);
			return false;
		}
		//如果不大于怪物的范围，则开始攻击
		// traceByTime("------ roleAttackMonster 真的去攻击了");
		this.roleAttack(player, monster.getId(), AttackType.MONSTER);
		return true;
		// this._inRoleAttackFunc = false;
	}

	//判断主角状态是否可以攻击
	private checkRoleCanAttack(player: Player): boolean {
		if (player == null) {
			return false;
		}
		if (player.playerVo == null) {
			return false;
		}
		if (player.getPoseState() == null) {
			return false;
		}
		if (player.getPoseState().getState() == PoseState.DEAD) {
			return false;
		}
		return true;
	}

	private setPartnerClickTarget(partnerID: string, value: LiveThing): void {
		this._partnerClickTargetDic[partnerID] = value;
	}

	private getPartnerClickTarget(partnerID: string): LiveThing {
		return this._partnerClickTargetDic[partnerID];
	}

	//主角攻击玩家
	private roleAttackPlayer(rolePlayer: Player, target: Player): boolean {
		if (this._model.isLock == true || this._model.isStart == false) {
			return false;
		}
		if (this.checkRoleCanAttack(rolePlayer) == false) {
			return false;
		}
		//判断被攻击者状态
		if (target == null || target.playerVo == null || target.getPoseState() == null || !this._model.isCanPK(target.playerVo, false)) {
			return false;
		}
		var point: Point = new Point(target.x, target.y);
		var attackDis: number = rolePlayer.playerVo.getAttackRange();
		var circleNum: number = Point.distance(new Point(rolePlayer.x, rolePlayer.y), point) / attackDis;
		if (circleNum > 1) {
			var p: Point = this._model.findPoint(point);
			var range = Math.floor(attackDis / TileUtil.STEP);
			this.roleMove(rolePlayer, p, range);
			return false;
		}
		else {
			this.roleAttack(rolePlayer, target.getId(), AttackType.PARTNER);
			return true;
		}
	}

	//玩家移动,endScenePoint是像素坐标
	private roleMove(rolePlayer: Player, endScenePoint: Point, ranger: number = 1, isFly: boolean = false, isMoveLine: boolean = false): Point {
		if (rolePlayer == null || rolePlayer.getPoseState() == null) {
			return null;
		}
		if (this._model.getRolePos() == null || endScenePoint == null) {
			return null;
		}
		if (endScenePoint.x > this._model.sceneWidth || endScenePoint.x < 0 || endScenePoint.y > this._model.sceneHeight || endScenePoint.y < 0) {
			return null;
		}
		if (this._role == rolePlayer && TaskModel.getInstance().isNovicePlayer()) {
			this.showAutoFindRoad();
		}
		var rolePos: Point = new Point(rolePlayer.x, rolePlayer.y);
		var scenePath: Array<Point>
		if (this._model.isCanFind8Scene()) {
			var canMove: boolean = this._model.checkPointCanMove(endScenePoint);
			if (!canMove) {
				Message.show("该处不能行走");
				return;
			}
			scenePath = this._model.findPath(this._model.changeToTilePoint(rolePos), this._model.changeToTilePoint(endScenePoint));
			scenePath = this.changeToMapPath(scenePath);
		}
		if (scenePath == null || scenePath.length == 0) {
			// if (this._model.isMainCity()) {
			// 	Message.show("该位置不能到达")
			// 	return;
			// }
			scenePath = this._model.findLine(endScenePoint, ranger, isMoveLine, rolePos);
		}
		if (!rolePlayer.isPicking) {
			if (scenePath.length < 2) {
				return null;
			}
		}
		if (scenePath.length == 1 && rolePlayer.isPicking) {
			scenePath.push(endScenePoint);
		}
		scenePath.shift();
		var lastPoint: Point = scenePath[scenePath.length - 1];
		// traceByTime("------ scene roleMove len = " + scenePath.length);
		rolePlayer.movePath(scenePath);
		return lastPoint;
	}

	private roleAttack(rolePlayer: Player, targetID: any, type: number, skillId: number = 0): void {
		var state: number = rolePlayer.getPoseState().getState();
		if (this._model.isCityWarInner() && CityWarModel.getInstance().fightType == AttackType.PARTNER && state != PoseState.STAND) {
			rolePlayer.stopPath(false);
		}
		else {
			rolePlayer.stopPath();
		}
		rolePlayer.removeSpeak();
		if (rolePlayer == null) {
			return;
		}
		if (rolePlayer.isYun) {
			return;
		}
		if (rolePlayer.getPoseState().getState() == PoseState.DEAD) {
			return;
		}
		var id: string;
		var partnerID: string = rolePlayer.getId();
		var buffSi: number = this._buffDic[partnerID];
		if (buffSi > 0) {
			clearTimeout(buffSi);
		}
		if (type == AttackType.MONSTER) {
			id = targetID;
			var monster: Monster = this._monsterDic[id];
			if (monster != null) {
				this.setPartnerClickTarget(rolePlayer.getId(), monster);
				if (monster.getHp() > 0 || monster.monsterVo.monsterType > 0) {
					var fightEvent: FightEvent = new FightEvent(FightEvent.ATTACKMONSTER, { parnerID: partnerID, monsterId: id, monsterTypeId: monster.monsterVo.typeId });
					this._model.dispatchEvent(fightEvent);
					if (SceneModel.getInstance().isNoviceScene) {
						if (monster.monsterVo.typeId == this._targetMonster) {
							this.monsterToPartnerPoint(monster, this._role.getId());
						}
					}
				}
			}
		}
		else if (type == AttackType.PARTNER) {
			id = targetID;
			var player: Player = this.getPlayer(id);
			this.setPartnerClickTarget(rolePlayer.getId(), player);
			if (player != null && player.playerVo.getHp() > 0) {
				this._model.dispatchEvent(new FightEvent(FightEvent.ATTACKPLAYER, { partnerID: partnerID, target: id }));
			}
		}
		//只有在假打场景中，才在这里循环打怪或者PK
		if (this._model.isHookSmall() || this._model.isNoviceScene()) {
			this.continueFight(rolePlayer);
		}
	}

	//启动定时器进行攻击
	private continueFight(role: Player): void {
		if (role == null) {
			return;
		}
		var partnerID: string = role.getId();
		var attackSi: number = this._roleNextAttackSiDic[partnerID];
		if (attackSi > 0) {
			clearTimeout(attackSi);
		}
		attackSi = setTimeout2((role: Player) => {
			if (RoleModel.getInstance().isMyPartner(role.getId()) || role.playerVo.useType == PlayerBaseVO.HELP_FIGHTER) {
				this.roleAttackClickTarget(role);
			}
			else {
				if (MeetPlayerModel.getInstance().fightMPID > 0) {
					this.meetPlayerAttackTarget(role);
				}
			}
		}, 470, role);
		this._roleNextAttackSiDic[partnerID] = attackSi;
	}

	//在玩家字典中获取
	public getPlayer(id: string): Player {
		if (this._playerDic == null) return null;
		if (RoleModel.getInstance().getRoleBaseInfo() == null) return null;
		if (id == RoleModel.getInstance().getRoleBaseInfo().uid && this._role) {
			return this._role;
		}
		else if (this._playerDic[id] != undefined) {
			return this._playerDic[id];
		}
		return null;
	}
	//在NPC字典中获取
	public getNpc(id: number): Npc {
		if (this._npcDic == null) return null;
		else if (this._npcDic[id] != undefined) {
			return this._npcDic[id];
		}
		return null;
	}
	//在宠物字典中获取
	private getPet(id: string): Pet {
		if (this._petDic == null) return null;
		if (RoleModel.getInstance().getRoleBaseInfo() == null) return null;
		if (this._petDic[id] != undefined) {
			return this._petDic[id];
		}
		return null;
	}

	private changeToMapPath(path: Array<Point>): Array<Point> {
		if (path == null || path.length == 0) {
			return null;
		}
		var newPath: Array<Point> = new Array();
		for (var i: number = 0; i < path.length; i++) {
			var point: Point = path[i];
			if (point != null) {
				newPath.push(this._model.changeToPixsPoint(point));
			}
		}
		return newPath;
	}

	private addPlayer(playerVo: PlayerBaseVO): Player {
		if (this._role == null) {
			return;
		}
		var player: Player = this.getPlayer(playerVo.uid);
		if (player != null && playerVo.uid != this._role.getId()) {//重生
			this.removePlayer(playerVo.uid);
		}
		player = this.makePlayer(playerVo);
		this._playerDic[playerVo.uid] = player;
		var realPoint: Point = this._model.changeToPixsPoint(new Point(playerVo.x, playerVo.y));
		realPoint = this._model.changeToRightPoint(realPoint);
		player.x = realPoint.x;
		player.y = realPoint.y;
		player.setPlayerVo(playerVo);
		player.addEventListener(SceneEvtName.DEAD, this.playerDeadHandler, this);
		// player.getPoseState().addEventListener(PoseState.CHANGE, this.playerStateChangeHandler, this);
		//如果是遭遇到的假人，就一直播放攻击动作
		var useType = playerVo.useType;
		if (useType == PlayerBaseVO.VIRTUAL) {
			player.toAttack();
			player.dirToPoint(new Point(player.x + 50, player.y + 30));
		}
		else if (useType == PlayerBaseVO.MEET) {
			player.addEventListener(SceneEvtName.WALK_COMPLETE_NODE, this.rolePosChange, this);
			player.addEventListener(SceneEvtName.WALK_COMPLETE, this.meetPlayerWalkComplete, this);
			this._meetPlayerList.push(player);
		}
		else if (useType == PlayerBaseVO.FIGHTER || useType == PlayerBaseVO.HELP_FIGHTER) {
			player.addEventListener(SceneEvtName.WALK_COMPLETE, this.helpFighterWalkComplete, this);
			var target: Monster = this.findBoss();
			this.roleAttackMonster(player, target);
		}
		this.addElement(player);
		return player;
	}

	private removePlayer(id: string): void {
		var player: Player = this.getPlayer(id);
		if (player == null) {
			return;
		}
		this.isPartnerRemoveTarget(id);
		if (this._petMonsterTarget == player) {
			this._petMonsterTarget = null;
		}
		player.removeEventListener(SceneEvtName.DEAD, this.playerDeadHandler, this);
		player.removeEventListener(EventName.ZSCZ_FINISH, this.roleZSCZHandler, this);
		player.removeEventListener(EventName.ROLE_POS_CHANGE, this.rolePosChange, this);
		player.removeEventListener(SceneEvtName.WALK_COMPLETE, this.helpFighterWalkComplete, this);
		player.getPoseState().removeEventListener(PoseState.CHANGE, this.playerStateChangeHandler, this);
		player.getPoseState().removeEventListener(PoseState.CHANGE, this.roleStateChangeHandler, this);
		player.removeEventListener(SceneEvtName.WALK_COMPLETE_NODE, this.roleWalkCompleteNodeHandler, this);
		player.removeEventListener(SceneEvtName.WALK_COMPLETE, this.roleWalkCompleteHandler, this);
		player.removeEventListener(SceneEvtName.WALK_COMPLETE, this.meetPlayerWalkComplete, this);
		this.removeElement(player);
		var n: number = this._myPartnerList.indexOf(player);
		if (n > -1) {
			this._myPartnerList.splice(n, 1);
		}
		n = this._meetPlayerList.indexOf(player);
		if (n > -1) {
			this._meetPlayerList.splice(n, 1);
		}
		player.clear();
		// player.dispose();
		// this._gameDispatcher.dispatchEvent(new ParamEvent(SceneEvtName.PLAYER_DEAD, { data: player.playerVo }));
		delete this._playerDic[id];
	}
	private removeAllNpc(): void {
		var a = this;
		var npc: Npc;
		var idList: Array<number> = new Array();
		for (var i: number = 0; i < a._npcList.length; i++) {
			npc = a._npcList[i];
			idList.push(npc.npcVo.template_id);
		}
		for (i = 0; i < idList.length; i++) {
			a.removeNpc(idList[i]);
		}
		a._npcList = new Array();
	}
	private removeNpc(id: number): void {
		var a = this;
		var npc: Npc = this._npcDic[id];
		if (npc == null) {
			return;
		}
		var index: number = this._npcList.indexOf(npc);
		if (index >= 0) {
			this._npcList.splice(index, 1);
		}
		this.removeElement(npc);
		npc.dispose();
		delete this._npcDic[id];
	}
	private removeAllPet(): void {
		if (!this._petList) {
			return;
		}
		var pet: Pet;
		var idList: Array<string> = new Array();
		var i: number;
		for (i = 0; i < this._petList.length; i++) {
			pet = this._petList[i];
			idList.push(pet.getId());
		}
		for (i = 0; i < idList.length; i++) {
			this.removePet(idList[i]);
		}
		this._petList = new Array();

	}
	private removePet(id: string): void {
		var pet: Pet = this.getPet(id);
		if (pet == null) {
			return;
		}
		var index: number = this._petList.indexOf(pet);
		if (index >= 0) {
			this._petList.splice(index, 1);
		}
		this.removeElement(pet);
		pet.clear();
		// player.dispose();
		delete this._petDic[id];
	}

	//判断伙伴是否需要移除自己选中的目标
	private isPartnerRemoveTarget(id: any): void {
		var n: any;
		var live: LiveThing;
		for (n in this._partnerClickTargetDic) {
			live = this._partnerClickTargetDic[n];
			if (live && live.getId() == id) {
				delete this._partnerClickTargetDic[n];
				var player: Player = this.getPlayer(n);
				if (player) {
					player.stopZSCZEffect();
				}
			}
		}
	}

	//玩家死掉
	private playerDeadHandler(e: ParamEvent): void {
		var player: Player = e.currentTarget as Player;
		var id: string = player.getId();
		if (this._model.isClientHunZhan()) {
			//判断移除的玩家是否是真实形象的
			var vo: PlayerBaseVO = this._model.getPlayer(id);
			if (vo && vo.isRealFigure) {
				this._model.removeOneRealFigure();
			}
		}
		this._model.removePlayer(id);
		if (player.playerVo.useType == PlayerBaseVO.MEET) {
			if (this._model.checkMeetPlayerFinish()) {
				this.clearMeetPlayer();
				this._gameDispatcher.dispatchEvent(new ParamEvent(MeetPlayerEvtName.REQUEST_13301, { result: 1 }));
			}
			else {
				this.rolesAutoFightPlayer();
			}
			if (this._petMonsterTarget = player) {
				this._petMonsterTarget = null;
			}
		}
	}

	private roleWalkStartHandler(e: ParamEvent): void {
		var path: Array<Point> = e.data.path;
		if (path.length < 1) return;
		this._model.dispatchEvent(new ParamEvent(SceneEvtName.WALK_START, { path: path }));
	}

	private roleWalkCompleteNodeHandler(e: ParamEvent): void {
		this.roleChangePosition();
		if (MeetPlayerModel.getInstance().gotoFightMeetPlayerID > 0) {
			this._gameDispatcher.dispatchEvent(new ParamEvent(EventName.ROLE_POS_CHANGE));
		}
		else {
			var rolePlayer: Player = e.target;
			if (rolePlayer == null) {
				return;
			}
			var walkTimes: number = 0;
			if (this._walkTimesDic[rolePlayer.getId()]) {
				walkTimes = this._walkTimesDic[rolePlayer.getId()];
			}
			if (this._role == rolePlayer) {
				this.roleChangePosition();
				if (this._isClickMap) {
					if (walkTimes % 15 == 0) {
						this.allSmallMonFollowRole(rolePlayer.getId());
					}
				}
			}
			if (walkTimes % 4 == 0 && !this._isClickMap && this._clickTarget == null) {
				// traceByTime("--------- roleWalkCompleteNodeHandler");
				this.roleAttackClickTarget(rolePlayer);
			}
			walkTimes++;
			if (walkTimes > 99999999) {
				walkTimes = 0;
			}
			this._walkTimesDic[rolePlayer.getId()] = walkTimes;
		}
	}

	//找找有没有怪物的攻击目标是对应的玩家id
	private allSmallMonFollowRole(id: string): void {
		var a = this;
		for (var n in a._monsterDic) {
			var mon: Monster = a._monsterDic[n];
			if (mon.monsterVo.isPetMonster) {
				continue;
			}
			if (mon.monsterVo.useType == MonsterVO.VIRTUAL) {
				continue;
			}
			if (mon.monsterVo.monsterType == MonsterVO.MEET_BOSS) {
				if (!this._model.toFightBossMeet) {
					continue;
				}
			}
			a.monsterToPartnerPoint(mon, id);
		}
	}

	private roleChangePosition(): void {
		if (this._role == null) {
			return;
		}
		this._model.setRolePos(new Point(this._role.x, this._role.y));
		this._role.playerVo.x = TileUtil.changeXToTile(this._role.x);
		this._role.playerVo.y = TileUtil.changeYToTile(this._role.y);
		var list: Array<Player> = this._myPartnerList;
		var p: Player;
		for (var i: number = 0; i < list.length; i++) {
			p = list[i];
			if (p != this._role) {
				p.playerVo.x = TileUtil.changeXToTile(p.x);
				p.playerVo.y = TileUtil.changeYToTile(p.y);
			}
		}
	}

	//自己的角色走完路了去打人
	private roleWalkCompleteHandler(e: ParamEvent): void {
		var rolePlayer: Player = e.target;
		var a = this;
		if (this._role == rolePlayer) {
			this._isClickMap = false;
			this.roleChangePosition();
			a.removeAutoFindRoad();
		}
		if (a._model.isMainCity() && a._role == rolePlayer) {
			var px: number = TileUtil.changeXToTile(this._role.x);
			var py: number = TileUtil.changeYToTile(this._role.y);
			a.dispatchEvent(new ParamEvent(SceneEvtName.WALK_START_NODE, { path: [new Point(px, py)] }));
		}
		if (a._clickTarget instanceof Npc) {
			a.roleTalkToNPC((a._clickTarget as Npc), 2);
			return;
		}
		if (CityWarModel.getInstance().fightType == 0 && this._model.isCityWarInner() && !CityWarModel.getInstance().isCaiQi) {
			if (this._role) {
				this.randomRunHandler(null);
			}
		}
		else {
			// traceByTime("-------- roleWalkCompleteHandler");
			this.roleAttackClickTarget(rolePlayer);
		}
	}

	//遭遇玩家走完路去打人
	private meetPlayerWalkComplete(event: ParamEvent): void {
		var mp: Player = event.target;
		this.meetPlayerAttackTarget(mp);
	}

	//计算怪物到某个伙伴的行走路径的终点
	private monsterToPartnerPoint(monster: Monster, partnerID: string, angleParam: number = 0) {
		if (monster == null) {
			return;
		}
		var player: Player = this.getPlayer(partnerID);
		if (player == null) {
			return;
		}
		if (monster.monsterVo.monsterType == MonsterVO.MEET_BOSS) {
			if (!this._model.toFightBossMeet) {
				return;
			}
		}
		var attackDis: number = 100;
		var curPos: Point = new Point(monster.x, monster.y);
		var dis: number = Point.distance(curPos, new Point(player.x, player.y));
		monster.attackObj = { type: AttackType.PARTNER, id: partnerID };
		if (dis < attackDis) {
			this.monsterAttack(monster, { type: AttackType.PARTNER, id: partnerID });
		}
		else {
			var angle: number = Math.atan2(monster.y - player.y, monster.x - player.x) + angleParam;
			var endPoint: Point = new Point()
			endPoint.x = Math.floor(player.x + Math.cos(angle) * 60);
			endPoint.y = Math.floor(player.y + Math.sin(angle) * 60);
			endPoint = this._model.changeToRightPoint(endPoint);
			var scenePath: Array<Point> = this._model.findLine(endPoint, 1, true, curPos);
			scenePath.shift();
			monster.movePath(scenePath);
		}
	}

	// private rolePosChangeHandler(event: ParamEvent): void {
	// 	if (this._role) {
	// 		this._role.x = this._model.getRolePos().x;
	// 		this._role.y = this._model.getRolePos().y;
	// 	}
	// }

	private _oldPos: Point;
	private focusPosChangeHandler(event: ParamEvent): void {
		var focusPos: Point = this._model.getFocusPos();
		if (this._oldPos == null || Point.distance(this._oldPos, focusPos) >= 100) {
			this._map.update();
			this._oldPos = focusPos.clone();
		}
		if (this._map.getIsTweenScroll()) {
			// if (this._map.getPositionChanged()) {
			// 	this._map.setPositionChanged(true);
			// }
			this._map.setPositionChanged(true);
		}
	}

	private scrollMap(): void {
		this._map.scroll();
	}


	private getMonsterById(id: number): Monster {
		var monster: Monster = this._monsterDic[id];
		return monster;
	}

	private addMonsterHandler(e: ParamEvent): void {
		this.addMonster(e.data as MonsterVO);
	}

	private removeMonsterHandler(e: ParamEvent): void {
		this.removeMonster(e.data.id);
	}

	private addMonster(monsterVo: MonsterVO): void {
		if (this._monsterDic == null || this._monsterDic == undefined) {
			this._monsterDic = new Object();
		}
		if (this._monsterDic[monsterVo.id] != undefined) { //重生
			this.removeMonster(monsterVo.id);
		}
		// var monster: Monster = new Monster(monsterVo);
		var monster: Monster = this.makeMonster(monsterVo.useType);
		monster.setMonsterVo(monsterVo);
		this._monsterDic[monsterVo.id] = monster;
		var bornPoint: Point = new Point();
		bornPoint.x = TileUtil.changeXToPixs(monsterVo.x);
		bornPoint.y = TileUtil.changeYToPixs(monsterVo.y);
		bornPoint = this._model.changeToRightPoint(bornPoint);
		monster.x = bornPoint.x;
		monster.y = bornPoint.y;
		monster.addEventListener(SceneEvtName.DEAD, this.monsterDeadHandler, this);
		monster.addEventListener(EventName.MONSTERATTACK, this.monsterAttackHandler, this);
		monster.addEventListener(EventName.MONSTERMOVEBACK, this.monsterMoveBackHandler, this);
		monster.addEventListener(SceneEvtName.WALK_COMPLETE_NODE, this.monsterWalkNodeHandler, this);
		monster.addEventListener(SceneEvtName.WALK_COMPLETE, this.monsterWalkComplete, this);
		this.addElement(monster);
		monster.redraw();
		if (monsterVo.path != null) {
			monster.movePath(monsterVo.path.concat());
		}
		if (monsterVo.useType == MonsterVO.VIRTUAL) {
			monster.dirToPoint(new Point(monster.x - 50, monster.y - 50));
		}
		if (this._model.isHookSmall() && monster.monsterVo.useType != MonsterVO.VIRTUAL) {
			if (this._role) {
				this.monsterToPartnerPoint(monster, this._role.getId());
			}
		}
	}

	//客户端控制怪物攻击
	private monsterAttackHandler(event: ParamEvent): void {
		var mon: Monster = event.currentTarget;
		var attackObj: Object = event.data;
		this.monsterToPartnerPoint(mon, attackObj["id"]);
	}
	private monsterAttack(mon: Monster, attackObj: Object): void {
		var targetID: any = attackObj["id"];
		var type: number = attackObj["type"];
		var target: LiveThing = this.getLiveThing(type, targetID);
		if (target == null) {
			return;
		}
		mon.dirToPoint(new Point(target.x, target.y));
		mon.toAttack();
		var angle: number = Math.atan2(target.y - mon.y, target.x - mon.x);
		var damage: number = PropertyUtil.calculateDamage(mon.getVo().propertyVo, target.getVo().getPropertyVo(), 0, 0);
		var isShowDamage: boolean = false;
		if (type == AttackType.PARTNER && RoleModel.getInstance().isMyPartner(targetID)) {
			isShowDamage = true;
		}
		SceneImageManager.getInstance().showDamage(this._imageTxtLayer, damage, target.x, target.y + target.getBodyHeight() / 2, angle, 0, isShowDamage);
	}

	//怪物被击退后，继续追击玩家
	private monsterMoveBackHandler(event: ParamEvent): void {
		var mon: Monster = event.currentTarget;
		if (mon.attackObj) {
			this.monsterToPartnerPoint(mon, mon.attackObj["id"]);
		}
	}

	//获取场景中的活物，一般是玩家或者怪物
	private getLiveThing(type: number, id: any): LiveThing {
		var target: LiveThing;
		switch (type) {
			case AttackType.PARTNER:
				target = this.getPlayer(id);
				break;
			case AttackType.MONSTER:
				target = this.getMonsterById(id);
				break;
		}
		return target;
	}

	private monsterDeadHandler(e: ParamEvent): void {
		var monster: Monster = e.target as Monster;
		if (monster) {
			var monType: number = monster.monsterVo.monsterType;
			var dropInfo: Array<NodeDrop_list> = monster.monsterVo.dropInfo;
			if (dropInfo) {
				this._model.setDropList(dropInfo, new Point(monster.x, monster.y));
				//遭遇boss要打开领取奖励界面
				if (monType > MonsterVO.SMALL) {
					this._gameDispatcher.dispatchEvent(new ParamEvent(EventName.SHOW_FR_SUCCESS, { list: dropInfo }));
				}
			}
			if (SceneModel.getInstance().isNoviceScene()) {
				TaskModel.getInstance().killMonsterAddCount(monster.monsterVo.typeId);
				this._targetMonster = 0;
			}
			this._model.removeMonster(monster.getId());
		}
	}

	private removeMonster(id: number): void {
		this.isPartnerRemoveTarget(id);
		if (this._monsterDic[id] == undefined)
			return;
		var monster: Monster = this._monsterDic[id];
		if (this._moveBackSiDic[id]) {
			clearTimeout(this._moveBackSiDic[id]);
		}
		monster.removeEventListener(SceneEvtName.DEAD, this.monsterDeadHandler, this);
		monster.removeEventListener(EventName.MONSTERATTACK, this.monsterAttackHandler, this);
		monster.removeEventListener(EventName.MONSTERMOVEBACK, this.monsterMoveBackHandler, this);
		monster.removeEventListener(SceneEvtName.WALK_COMPLETE_NODE, this.monsterWalkNodeHandler, this);
		monster.removeEventListener(SceneEvtName.WALK_COMPLETE, this.monsterWalkComplete, this);
		this.removeElement(monster);
		monster.clear();
		delete this._monsterDic[id];
		if (this._petMonsterTarget == monster) {
			this._petMonsterTarget = null;
			if (this._petMonster) {
				if (this._petMonsterTarget == null) {
					monster = this.findNoBelongMonster(this._petMonster.ownerID);
					this._petMonsterTarget = monster;
				}
				this.petMonsterAttack();
			}
		}
		// monster.dispose();
		monster = null;
	}

	private monsterWalkNodeHandler(event: ParamEvent): void {
		if (!this._model.isHookSmall()) {
			return;
		}
		var monster: Monster = event.target as Monster;
		var roleObj: Object = monster.attackObj;
		if (roleObj) {
			var id: string = roleObj["id"];
			var walkTimes: number = 0;
			if (this._walkTimesDic[monster.getId()]) {
				walkTimes = this._walkTimesDic[monster.getId()];
			}
			if (walkTimes % 4 == 0) {
				this.monsterToPartnerPoint(monster, id);
			}
			walkTimes++;
			if (walkTimes > 99999999) {
				walkTimes = 0;
			}
			this._walkTimesDic[monster.getId()] = walkTimes;
		}
	}
	private monsterWalkComplete(event: ParamEvent): void {
		if (this._model.isHookSmall() || this._model.isMaterialFuBen()) {
			var mon: Monster = event.target;
			if (this._role) {
				this.monsterToPartnerPoint(mon, this._role.getId());
			}
		}
	}

	//假打，客户端自己做效果
	private _processSKillID: number = 0;//过程特效的技能ID
	public playFight(playerID: string, monsterID: number, skillId: number): void {
		var attacker: Player = this._playerDic[playerID];
		var hitter: Monster = this._monsterDic[monsterID];
		if (attacker == null || hitter == null) {
			return;
		}
		var list: Array<FightVo> = this.makeFightList(attacker.getId(), monsterID, skillId, AttackType.MONSTER);
		this.playFight2(attacker, hitter, skillId, list);
	}

	//假打，遭遇PK
	public playFightPlayer(attackID: string, target: string, skillID: number): void {
		var attacker: Player = this._playerDic[attackID];
		var hitter: Monster = this._playerDic[target];
		if (attacker == null || hitter == null) {
			return;
		}
		var list: Array<FightVo> = this.makeFightList(attacker.getId(), target, skillID, AttackType.PARTNER);
		this.playFight2(attacker, hitter, skillID, list);
	}

	private playFight2(attacker: LiveThing, hitter: LiveThing, skillId: number, list: Array<FightVo>): void {
		if (attacker == null || hitter == null) {
			return;
		}
		attacker.dirToPoint(new Point(hitter.x, hitter.y));
		attacker.toAttack(skillId, null, hitter);
		var skillEffectVo: SkillEffectVo = this._skillManager.getSKillEffect(skillId);
		if (skillEffectVo && skillEffectVo.eff1Delay > 0) {
			if (this._playMovieDic[attacker.getId()]) {
				clearTimeout(this._playMovieDic[attacker.getId()]);
			}
			var si: number = setTimeout2((attacker, hitter, skillId, list) => {
				this.playFightMovie(attacker, hitter, skillId, list);
				delete this._playMovieDic[attacker.getId()];
			}, skillEffectVo.eff1Delay, attacker, hitter, skillId, list);
			this._playMovieDic[attacker.getId()] = si;
		}
		else {
			this.playFightMovie(attacker, hitter, skillId, list);
		}
	}

	//根据服务端的数据，真打
	public playRealFight(scmd: SCMD10700): void {
		var attack: LiveThing;
		var skillVo: SkillVo = SkillModel.getInstance().getSkill(scmd.skill_id);
		var attackUid = PlayerBaseVO.makeUid(scmd.plat_name, scmd.att_id);
		switch (scmd.type) {
			case AttackType.PARTNER:
				attack = this.getPlayer(attackUid);
				//攻击者是玩家，但是没有结果列表的，就重新找目标去打
				if (this._model.isCityWarFrontPalace() || this._model.isCityWarPalace()) {
					if (scmd.battle_result.length == 0) {
						if (RoleModel.getInstance().isMyPartner(attackUid)) {
							this.rolesFightRealPlayer((attack as Player));
						}
						return;
					}
				}
				//真打的场景，在收到返回的协议后才重新启动去打
				if (attack) {
					if (RoleModel.getInstance().isMyPartner(attackUid) || attack.getVo().useType == PlayerBaseVO.HELP_FIGHTER) {
						this.continueFight(attack as Player);
					}
				}
				break;
			case AttackType.MONSTER:
				attack = this.getMonsterById(scmd.att_id);
				break;
		}
		if (skillVo == null || attack == null) {
			return;
		}
		var node: NodeBattle_result;
		var fightVo: FightVo;
		var list: Array<FightVo> = new Array();
		var hitter: LiveThing;
		for (var i: number = 0; i < scmd.battle_result.length; i++) {
			node = scmd.battle_result[i];
			fightVo = new FightVo();
			fightVo.hitterType = node.obj_type;
			switch (node.obj_type) {
				case AttackType.PARTNER:
					var uid: string = PlayerBaseVO.makeUid(node.plat_name, node.obj_id);
					fightVo.hitter = this.getPlayer(uid);
					break;
				case AttackType.MONSTER:
					fightVo.hitter = this.getMonsterById(node.obj_id);
					break;
			}
			if (fightVo.hitter == null) {
				continue;
			}
			fightVo.hurt = node.hurt;
			fightVo.leftHp = node.hp;
			fightVo.leftType = node.type;
			// trace(StringUtil.substitute("node.obj_id = {0} node.type = {1} value = {2}", node.obj_id, node.type, node.hp));
			if (i == 0) {
				hitter = fightVo.hitter;
			}
			list.push(fightVo);
			/****************攻城战特殊处理*********************/
			if (!this._model.isCityWarInner()) {
				continue;
			}
			//如果攻击者或者防守者是自己的伙伴就忽略
			var defenceUid = PlayerBaseVO.makeUid(node.plat_name, node.obj_id);
			if (this._roleModel.getPartnerInfo(attackUid) != null || this._roleModel.getPartnerInfo(defenceUid) != null) {
				continue;
			}
			//如果攻击者或者防守者是在攻城战中和自己正在PK的人就忽略
			if (attack.getBelongID() == CityWarModel.getInstance().fightID && this._roleModel.getPartnerInfo(defenceUid) != null) {
				continue;
			}
			if (fightVo.hitter == null || (attack.getBelongID() == this._roleModel.getRoleBaseInfo().pid && fightVo.hitter.getBelongID() == CityWarModel.getInstance().fightID)) {
				continue;
			}
			var newPos: Point;
			var monDis: number = 155;
			var playerDis: number = 220;
			//只处理人攻击的情况
			if (scmd.type == AttackType.PARTNER) {
				//人打怪,怪物在屏幕中，人要瞬移,因为怪物肯定是不会动的
				if (node.obj_type == AttackType.MONSTER) {
					if (Point.distance(new Point(attack.x, attack.y), new Point(fightVo.hitter.x, fightVo.hitter.y)) <= monDis) {
						continue;
					}
					if (this._model.checkInScreen(fightVo.hitter.x, fightVo.hitter.y) || this._model.checkInScreen(attack.x, attack.y)) {
						newPos = this._model.getRandomPointOfRound(new Point(fightVo.hitter.x, fightVo.hitter.y), monDis);
						attack.x = newPos.x;
						attack.y = newPos.y;
						attack.getVo().x = TileUtil.changeXToTile(newPos.x);
						attack.getVo().y = TileUtil.changeYToTile(newPos.y);
					}
				}
				//人打人
				else if (node.obj_id == AttackType.PARTNER) {
					if (this._role == null) {
						continue;
					}
					//攻击者不在屏幕中，就拉进来
					if (!this._model.checkInScreen(attack.x, attack.y, 100)) {
						playerDis = 300 + Math.random() * 100;
						newPos = this._model.getRandomPointOfRound(new Point(this._role.x, this._role.y), playerDis);
						attack.x = newPos.x;
						attack.y = newPos.y;
						attack.getVo().x = TileUtil.changeXToTile(newPos.x);
						attack.getVo().y = TileUtil.changeYToTile(newPos.y);
					}
					if (!this._model.checkInScreen(fightVo.hitter.x, fightVo.hitter.y, 100)) {
						playerDis = 220;
						newPos = this._model.getRandomPointOfRound(new Point(attack.x, attack.y), playerDis);
						fightVo.hitter.x = newPos.x;
						fightVo.hitter.y = newPos.y;
						fightVo.hitter.getVo().x = TileUtil.changeXToTile(newPos.x);
						fightVo.hitter.getVo().y = TileUtil.changeYToTile(newPos.y);
					}
				}
			}
		}
		this.playFight2(attack, hitter, scmd.skill_id, list);
	}

	//客户端假打的战斗播放列表
	private makeFightList(partnerID: string, targetID: any, skillId: number, type: number): Array<FightVo> {
		var result: Array<FightVo> = new Array();
		var fVo: FightVo;
		var skillInfo: NodeSkill = RoleModel.getInstance().getPartnerSkillInfo(partnerID, skillId);
		if (skillInfo == null) {
			return null;
		}
		var attExt: number = SkillModel.getInstance().getSkillAttackExt(skillId, skillInfo.level);
		var targetList: Array<LiveThing>;
		if (type == AttackType.MONSTER) {
			targetList = this.getMonsterListBySkill(partnerID, skillId, targetID);
		}
		else if (type == AttackType.PARTNER) {
			targetList = this.getPlayerListBySkill(partnerID, skillId, targetID);
		}
		var player: Player = this.getPlayer(partnerID);
		var target: LiveThing;
		for (var i: number = 0; i < targetList.length; i++) {
			target = targetList[i];
			fVo = new FightVo();
			fVo.hitter = target;
			fVo.hitterType = type;
			var damage: number = PropertyUtil.calculateDamage(player.playerVo.getPropertyVo(), target.getPropertyVo(), attExt, 0);
			fVo.hurt = damage;
			fVo.leftHp = target.getHp() - damage;
			result.push(fVo);
		}
		return result;
	}

	//播放打架效果
	private playFightMovie(attacker: LiveThing, hitter: LiveThing, skillId: number, fightList: Array<FightVo>): void {
		if (!hitter || !attacker) {
			return;
		}
		var skillEffectVo: SkillEffectVo = this._skillManager.getSKillEffect(skillId);
		//道士召唤宝宝技能
		if (SkillModel.getInstance().isCallPetSkill(skillId)) {
			if (this._callPetMonsterSi > 0) {
				clearTimeout(this._callPetMonsterSi);
			}
			var kurl: string = UrlUtil.getSkillEffectURL(skillEffectVo.eff1);
			EffectManager.getInstance().showEffect(kurl, attacker.x - 40, attacker.y + 60, this._effectLayer);
			this._callPetMonsterSi = setTimeout2(() => { this.callPetMonster(); }, skillEffectVo.eff1Delay);
			return;
		}
		if (skillEffectVo == null && skillId != 200001) {
			Message.show("没有找到技能效果配置：id = " + skillId);
			return;
		}
		var url: string;
		var px: number = 0;
		var py: number = 0;
		var container: any;
		var angle: number;
		var p: Point;
		if (skillEffectVo) {
			switch (skillEffectVo.type) {
				case SkillEffectVo.PROCESS:
					this._processSKillID = skillId;
					this.playHuoQiu(attacker, hitter, skillEffectVo.speed, skillEffectVo);
					break;
				case SkillEffectVo.SELF:
					url = UrlUtil.getSkillEffectURL(skillEffectVo.eff1);
					if (skillEffectVo.pos == SkillEffectVo.POS_SCENE) {
						if (skillEffectVo.id == 103004) {
							EffectManager.getInstance().showEffect(url, attacker.x + skillEffectVo.off1.x, attacker.y + skillEffectVo.off1.y, this._effectLayer, 120);
						}
						else {
							EffectManager.getInstance().showEffect(url, attacker.x + skillEffectVo.off1.x, attacker.y + skillEffectVo.off1.y, this._effectLayer);
						}
					}
					else {
						switch (skillEffectVo.pos) {
							case SkillEffectVo.POS_BODY:
								py = -attacker.getBodyHeight() / 2;
								break;
							case SkillEffectVo.POS_FOOT:
								py = 0;
								break;
							case SkillEffectVo.POS_HEAD:
								py = -attacker.getBodyHeight();
								break;
						}
						if (skillId != 101004 && skillId != 101009) {
							var sDelay: number = 70;
							var isLook: boolean = true;
							attacker.playSkillEffect(url, skillEffectVo.off1.x + px, skillEffectVo.off1.y + py, sDelay, isLook);
						}
					}
					break;
				case SkillEffectVo.TARGET:
					this.playTargetEffect(skillEffectVo, hitter, true);
					if (skillEffectVo.eff2 != "" && skillEffectVo.eff2 != "0") {
						this.playTargetEffect(skillEffectVo, hitter)
					}
					break;
				case SkillEffectVo.TARGET_SELF://这里的分支暂时只有战士用···
					if (skillEffectVo.id == 101003 || skillEffectVo.id == 101008) {
						//战士的连月技能特殊点，放在自己身上，但是不用方向
						this.playTargetEffect(skillEffectVo, attacker, true);
					}
					else {
						var tmpdir: Object = this._skillManager.getSkillEffectDir(attacker.x, attacker.y, hitter.x, hitter.y);
						this.playTargetEffect(skillEffectVo, attacker, true, tmpdir);
						if (skillEffectVo.eff2Delay > 0) {
							if (this._zhanshiSkillSi > 0) {
								clearTimeout(this._zhanshiSkillSi);
							}
							this._zhanshiSkillSi = setTimeout2((skillEffectVo: SkillEffectVo, hitter: LiveThing) => { this.playTargetEffect(skillEffectVo, hitter) }, 250, skillEffectVo, hitter);
						}
						else {
							this.playTargetEffect(skillEffectVo, hitter);
						}
					}
					break;
				case SkillEffectVo.SELF_ALL:
					this.playTargetEffect(skillEffectVo, attacker, true);
					if (this._zhanJiaSi > 0) {
						clearTimeout(this._zhanJiaSi);
					}
					this._zhanJiaSi = setTimeout2((skillEffectVo: SkillEffectVo) => { this.playAllPartnerZhanJiaEffect(skillEffectVo); }, skillEffectVo.eff2Delay, skillEffectVo);
					break;
				case SkillEffectVo.PARTNERS:
					var target: Player = this.getRandomPartner();
					if (target == null) {
						return;
					}
					switch (skillEffectVo.pos) {
						case SkillEffectVo.POS_BODY:
							py = -target.getBodyHeight() / 2;
							break;
						case SkillEffectVo.POS_FOOT:
							py = 0;
							break;
						case SkillEffectVo.POS_HEAD:
							py = -target.getBodyHeight();
							break;
					}
					var sDelay: number = 70;
					var isLook: boolean = true;
					url = UrlUtil.getSkillEffectURL(skillEffectVo.eff1);
					target.playSkillEffect(url, skillEffectVo.off1.x + px, skillEffectVo.off1.y + py, sDelay, isLook);
					break;
			}
		}
		//战士的冲撞
		if (skillId == 101004 || skillId == 101009) {
			p = new Point();//人的路径终点
			var mp: Point = new Point();//怪物的终点
			angle = Math.atan2(hitter.y - attacker.y, hitter.x - attacker.x);
			p.x = attacker.x + Math.cos(angle) * 250;
			p.y = attacker.y + Math.sin(angle) * 250;
			p = this._model.changeToRightPoint(p);
			var mePos: Point = new Point(attacker.x, attacker.y)
			var dis: number = Point.distance(p, mePos);
			var effectAngle: number = Math.atan2(hitter.y - attacker.y, hitter.x - attacker.x) * 180 / Math.PI + 90;
			attacker.getVo().setSpeed(320);
			attacker.setSpeed(320);
			var effect: UIEffect = EffectManager.getInstance().showEffect(url, skillEffectVo.off1.x, skillEffectVo.off1.y + py, attacker, 70, true, false, dis * (1200 / attacker.getVo().getSpeed()));
			effect.setRotation(effectAngle);
			attacker.setZSCZEff(effect);
			// if (this._model.isHookSmall() && !Point.equal(p, mePos)) {
			if (this._model.isHookSmall() && Point.distance(p, mePos) > 30) {
				mp.x = hitter.x + Math.cos(angle) * 250;
				mp.y = hitter.y + Math.sin(angle) * 250;
				mp = this._model.changeToRightPoint(mp);
				var path: Array<Point> = this._model.findLine(p);
				if (path && path.length > 0) {
					path.shift();
					attacker.movePath(path);
					hitter.moveBack(mp, 320);
					attacker.isInZSCZ = true;
				}
				return;
			}
			else {
				attacker.playZhanShenChongZhuang();
			}
		}
		//表现伤害
		var fightVo: FightVo;
		var realHitter: LiveThing;
		var damage: number;
		var leftHp: number;
		var liveVo: LiveThingVo;
		for (var i: number = 0; i < fightList.length; i++) {
			fightVo = fightList[i];
			realHitter = fightVo.hitter;
			if (realHitter == null) {
				continue;
			}
			damage = fightVo.hurt;
			if (fightVo.hitterType == AttackType.PARTNER) {
				liveVo = this._model.getPlayer(realHitter.getId());
			}
			else if (fightVo.hitterType == AttackType.MONSTER) {
				liveVo = this._model.getMonsterVo(realHitter.getId());
			}
			if (!liveVo) {
				continue;
			}
			leftHp = Math.max(fightVo.leftHp, 0);
			if (fightVo.leftType == FightVo.RED) {
				//如果攻击者不是假打的玩家就设置防守方的血量
				if (!is(attacker, "Player") || (attacker as Player).playerVo.useType != PlayerBaseVO.FIGHTER) {
					liveVo.setHp(leftHp);
				}
			}
			else {
				liveVo.setMp(leftHp);
			}
			if (damage > 0) {
				angle = Math.atan2(realHitter.y - attacker.y, realHitter.x - attacker.x);
				var imageType: number = 0;
				var isShowDamage: boolean = false;
				if (is(attacker, "Player")) {
					imageType = (attacker as Player).playerVo.getCareer();
					if (RoleModel.getInstance().isMyPartner(attacker.getId())) {
						isShowDamage = true;
					}
				}
				if (is(realHitter, "Player")) {
					if (RoleModel.getInstance().isMyPartner(realHitter.getId())) {
						isShowDamage = true;
					}
				}
				SceneImageManager.getInstance().showDamage(this._imageTxtLayer, damage, realHitter.x, realHitter.y + realHitter.getBodyHeight() / 2, angle, imageType, isShowDamage);
			}
			if (this._model.isHookSmall()) {
				if (skillId == 102003 || skillId == 102008) {
					//法师的抗拒火环要推开怪物
					if (MeetPlayerModel.getInstance().fightMPID == 0) {
						if (this._moveBackSiDic[realHitter.getId()]) {
							clearTimeout(this._moveBackSiDic[realHitter.getId()]);
						}
						p = new Point();
						p.x = realHitter.x + Math.cos(angle) * 100;
						p.y = realHitter.y + Math.sin(angle) * 100;
						p = this._model.changeToRightPoint(p);
						var si: number = setTimeout2((monster: Monster, p: Point) => { monster.moveBack(p) }, 400, realHitter, p);
						this._moveBackSiDic[realHitter.getId()] = si;
					}
				}
				else if (skillId == 101003 || skillId == 101008) {
					//战士群攻
					this.playTargetEffect(skillEffectVo, realHitter);
				}
			}
		}
	}

	//一个技能影响到到怪物，基本上是取距离玩家最近的几个怪物
	private getMonsterListBySkill(partnerID: string, skillID: number, targetID: number): Array<Monster> {
		var targetNum: number = this._skillManager.getSkillTargetNum(skillID);
		var list: Array<Monster> = new Array();
		//如果是只有影响到1个怪物的话，就直接返回这个怪物
		if (targetID != 0 && targetNum <= 1) {
			list.push(this._monsterDic[targetID]);
			return list;
		}
		var n: any;
		var mon: Monster;
		var rolePlayer: Player = this.getPlayer(partnerID);
		var rolePoint: Point = new Point(rolePlayer.x, rolePlayer.y);
		var dis: number;
		for (n in this._monsterDic) {
			mon = this._monsterDic[n];
			if (!mon.canBeAttack()) {
				continue;
			}
			dis = Point.distance(new Point(mon.x, mon.y), rolePoint);
			if (dis < 300) {
				list.push(mon);
			}
			if (list.length >= targetNum) {
				break;
			}
		}
		return list;
	}

	//获取一个技能影响到的玩家列表
	private getPlayerListBySkill(partnerID: string, skillID: number, targetID: string): Array<Player> {
		var targetNum: number = this._skillManager.getSkillTargetNum(skillID);
		var list: Array<Player> = new Array();
		//如果是只有影响到1个怪物的话，就直接返回这个怪物
		if (targetID != "" && targetNum <= 1) {
			list.push(this.getPlayer(targetID));
			return list;
		}
		var n: any;
		var enermy: Player;
		var rolePlayer: Player = this.getPlayer(partnerID);
		var rolePoint: Point = new Point(rolePlayer.x, rolePlayer.y);
		var dis: number;
		for (n in this._playerDic) {
			enermy = this._playerDic[n];
			if (enermy.playerVo.useType != PlayerBaseVO.MEET) {
				continue;
			}
			dis = Point.distance(new Point(enermy.x, enermy.y), rolePoint);
			if (dis < 300) {
				list.push(enermy);
			}
			if (list.length >= targetNum) {
				break;
			}
		}
		return list;
	}

	//播放释放在target身上的技能
	private playTargetEffect(skillEffectVo: SkillEffectVo, target: LiveThing, isEffect1: boolean = false, dir: Object = null): void {
		if (!target) {
			return;
		}
		var px: number = 0;
		var py: number = 0;
		var container: any;
		if (skillEffectVo.pos == SkillEffectVo.POS_FOOT) {
			py = target.y;
			px = target.x;
			container = this._effectLayer;
		}
		else if (skillEffectVo.pos == SkillEffectVo.POS_BODY) {
			py = - target.getBodyHeight() / 2;
			px = 0;
			container = target;
		}
		else {
			px = target.x;
			py = target.y;
			container = this._effectLayer;
		}
		var url: string;
		var scale: number = 1;
		if (skillEffectVo.type == SkillEffectVo.TARGET) {
			if (isEffect1) {
				url = UrlUtil.getSkillEffectURL(skillEffectVo.eff1);
			}
			else {
				url = UrlUtil.getSkillEffectURL(skillEffectVo.eff2);
			}
		}
		else if (skillEffectVo.type == SkillEffectVo.TARGET_SELF) {
			if (isEffect1) {
				if (dir) {
					var resD: number = dir["dir"];
					if (resD == 4) {
						resD = 6;
					}
					url = UrlUtil.getSkillEffectURL(skillEffectVo.eff1 + resD);
					scale = dir["scale"];
				}
				else {
					url = UrlUtil.getSkillEffectURL(skillEffectVo.eff1);
				}
				// py += target.getBodyHeight() / 2;
			}
			else {
				url = UrlUtil.getSkillEffectURL(skillEffectVo.eff2);
			}
		}
		else if (skillEffectVo.type == SkillEffectVo.SELF_ALL) {
			if (isEffect1) {
				url = url = UrlUtil.getSkillEffectURL(skillEffectVo.eff1);
			}
		}
		var effect: UIEffect = new UIEffect("playTargetEffect");
		effect.scaleX = scale;
		effect.showEffect(url, px, py, container);
	}

	private _huoQiuHitter: LiveThing;
	private playHuoQiu(attack: LiveThing, hitter: LiveThing, speed: number, effectVo: SkillEffectVo): void {
		var arrow: Arrow = new Arrow();
		var url: string = UrlUtil.getSkillEffectURL(effectVo.eff1);
		arrow.showArrow(url, attack, hitter, this._sceneUpContainer, 200, effectVo.speed, 200, new Point(30, -50));
		arrow.addEventListener(Arrow.ARROW_END, this.playHuoQiu2, this);
		this._huoQiuHitter = hitter;
	}

	private _103001Si: number = 0;
	private playHuoQiu2(event: ParamEvent): void {
		(event.currentTarget).removeEventListener(Arrow.ARROW_END, this.playHuoQiu2, this);
		var point: Point = event.data.endP;
		if (this._huoQiuHitter != null) {
			if (this._processSKillID != 0) {
				var effectVo: SkillEffectVo = this._skillManager.getSKillEffect(this._processSKillID);
				var offPoint: Point = effectVo.off2;
				var url: string = UrlUtil.getSkillEffectURL(effectVo.eff2);
				// EffectManager.getInstance().showEffect(url, point.x + offPoint.x, point.y + offPoint.y, this._effectLayer);
				EffectManager.getInstance().showEffect(url, point.x + offPoint.x, point.y + offPoint.y, this._sceneUpContainer);
				//如果是103001技能，还有第三段
				if (this._processSKillID == 103001) {
					if (this._103001Si > 0) {
						clearTimeout(this._103001Si);
					}
					url = UrlUtil.getSkillEffectURL("zhazha");
					this._103001Si = setTimeout2((url: string, point: Point, offPoint: Point, container: CommonSprite) => { EffectManager.getInstance().showEffect(url, point.x + offPoint.x, point.y + offPoint.y, container); }, 150, url, point, offPoint, this._effectLayer);
				}
			}
			this._huoQiuHitter = null;
		}
		this._processSKillID = 0;
	}

	//根据怪物类型ID找出怪物
	private findMonsterByTypeID(typeID: number): Monster {
		var i: any;
		var mon: Monster;
		for (i in this._monsterDic) {
			mon = this._monsterDic[i];
			if (mon.monsterVo && mon.monsterVo.typeId == typeID) {
				return mon;
			}
		}
		return null;
	}

	private noviceMonsterCreateFinish(e: ParamEvent): void {
		var a = this;

		if (!this._model.isStart) {
			return;
		}

		a.monsterRandomWalk();

		var partnerID = this._roleModel.getPartnerIdByCareer(Tools.ZHANSHI);
		if (partnerID != "") {
			var role: Player = this.getPlayer(partnerID);
			if (role) {
				role.stopZSCZEffect();
			}
		}
		this.clearPlayMovieSi();
		var monsterId: number = 0;
		if (e.data != null && e.data.monsterId != null && e.data.monsterId != undefined) {
			monsterId = e.data.monsterId;
		}
		this.rolesAutoFightMonster(monsterId);
	}

	private monsterRandomWalk(): void {
		if (this._monsterDic && SceneModel.getInstance().isNoviceScene()) {
			var i: any;
			var mon: Monster;
			var point: Point;
			var walk: boolean = false;
			for (i in this._monsterDic) {
				mon = this._monsterDic[i];
				walk = (Math.ceil(Math.random() * 9) >= 5);
				point = new Point(mon.x + Tools.makeCustomRandom(120), mon.y + Tools.makeCustomRandom(60));
				if (walk) mon.movePath([point]);
			}
		}
	}

	//挂机场景怪物创建完成后，继续打怪
	private continueFightMonster(event: ParamEvent = null): void {
		if (!this._model.isStart) {
			return;
		}
		var partnerID = this._roleModel.getPartnerIdByCareer(Tools.ZHANSHI);
		if (partnerID != "") {
			var role: Player = this.getPlayer(partnerID);
			if (role) {
				role.stopZSCZEffect();
			}
		}
		this.clearPlayMovieSi();
		this.rolesAutoFightMonster();
	}

	//需要真打的场景的怪物创建完毕后，继续挂机
	private monsterListCreateFinish(event: ParamEvent = null): void {
		if (!this._model.isStart) {
			return;
		}
		this.clearPlayMovieSi();
		if (!this._model.isCityWarInner()) {
			this.rolesAutoFightMonster();
		}
	}

	//伙伴们再自动打怪，一般是一波怪物创建完成或者是切换场景的时候调用,有遭遇boss的时候，打完当前一波怪物，也会调用
	private rolesAutoFightMonster(monsterId: number = 0): boolean {
		var monster: Monster;
		var list: Array<Player> = this._myPartnerList;
		var isFighting: boolean;
		for (var i: number = 0; i < list.length; i++) {
			var rolePlayer = list[i];
			if ((rolePlayer.getPoseState() && rolePlayer.getPoseState().getState() != PoseState.ATTACK)
				|| (this._model.isKFBossScene() && getTimer() - rolePlayer.lastAttackTime > 3000)//跨服boss场景中攻击动作距离上一次超过3秒了
				|| this._model.isHookSmall()) {
				if (!isFighting) {
					isFighting = this.roleAttackClickTarget(rolePlayer, monsterId);
				}
				else {
					this.roleAttackClickTarget(rolePlayer, monsterId);
				}
			}
		}
		//宝宝跟着去打怪
		if (this._petMonster) {
			if (this._petMonsterTarget == null) {
				monster = this.findNoBelongMonster(this._petMonster.ownerID);
				this._petMonsterTarget = monster;
			}
			this.petMonsterAttack();
		}
		return isFighting;
	}

	//道士召唤的宝宝打架
	private petMonsterAttack(): void {
		var target: LiveThing = this._petMonsterTarget;
		if (this._petMonster == null || target == null) {
			return;
		}
		if (this._model.isLock || !this._model.isStart) {
			return;
		}
		var attacker: Monster = this._petMonster;
		attacker.attackObj = { type: AttackType.MONSTER, id: target.getId() };
		var point: Point = new Point(target.x, target.y);
		var rangerPoint: Point = new Point(5, 4);
		var rangerDisX: number = rangerPoint.x > 2 ? rangerPoint.x * TileUtil.GRID_WIDTH + SkillModel.ATTACK_RANGER_X : rangerPoint.x * TileUtil.GRID_WIDTH;
		var rangerDisY: number = rangerPoint.y > 2 ? rangerPoint.y * TileUtil.GRID_HEIGHT + SkillModel.ATTACK_RANGER_Y : rangerPoint.y * TileUtil.GRID_HEIGHT;
		var circleNum: number = ((attacker.x - point.x) * (attacker.x - point.x)) / (rangerDisX * rangerDisX) + ((attacker.y - point.y) * (attacker.y - point.y)) / (rangerDisY * rangerDisY)
		if (circleNum > 1) {
			var p: Point = this._model.findPoint(point);
			if (p == null) {
				return;
			}
			attacker.move(p);
			return;
		}
		attacker.dirToPoint(point);
		attacker.toAttack();
		var damage: number = PropertyUtil.calculateDamage(attacker.monsterVo.propertyVo, target.getVo().getPropertyVo(), 0, 0);
		var angle: number = Math.atan2(target.y - attacker.y, target.x - attacker.x);
		SceneImageManager.getInstance().showDamage(this._imageTxtLayer, damage, target.x, target.y + target.getBodyHeight() / 2, angle);
		if (this._model.isHookSmall()) {
			var leftHp = Math.max(0, target.getVo().getHp() - damage);
			target.getVo().setHp(leftHp);
		}
		if (this._petMonsterAttackSi > 0) {
			clearTimeout(this._petMonsterAttackSi);
		}
		this._petMonsterAttackSi = setTimeout2(() => { this.petMonsterAttack() }, 800);
	}

	//找出未被标记去打的怪物（先找下有无被伙伴选中的怪物，如果都被选中了，就随便选一个）
	private findNoBelongMonster(partnerID: string): Monster {
		var list = RoleModel.getInstance().getPartnerList();
		if (list && list.length == 1 && this._model.isHookSmall()) {
			var rp: Player = this.getPlayer(partnerID);
			return this.findNearSmallMon(rp);
		}
		var monster: Monster;
		var tmpMon: Monster;//挂机中的小怪
		var mVo: MonsterVO;
		var n: any;
		for (n in this._monsterDic) {
			monster = this._monsterDic[n];
			mVo = monster.monsterVo;
			if (mVo.isPetMonster) {
				continue;
			}
			else if (mVo.useType == MonsterVO.VIRTUAL) {
				continue;
			}
			else if (mVo.monsterType == MonsterVO.MEET_BOSS) {
				if (!this._model.toFightBossMeet) {
					continue;
				}
				if (this._model.checkSceneHasSmallMonster()) {
					continue;
				}
			}
			tmpMon = monster;
			if (monster.belongTo == "" || monster.belongTo == partnerID) {
				return monster;
			}
		}
		if (monster && !monster.canBeAttack()) {
			return tmpMon;
		}
		return monster;
	}

	public dispose(): void {
		if (this._zhanJiaSi) {
			clearTimeout(this._zhanJiaSi);
		}
		if (this._callPetMonsterSi > 0) {
			clearTimeout(this._callPetMonsterSi);
		}
		if (this._103001Si > 0) {
			clearTimeout(this._103001Si);
		}
		if (this._zhanshiSkillSi > 0) {
			clearTimeout(this._zhanshiSkillSi);
		}
		// this.clearAutoPickSi();
	}

	private clearAllMonster(e: ParamEvent): void {
		var a = this;
		a.disposeMonster();
	}

	//销毁怪物
	private disposeMonster(): void {
		if (this._monsterDic) {
			var i: any;
			var mon: Monster;
			for (i in this._monsterDic) {
				mon = this._monsterDic[i];
				mon.clear();
				// mon.dispose();
				mon = null;
			}
			this._monsterDic = null;
		}
	}

	//清除击退效果的延迟操作
	private clearMoveBackSi(): void {
		var si: number;
		var n: any;
		for (n in this._moveBackSiDic) {
			si = this._moveBackSiDic[n];
			clearTimeout(si);
		}
		this._moveBackSiDic = new Object();
	}

	//销毁玩家
	private disposePlayer(): void {
		if (this._playerDic) {
			var i: any;
			var player: Player;
			for (i in this._playerDic) {
				player = this._playerDic[i];
				if (player.GetIsRole()) {
					continue;
				}
				player.clear();
				// player.dispose();
				player = null;
			}
			this._playerDic = null;
		}
	}

	//销毁掉落物品
	private disposeDropItem(): void {
		if (this._dropItemList) {
			var item: DropItem;
			for (var i = 0; i < this._dropItemList.length; i++) {
				item = this._dropItemList[i];
				item.dispose();
				this.removeDropItem(item);
			}
			this._dropItemList = null;
		}
	}

	//销毁地图块
	private disposeMap(): void {
		if (this._map) {
			this._map.dispose();
		}
	}

	//清理元素
	private clearElement(event: ParamEvent = null): void {
		var a = this;
		a.removeAllPartner();
		a.removeAllPet();
		a.removeAllNpc();
		a.removePetMonster();
		a.disposeDropItem();
		a.disposeMonster();
		a.disposePlayer();
		a.clearMoveBackSi();
		a.clearPlayMovieSi();
		a.clearBuffSi();
		a.clearRoleAttackSi();
		a.cancelClickTarget();
		if (a._zhanJiaSi) {
			clearTimeout(a._zhanJiaSi);
		}
		if (a._callPetMonsterSi > 0) {
			clearTimeout(a._callPetMonsterSi);
		}
		if (a._103001Si > 0) {
			clearTimeout(a._103001Si);
		}
		if (a._zhanshiSkillSi > 0) {
			clearTimeout(a._zhanshiSkillSi);
		}
		// a.clearAutoPickSi();
		a._partnerClickTargetDic = new Object();
		a.clearMeetPlayer();
		// a._pickingItem = null;
	}

	private clearBuffSi(): void {
		for (var n in this._buffDic) {
			var si: number = this._buffDic[n];
			clearTimeout(si);
		}
		this._buffDic = new Object();
	}

	//移除全部伙伴
	public removeAllPartner(): void {
		if (!this._myPartnerList) {
			return;
		}
		var role: Player;
		var idList: Array<string> = new Array();
		var i: number;
		for (i = 0; i < this._myPartnerList.length; i++) {
			role = this._myPartnerList[i];
			idList.push(role.getId());
		}
		for (i = 0; i < idList.length; i++) {
			this.removePartner(idList[i], true);
		}
		this._myPartnerList = new Array();
		this._role = null;
		this._isClickMap = false;
	}

	//移除自己的一个小伙伴
	private removePartner(id: string, useInClear: boolean = false): void {
		var isMainRoleDead: boolean = false;
		var player: Player;
		// trace("removePartner id = ", id);
		if (this._role && id == this._role.playerVo.uid) {
			this.removeRole();
			isMainRoleDead = true;
		}
		else {
			player = this.getPlayer(id);
			this.removePlayer(id);
		}
		this._model.removePlayer(id, false);
		var index: number = this._myPartnerList.indexOf(player);
		if (index >= 0) {
			this._myPartnerList.splice(index, 1);
		}
		var si: number = this._buffDic[id];
		if (si > 0) {
			clearTimeout(si);
		}
		si = this._roleNextAttackSiDic[id];
		if (si > 0) {
			clearTimeout(si);
		}
		//如果是切换场景，清理伙伴的话，就不需要做下面的判断
		if (useInClear) {
			return;
		}
		//判断是不是所有伙伴都死了，死了就不用加主伙伴
		if (RoleModel.getInstance().getAllHP() == 0 || this._myPartnerList.length == 0) {
			return;
		}
		//如果死的是主伙伴，就要再添加一个主伙伴
		if (isMainRoleDead) {
			player = this._myPartnerList[0];
			this.addRole(player.getId());
		}
	}

	//清理伙伴的延迟播放攻击效果
	private clearPlayMovieSi(): void {
		var n: any;
		var si: number;
		for (n in this._playMovieDic) {
			si = this._playMovieDic[n];
			clearTimeout(si);
		}
		this._playMovieDic = new Object();
	}

	//添加掉落物品
	private addDropItemHandler(event: ParamEvent): void {
		var dropVo: DropItemVo = event.data.data;
		this.addDropItem(dropVo);
		//非小怪挂机场景的跑去捡掉落
		// if (!this._model.isHookSmall()) {
		// 	this.waveMonsterEnd(null);
		// }
	}
	//添加掉落物品
	private addDropItem(dropVo: DropItemVo): void {
		var dropItem: DropItem = new DropItem();
		dropItem.setData(dropVo);
		dropItem.x = dropVo.x;
		dropItem.y = dropVo.y;
		this._dropItemList.push(dropItem);
		this._dropContainer.addChild(dropItem);
	}

	//掉落物飞翔
	private dropFly(): void {
		if (!this._dropItemList) {
			return;
		}
		while (this._dropItemList.length > 0) {
			if (this._role) {
				var item: DropItem = this._dropItemList.shift();
				egret.Tween.get(item).to({ x: this._role.x, y: this._role.y - 60 }, 400)
					.call(this.removeDropItem, this, [item]);
			}
		}
	}

	//移除掉落物品
	private removeDropItem(item: DropItem, removeFromList: boolean = false): void {
		if (removeFromList) {
			var list = this._dropItemList;
			if (list == null) {
				return;
			}
			var index: number = list.indexOf(item);
			if (index == -1) {
				var k = 1;
			}
			if (index >= 0) {
				list.splice(index, 1);
			}
		}
		if (this._dropContainer.contains(item)) {
			this._dropContainer.removeChild(item);
		}
		item.dispose();
		item = null;
	}

	//当前波数怪物打完了，进入到自动捡掉落的步骤
	private _dropFlySi: number = 0;
	// private _autoPickSi: number = 0;
	// private _pickingItem: DropItem;
	private waveMonsterEnd(event: ParamEvent): void {
		if (this._dropFlySi > 0) {
			clearTimeout(this._dropFlySi);
		}
		this._dropFlySi = setTimeout2(() => { this.dropFly() }, 200);
		// this.clearAutoPickSi();
		// this._pickingItem = null;
		// if (this._role) {
		// 	this._role.isPicking = true;
		// 	var ps = this._role.getPoseState();
		// 	if (ps && ps.getState() == PoseState.STAND) {
		// 		traceByTime(StringUtil.substitute("waveMonsterEnd autoPick"));
		// 		this.autoPick();
		// 	}
		// }
	}
	// private autoPick(): void {
	// 	var a = this;
	// 	if (!a._role.isPicking) {
	// 		return;
	// 	}
	// 	a.clearAutoPickSi();
	// 	a._autoPickSi = setTimeout2(() => { this.autoPickInner() }, 50);
	// }
	// private autoPickInner(): void {
	// 	var a = this;
	// 	//去捡掉落钱先把当前在捡的掉落移除掉
	// 	if (a._pickingItem) {
	// 		a.removeDropItem(a._pickingItem, true);
	// 	}
	// 	a._pickingItem = a.findNearDrop();
	// 	if (a._pickingItem) {
	// 		a.roleMove(this._role, new Point(a._pickingItem.x + a._pickingItem.getHalfW(), a._pickingItem.y + a._pickingItem.getHalfH()), 0);
	// 	}
	// 	//没找到掉落物品，表示已经捡完了，可以结束自动捡掉落的流程了
	// 	else {
	// 		a._role.isPicking = false;
	// 		if (this._model.isHookSmall()) {
	// 			GameDispatcher.getInstance().dispatchEvent(new ParamEvent(EventName.WAVE_MONSTER_DROP_END));
	// 		}
	// 		else {
	// 			this._model.showDropReward();
	// 		}
	// 	}
	// }
	// private findNearDrop(): DropItem {
	// 	var list = this._dropItemList;
	// 	if (list == null || list.length == 0) {
	// 		return null;
	// 	}
	// 	var dis: number = 0;
	// 	var result: DropItem;
	// 	for (var i = 0; i < list.length; i++) {
	// 		var item: DropItem = list[i];
	// 		var tmp = Math.abs(this._role.x - item.x) + Math.abs(this._role.y - item.y);
	// 		if (dis == 0 || tmp < dis) {
	// 			dis = tmp;
	// 			result = item;
	// 		}
	// 	}
	// 	return result;
	// }

	// private clearAutoPickSi(): void {
	// 	if (this._autoPickSi > 0) {
	// 		clearTimeout(this._autoPickSi);
	// 	}
	// }

	//伙伴死亡
	private roleDeadHandler(event: ParamEvent): void {
		var p: Player = event.currentTarget;
		//如果死的是道士的话，要去掉召唤宝宝的定时器
		if (p.playerVo.getCareer() == Tools.DAOSHI) {
			clearTimeout(this._callPetMonsterSi);
			this.removePetMonster();
		}
		if (this._petList && this._petList.length > 0) {
			var pet: Pet = this._petList[0];
			if (pet.getOwner().getVo().pid == p.getVo().pid) {
				this.removePet(pet.getVo().uid);
			}
		}
		//只有在小怪挂机场景里面所有角色都死了，才会在这里派发ALL_PARTNER_DEAD
		//其他场景都在服务端通知客户端移除玩家的时候来判断是否需要派发ALL_PARTNER_DEAD
		if (this._model.isHookSmall()) {
			// trace("--- roleDeadHandler id = ", p.getId());
			this.removePartner(p.getId());
			if (RoleModel.getInstance().getAllHP() == 0 || this._myPartnerList.length == 0) {
				this._gameDispatcher.dispatchEvent(new ParamEvent(EventName.ALL_PARTNER_DEAD));
				return;
			}
			this.meetPlayerRemoveTarget(p.getId());
		}
	}

	//移除遭遇玩家正在攻击的目标
	private meetPlayerRemoveTarget(id: string): void {
		var n: any;
		var role: Player;
		for (n in this._meetPlayerTargetDic) {
			role = this._meetPlayerTargetDic[n];
			if (role.getId() == id) {
				delete this._meetPlayerTargetDic[n];
			}
		}
	}

	//召唤宝宝
	private _callPetMonsterSi: number = 0;
	private callPetMonster(): void {
		if (this._petMonster) {
			return;
		}
		var partnerID = this._roleModel.getPartnerIdByCareer(Tools.DAOSHI);
		if (partnerID == "") {
			return;
		}
		var skillID: number = SkillModel.getInstance().getPetSkillID();
		var skillInfo: NodeSkill = this._roleModel.getPartnerSkillInfo(partnerID, skillID);
		if (skillInfo == null) {
			return;
		}
		var att: number = SkillModel.getInstance().getSkillAttackExt(skillID, skillInfo.level);
		var player: Player = this.getPlayer(partnerID);
		if (player == null) {
			return;
		}
		var mVo: MonsterVO = new MonsterVO();
		mVo.setName("");
		mVo.id = 999999;
		mVo.isPetMonster = true;
		mVo.useType = MonsterVO.PET;
		mVo.propertyVo = new PropertyVO();
		mVo.propertyVo.setValue(PropertyVO.ATTACK, att);
		var resID: number = SkillModel.getInstance().getResIDBySkillID(skillID);
		mVo.setResId(resID);
		mVo.setSpeed(PlayerBaseVO.SPEED);
		// this._petMonster = new Monster(mVo);
		this._petMonster = this.makeMonster(MonsterVO.PET);
		this._petMonster.setMonsterVo(mVo);
		this._petMonster.ownerID = partnerID;
		this._petMonster.x = player.x - 40;
		this._petMonster.y = player.y + 60;
		this.addElement(this._petMonster);
		this._monsterDic[mVo.id] = this._petMonster;
		this._petMonster.redraw();
		this._petMonster.addEventListener(EventName.MONSTERATTACK, this.petMonsterAttackHandler, this);
		this._model.hasPetMonster = true;
		if (this._petMonsterTarget == null) {
			if (this._model.isCityWarInner()) {
				if (CityWarModel.getInstance().fightType == AttackType.MONSTER) {
					return;
				}
				else if (CityWarModel.getInstance().fightType == AttackType.PARTNER) {

				}
			}
			else {
				var monster: Monster = this.findNoBelongMonster(this._petMonster.ownerID);
				this._petMonsterTarget = monster;
			}
		}
		this.petMonsterAttack();
	}

	//宝宝走完路之后打人
	private _petMonsterAttackSi: number;
	private _petMonsterTarget: LiveThing;
	private petMonsterAttackHandler(event: ParamEvent): void {
		if (this._model.isCityWarInner()) {
			this.petMonsterAttack();
		}
		else {
			if (this._petMonsterTarget == null) {
				this._petMonsterTarget = this.findNoBelongMonster(this._petMonster.ownerID);
			}
			this.petMonsterAttack();
		}
	}

	//移除宝宝
	private removePetMonster(): void {
		if (!this._petMonster) {
			return;
		}
		this._petMonster.removeEventListener(EventName.MONSTERATTACK, this.petMonsterAttackHandler, this);
		this.removeMonster(this._petMonster.getId());
		this._petMonster.clear();
		// this._petMonster.dispose();
		this._petMonster = null;
		this._petMonsterTarget = null;
		clearTimeout(this._petMonsterAttackSi);
		this._model.hasPetMonster = false;
	}

	//在场景中遇到遭遇boss了
	private addBossMeetHandler(event: ParamEvent): void {
		this._model.toFightBossMeet = true;
		if (this._role) {
			this._role.isPicking = false;
		}
		//判断一下小怪打完没有，没有的话继续打小怪
		if (!this._model.checkSceneHasSmallMonster()) {
			this.rolesAutoFightMonster();
		}
	}

	//让小伙伴们继续打怪或者打遭遇玩家
	public rolesToFight(): boolean {
		if (MeetPlayerModel.getInstance().gotoFightMeetPlayerID > 0) {
			return this.rolesAutoFightPlayer();
		}
		else {
			return this.rolesAutoFightMonster();
		}
	}

	//开启新的小伙伴
	private addPartnerHandler(event: ParamEvent): void {
		if (!this._model.isHookSmall()) {
			Message.show("新伙伴将在下次战斗加入");
			return;
		}
		if (this._elementList == null) {
			return;
		}
		var vo: PlayerBaseVO = event.data.vo;
		this.addPartner(vo);
		var player: Player = this.getPlayer(vo.uid);
		this.onePartnerFightMonster(player);
	}

	//打完遭遇boss
	private meetBossFinish(event: ParamEvent): void {
		this.dropFly();
	}

	//添加虚拟玩家
	private addVirtualPlayerHandler(event: ParamEvent): void {
		var meetVo = MeetPlayerModel.getInstance().getPkInfo();
		if (meetVo == null) {
			return;
		}
		var list: Array<NodeMeet_roles> = meetVo.meet_roles;
		if (list == null) {
			return;
		}
		for (var i: number = 0; i < list.length; i++) {
			//用第一个伙伴的外观
			if (list[i].partner_list.length == 0) {
				continue;
			}
			var playerVo = this._roleModel.changeOtherNodePartnerToVo(list[i].partner_list[0], list[i]);
			if (!this._model.getPlayer(playerVo.uid)) {
				var pos = this._model.getMeetPlayerPos(i);
				if (pos) {
					playerVo.x = pos.x;
					playerVo.y = pos.y;
					this.addVirtualPlayer(playerVo);
				}
			}
		}
	}
	private addVirtualPlayer(vo: PlayerBaseVO): void {
		vo.useType = PlayerBaseVO.VIRTUAL;
		this._model.addPlayer(vo);
		//添加一个假的怪物来被打
		var monPoint: Point = new Point(vo.x + 1, vo.y + 2);
		var mVo = this._model.createVirtualMonster(monPoint);
		vo.attackVirtualMon = mVo;
	}

	//移除玩家
	private removePlayerHandler(event: ParamEvent): void {
		var id: string = event.data.id;
		var p: Player = this.getPlayer(id);
		if (p == null) {
			return;
		}
		if (p.playerVo.isRole) {
			this.removePartner(id);
			//这里都是在真打的场景中移除伙伴的
			if (!this._model.isHookSmall()) {
				if (RoleModel.getInstance().getAllHP() == 0 || this._myPartnerList.length == 0) {
					this._gameDispatcher.dispatchEvent(new ParamEvent(EventName.ALL_PARTNER_DEAD));
				}
			}
		}
		else {
			this.removePlayer(id);
		}
	}

	//非伙伴的玩家的状态改变
	private playerStateChangeHandler(e: ParamEvent): void {
		var state: number = e.target.getState();
		var preState: number = e.target.getPreState();
		var partnerID: string = e.target.ownerID;
		var rolePlayer: Player = this.getPlayer(partnerID);
		if (rolePlayer && state == PoseState.STAND && preState != PoseState.DEAD) {
			var useType = rolePlayer.playerVo.useType;
			if (useType == PlayerBaseVO.VIRTUAL) {
				rolePlayer.toAttack();
				if (this._model.isKFBossScene()) {
					Message.show("fail fight");
				}
				//在屏幕内才播放特效
				if (this._model.checkInScreen(rolePlayer.x, rolePlayer.y)) {
					var skillID: number = this._model.getRandomSkill(rolePlayer.playerVo.getCareer());
					var hitter: Monster = this.getMonsterById(rolePlayer.playerVo.attackVirtualMon.id);
					this.playFightMovie(rolePlayer, hitter, skillID, []);
				}
			}
			// else if (useType == PlayerBaseVO.MEET) {
			// 	this.meetPlayerAttackTarget(rolePlayer);
			// }
			// else if (useType == PlayerBaseVO.FIGHTER || useType == PlayerBaseVO.HELP_FIGHTER) {
			// 	var target: Monster = this.findBoss();
			// 	this.roleAttackMonster(rolePlayer, target);
			// }
		}
	}

	//伙伴们自动打遭遇玩家
	private rolesAutoFightPlayer(): boolean {
		var myList: Array<Player> = this._myPartnerList;
		var partner: Player;
		var isFighting = false;
		for (var i: number = 0; i < myList.length; i++) {
			partner = myList[i];
			if (!isFighting) {
				isFighting = this.roleAttackClickTarget(partner);
			}
			else {
				this.roleAttackClickTarget(partner);
			}
		}
		//宝宝跟着去打玩家
		if (this._petMonster) {
			if (this._petMonsterTarget == null) {
				var meetList: Array<Player> = this._meetPlayerList;
				var index: number = Math.ceil(Math.random() * meetList.length) - 1;
				if (index < 0) {
					index = 0;
				}
				var target: Player = meetList[index];
				this._petMonsterTarget = target;
			}
			this.petMonsterAttack();
		}
		return isFighting;
	}

	//播放所有玩家的加甲的特效
	private _zhanJiaSi: number = 0;
	private playAllPartnerZhanJiaEffect(vo: SkillEffectVo): void {
		var url: string = UrlUtil.getSkillEffectURL(vo.eff2);
		var player: Player;
		for (var i: number = 0; i < this._myPartnerList.length; i++) {
			player = this._myPartnerList[i];
			player.playSkillEffect(url, -50, -45, 40, false);
		}
	}

	//遭遇玩家去打小伙伴
	public meetPlayerFightRoles(): boolean {
		if (MeetPlayerModel.getInstance().gotoFightMeetPlayerID == 0) {
			return;
		}
		if (this._model.checkMeetPlayerFinish()) {
			return;
		}
		var list: Array<Player> = this._meetPlayerList;
		var mp: Player;
		var isFighting: boolean = false;
		for (var i: number = 0; i < list.length; i++) {
			mp = list[i];
			if (!isFighting) {
				isFighting = this.meetPlayerAttackTarget(mp);
			}
			else {
				this.meetPlayerAttackTarget(mp);
			}
		}
		return isFighting;
	}

	//遭遇玩家攻击
	private meetPlayerAttackTarget(mp: Player): boolean {
		var target: Player = this._meetPlayerTargetDic[mp.getId()];
		if (target == null) {
			target = this.getRandomPartner();
			this._meetPlayerTargetDic[mp.getId()] = target;
		}
		// if (target == null) {
		// 	trace("---- meetPlayerAttackTarget target = null");
		// }
		// else {
		// 	trace("---- meetPlayerAttackTarget target.id = ", target.getId());
		// }
		return this.roleAttackPlayer(mp, target);
	}

	//获取自己的一个随机小伙伴
	private getRandomPartner(): Player {
		var myList: Array<Player> = this._myPartnerList;
		var index: number;
		var target: Player;
		if (myList.length == 1) {
			target = myList[0];
		}
		else {
			index = Math.floor(Math.random() * myList.length);
			target = myList[index];
		}
		return target;
	}

	private allPartnerDead(event: ParamEvent): void {
		var list: Array<Player> = this._myPartnerList.concat();
		for (var i: number = 0; i < list.length; i++) {
			list[i].playerVo.setHp(0);
		}
	}

	private findBoss(): Monster {
		var n: any;
		var mon: Monster;
		for (n in this._monsterDic) {
			mon = this._monsterDic[n];
			if (mon.monsterVo.monsterType > MonsterVO.SMALL) {
				return mon;
			}
		}
		return null;
	}

	public clearMeetPlayer(): void {
		this._meetPlayerList = new Array();
		var player: Player;
		var n: any;
		for (n in this._playerDic) {
			player = this._playerDic[n];
			if (player.playerVo.useType == PlayerBaseVO.MEET) {
				this.removePlayer(player.getId());
			}
		}
		this._meetPlayerTargetDic = new Object();
		this._partnerClickTargetDic = new Object();
		this._petMonsterTarget = null;
	}

	//是否隐藏其他玩家
	private isHideOtherChange(event: ParamEvent): void {
		if (this._model.isRoundBoss() || this._model.isGuildBoss()) {
			var isHide: boolean = this._model.hideOhters;
			var n: any;
			var p: Player;
			if (isHide) {
				for (n in this._playerDic) {
					p = this._playerDic[n];
					if (!p.playerVo.isRole) {
						if (isHide) {
							this.removeElement(p);
						}
						else {
							this.addElement(p);
						}
					}
				}
			}
		}
	}

	//战神冲撞后才对怪物进行扣血
	private roleZSCZHandler(event: ParamEvent): void {
		var player: Player = event.currentTarget;
		var monsterID: number = player.attackObj["id"];
		var monster: Monster = this.getMonsterById(monsterID);
		var skillID: number = event.data.skillID;
		if (monster && player) {
			var skillInfo: NodeSkill = RoleModel.getInstance().getPartnerSkillInfo(player.getId(), skillID);
			if (skillInfo == null) {
				return;
			}
			var attExt: number = SkillModel.getInstance().getSkillAttackExt(skillID, skillInfo.level);
			var damage: number = PropertyUtil.calculateDamage(player.playerVo.getPropertyVo(), monster.getPropertyVo(), attExt, 0);
			if (damage > 0) {
				var angle: number = Math.atan2(monster.y - player.y, monster.x - player.x);
				SceneImageManager.getInstance().showDamage(this._imageTxtLayer, damage, monster.x, monster.y + monster.getBodyHeight() / 2, angle, Tools.ZHANSHI, true);
				var leftHp = Math.max(monster.monsterVo.getHp() - damage, 0);
				monster.monsterVo.setHp(leftHp);
			}
		}
	}

	//角色位置改变事件，暂时用于遭遇玩家pk中
	private rolePosChange(event: ParamEvent): void {
		if (MeetPlayerModel.getInstance().gotoFightMeetPlayerID > 0) {
			if (this.meetPlayerFightRoles()) {
				this._gameDispatcher.removeEventListener(EventName.ROLE_POS_CHANGE, this.rolePosChange, this);
			}
			var target = event.currentTarget;
			if (is(target, "Player")) {
				if (this.rolesToFight()) {
					target.removeEventListener(EventName.ROLE_POS_CHANGE, this.rolePosChange, this);
				}
			}
		}
	}

	//设置伙伴去打某个目标
	private setRolesFightHandler(event: ParamEvent): void {
		var id: number = event.data.id;
		var type: number = event.data.type;
		var myPartnerList: Array<Player> = this._myPartnerList;
		for (var i: number = 0; i < myPartnerList.length; i++) {
			var partner: Player = myPartnerList[i];
			if (type == AttackType.MONSTER) {
				var mon: Monster = this.getMonsterById(id);
				if (mon == null) {
					Message.show("没有找到要攻击的守卫 id = " + id);
					return;
				}
				this.setPartnerClickTarget(partner.getId(), mon);
				this._petMonsterTarget = mon;
				this.roleAttackMonster(partner, mon);
				this.petMonsterAttack();
			}
			else if (type == AttackType.PARTNER) {
				if (partner) {
					this.rolesFightRealPlayer(partner);
				}
			}
		}
	}

	//自己的小伙伴去打真人
	private rolesFightRealPlayer(role: Player): void {
		if (!role) {
			return;
		}
		if (!role.playerVo) {
			return;
		}
		var targetID: string = "";
		var targetPlayer: Player = null;
		if (this._model.isCityWarInner()) {
			if (CityWarModel.getInstance().fightType == AttackType.PARTNER) {
				targetID = CityWarModel.getInstance().fightID;
			}
		}
		else if (this._model.isClientHunZhan()) {
			targetID = role.playerVo.hunZhanTargetID;
		}
		targetPlayer = this.findRealPartnerByRoleID(targetID);
		if (targetPlayer) {
			this.setPartnerClickTarget(role.getId(), targetPlayer);
			this.roleAttackPlayer(role, targetPlayer);
		}
		else {
			if (this._model.isClientHunZhan()) {
				this.onePartnerFightMonster(role);
			}
		}
	}

	//根据角色id找出找出其中的一个伙伴
	private findRealPartnerByRoleID(id: string): Player {
		var list: Array<Player> = new Array();
		for (var n in this._playerDic) {
			var p: Player = this.getPlayer(n);
			if (p.playerVo.pid == id) {
				list.push(p);
			}
		}
		var len: number = list.length;
		if (len > 0) {
			var index: number = Math.floor(Math.random() * len);
			return list[index];
		}
		return null;
	}

	//攻城战中，角色跑到旗子那里
	private rolesGotoFlagHandler(event: ParamEvent): void {
		var id: number = event.data.id;
		this.rolesGotoFlag(id);
	}
	private rolesGotoFlag(id: number): void {
		var n: any;
		// var mVo: MonsterVO = this._model.getMonsterVoByTypeID(9000003);
		var vo: CWSceneConfigVo = CityWarModel.getInstance().getCityWarSceneConfig(SceneInfoVo.CITYWAR_PALACE);
		var flagPoint: Point = vo.monPoint[0];
		// trace(StringUtil.substitute("flagPoint x={0}, y={1}", flagPoint.x, flagPoint.y));
		var endPoint: Point = this._model.changeToPixsPoint(flagPoint);
		for (n in this._playerDic) {
			var player: Player = this.getPlayer(n);
			if (player.playerVo.id == id) {
				if (player.playerVo.isRole) {
					this.roleMove(player, endPoint);
				}
				else {
					player.x = endPoint.x;
					player.y = endPoint.y;
					player.playerVo.x = flagPoint.x;
					player.playerVo.y = flagPoint.y;
				}
			}
		}
	}

	//在攻城战中去打人或者被人打，都是把对方放到自己附近(主角色的右上角)，然后开打
	private goToFightPlayers(event: ParamEvent): void {
		var id: string = event.data.id;
		var pos: Point = event.data.pos;
		if (this._role == null) {
			return;
		}
		for (var n in this._playerDic) {
			var target: Player = this.getPlayer(n);
			if (target && target.playerVo.pid == id) {
				target.playerVo.x = pos.x;
				target.playerVo.y = pos.y;
				var point = this._model.changeToPixsPoint(pos);
				target.x = point.x;
				target.y = point.y;
			}
		}
	}

	private _contentList: Array<string>;
	private randomRunHandler(event: ParamEvent): void {
		// if (this._model.isCityWarInside() || this._model.isCityWarFrontPalace()) {
		if (this._model.isCityWarInner()) {
			var list = this._myPartnerList;
			var myQ: number = this._model.getMyQuadrant();
			var oq: number = this._model.getOppositequadrant(myQ);
			var point = this._model.getRandomPointInQuadrant(oq);
			for (var i: number = 0; i < list.length; i++) {
				var role = list[i];
				point.x = point.x + Math.random() * 100;
				point.y = point.y + Math.random() * 50;
				point = this._model.changeToRightPoint(point);
				this.roleMove(role, point);
			}
			if (this._role) {
				if (this._contentList == null) {
					this._contentList = new Array();
					this._contentList.push("先打守卫，没毛病");
					this._contentList.push("高玩不可怕，蚂蚁啃大象");
					this._contentList.push("同志们，攒够30分直接进皇宫");
					this._contentList.push("眼疾手快，莫挂机，挂机遭人P");
					this._contentList.push("抱团才能胜利");
					this._contentList.push("高玩当守卫，小号采皇旗");
					this._contentList.push("我不会告诉你，采皇旗的人是无敌的");
				}
				var index: number = Math.floor(this._contentList.length * Math.random());
				var content: string = this._contentList[index];
				this._role.speak(content, 5);
			}
		}
	}

	private autoFlyGoods(event: ParamEvent): void {
		this.dropFly();
	}

	private showBUff(event: ParamEvent): void {
		var data: SCMD10701 = event.data.data;
		var target: LiveThing = null;
		if (data.type == AttackType.PARTNER) {
			var uid: string = PlayerBaseVO.makeUid(data.plat_name, data.def_id);
			target = this.getPlayer(uid);
			if (RoleModel.getInstance().isMyPartner(uid) && target) {
				var buffVo: BuffVo = SkillModel.getInstance().getBUffVo(data.buff_id);
				if (buffVo && buffVo.type == BuffVo.YUN) {
					var si: number = this._buffDic[data.def_id];
					if (si > 0) {
						clearTimeout(si);
					}
					target.isYun = true;
					si = setTimeout2(() => {
						target.isYun = false;
						this.roleAttackClickTarget((target as Player));
					}, buffVo.time + 50);
					this._buffDic[data.def_id] = si;
				}
			}
		}
		else {
			target = this.getMonsterById(data.def_id);
		}
		if (target) {
			target.showBuff(data.buff_id);
		}
	}

	//继续攻击真实的玩家
	private continueFightRealPlayer(event: ParamEvent): void {
		var list = this._myPartnerList;
		for (var i = 0; i < list.length; i++) {
			var rolePartner = list[i];
			this.rolesFightRealPlayer(rolePartner);
		}
	}

	//如果不是攻击状态中且不再眩晕状态中，就要找目标来打了
	private checkHunZhanFight(event: ParamEvent = null): void {
		if (this._model.isClientHunZhan()) {
			var list: Array<Player> = this._myPartnerList;
			if (list) {
				for (var i: number = 0; i < list.length; i++) {
					var rolePlayer = list[i];
					if (rolePlayer && rolePlayer.getPoseState()) {
						var state = rolePlayer.getPoseState().getState();
						if (state != PoseState.ATTACK && this._buffDic[rolePlayer.getId()] == null) {
							this.roleAttackClickTarget(rolePlayer);
						}
					}
				}
			}
		}
	}

	//制造一个Player
	private makePlayer(node: PlayerBaseVO): Player {
		var player: Player;
		var list = this._playerCachList;
		for (var i = 0; i < list.length; i++) {
			player = list[i];
			if (!player.isUsing) {
				break;
			}
		}
		if (player == null || player.isUsing) {
			player = new Player();
			this._playerCachList.push(player);
		}
		return player;
	}
	//制造一个Pet
	private makePet(node: PetBaseVO): Pet {
		var pet: Pet;
		var list = this._petCachList;
		for (var i = 0; i < list.length; i++) {
			pet = list[i];
			if (!pet.isUsing) {
				break;
			}
		}
		if (pet == null || pet.isUsing) {
			pet = new Pet();
			this._petCachList.push(pet);
		}
		return pet;
	}
	//制造一个NPC
	private makeNpc(node: SceneNpcVO): Npc {
		var npc: Npc;
		var list = this._npcCachList;
		for (var i = 0; i < list.length; i++) {
			npc = list[i];
			if (!npc.isUsing) {
				break;
			}
		}
		if (npc == null || npc.isUsing) {
			npc = new Npc(node);
			this._npcCachList.push(npc);
		}
		return npc;
	}

	//当前场景的玩家数量
	// private getScenePlayerNum(): number {
	// 	var result = 0;
	// 	for (var i in this._playerDic) {
	// 		result++;
	// 	}
	// 	return result;
	// }

	//当前场景的怪物数量
	// private getSceneMonsterNum(type: number): number {
	// 	var result = 0;
	// 	for (var i in this._monsterDic) {
	// 		var mon: Monster = this._monsterDic[i];
	// 		if (mon && mon.monsterVo && mon.monsterVo.useType == type)
	// 			result++;
	// 	}
	// 	return result;
	// }

	//制造一个怪物
	private makeMonster(type: number = 0): Monster {
		// var currentMonsterNum: number = this.getSceneMonsterNum(type);
		// traceByTime(StringUtil.substitute("makeMonster type = {0} currentMonsterNum = {1}", type, currentMonsterNum));
		// var cachList: Array<Monster>;
		// switch (type) {
		// 	case MonsterVO.COMMON:
		// 		cachList = this._monsterCachList;
		// 		break;
		// 	case MonsterVO.VIRTUAL:
		// 		cachList = this._vMonCachList;
		// 		break;
		// 	case MonsterVO.PET:
		// 		cachList = this._petMonCachList;
		// 		break;
		// 	case MonsterVO.MEETBOSS:
		// 		cachList = this._meetBossList;
		// 		break;
		// 	default:
		// 		cachList = null;
		// 		break;
		// }
		var monster: Monster;
		var cachList = this._monsterCachList;
		for (var i = 0; i < cachList.length; i++) {
			monster = cachList[i];
			if (!monster.isUsing) {
				break;
			}
		}
		//没有找到一个可以用的缓存就创建一个新的
		if (monster == null || monster.isUsing) {
			monster = new Monster();
			cachList.push(monster);
		}
		// return new Monster();
		return monster;
	}
	//移除某个玩家的buff
	private removeBuff(event: ParamEvent): void {
		var scmd: SCMD10702 = event.data.data;
		var uid: string = PlayerBaseVO.makeUid(scmd.plat_name, scmd.partner_id);
		var target: Player = this.getPlayer(uid);
		if (target) {
			target.removeSkillEffect(scmd.buff_id);
		}
	}

	//寻找距离自己最近的一个小怪
	private findNearSmallMon(role: Player): Monster {
		var result: Monster = null;
		var dis: number = 0;
		if (this._model.isHookSmall() && role) {
			for (var n in this._monsterDic) {
				var mon: Monster = this._monsterDic[n];
				if (mon.isDead || mon.monsterVo.isPetMonster) {
					continue;
				}
				if (mon.monsterVo.monsterType == MonsterVO.MEET_BOSS) {
					if (!this._model.toFightBossMeet) {
						continue;
					}
				}
				if (mon.monsterVo.useType == MonsterVO.VIRTUAL) {
					continue;
				}
				var disRoleAndMon: number = Point.distance(new Point(mon.x, mon.y), new Point(role.x, role.y))
				if (dis == 0 || disRoleAndMon < dis) {
					result = mon;
					dis = disRoleAndMon;
				}
			}
		}
		return result;
	}

	//清除所有角色的攻击定时
	private clearRoleAttackSi(): void {
		for (var n in this._roleNextAttackSiDic) {
			var si: number = this._roleNextAttackSiDic[n];
			clearTimeout(si);
		}
	}

	//协助者走完路要继续打怪
	private helpFighterWalkComplete(event: ParamEvent): void {
		var role: Player = event.target;
		if (role) {
			var usetype = role.playerVo.useType;
			if (usetype == PlayerBaseVO.HELP_FIGHTER) {
				this.roleAttackClickTarget(role);
			}
		}
	}
	//服务端广播的玩家走路
	private playerMove(e: ParamEvent): void {
		var a = this;
		var platform: string = e.data.platform;
		var id: number = e.data.eId;
		var path: Array<Point> = e.data.path;
		var ids: string = PlayerBaseVO.makeUid(platform, id);
		var targetPlayer: Player = a.getPlayer(ids);
		if (targetPlayer) {
			targetPlayer.movePath(path);
		}
	}
	private walkToNpc(e: ParamEvent): void {
		var a = this;
		var id: number = e.data.id;
		var npc: Npc = a.getNpc(id);
		if (npc) {
			a.roleTalkToNPC(npc, 2);
		}

	}
	private roleTalkToNPC(npc: Npc, type: number = 1, extralParam: any = null): void {
		var a = this;
		if (a._role) {
			a.setPartnerClickTarget(a._role.getId(), null);
		}
		a.setClickTarget(npc);
		var angle: Number = Math.atan2(npc.y - a._model.getRolePos().y, npc.x - a._model.getRolePos().x);
		var point: Point = new Point(npc.x, npc.y);
		var ranger: number = 3;
		var Wdis: Number = Math.abs(a._role.x - point.x);
		var Hdis: Number = Math.abs(a._role.y - point.y);
		if (Wdis > TileUtil.GRID_WIDTH * ranger || Hdis > TileUtil.GRID_HEIGHT * ranger) {
			a.roleMove(a._role, point, ranger);
		} else {
			a.cancelClickTarget();
			a._gameDispatcher.dispatchEvent(new ParamEvent(EventName.TRIGGER_NPC, { npcVO: npc.npcVo, type: type }));
		}
	}
	private setClickTarget(value: SceneElement): void {
		var a = this;
		if (value != null && a._clickTarget != value)
			a._clickTarget = value;

	}
	private cancelClickTarget(): void {
		var a = this;
		a._clickTarget = null;
	}
	private _findRoadEffect: UIEffect;
	private showAutoFindRoad(): void {
		var a = this;
		if (a._findRoadEffect == null) {
			a._findRoadEffect = EffectManager.getInstance().showEffect(UrlUtil.getCommonEffectURL("xunlu"), 300, 262, GameContent.gameLayers.guideLayer, 120, true);
		}
	}
	private removeAutoFindRoad(): void {
		var a = this;
		if (a._findRoadEffect) {
			a._findRoadEffect.dispose();
			a._findRoadEffect = null;
		}
	}
}