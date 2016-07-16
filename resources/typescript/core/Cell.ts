///<reference path="../enums/Field.ts"/>
///<reference path="../entities/LifeObject.ts"/>

module core {
    import LifeObject = entities.LifeObject;
    export class Cell {
        public block: LifeObject
        public treasure: LifeObject
        constructor(public field: Field) {}
    }
}