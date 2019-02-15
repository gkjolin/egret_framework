class NodeGuild_list {
	public guild_id:number;
	public level:number;
	public name:string;
	public chief_role_id:number;
	public chief_role_name:string;
	public num:number;
	public power:number;

	public list=[{name:"guild_id",type:"Int64"},{name:"level",type:"Int8"},{name:"name",type:"string"},{name:"chief_role_id",type:"Int64"},{name:"chief_role_name",type:"string"},{name:"num",type:"Int8"},{name:"power",type:"Int64"}];
	public constructor() {}
}