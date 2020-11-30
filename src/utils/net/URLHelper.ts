export class URLHelper {

    private _url: string;

    private static _instance: URLHelper;

    public static instance(): URLHelper {
        return URLHelper._instance;
    }

    public static initalize(url: string) :URLHelper{
        if (!URLHelper._instance) {
            URLHelper._instance = new URLHelper(url, new SingletonEnforcer);
        }
        return URLHelper._instance;
    }

    constructor(url: string, singletonEnforcer: SingletonEnforcer) {
        if (!singletonEnforcer)
            throw new Error("Singleton!!!");
        this._url = url;
    }

    public resolveURL(value: string | string[], delimiter: string = "/"): string {

        if (value instanceof Array) {
            return this._url + delimiter + value.join(delimiter);
        }
        return this._url + delimiter + value;
    }

    public get url(): string {
        return this._url;
    }
}

class SingletonEnforcer {
}
