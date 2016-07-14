///<reference path="../enums/Direction.ts"/>
///<reference path="../enums/Field.ts"/>
///<reference path="../core/Position.ts"/>
///<reference path="../core/Cell.ts"/>
///<reference path="../utils/common.ts"/>
///<reference path="../entities/Block.ts"/>

module core {
    import Direction = enums.Direction
    import Field = enums.Field;
    import Block = entities.Block;
    import Cell = core.Cell
    export class World {
        public static MAX_X = 3
        public static MIN_X = 0
        public static MAX_Y = 3
        public static MIN_Y = 0

        public fields: Cell[][]

        public make() {
            this.fields = new Array(World.MAX_Y + 1)
            for (var i = 0; i <= World.MAX_Y; i++) {
                var row = new Array(World.MAX_X + 1)
                for (var j = 0; j <= World.MAX_X; j++) {
                    switch (utils.dice()) {
                        case 6:
                            row[j] = new Cell(Field.BLOCK)
                            row[j].object = new Block()
                            break
                        default:
                            row[j] = new Cell(Field.FLAT)
                            break
                    }
                }
                this.fields[i] = row
            }
            let endX = utils.random(World.MAX_X)
            let endY = utils.random(World.MAX_Y)
            this.fields[endY][endX].field = Field.GOAL
            this.fields[endY][endX].object = null
        }

        public getForwardField(position: core.Position, direction: Direction): Field {
            var field = Field.WALL
            var forwardPosition = position.getForward(direction)
            if (forwardPosition.x === -1 || forwardPosition.y === -1) {
                return field
            }
            switch (direction) {
                case Direction.NORTH:
                    if (World.MIN_Y <= forwardPosition.y) {
                        field = this.fields[forwardPosition.y][forwardPosition.x].field
                    }
                    break
                case Direction.EAST:
                    if (forwardPosition.x <= World.MAX_X) {
                        field = this.fields[forwardPosition.y][forwardPosition.x].field
                    }
                    break
                case Direction.SOUTH:
                    if (forwardPosition.y <= World.MAX_Y) {
                        field = this.fields[forwardPosition.y][forwardPosition.x].field
                    }
                    break
                case Direction.WEST:
                    if (World.MIN_X <= forwardPosition.x) {
                        field = this.fields[forwardPosition.y][forwardPosition.x].field
                    }
                    break
            }
            return field
        }
    }
}