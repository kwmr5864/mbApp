///<reference path="../core/LimitedValue.ts"/>

module entities {
    import LimitedValue = core.LimitedValue;
    export abstract class LifeObject {
        public life: LimitedValue
        constructor(public name: string, protected _life: number = 100) {
            this.life = new LimitedValue(_life)
        }
    }
}