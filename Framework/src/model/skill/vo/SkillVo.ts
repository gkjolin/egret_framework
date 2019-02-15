class SkillVo {
	public id: number;  //id
	public name: string;//名字  
	public describe: string;//描述
	public type: number;//技能类型 1是主动，2是被动，3的辅助  , 4副技能 ,5轻功
	public icon: number;//资源id 
	public prof: number;//    
	public cost: number;//  
	public obj: number;//释放对象1自己2攻击目标3选择单体目标4选择范围目标。常量定义在TargetType里  
	public target: number;//  
	public distance: number;//  
	public cd: number;//cd时间毫秒为单位:1秒用1000表示 
	public mod: number;//模式1单体 2群体 3直线群攻
	public getbuff: number;//getbuff  
	public open_lv: number;//  
	public power_up: number;//    
	public born_percent: number;//   
	public lv_percent: number;//   
	public career: number;//职业         
	public area: number;//攻击范围单体模式此项为0，群体模式目标的半径  
	public attime: number;//攻击次数  
	public attarea: number;//攻击距离 
	public effectID: number;//效果id
	public lev: number;
	public param: any;//扩展字段
	public replace: number;
	public prior: number;//技能优先级
	public constructor() {
	}
}