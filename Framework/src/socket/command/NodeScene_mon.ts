class NodeScene_mon {
	public mon_id:number;
	public name:string;
	public guild_id:number;
	public guild_name:string;
	public template_id:number;
	public career:number;
	public sex:number;
	public hp:number;
	public max_hp:number;
	public pos_x:number;
	public pox_y:number;
	public skill:any[]=[NodeSkill];
	public appearance:any[]=[NodeAppearance];

	public list=[{name:"mon_id",type:"Int32"},{name:"name",type:"string"},{name:"guild_id",type:"Int64"},{name:"guild_name",type:"string"},{name:"template_id",type:"Int32"},{name:"career",type:"Int8"},{name:"sex",type:"Int8"},{name:"hp",type:"Int64"},{name:"max_hp",type:"Int64"},{name:"pos_x",type:"Int16"},{name:"pox_y",type:"Int16"},{name:"skill",type:"array"},{name:"appearance",type:"array"}];
	public constructor() {}
}