class NodeSkill {
	public skill_id:number;
	public partner_id:number;
	public level:number;
	public cd:number;

	public list=[{name:"skill_id",type:"Int32"},{name:"partner_id",type:"Int64"},{name:"level",type:"Int16"},{name:"cd",type:"Int32"}];
	public constructor() {}
}