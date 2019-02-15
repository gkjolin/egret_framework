class PropertyUtil {
	public constructor() {
	}

	public static changeProListToVo(list: Array<NodeAttr>): PropertyVO {
		var vo: PropertyVO = new PropertyVO();
		var node: NodeAttr;
		for (var i: number = 0; i < list.length; i++) {
			node = list[i];
			vo.setValue(node.id, node.val);
		}
		return vo;
	}

	//vo1是攻击者，vo2是防守者，attExt是攻击者的额外攻击力（技能），defence防守方额外的防御力
	public static calculateDamage(vo1: PropertyVO, vo2: PropertyVO, attExt: number, defence: number): number {
		if (vo1 == null || vo2 == null) {
			return 0;
		}
		var totalAttack: number = vo1.attack + attExt;
		var totalDefence: number = vo2.att_def + defence;
		var damage: number = Math.max((totalAttack - totalDefence), totalAttack * 0.2) * (1 - vo2.hurt_def / 10000);
		if (MeetPlayerModel.getInstance().fightMPID > 0) {
			damage = damage * 0.5;
		}
		return Math.ceil(damage);
	}

	public static calculateProFight(vo: PropertyVO): number {
		if (vo == null) {
			return 0;
		}
		var fight: number = 4 * vo.attack + 2 * vo.att_def + 0.4 * vo.hp
			+ 2 * vo.magic_def + 10000 * vo.crit + 5000 * vo.crit_def + 1000 * vo.palsy_rate
			+ 500 * vo.palsy_def + 100 * vo.hurt_def;
		return Math.floor(fight);
	}

	//判断2个属性vo是否相同
	public static checkProVoDiff(vo1: PropertyVO, vo2: PropertyVO): boolean {
		if (vo1 == null || vo2 == null) {
			return true;
		}
		if (vo1.att_def != vo2.att_def || vo1.attack != vo2.attack) {
			return true;
		}
		if (vo1.crit != vo2.crit || vo1.crit_def != vo2.crit_def) {
			return true;
		}
		if (vo1.crit_hurt != vo2.crit_hurt || vo1.hp != vo2.hp) {
			return true;
		}
		if (vo1.hp_up != vo2.hp_up || vo1.hurt_def != vo2.hurt_def) {
			return true;
		}
		if (vo1.hurt_up != vo2.hurt_up || vo1.magic_def != vo2.magic_def) {
			return true;
		}
		if (vo1.mp != vo2.mp || vo1.palsy_def != vo2.palsy_def) {
			return true;
		}
		if (vo1.palsy_rate != vo2.palsy_rate) {
			return true;
		}
		return false;
	}
}