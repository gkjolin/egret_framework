class SkillEffectVo {
	public id:number;//技能id
	public type:number;//效果类型，1是打在敌人身上的，2是放在自己身上，3是过程特效
	public dir:number;//效果方向，用于type是1的技能上，表明该技能特效需要读取不同的方向
	public speed:number;//过程特效中第一段的飞行速度，1秒飞多少像素
	public eff1:string;//技能特效名称，类型1的话，对应的资源名称命名需要加上方向，例：某技能类型是1，eff1写a，那么在effect/skill中的资源就要有a2,a3,a8这样
	public eff2:string;//过程特效才用到的
	public showHurtTime:number;//展现伤害（扣血和飘字）的时机，1是出手时候，2是技能完结（1和2针对非过程特效），3是过程特效第一段完结，4是过程特效第二段完结
	public pos:number;//1是打在敌人身上，2是打在敌人脚底，3是在场景上面
	public off1:Point = new Point();//技能特效1的偏移
	public off2:Point = new Point();//技能特效2的偏移
	public eff1Delay:number = 0;//技能1的延迟
	public eff2Delay:number = 0;//技能2的延迟

	public static TARGET:number = 1;//只放在敌人身上
	public static SELF:number = 2;//只放在自己身上
	public static PROCESS:number = 3;//过程特效
	public static TARGET_SELF:number = 4;//2个特效都放在敌人身上（或者1个在自己身上，1个在敌人身上）
	public static SELF_ALL:number = 5;//自己身上播放一个特效，然后和其他伙伴也有特效
	public static ZHAOHUAN:number = 6;//召唤
	public static PARTNERS:number = 7;//释放在随便一个小伙伴身上

	public static POS_BODY:number = 1;
	public static POS_FOOT:number = 2;
	public static POS_SCENE:number = 3;
	public static POS_HEAD:number = 4;
	public constructor() {
	}
}