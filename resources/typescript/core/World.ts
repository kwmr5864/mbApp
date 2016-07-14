///<reference path="../enums/Direction.ts"/>
///<reference path="../enums/Field.ts"/>
///<reference path="../core/Position.ts"/>
///<reference path="../core/Cell.ts"/>
///<reference path="../utils/common.ts"/>
///<reference path="../entities/Blocks.ts"/>

module core {
    import dice = utils.dice
    import Direction = enums.Direction
    import Field = enums.Field
    import Cell = core.Cell

    export class World {
        public static MAX_X = 7
        public static MIN_X = 0
        public static MAX_Y = 7
        public static MIN_Y = 0

        public fields: Cell[][]

        public make() {
            this.fields = new Array(World.MAX_Y + 1)
            for (var i = 0; i <= World.MAX_Y; i++) {
                var row = new Array(World.MAX_X + 1)
                for (var j = 0; j <= World.MAX_X; j++) {
                    switch (dice()) {
                        case 6:
                            row[j] = new Cell(Field.BLOCK)
                            switch (dice()) {
                                case 1:
                                    row[j].object = new entities.Rock()
                                case 2:
                                case 3:
                                    row[j].object = new entities.Tree()
                                    break
                                default:
                                    row[j].object = new entities.Tussock()
                                    break
                            }
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

        public getForwardCell(position: core.Position, direction: Direction): Cell {
            var forwardPosition = this.getForwardPosition(position, direction)

            return this.fields[forwardPosition.y][forwardPosition.x]
        }

        public getForwardPosition(position: core.Position, direction: Direction): core.Position {
            var forwardPosition = position.getForward(direction)
            switch (direction) {
                case Direction.NORTH:
                    if (forwardPosition.y < World.MIN_Y) {
                        forwardPosition.y = World.MAX_Y
                    }
                    break
                case Direction.EAST:
                    if (World.MAX_X < forwardPosition.x) {
                        forwardPosition.x = World.MIN_X
                    }
                    break
                case Direction.SOUTH:
                    if (World.MAX_Y < forwardPosition.y) {
                        forwardPosition.y = World.MIN_Y
                    }
                    break
                case Direction.WEST:
                    if (forwardPosition.x < World.MIN_X) {
                        forwardPosition.x = World.MAX_X
                    }
                    break
            }

            return forwardPosition
        }
    }
}