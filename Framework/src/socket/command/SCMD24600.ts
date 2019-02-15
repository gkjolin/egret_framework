class SCMD24600 {
	public guild_name:string;
	public role_id:number;
	public role_name:string;
	public appearance:any[]=[NodeAppearance];

	public list=[{name:"guild_name",type:"string"},{name:"role_id",type:"Int64"},{name:"role_name",type:"string"},{name:"appearance",type:"array"}];
	public constructor() {}
}