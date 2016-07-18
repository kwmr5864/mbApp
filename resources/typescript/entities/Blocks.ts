///<reference path="../typings/faker/faker.d.ts"/>

///<reference path="./LifeObject"/>
///<reference path="../utils/common.ts"/>

module entities {
    import dice = utils.dice;
    export abstract class Block extends LifeObject {
        constructor(private _name: string, protected _life: number, public hasTreasure: boolean = false) {
            super(`${_name}「${faker.lorem.words(1)}」`, _life)
        }
    }
    export class Wall extends Block {
        constructor() {
            super('壁', 9999)
        }
    }
    export class Rock extends Block {
        constructor() {
            super('岩', 30 + dice())
        }
    }
    export class Tree extends Block {
        constructor() {
            super('木', 10 + dice())
        }
    }
    export class WoodenBox extends Block {
        constructor() {
            super('木箱', 10 + dice(2), true)
        }
    }
    export class Tussock extends Block {
        constructor() {
            super('草むら', dice())
        }
    }
}