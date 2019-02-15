class NodeMeet_pk_logs {
	public role_id:number;
	public name:string;
	public flag:number;
	public ctime:number;
	public drop_list:any[]=[NodeDrop_list];

	public list=[{name:"role_id",type:"Int64"},{name:"name",type:"string"},{name:"flag",type:"Int8"},{name:"ctime",type:"Int32"},{name:"drop_list",type:"array"}];
	public constructor() {}
}