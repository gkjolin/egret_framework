class NodeItem {
	public item_id:number;
	public partner_id:number;
	public template_id:number;
	public location:number;
	public slot:number;
	public num:number;
	public rand_attr:number;
	public rand_awake:number;
	public last_sec:number;

	public list=[{name:"item_id",type:"Int64"},{name:"partner_id",type:"Int64"},{name:"template_id",type:"Int32"},{name:"location",type:"Int8"},{name:"slot",type:"Int8"},{name:"num",type:"Int32"},{name:"rand_attr",type:"Int32"},{name:"rand_awake",type:"Int32"},{name:"last_sec",type:"Int32"}];
	public constructor() {}
}