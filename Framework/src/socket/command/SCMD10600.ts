class SCMD10600 {
	public wave_id:number;
	public kill_num:number;
	public awarded_id:number;
	public award_id:number;
	public total_wave_id:number;
	public total_circle:number;
	public drop_list:any[]=[NodeDrop_list];

	public list=[{name:"wave_id",type:"Int16"},{name:"kill_num",type:"Int16"},{name:"awarded_id",type:"Int16"},{name:"award_id",type:"Int16"},{name:"total_wave_id",type:"Int16"},{name:"total_circle",type:"Int16"},{name:"drop_list",type:"array"}];
	public constructor() {}
}