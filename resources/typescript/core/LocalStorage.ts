///<reference path="../typings/cryptojs/cryptojs.d.ts"/>

module core {
    export class LocalStorage {
        private static CRYPTO_SECRET_KEY = 'mbapp'
        public static get<T>(key: string): T {
            var data = localStorage.getItem(key)
            var value = data
            //value = CryptoJS.AES.decrypt(value, LocalStorage.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8)

            return JSON.parse(value)
        }
        public static set<T>(key: string, value: T) {
            var data = JSON.stringify(value);
            //data = CryptoJS.AES.encrypt(data, LocalStorage.CRYPTO_SECRET_KEY)
            localStorage[key] = data
        }
    }
}