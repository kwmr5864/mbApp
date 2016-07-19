///<reference path="../typings/faker/faker.d.ts"/>

module entities {
    export class Spring extends LifeObject {
        constructor(public poison: boolean = false) {
            super(`${faker.commerce.color()}の湧き水`, Math.ceil(dice() / 2))
        }
    }
}