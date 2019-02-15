class SCMD10700 {
	public plat_name:string;
	public att_id:number;
	public type:number;
	public skill_id:number;
	public battle_result:any[]=[NodeBattle_result];

	public list=[{name:"plat_name",type:"string"},{name:"att_id",type:"Int64"},{name:"type",type:"Int8"},{name:"skill_id",type:"Int32"},{name:"battle_result",type:"array"}];
	public constructor() {}
}