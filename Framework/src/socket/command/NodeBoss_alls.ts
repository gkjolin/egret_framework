class NodeBoss_alls {
	public template_id:number;
	public hp_rate:number;
	public last_time:number;
	public boss_all_hits:any[]=[NodeBoss_all_hits];
	public boss_all_kills:any[]=[NodeBoss_all_kills];

	public list=[{name:"template_id",type:"Int32"},{name:"hp_rate",type:"Int8"},{name:"last_time",type:"Int32"},{name:"boss_all_hits",type:"array"},{name:"boss_all_kills",type:"array"}];
	public constructor() {}
}