class NodeScene_partner {
	public plat_name:string;
	public partner_id:number;
	public own_id:number;
	public name:string;
	public guild_id:number;
	public guild_name:string;
	public career:number;
	public sex:number;
	public hp:number;
	public max_hp:number;
	public skill:any[]=[NodeSkill];
	public pos_x:number;
	public pox_y:number;
	public appearance:any[]=[NodeAppearance];

	public list=[{name:"plat_name",type:"string"},{name:"partner_id",type:"Int64"},{name:"own_id",type:"Int64"},{name:"name",type:"string"},{name:"guild_id",type:"Int64"},{name:"guild_name",type:"string"},{name:"career",type:"Int8"},{name:"sex",type:"Int8"},{name:"hp",type:"Int64"},{name:"max_hp",type:"Int64"},{name:"skill",type:"array"},{name:"pos_x",type:"Int16"},{name:"pox_y",type:"Int16"},{name:"appearance",type:"array"}];
	public constructor() {}
}