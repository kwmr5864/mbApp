///<reference path="../enums/Field.ts"/>
///<reference path="../entities/LifeObject.ts"/>

module core {
    import LifeObject = entities.LifeObject;
    export class Cell {
        public object: LifeObject
        constructor(public field: Field) {}
    }
}