class AppearanceUtil {
	public constructor() {
	}

	public static changeAppListToVo(list: Array<NodeAppearance>): AppearanceVO {
		var vo: AppearanceVO = new AppearanceVO();
		var node: NodeAppearance;
		for (var i: number = 0; i < list.length; i++) {
			node = list[i];
			vo.setValue(node.key, node.value);
		}
		return vo;
	}

	//检查2个外观vo是否一致
	public static checkAppVoDiff(vo1: AppearanceVO, vo2: AppearanceVO): boolean {
		if (vo1 == null || vo2 == null) {
			return true;
		}
		if (vo1.cloth != vo2.cloth || vo1.wing != vo2.wing) {
			return true;
		}
		if (vo1.weaponFashion != vo2.weaponFashion || vo1.wingFashion != vo2.wingFashion) {
			return true;
		}
		if (vo1.title != vo2.title || vo1.weapon != vo2.weapon) {
			return true;
		}
		if (vo1.clothFashion != vo2.clothFashion) {
			return true;
		}
		if (vo1.ring != vo2.ring) {
			return true;
		}
		if (vo1.pet != vo2.pet) {
			return true;
		}
		if (vo1.pet_weapon_10 != vo2.pet_weapon_10) {
			return true;
		}
		if (vo1.pet_weapon_11 != vo2.pet_weapon_11) {
			return true;
		}
		if (vo1.pet_weapon_12 != vo2.pet_weapon_12) {
			return true;
		}
		return false;
	}
}