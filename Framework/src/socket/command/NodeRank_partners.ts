class NodeRank_partners {
	public partner_id:number;
	public role_id:number;
	public career:number;
	public sex:number;
	public power:number;
	public appearance:any[]=[NodeAppearance];
	public attr:any[]=[NodeAttr];
	public rank_equips:any[]=[NodeRank_equips];
	public forge_streng:any[]=[NodeForge_list];
	public forge_stone:any[]=[NodeForge_list];
	public forge_soul:any[]=[NodeForge_list];
	public forge_mind_list:any[]=[NodeForge_mind_list];
	public spec_equips:any[]=[NodeSpec_equips];
	public dominate_list:any[]=[NodeDominate_list];
	public rank_skills:any[]=[NodeRank_skills];
	public wing_level:number;
	public wing_star:number;
	public wing_exp:number;
	public meridian_level:number;
	public meridian_exp:number;

	public list=[{name:"partner_id",type:"Int64"},{name:"role_id",type:"Int64"},{name:"career",type:"Int8"},{name:"sex",type:"Int8"},{name:"power",type:"Int64"},{name:"appearance",type:"array"},{name:"attr",type:"array"},{name:"rank_equips",type:"array"},{name:"forge_streng",type:"array"},{name:"forge_stone",type:"array"},{name:"forge_soul",type:"array"},{name:"forge_mind_list",type:"array"},{name:"spec_equips",type:"array"},{name:"dominate_list",type:"array"},{name:"rank_skills",type:"array"},{name:"wing_level",type:"Int8"},{name:"wing_star",type:"Int8"},{name:"wing_exp",type:"Int8"},{name:"meridian_level",type:"Int32"},{name:"meridian_exp",type:"Int32"}];
	public constructor() {}
}