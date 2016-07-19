///<reference path="../typings/faker/faker.d.ts"/>

///<reference path="./LifeObject"/>
///<reference path="../utils/common.ts"/>

module entities {
    import dice = utils.dice;
    export abstract class Block extends LifeObject {
        constructor(private _name: string, protected _life: number, public hasTreasure: boolean = false) {
            super(_name, _life)
        }
    }
    export class Wall extends Block {
        constructor() {
            super(`${faker.lorem.words(1)}と書かれた壁`, 9999)
        }
    }
    export class Rock extends Block {
        constructor() {
            super(`${faker.commerce.productAdjective()}な岩`, 30 + dice())
        }
    }
    export class Tree extends Block {
        constructor() {
            super(`${faker.commerce.productAdjective()}な木`, 10 + dice())
        }
    }
    export class WoodenBox extends Block {
        constructor() {
            super(`${faker.lorem.words(1)}と書かれた木箱`, 10 + dice(2), true)
        }
    }
    export class Tussock extends Block {
        constructor() {
            super(`${faker.commerce.color()}の草むら`, dice())
        }
    }
}