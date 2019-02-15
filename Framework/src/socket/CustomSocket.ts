class CustomSocket extends egret.WebSocket {
	public static ERROR: string = 'socket_error';
	public static CONNECT: string = 'socket_connect';
	private _cmdArray: Array<Array<any>>;
	private _bufferDataArray: Array<any>;
	private _cashBytes: CustomByteArray;
	private _contentLen: number = 0;
	private HEADLENGTH: number = 7;
	private _readDataFlag: boolean = false;
	private _cmdMap: Object;
	private _cmdReflectionDic: Object;
	public ip: string;
	public port: number;
	public isClosed: boolean = true;
	private static _instance: CustomSocket;
	public isAutoRefreshing: Boolean;

	public constructor() {
		super();
		this.type = egret.WebSocket.TYPE_BINARY;
		this.init();
	}

	private init(): void {
		this._cmdArray = new Array();
		this._bufferDataArray = new Array();
		this._cmdMap = new Object();
		this._cmdReflectionDic = new Object();
		this.type = egret.WebSocket.TYPE_BINARY;
	}

	//配置socket监听事件
	public configureListeners(): void {
		this.removeEventListener(egret.Event.CLOSE, this.closeHandler, this);
		this.removeEventListener(egret.Event.CONNECT, this.connectHandler, this);
		this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.ioErrorHandler, this);
		this.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.socketDataHandler, this);
		this.addEventListener(egret.Event.CLOSE, this.closeHandler, this);
		this.addEventListener(egret.Event.CONNECT, this.connectHandler, this);
		this.addEventListener(egret.IOErrorEvent.IO_ERROR, this.ioErrorHandler, this);
		this.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.socketDataHandler, this);
	}

	//IO错误
	private ioErrorHandler(event: egret.Event): void {
		trace('----------------------服务器重启了-------------------');
		this.dispatchEvent(new ParamEvent(CustomSocket.ERROR, { code: 2 }));
	}

	//判断是否在连接中
	private connectHandler(event: egret.Event): void {
		this.dispatchEvent(new ParamEvent(CustomSocket.CONNECT));
		this.isClosed = false;
	}

	//服务端断开连接
	private closeHandler(event: egret.Event): void {
		trace('----------------------socket断开了-------------------');
		this.isClosed = true;
		this.dispatchEvent(new ParamEvent(CustomSocket.ERROR, { code: 1 }));
	}

	//收到socket数据进行处理
	private socketDataHandler(event: ProgressEvent): void {
		var bytes: CustomByteArray = new CustomByteArray(); //开辟缓冲区
		this.readBytes(bytes); //将数据读入内存缓冲区

		this._bufferDataArray.push(bytes);
		if (!this._readDataFlag) {
			//如果当前没有在数据处理中 将开始处理数据，否则等待处理
			this._readDataFlag = true; //设置状态标志为处理中
			this.handleBufferData(); //开始处理数据·
			this._readDataFlag = false;
		}
		event = null;
		bytes = null;
	}

	//处理缓冲区数据
	private handleBufferData(): void {
		if (this._bufferDataArray.length <= 0) {
			//当前数据缓冲区为空
			this._readDataFlag = false;
			return;
		}
		//如果不为空 将读取队列头数据
		var bytesArray: CustomByteArray = this._bufferDataArray.shift();
		bytesArray.position = 0; //将字节数组指针还原
		//如果上一次缓存的字节数组里面有东西，将读取出来和这一次进行拼接
		if (this._cashBytes != null && this._cashBytes.bytesAvailable > 0) {
			var dataBytes: CustomByteArray = new CustomByteArray();
			this._cashBytes.readBytes(dataBytes, 0, this._cashBytes.bytesAvailable);
			bytesArray.readBytes(dataBytes, dataBytes.length, bytesArray.bytesAvailable);
			this._cashBytes = null;
			bytesArray = dataBytes;
			bytesArray.position = 0; //将字节数组指针还原
			dataBytes = null;
		}
		if (this._contentLen == 0 && bytesArray.bytesAvailable < this.HEADLENGTH) {
			//当前数据不够需要的数据长度,且还未读取过包长度  将缓存数据
			if (this._cashBytes == null) {
				this._cashBytes = new CustomByteArray(); //开辟缓存数据
			}
			bytesArray.readBytes(this._cashBytes, this._cashBytes.length, bytesArray.bytesAvailable); //将当前数据放入缓冲区
			bytesArray = null;
			this.handleBufferData(); //重新开始去队列数据
		} else {
			//将字节数组转换成数据
			this.getBytes(bytesArray);
			dataBytes = null;
			bytesArray = null;
		}
	}

	public getBytes(bytesArray: CustomByteArray): void {
		// 读取内容长度
		if (this._contentLen == 0) {
			this._contentLen = bytesArray.readUnsignedInt(); //计算出当前还需要的数据包长度 UnsignedShort为2个字节
		}
		//查看当前长度是否小于 需要的长度
		if (bytesArray.bytesAvailable < this._contentLen) {
			//数据包长度不足
			if (this._cashBytes == null) {
				//开辟缓冲区 存取长度
				this._cashBytes = new CustomByteArray();
			}
			bytesArray.readBytes(this._cashBytes, this._cashBytes.length, bytesArray.bytesAvailable); //将数据放入缓冲区
			bytesArray = null;
			this.handleBufferData(); //继续读取队列数据
		} else {
			//读取两个字节的消息号
			var cmd: number = bytesArray.readUnsignedInt();
			var realDatas: CustomByteArray = new CustomByteArray(); //开辟数据区域，将实际数据读取出来
			if (this._contentLen != 0) {
				bytesArray.readBytes(realDatas, 0, this._contentLen);
			}
			this.receiveData(cmd, realDatas);
			this._contentLen = 0;
			realDatas = null;

			//如果缓冲区还有数据，则继续读
			if (bytesArray.bytesAvailable >= this.HEADLENGTH) {
				this.getBytes(bytesArray);
			} else {
				if (bytesArray.bytesAvailable > 0) {
					if (this._cashBytes == null) {
						this._cashBytes = new CustomByteArray();
					}
					bytesArray.readBytes(this._cashBytes, this._cashBytes.length, bytesArray.bytesAvailable);
				}
				this._readDataFlag = false;
				bytesArray = null;
				this.handleBufferData();
			}
		}
	}

	//处理收到的服务端发送过来的消息
	private _loginCmdList: Array<number> = [ 10000, 10001, 10002, 10003, 10010, 10020, 10200, 10203, 10300 ];
	private receiveData(cmd: number, dataBytes: CustomByteArray, isReplay: Boolean = false): void {
		if (cmd < 10000) return; //小于10000的全是非法协议
		//如果角色信息未准备好，除了登录相关的协议，就不处理服务端发过来的其他信息了
		
		
		
		// if (RoleModel.getInstance().getRoleCommon() == null || RoleModel.getInstance().getPartnerList() == null) {
		// 	if (this._loginCmdList.indexOf(cmd) < 0) {
		// 		return;
		// 	}
		// }


		var hander: Array<any> = this._cmdArray[cmd];
		if (hander == null || hander.length <= 0) {
			return;
		}
		var valueObject: Object; //获取该消息号对应的valueObject对象
		var valueObjArray: Object; //将发送过来的数据映射到对象里面去
		//valueObject=this._cmdMap.getCMDObject(cmd); //根据消息协议号映射对象
		if (this.getCMDObject(cmd) == null) {
			try {
				valueObject = egret.getDefinitionByName('SCMD' + cmd);
				this.addCMDObject(cmd, valueObject);
			} catch (e) {
				if (cmd != 90006 && cmd != 11202) {
					//屏蔽心跳协议
					trace('@没有配置该协议对应的类' + cmd);
				}
			}
		} else {
			valueObject = this.getCMDObject(cmd);
		}
		if (valueObject == null && cmd != 90006) {
			//如果没有配置对象时
			trace('@没有配置该协议对应的类   ' + cmd);
		} else {
			//如果没有映射对象
			if (dataBytes.bytesAvailable > 0) {
				try {
					valueObjArray = this.mappingObject(valueObject, dataBytes, cmd);
				} catch (e) {
					throw new Error('协议号' + cmd + '有错');
				}
			} else {
				valueObjArray = null;
			}
		}
		var t1: number = getTimer();
		for (var i: number = 0; i < hander.length; i++) {
			if (valueObjArray == null) {
				hander[i]();
			} else {
				hander[i](valueObjArray);
			}
		}
		//if (cmd == 10700) {
		//	if (valueObjArray["type"] == AttackType.PARTNER) {
		//		var t = getTimer();
		//		this._cmd10700Back = true;
		// console.log(StringUtil.substitute("receive 10700  timer={0} id = {1} skill = {2}", t, valueObjArray["att_id"], valueObjArray["skill_id"]));
		//	}
		//}
		//var gap: number = getTimer() - t1;
		//if (cmd != 10020) {
		//	trace(StringUtil.substitute("receive cmd = {0}  ", cmd, valueObjArray));
		//}
		// if (gap > 5 && cmd != 10020 && cmd != 10600) {
		// 	trace(StringUtil.substitute("{0} 消耗时间 = {1}ms  length = {2}", cmd, gap, hander.length));
		// }
		valueObject = null;
		hander = null;
	}

	//查找协议解释类
	private getCMDObject(cmd: number): any {
		let key: string = 'cmd' + cmd;
		return this._cmdMap[key];
	}

	//添加解析类
	private addCMDObject(cmd: number, parser: Object): void {
		let key: string = 'cmd' + cmd;
		this._cmdMap[key] = parser;
	}

	//解释协议内容
	private mappingObject(valueClass: any, dataBytes: CustomByteArray, cmd: number): Object {
		var valueObject = new valueClass();
		for (var obt of valueObject['list']) {
			if (dataBytes.bytesAvailable <= 0) {
				//如果数据包没有了  将停止解析
				break;
			}
			if (obt.type == 'uint') {
				valueObject[obt.name] = dataBytes.readShort();
			} else if (obt.type == 'Int8') {
				valueObject[obt.name] = dataBytes.readUnsignedByte();
			} else if (obt.type == 'Int16') {
				valueObject[obt.name] = dataBytes.readUnsignedShort();
			} else if (obt.type == 'Int32') {
				valueObject[obt.name] = dataBytes.readInt();
			} else if (obt.type == 'Int64') {
				var num1: number = dataBytes.readUnsignedInt();
				var num2: number = dataBytes.readUnsignedInt();
				var max: number = 4294967295 + 1;
				var num: number = Number(num1) * max + Number(num2);
				valueObject[obt.name] = num;
			} else if (obt.type == 'Number') {
				valueObject[obt.name] = dataBytes.readFloat();
			} else if (obt.type == 'string') {
				valueObject[obt.name] = dataBytes.readUTF();
			} else {
				//					处理服务端单个属性是list的情况.
				var circleTimes = dataBytes.readShort();
				var objs: any[] = valueObject[obt.name];
				var VO: Object = objs.pop();
				for (var i: number = 0; i < circleTimes; i++) {
					//var vo:Object=new VO();
					//只支持32位整数和字符串还有其他类型，请注意
					if (VO instanceof Number) {
						objs.push(dataBytes.readInt());
					} else if (VO instanceof String) {
						objs.push(dataBytes.readUTF());
					} else {
						objs.push(this.mappingObject(VO, dataBytes, cmd));
					}
				}
				VO = null;
			}
		}
		obt = null;
		VO = null;
		objs = null;
		return valueObject;
	}

	//获取解析类对应的解析数组
	private getReflection(valueObject: any): any {
		return this._cmdReflectionDic[valueObject];
	}

	//添加解析类对应的解析数组
	private putReflection(valueObject: any, list: Array<any>): void {
		this._cmdReflectionDic[valueObject] = list;
	}

	//开始连接
	public start(ip: string = null, port: number = 0): void {
		this.ip = ip;
		this.port = port;
		this.configureListeners();
		var isSSL = Tools.getPageParams('is_ssl');
		if (isSSL && parseInt(isSSL) > 0) {
			// this.connectByUrl(StringUtil.substitute("wss://qq.dev.bzsch5.9217web.com:9004"));
			// var url: string = AllParamObj["ssl_url"];
			// this.connectByUrl(StringUtil.substitute("wss://{0}?login={1}:{2}", url, ip, port));
			this.connectByUrl(StringUtil.substitute('wss://{0}:{1}', ConfigManager.domain, port));
		} else {
			this.connect(this.ip, this.port);
		}
	}

	public static getInstance(): CustomSocket {
		if (this._instance == null) {
			this._instance = new CustomSocket();
		}
		return this._instance;
	}

	/**
		 * 封装消息
		 * @param cmd	消息消息号
		 * @param object 消息内容
		 *delaytime 毫秒
		 */
	private _cmd10700Back: boolean = true;
	public sendMessage(cmd: number, object: any = null): void {
		if (this.connected == false) {
			switch (this) {
				case CustomSocket.getInstance(): {
					//if(isAutoRefreshing && !(cmd == 90006 || cmd == 92001))
					//		showDisconnectMessage();
					break;
				}
				default: {
					break;
				}
			}
			return;
		}

		var dataBytes: CustomByteArray = new CustomByteArray();
		if (object != null) {
			var byteArray: CustomByteArray = null;
			if (object instanceof Array && object.length > 0) {
				for (var i: number = 0; i < object.length; i++) {
					byteArray = this.packageData(object[i]);
					dataBytes.writeBytes(byteArray, 0, byteArray.length);
				}
			} else {
				byteArray = this.packageData(object);
				dataBytes.writeBytes(byteArray, 0, byteArray.length);
			}
		}
		if (cmd != 10020 && debugCmd) {
			//trace(StringUtil.substitute("sendData cmd = {0} timer = {1}", cmd, getTimer()), object);
		}
		// if (cmd == 10700) {
		// 	var t = getTimer();
		// 	if (this._cmd10700Back == false) {
		// 		console.log(StringUtil.substitute("10700 no return timer={0} id = {1} skill = {2}", t, object.partner_id, object.skill_id));
		// 	}
		// 	this._cmd10700Back = false;
		// 	console.log(StringUtil.substitute("----- 10700 timer={0} id = {1} skill = {2}", t, object.partner_id, object.skill_id));
		// }
		//装包
		var sendBytes: CustomByteArray = new CustomByteArray();
		sendBytes.writeUnsignedInt(dataBytes.length);
		sendBytes.writeUnsignedInt(cmd);
		sendBytes.writeBytes(dataBytes, 0, dataBytes.bytesAvailable);
		this.writeBytes(sendBytes);
		this.flush();

		byteArray = null;
		object = null;
		dataBytes = null;
		sendBytes = null;
	}

	/**
	 * 封装数据发送
	 * @param object 需要发送的参数对象
	 * @return
	 *
	 */
	private packageData(object: Object): CustomByteArray {
		var byteArray: CustomByteArray = new CustomByteArray();
		var max: number;
		for (var obj of object['list']) {
			if (obj.type == 'uint') {
				byteArray.writeShort(object[obj.name]);
			} else if (obj.type == 'Number') {
				var num: number = object[obj.name] as number;
				if (isNaN(num)) {
					num = 0;
				}
				byteArray.writeFloat(num);
			} else if (obj.type == 'string') {
				var str: string = object[obj.name];
				if (str == null) {
					str = ' ';
				}
				byteArray.writeUTF(str);
			} else if (obj.type == 'Int64') {
				max = 4294967295 + 1;
				byteArray.writeInt(Math.floor(object[obj.name] / max));
				byteArray.writeInt(Math.floor(object[obj.name] % max));
			} else if (obj.type == 'Int32') {
				byteArray.writeInt(object[obj.name]);
			} else if (obj.type == 'Int16') {
				byteArray.writeShort(object[obj.name]);
			} else if (obj.type == 'Int8') {
				byteArray.writeByte(object[obj.name]);
			} else {
				var tempObj: Object = object[obj.name];
				if (tempObj instanceof Array) {
					byteArray.writeShort((tempObj as any[]).length);
					for (var innerObj of tempObj) {
						var tempByte: CustomByteArray = this.packageData(innerObj);
						byteArray.writeBytes(tempByte, 0, tempByte.length);
					}
				} else {
					//处理依赖关系  即对象中装有其他对象
					tempByte = this.packageData(tempObj);
					byteArray.writeBytes(tempByte, 0, tempByte.length);
				}
				tempObj = null;
				innerObj = null;
				tempByte = null;
			}
		}
		obj = null;
		object = null;
		str = null;
		return byteArray;
	}

	/**
	 *添加某个消息号的监听
	 * @param cmd	消息号
	 * @param args	传两个参数，0为处理函数  1为需要填充的数据对象
	 *
	 */
	addCmdListener(cmd: number, hander: Function, thisObj: any): void {
		if (this._cmdArray[cmd] == null) {
			this._cmdArray[cmd] = [];
		}
		if (this._cmdArray[cmd].indexOf(hander) == -1) {
			this._cmdArray[cmd].push(hander);
		}
	}

	/**
		 *移除 消息号监听
		 * @param cmd
		 *
		 */
	removeCmdListener(cmd: number, listener: Function): void {
		var handers: any[] = this._cmdArray[cmd];
		if (handers != null && handers.length > 0) {
			for (var i: number = handers.length - 1; i >= 0; i--) {
				if (listener == handers[i]) {
					handers.splice(i, 1);
				}
			}
		}
	}
}
