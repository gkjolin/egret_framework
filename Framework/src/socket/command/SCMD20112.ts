class SCMD20112 {
	public boss_id:number;
	public hp:number;
	public max_hp:number;
	public my_hit:number;
	public kfboss_awake_hits:any[]=[NodeKfboss_awake_hits];

	public list=[{name:"boss_id",type:"Int32"},{name:"hp",type:"Int64"},{name:"max_hp",type:"Int64"},{name:"my_hit",type:"Int64"},{name:"kfboss_awake_hits",type:"array"}];
	public constructor() {}
}