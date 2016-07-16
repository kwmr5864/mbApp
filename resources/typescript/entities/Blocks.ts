///<reference path="./LifeObject"/>
///<reference path="../utils/common.ts"/>

module entities {
    import dice = utils.dice;
    export class Rock extends LifeObject {
        constructor() {
            super('岩', 30 + dice())
        }
    }
    export class Tree extends LifeObject {
        constructor() {
            super('木', 10 + dice())
        }
    }
    export class TreasureBox extends LifeObject {
        constructor() {
            super('木箱', 10 + dice(2))
        }
    }
    export class Tussock extends LifeObject {
        constructor() {
            super('草むら', dice())
        }
    }
}