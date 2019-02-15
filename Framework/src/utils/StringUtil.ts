class StringUtil {
	public constructor() {
	}

	public static substitute(str: string, ...rest): string {
        if (str == null) return '';
        // Replace all of the parameters in the msg string.
        var len: number = rest.length;
        var args: Array<any>;
        if (len == 1 && is(rest[0], "Array")) {
            args = rest[0] as Array<any>;
            len = args.length;
        }
        else {
            args = rest;
        }

        for (var i: number = 0; i < len; i++) {
            str = str.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
        }
        return str;
    }
}