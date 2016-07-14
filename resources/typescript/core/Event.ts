///<reference path="../utils/common.ts"/>

module core {
    import dice = utils.dice;
    export class Event {
        public static getFood(): number {
            return dice(2)
        }

        public static getTrap(): number {
            return dice()
        }
    }
}