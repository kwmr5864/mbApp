///<reference path="../enums/Field.ts"/>
///<reference path="../entities/LifeObject.ts"/>
///<reference path="../entities/Item.ts"/>

module core {
    import LifeObject = entities.LifeObject
    import Item = entities.Item
    export class Cell {
        public block: LifeObject
        public treasure: Item
        constructor(public field: enums.Field) {}
    }
}