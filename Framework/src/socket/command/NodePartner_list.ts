class NodePartner_list {
	public partner_id:number;
	public career:number;
	public sex:number;
	public skill:any[]=[NodeSkill];
	public attr:any[]=[NodeAttr];
	public appearance:any[]=[NodeAppearance];
	public power:number;

	public list=[{name:"partner_id",type:"Int64"},{name:"career",type:"Int8"},{name:"sex",type:"Int8"},{name:"skill",type:"array"},{name:"attr",type:"array"},{name:"appearance",type:"array"},{name:"power",type:"Int64"}];
	public constructor() {}
}