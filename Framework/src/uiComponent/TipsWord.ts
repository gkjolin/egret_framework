class TipsWord extends Csprite {
	public static FUBEN: string = 'btn_fuben'; //副本
	public static KING: string = 'btn_king'; //王者争霸
	public static SHOP_CHEAP: string = 'btn_shopch'; //超值商店
	public static AWAKE: string = 'btn_awake'; //觉醒
	public static BIANQIANG: string = 'btn_bianqiang'; //我要变强
	public static SHADOW: string = 'btn_guanghuan'; //光环
	public static KUAFU: string = 'btn_kuafu'; //跨服
	public static LOGIN_REWARD: string = 'btn_login'; //登录奖励
	public static MAIL: string = 'btn_mail'; //邮件
	public static FRIEND: string = 'btn_friend'; //好友
	public static KFSHOPEQUIP: string = 'btn_zhuangbei'; //装备商店
	public static GUILD: string = 'btn_gonghui'; //帮派
	// public static HUODONG: string = "btn_huodong";//活动
	public static FULI: string = 'btn_fuli'; //福利
	public static GUIZU: string = 'btn_guizu'; //贵族
	public static LUNHUI: string = 'btn_lunhui'; //轮回
	public static SHENQI: string = 'btn_shenqi'; //神器
	public static HEFU: string = 'btn_hefu'; //合服
	public static FIRST_CHARGE: string = 'btn_firstcharge'; //首充
	public static FANLI: string = 'btn_fanli'; //返利
	public static CHARGE: string = 'btn_chongzhi'; //充值
	public static ACTIVITY_BACK: string = 'btn_huigui'; //
	public static ACTIVITY_YY: string = 'btn_yuyue'; //
	public static ACTIVITY_OFF: string = 'btn_lixian'; //
	public static QQ_VIP: string = 'btn_qqvip'; //
	public static SUPER_VIP: string = 'btn_supvip'; //
	public static SHUANG_11: string = 'btn_shaung11';
	public static QQ_COVER: string = 'btn_cover';
	public static PK_SKILL: string = 'btn_jueji';
	public static RANK: string = 'btn_paihang';
	private icon: PicLoader;
	private dataConfig: TipsWordVO;
	private _iconID: string;
	private _Location: number = 0;
	private _effect: UIEffect;
	private _isShowEffect: boolean; //点解后不显示
	public constructor(url: string) {
		super();
		this._iconID = url;
		this._isShowEffect = true;
		this.changeIcon(this._iconID);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetClick, this);
	}
	private onGetClick(): void {
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetClick, this);
		this._isShowEffect = false;
		this.disposeGrow();
	}
	//====配置数据
	public get Location(): number {
		if (this.dataConfig) {
			return this.dataConfig.Location;
		}
		return this._Location;
	}
	public set Location(value: number) {
		this._Location = value;
	}
	public get showLevel(): number {
		if (this.dataConfig) {
			return this.dataConfig.showLevel;
		}
		return 0;
	}
	public get rows(): number {
		if (this.dataConfig) {
			return this.dataConfig.rows;
		}
		return 1;
	}

	public changeIcon(_url: String): void {
		if (this.icon == null) {
			this.icon = new PicLoader(PicLoader.MAPTILE);
			this.addChildAt(this.icon, 0);
		}
		this.icon.load('resource/assets/icon/mainUIBtn/' + this._iconID + '.png');
		// this.dataConfig = TipsWordModel.getInstance().getDataByIconId(this._iconID);
		// 	if (this.dataConfig) {
		// 		this.setGrow(this.dataConfig.isGlow > 0);
		// 	}
		// else
		{
			Message.show('TipsWord id = ' + this._iconID + ' 有问题');
		}
	}

	/**
		 * 设置图标是否发光
		 * @param isShine  
		 * 
		 */
	private _clearGrowSi: number = 0;
	public setGrow(isShine: boolean = true): void {
		if (this._isShowEffect && isShine) {
			if (!this._effect) {
				this._effect = EffectManager.getInstance().showEffect(
					UrlUtil.getCommonEffectURL('huodong'),
					-4,
					-6,
					this,
					80,
					true
				);
			}
			if (this._clearGrowSi > 0) {
				clearTimeout(this._clearGrowSi);
			}
			this._clearGrowSi = setTimeout2(() => {
				this.disposeGrow();
			}, 200000);
		} else if (this._effect) {
			this.disposeGrow();
		}
	}

	private disposeGrow(): void {
		if (this._effect) {
			this._effect.dispose();
			this._effect = null;
		}
		if (this._clearGrowSi > 0) {
			clearTimeout(this._clearGrowSi);
		}
	}

	public get info(): TipsWordVO {
		return this.dataConfig;
	}
}

class TipsWordVO {
	public template_id: number;
	public iconID: string;
	public name: string;
	public Location: number;
	public rows: number;
	public isGlow: number;
	public showLevel: number;
	public showhook: number;
	public is_little: number;
	public below: number;
	public city: number;
	public constructor() {
	}
}
