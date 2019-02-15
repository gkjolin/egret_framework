class SCMD19900 {
	public act_id:number;
	public num:number;
	public open_num:number;
	public free_num:number;
	public last_time:number;
	public act_flegg_list:any[]=[NodeAct_flegg_list];

	public list=[{name:"act_id",type:"Int32"},{name:"num",type:"Int32"},{name:"open_num",type:"Int32"},{name:"free_num",type:"Int32"},{name:"last_time",type:"Int32"},{name:"act_flegg_list",type:"array"}];
	public constructor() {}
}