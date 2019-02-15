class NodeGuild_members {
	public role_id:number;
	public icon:number;
	public name:string;
	public position:number;
	public donate_total:number;
	public power:number;
	public offline_time:number;

	public list=[{name:"role_id",type:"Int64"},{name:"icon",type:"Int32"},{name:"name",type:"string"},{name:"position",type:"Int8"},{name:"donate_total",type:"Int32"},{name:"power",type:"Int64"},{name:"offline_time",type:"Int32"}];
	public constructor() {}
}