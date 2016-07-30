///<reference path="../typings/faker/faker.d.ts"/>
///<reference path="../entities/Item.ts"/>

module entities {
    import Item = entities.Item
    export class TreasureBox extends LifeObject {
        constructor(public item?: Item, public lock: number = 0, public unbreakable: boolean = false) {
            super(`${faker.commerce.color()} ${faker.commerce.productMaterial()}の宝箱`, 50)
        }
    }
}