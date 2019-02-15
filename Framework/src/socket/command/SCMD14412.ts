class SCMD14412 {
	public boss_id:number;
	public hp:number;
	public max_hp:number;
	public my_hit:number;
	public boss_all_hits:any[]=[NodeBoss_all_hits];

	public list=[{name:"boss_id",type:"Int32"},{name:"hp",type:"Int64"},{name:"max_hp",type:"Int64"},{name:"my_hit",type:"Int64"},{name:"boss_all_hits",type:"array"}];
	public constructor() {}
}