class SCMD12519 {
	public guild_id:number;
	public guild_name:string;
	public guild_level:number;
	public guild_num:number;
	public guild_money:number;
	public guild_power:number;
	public chief_role_id:number;
	public chief_role_name:string;
	public icon:number;
	public notice:string;
	public req_auto:number;
	public req_power:number;

	public list=[{name:"guild_id",type:"Int64"},{name:"guild_name",type:"string"},{name:"guild_level",type:"Int16"},{name:"guild_num",type:"Int32"},{name:"guild_money",type:"Int32"},{name:"guild_power",type:"Int64"},{name:"chief_role_id",type:"Int64"},{name:"chief_role_name",type:"string"},{name:"icon",type:"Int32"},{name:"notice",type:"string"},{name:"req_auto",type:"Int8"},{name:"req_power",type:"Int64"}];
	public constructor() {}
}