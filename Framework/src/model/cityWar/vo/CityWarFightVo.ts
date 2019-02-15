class CityWarFightVo {
	public roleID: number;
	public icon: number;
	public name: string;
	public guildID: number;
	public guildName: string;
	public constructor() {
	}

	public changeFromNode(node: NodeAtt_roles): void {
		this.roleID = node.role_id;
		this.icon = node.icon;
		this.name = node.name;
		this.guildID = 0;
		this.guildName = "";
	}

	public changeFromScmd(scmd: SCMD10810): void {
		this.roleID = scmd.role_id;
		this.icon = scmd.icon;
		this.name = scmd.name;
		this.guildID = scmd.guild_id;
		this.guildName = scmd.guild_name;
	}
}