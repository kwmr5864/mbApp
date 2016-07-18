///<reference path="../enums/Field.ts"/>
///<reference path="../entities/Blocks.ts"/>
///<reference path="../entities/TreasureBox.ts"/>
///<reference path="../entities/Spring.ts"/>

module core {
    import Block = entities.Block
    import TreasureBox = entities.TreasureBox
    import Spring = entities.Spring;
    export class Cell {
        public block: Block
        public treasure: TreasureBox
        public spring: Spring
        constructor(public field: enums.Field) {}
    }
}