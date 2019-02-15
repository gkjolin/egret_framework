class SCMD14900 {
	public role_id:number;
	public role_name:string;
	public level:number;
	public round:number;
	public last_time:number;
	public man_time:number;
	public guild_farms:any[]=[NodeGuild_farms];

	public list=[{name:"role_id",type:"Int64"},{name:"role_name",type:"string"},{name:"level",type:"Int16"},{name:"round",type:"Int16"},{name:"last_time",type:"Int32"},{name:"man_time",type:"Int32"},{name:"guild_farms",type:"array"}];
	public constructor() {}
}