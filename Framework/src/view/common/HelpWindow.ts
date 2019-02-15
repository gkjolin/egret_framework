class HelpWindow extends LayeroutWindow {
	public static GUILD_FARM: number = 1;//公会农场
	public static GUILD_FUBEN: number = 2;//公会副本
	public static MINE: number = 3;//矿洞
	public static ORANGESUIT: number = 4;//橙装
	public static DARK: number = 5;//暗战
	public static SHADOW: number = 6;//光环
	public static SKILL_FEAT: number = 7;//功勋技能
	public static LUNHUI: number = 8;//轮回
	public static KING: number = 9;//王者争霸
	public static FANLI_ZHUAN: number = 10;//返利单笔返利转盘
	public static SHOP_CHEAP: number = 11;//超值商店
	public static AWAKE: number = 12;//觉醒
	public static AWAKE_RUNE: number = 13;//觉醒装备-符文
	public static BOSS_Guild: number = 14;//公会BOSS
	public static SHENLIAN: number = 15;//神炼
	public static MIJINGZP: number = 16;//秘境转盘
	public static MAGIC_PET: number = 17;//魔宠
	public static BOSS_KF: number = 18;//跨服BOSS
	public static DFW: number = 19;//跨服BOSS
	public static BOSS_All: number = 20;//全民BOSS
	public static BOSS_Field: number = 21;//野外BOSS
	public static BOSS_Personal: number = 22;//个人BOSS
	public static BOSS_Elite: number = 23;//精英BOSS
	public static BOSS_Home: number = 24;//BOSS之家
	public static BOSS_Round: number = 25;//转生BOSS
	private returnButton: CustomButton;
	private txtContent: CustomLabel
	public constructor() {
		super();
		this.skinName = "resource/game_skins/common/HelpWindowSkin.exml";
	}
	protected uiCompHandler(): void {
		super.uiCompHandler();
		this.setImageWindowTitle('title_wfsm');
		this.returnButton.addEventListener(egret.TouchEvent.TOUCH_TAP, super.onReturnButtonClick, this);
	}

	public setType(value: number): void {
		switch (value) {
			case HelpWindow.GUILD_FARM:
				this.txtContent.htmlText = "<font color='#ffd200'>玩法规则：</font>\n1.加入公会后自动开启庄园农田\n2.农田随转生等级逐渐开启，最多可达12块地\n3.每块农田在收获进度满时都可获得公会贡献奖励，奖励数量受公会庄园等级影响\n<font color='#ffd200'>庄园攻略：</font>\n1.我的农田可进行施肥，施肥将加快农田收获，施肥有cd时间\n2.公会成员的农田可进行浇水，浇水将获得贡献并加快成员农田收获进度\n3.已成熟的成员农田可进行偷菜，偷菜将获得对方部分贡献";
				break;
			case HelpWindow.GUILD_FUBEN:
				this.txtContent.htmlText = "<font color='#ffd200'>玩法规则：</font>\n1.每人每天可无限次数挑战公会副本\n2.公会副本只能向上挑战，难度会逐渐增加\n3.在限定时间（30秒）内成功击杀BOSS视为通关成功\n4.公会副本产出最高橙色品质的羽翼装备\n<font color='#ffd200'>副本攻略：</font>\n1.每天可邀请本公会通关最高的玩家进行“助战”，助战每天仅限1次，可大幅提升成功率，建议在今天无法继续通关时使用\n2.每天可扫荡副本1次，建议在今天打到最高层数时再使用";
				break;
			case HelpWindow.MINE:
				this.txtContent.htmlText = "<font color='#ffd200'>玩法规则：</font>\n1.每人每天3次开采矿洞次数\n2.刷新有几率提高矿洞品质，矿洞品质越高，开采结束时获得金币和功勋越多\n3.刷新失败增加祝福值，祝福值可增加提升成功几率\n4.刷新到黄水晶和彩钻晶时可获得功勋技能礼包\n<font color='#ffd200'>矿洞攻略：</font>\n1.每天有5次掠夺其他玩家矿洞的机会，不要浪费\n2.掠夺时优先保证能够获胜，其次才是选择掠夺的矿洞品质\n3.复仇可双倍拿回自己被掠夺走的资源，记得查看矿洞记录\n4.刷新到高品质矿洞时，推荐使用加速立即完成，避免损失";
				break;
			case HelpWindow.ORANGESUIT:
				this.txtContent.htmlText = "<font color='#ffd200'>橙装说明：</font>\n1.角色自动穿戴当前战力最高的装备，普通装备有可能替换低级橙装（低级橙装不会消失）\n2.可直接合成当前等级能穿戴的最高级橙装，合成成功后自动穿戴\n3.合成橙装需要橙装碎片，可通过寻宝或分解低级橙装获得\n4.橙装碎片不会有损失，每个等级橙装合成，分解的碎片数量都是一致的\n5.若角色已经穿戴橙装，则可通过碎片升级橙装（需角色等级达到要求）\n6.橙装升级时，原来装备的橙装会自动分解为碎片并抵扣新橙装合成需要数量";
				break;
			case HelpWindow.DARK:
				this.txtContent.htmlText = "<font color='#ffd200'>玩法说明：</font>\n1.活动时间为每周一8点至每周日23点20分，周日23点30分结算排行奖励\n2.排行以本周玩家下降神殿的层数进行排名，以活动结束时的排名为准\n3.通过“点击”探索每层的坐标格子，其中一个格子可通往下一层\n4.探索格子会消耗次数，次数每隔一段时间自动恢复\n<font color='#ffd200'>玩法攻略：</font>\n1.每周活动中，每层中通往下层的格子都是固定的，不妨记录起来\n2.向公会或好友询问神殿每层的情况可以事半功倍\n3.探索格子时遇到其他玩家，可战胜对方并与之交换格子";
				break;
			case HelpWindow.SHADOW:
				this.txtContent.htmlText = "<font color='#ffd200'>光环等级：</font>\n1.消耗金币可喂养光环进行升级，提高光环加成属性\n2.喂养次数不满时随时间恢复，最多累计6次\n3.每个角色的喂养和次数相互独立\n<font color='#ffd200'>光环品阶：</font>\n1.消耗进阶丹可提升光环品阶，进阶丹可通过商城购买\n2.当进阶到每阶10星时可挑战光环守卫，战斗胜利光环进阶\n3.每个角色的光环互相独立升阶\n4.光环升阶到3阶可激活强大的光环技能\n<font color='#ffd200'>光环秘藏：</font>\n1.每人每天可开启秘藏5次\n2.秘藏花费随开启次数增加";
				break;
			case HelpWindow.SKILL_FEAT:
				this.txtContent.htmlText = "<font color='#ffd200'>技能说明：</font>\n1.功勋技能通过消耗技能书获得\n2.每个角色最多可学习8个功勋技能，技能栏随转生等级开启\n3.功勋技能可通过消耗功勋升级，最高可达10级\n4.功勋技能升级有成功几率，升级失败时技能等级会降低1级\n<font color='#ffd200'>高手进阶：</font>\n1.相同的功勋技能，效果可叠加\n2.遗忘功勋技能可获得大量功勋，可学习不需要的功勋技能再进行遗忘";
				break;
			case HelpWindow.LUNHUI:
				this.txtContent.htmlText = "<font color='#ffd200'>轮回说明：</font>\n1.轮回可令角色回到第1关，重新击杀boss获得包括元宝在内的奖励\n2.轮回有每天次数限制，vip等级越高，每天可轮回次数越多\n3.轮回需要角色通过一定数量的关卡，历史最高关卡每提高100关可轮回1次\n<font color='#ffd200'>回归说明：</font>\n1.终生卡用户可免费使用\n2.回归可使角色立即回到历史最高关卡，免去打boss的过程\n3.回归获得正常掉落的元宝，金币和材料，装备自动回收为强化石\n<font color='#ffd200'>超级轮回丹说明：</font>\n1、当背包内有超级轮回丹时，勾选后轮回自动消耗\n2、消耗超级轮回丹时，轮回无关卡需求，但是还是会提高关卡需求\n3、超级轮回丹可通过活动获得";
				break;
			case HelpWindow.KING:
				this.txtContent.htmlText = "<font color='#ffd200'>段位说明：</font>\n1.段位分为：青铜-白银-黄金-钻石，每个段位5级，每级4颗星\n2.挑战对手胜利可获得1颗星，连胜可额外再获得1颗星\n3.满星时段位等级提升，如【青铜1】晋升为【白银5】\n4.黄金和钻石段位在挑战失败时会扣除1颗星，星级扣除不会导致降级\n<font color='#ffd200'>活动规则：</font>\n1.每周一10点开启活动，每周日22点结束活动，22点30分结算奖励\n2.奖励分为段位奖励和钻石前5名奖励，均需要手动领取，领奖时效为本周结算至下周结束\n3.匹配对手成功扣除1次挑战次数，挑战次数随时间回复，也可直接元宝购买";
				break;
			case HelpWindow.SHOP_CHEAP:
				this.txtContent.htmlText = "<font color='#ffd200'>超值商店：</font>\n1.以周为单位的超值特惠商店，从周一至周日每天商品组合不同\n2.每天8款超值商品组合，购买越多折扣越大\n3.超值商品需要按照从1到8的顺序依次购买";
				break;
			case HelpWindow.AWAKE:
				this.txtContent.htmlText = "<font color='#ffd200'>玩法说明：</font>\n1.消耗真气激活觉醒星级，每个星级加成特定伙伴属性\n2.真气可通过商城购买真气酒获得\n3.每个境界的最后一级将会【觉醒技能】\n4.觉醒技能威力更加强大，特效更加华丽";
				break;
			case HelpWindow.FANLI_ZHUAN:
				this.txtContent.htmlText = "<font color='#ffd200'>活动说明：</font>\n1.活动开启期间，单笔充值指定金额，即可转动龙盘\n2.最终收益=返利元宝基数x倍率（最高倍率可达4倍）\n3.每天每个档次的单笔充值返利只能领取1次\n4.一次性单笔充值较大元宝时，自动开启小额的元宝转盘，如单笔充值200元宝，则100元宝龙盘自动开启\n";
				break;
			case HelpWindow.AWAKE_RUNE:
				this.txtContent.htmlText = "<font color='#ffd200'>觉醒符文：</font>\n1.觉醒符文加成大量属性\n觉醒符文消耗【觉醒符石】道具进行镶嵌，道具可通过商城购买\n3.觉醒符文镶嵌在觉醒装备孔位上，如果没有穿戴觉醒装备，则符文属性不会生效\n4.觉醒装备被爆时，符文不会损失";
				break;
			case HelpWindow.BOSS_Guild:
				this.txtContent.htmlText = "<font color='#ffd200'>公会boss说明：</font>\n1.公会boss被击杀后每隔一段时间刷新\n2.公会boss可无限次挑战，但每天只有10次十倍掉落次数\n3.公会boss为杀戮场景，不同公会的玩家之间会强制pk，同公会不pk\n4.击杀其他玩家时，最终击杀的玩家有几率掠夺对方身上的装备或升星材料，助攻玩家无奖励\n5.被击杀玩家可通过锻造-神炼（5转开启）来防止装备被掠夺";
				break;
			case HelpWindow.MAGIC_PET:
				this.txtContent.htmlText = "<font color='#ffd200'>说明内容：</font>\n1.消耗对应魔宠丹药进行升级，升级可提升魔宠加成属性\n2.魔宠升级到上限时，可消耗进阶石进行升阶，升级可提升魔宠等级上限\n3.魔宠加成所有伙伴属性\n4.已激活的魔宠可手动跟随，在场景中随玩家移动\n\n < font color= '#ffd200' > 互动说明：\n1.每天每个已激活魔宠可互动3次\n2.互动消耗1个体力，体力可通过好友赠送获得\n3.魔宠阶数越高，互动奖励越好\n</font>\n";
				break;
			case HelpWindow.SHENLIAN:
				this.txtContent.htmlText = "<font color= '#ffd200'> 神炼说明：</font>\n1.神炼等级大于0且装备被掠夺时，神炼等级降低1级防止装备损失\n2.击杀者可获得对应神炼等级消耗数量的红装碎片作为补偿\n3.神炼5转开启，可消耗红装碎片加成全身普通装备基础属性百分比";
				break;
			case HelpWindow.MIJINGZP:
				this.txtContent.htmlText = "<font color= '#ffd200'> 玩法说明：</font>\n1.每天充值1元宝即可获得1积分\n2.每天24点积分重置为50积分\n3.不同转盘消耗积分不同，奖励也不同\n4.外圈奖励转到“内圈”时，可免费转动1次，获得内圈珍稀奖励";
				break;
			case HelpWindow.BOSS_KF:
				this.txtContent.htmlText = "<font color= '#ffd200'> 评级限制：</font>\n1.所有伙伴身上穿戴的觉醒装备，按照等级和转数评分，共同组成评级\n2.评级达到才能进入对应的BOSS场景\n3.评级可百分比提高觉醒装备的基础属性，不提高觉醒技能\n<font color= '#ffd200'> 评级规则：</font>\n1.以60级觉醒装备为6分，每提升10级或者1转，评分提高1分\n2.评分每提高24分，评级增加1级\n<font color= '#ffd200'> 跨服荣耀令：</font>\n1.在跨服BOSS中，杀人，被杀可以获得荣耀令\n2.跨服BOSS伤害第一，跨服BOSS击杀奖励中，可以获得大量荣耀令\n3.荣耀令可在跨服荣耀商店兑换高转的觉醒装备";
				break;
			case HelpWindow.DFW:
				this.txtContent.htmlText = "<font color= '#ffd200'>活动说明：</font>\n1.每天前5次可免费使用普通骰子前进\n2.每天累计充值400元宝即可获得1个666骰子，固定前进6点\n3.每6/12/18号格子上有珍贵奖励和双倍财富值\n4.财富值达到指定数量即可领取财富奖励，每日仅限1次，24点清空财富值\n5.移动到终点即可进入下一层，每天达到指定层数可领取层数奖励，活动期间层数不重置\n6.探秘积分可在寻宝兑换商店中兑换道具，兑换不影响财富值进度\n7.未使用的666骰子将在当天24点清空";
				break;
			case HelpWindow.BOSS_Personal:
				this.txtContent.htmlText = "<font color='#ffd200'>个人boss说明：</font>\n1.个人boss每个等级每天可挑战1次\n2.个人boss随玩家角色升级开启更多\n3.个人boss为和平场景，没有玩家pk\n4.购买月卡后可免费扫荡已挑战的boss";
				break;
			case HelpWindow.BOSS_All:
				this.txtContent.htmlText = "<font color='#ffd200'世界boss说明：</font>\n1.世界boss被击杀后每隔一段时间刷新\n2.世界boss随玩家角色升级开启更多\n3.世界boss为和平场景，没有玩家pk\n4.对世界boss造成伤害最高的玩家可获得较好奖励";
				break;
			case HelpWindow.BOSS_Field:
				this.txtContent.htmlText = "<font color='#ffd200'>野外boss说明：</font>\n1.野外boss在每天8-24点的每15分钟刷新\n2.野外boss出现后会在一定时间内逃跑，请在逃跑前击杀boss\n3.野外boss为杀戮场景，必须击退其他玩家才能击杀boss\n4.野外boss奖励归属最后击杀boss的玩家，仅限1人";
				break;
			case HelpWindow.BOSS_Home:
				this.txtContent.htmlText = "<font color='#ffd200'>boss之家说明：</font>\n1.boss之家分为低中高三种，每天8-24点刷新时间分别为：10分钟、15分钟、20分钟\n2.boss之家出现后会在一定时间内逃跑，请在逃跑前击杀boss\n3.boss之家在vip达到1/2/3级时可免费挑战，否则需消耗钥匙道具\n4.boss之家为杀戮场景，必须击退其他玩家才能击杀boss\n5.boss之家奖励归属最后击杀boss的玩家，仅限1人";
				break;
			case HelpWindow.BOSS_Elite:
				this.txtContent.htmlText = "<font color='#ffd200'>精英boss说明：</font>\n1.精英boss在每天8-24点刷新，等级越高刷新越慢\n2.精英boss挑战时需要消耗“精英之证”道具，消耗可获得该boss当次出现的无限挑战\n3.boss之家为杀戮场景，必须击退其他玩家才能击杀boss\n4.boss之家奖励归属最后击杀boss的玩家，仅限1人";
				break;
			case HelpWindow.BOSS_Round:
				this.txtContent.htmlText = "<font color='#ffd200'>转生boss说明：</font>\n1.转生boss在每天21点-21点10分开启\n2.玩家只能进入对应转数的转生boss挑战\n3.转生boss为和平场景，玩家之间不pk，竞争对boss的伤害值";
				break;
			default:
				break;
		}
	}
	public setCenter(): void {
		this.x = GameContent.stageWidth - this.width >> 1;
		this.y = (GameContent.stageHeight - this.height >> 1) + 170;
	}

	public dispose(): void {
		super.dispose();
		this.returnButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, super.onReturnButtonClick, this);
	}
}