///<reference path="../enums/SpringType.ts"/>
///<reference path="../utils/common.ts"/>

///<reference path="../typings/faker/faker.d.ts"/>

module entities {
    import SpringType = enums.SpringType;
    import dice = utils.dice
    export class Spring extends LifeObject {
        constructor(public type: SpringType = SpringType.WATER, public baseAmount: number = 1) {
            super(`${faker.commerce.color()}の湧き水`, Math.ceil(dice() / 2))
        }
        public getAmount(): number {
            return dice(this.baseAmount)
        }
    }
}