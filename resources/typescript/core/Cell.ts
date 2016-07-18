///<reference path="../enums/Field.ts"/>
///<reference path="../entities/LifeObject.ts"/>
///<reference path="../entities/Item.ts"/>
///<reference path="../entities/Spring.ts"/>

module core {
    import LifeObject = entities.LifeObject
    import Item = entities.Item
    import Spring = entities.Spring;
    export class Cell {
        public block: LifeObject
        public treasure: Item
        public spring: Spring
        constructor(public field: enums.Field) {}
    }
}