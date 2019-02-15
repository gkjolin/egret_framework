class SCMD15600 {
	public id:number;
	public role_id:number;
	public guild_id:number;
	public guild_name:string;
	public last_time:number;

	public list=[{name:"id",type:"Int32"},{name:"role_id",type:"Int64"},{name:"guild_id",type:"Int64"},{name:"guild_name",type:"string"},{name:"last_time",type:"Int16"}];
	public constructor() {}
}