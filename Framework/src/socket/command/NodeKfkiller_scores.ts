class NodeKfkiller_scores {
	public rank_id:number;
	public guild_name:string;
	public role_id:number;
	public role_name:string;
	public score:number;
	public kill_num:number;

	public list=[{name:"rank_id",type:"Int16"},{name:"guild_name",type:"string"},{name:"role_id",type:"Int64"},{name:"role_name",type:"string"},{name:"score",type:"Int32"},{name:"kill_num",type:"Int32"}];
	public constructor() {}
}