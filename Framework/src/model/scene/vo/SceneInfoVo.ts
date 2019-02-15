class SceneInfoVo {
	public id: number;//场景id
	public resID: number;//资源ID
	public width: number;//场景宽度
	public height: number;//场景高度
	public x: number;//出生点坐标x
	public y: number;//出生点坐标y
	public sceneName: string;//场景名称
	public type: number;//场景类型
	public desc: string;//描述
	public npcList: Array<SceneNpcVO>;//NPC

	public static SMALL: number = 1;//小怪地图
	public static WAVE_BOSS: number = 2;//关卡boss地图
	public static PERSON_BOSS: number = 3;
	public static PEOPLE_BOSS: number = 4;//全民boss
	public static ROUND_BOSS: number = 5;//转生boss
	public static MATERIAL: number = 6;//材料boss
	public static CITY_WAR: number = 7;//攻城战
	public static CHANLLENGE: number = 8;//挑战副本
	public static GUILD_FUBEN: number = 9;//挑战副本
	public static MINE: number = 10;//矿洞
	public static UNKNOW_PALACE: number = 11;//未知暗殿
	public static SHADOW_FUBEN: number = 12;//光环副本
	public static WZZB: number = 13;//王者争霸
	public static GUILD_BOSS: number = 14;//公会BOSS
	public static KFBOSS_SCENE: number = 15;//跨服BOSS场景
	public static BOSS_HOME: number = 16;//BOSS之家
	public static ELITE_BOSS: number = 17;//精英BOSS
	public static WILD_BOSS: number = 18;//野外BOSS
	public static EQUIP_FUBEN: number = 19;//装备BOSS
	public static MAIN_CITY: number = 20;//主城
	public static NOVICE_SCENE: number = 21;//新手村

	public static CITYWAR_OUTSIDE: number = 8001;
	public static CITYWAR_INSIDE: number = 8002;
	public static CITYWAR_FRONTPALACE: number = 8003;
	public static CITYWAR_PALACE: number = 8004;

	public static NOVICE_PALACE: number = 21001;
	public constructor() {
	}

	public setBorn(str: string): void {
		var list: RegExpMatchArray = str.match(/\d+/g);
		this.x = parseInt(list[0]);
		this.y = parseInt(list[1]);
	}
	public setNpc(str: string): void {
		if (str != "") {
			if (this.npcList == null) this.npcList = [];
			var npcVO: SceneNpcVO;
			var list: RegExpMatchArray = str.match(/\d+/g);
			for (var i: number = 0; i < list.length; i += 3) {
				npcVO = SceneModel.getInstance().getSceneNpcInfo(parseInt(list[i]));
				npcVO.x = parseInt(list[i + 1]);
				npcVO.y = parseInt(list[i + 2]);
				this.npcList.push(npcVO);
			}
		}

	}
}