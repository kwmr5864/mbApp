///<reference path="../typings/faker/faker.d.ts"/>

module entities {
    export class Spring extends LifeObject {
        constructor() {
            var amount = Math.ceil(dice() / 2)
            super(`${faker.commerce.color()}の湧き水`, amount)
        }
    }
}