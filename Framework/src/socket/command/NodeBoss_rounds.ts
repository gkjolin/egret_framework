class NodeBoss_rounds {
	public template_id:number;
	public is_kill:number;
	public boss_round_hits:any[]=[NodeBoss_round_hits];

	public list=[{name:"template_id",type:"Int32"},{name:"is_kill",type:"Int8"},{name:"boss_round_hits",type:"array"}];
	public constructor() {}
}