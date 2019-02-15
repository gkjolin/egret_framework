class SCMD10200 {
	public role_id:number;
	public name:string;
	public icon:number;
	public career:number;
	public sex:number;
	public level:number;
	public exp:number;
	public round:number;
	public gm:number;
	public guild_id:number;
	public guild_name:string;
	public guild_position:number;
	public platform:string;

	public list=[{name:"role_id",type:"Int64"},{name:"name",type:"string"},{name:"icon",type:"Int32"},{name:"career",type:"Int8"},{name:"sex",type:"Int8"},{name:"level",type:"Int16"},{name:"exp",type:"Int64"},{name:"round",type:"Int8"},{name:"gm",type:"Int8"},{name:"guild_id",type:"Int64"},{name:"guild_name",type:"string"},{name:"guild_position",type:"Int8"},{name:"platform",type:"string"}];
	public constructor() {}
}