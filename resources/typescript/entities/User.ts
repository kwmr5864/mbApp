///<reference path="../core/LimitedValue.ts"/>
///<reference path="./LifeObject.ts"/>

module entities {
    import LimitedValue = core.LimitedValue;
    export class User extends LifeObject {
        public food: LimitedValue
        constructor(public name: string) {
            super(name)
            this.food = new LimitedValue(1000)
        }
        public flow() {
            if (this.food.current < 1) {
                this.life.current--
            } else {
                this.food.current--
            }
        }
    }
}