class NodeKing_ranks {
	public rank:number;
	public role_id:number;
	public role_name:string;
	public level:number;
	public exp:number;
	public win_num:number;

	public list=[{name:"rank",type:"Int32"},{name:"role_id",type:"Int64"},{name:"role_name",type:"string"},{name:"level",type:"Int8"},{name:"exp",type:"Int8"},{name:"win_num",type:"Int16"}];
	public constructor() {}
}