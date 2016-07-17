///<reference path="../typings/faker/faker.d.ts"/>

///<reference path="../enums/Direction.ts"/>
///<reference path="../enums/Field.ts"/>
///<reference path="../enums/ItemType.ts"/>

///<reference path="../core/Position.ts"/>
///<reference path="../core/Cell.ts"/>

///<reference path="../utils/common.ts"/>

///<reference path="../entities/Blocks.ts"/>
///<reference path="../entities/Item.ts"/>

module core {
    import dice = utils.dice
    import Direction = enums.Direction
    import Field = enums.Field
    import ItemType = enums.ItemType
    import Cell = core.Cell
    import Item = entities.Item;

    export class World {
        public static MAX_X = 7
        public static MIN_X = 0
        public static MAX_Y = 7
        public static MIN_Y = 0

        public fields: Cell[][]

        constructor(public name: string = '') {
            if (name == '') {
                faker.locale = 'ja'
                this.name = `エリア『${faker.address.streetName()}』`
            }
        }

        public make() {
            this.fields = new Array(World.MAX_Y + 1)
            for (var i = 0; i <= World.MAX_Y; i++) {
                var row = new Array(World.MAX_X + 1)
                for (var j = 0; j <= World.MAX_X; j++) {
                    switch (dice()) {
                        case 5:
                        case 6:
                            switch (dice()) {
                                case 1:
                                    row[j] = new Cell(Field.WALL)
                                    row[j].block = new entities.Wall()
                                    break
                                case 2:
                                    row[j] = new Cell(Field.BLOCK)
                                    row[j].block = new entities.Rock()
                                    break
                                case 3:
                                    row[j] = new Cell(Field.BLOCK)
                                    row[j].block = new entities.Tree()
                                    break
                                case 4:
                                    row[j] = new Cell(Field.BLOCK)
                                    row[j].block = new entities.TreasureBox()
                                    row[j].block.addRandomItem()
                                    break
                                case 5:
                                    row[j] = new Cell(Field.BLOCK)
                                    row[j].block = new entities.Tussock()
                                    break
                                case 6:
                                    row[j] = new Cell(Field.FLAT)
                                    break
                            }
                            switch (dice()) {
                                case 1:
                                case 2:
                                    var item = Item.getRandom()
                                    if (item != null) {
                                        row[j].treasure = item
                                    }
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
            this.fields[endY][endX].block = null
        }

        public getForwardCell(position: core.Position, direction: Direction): Cell {
            var targetPosition = this.getForwardPosition(position, direction)

            return this.fields[targetPosition.y][targetPosition.x]
        }

        public getLeftCell(position: core.Position, direction: Direction): Cell {
            var targetPosition = this.getLeftPosition(position, direction)

            return this.fields[targetPosition.y][targetPosition.x]
        }

        public getRightCell(position: core.Position, direction: Direction): Cell {
            var targetPosition = this.getRightPosition(position, direction)

            return this.fields[targetPosition.y][targetPosition.x]
        }

        public getForwardPosition(position: core.Position, direction: Direction): core.Position {
            var targetPosition = position.getForward(direction)
            switch (direction) {
                case Direction.NORTH:
                    if (targetPosition.y < World.MIN_Y) {
                        targetPosition.y = World.MAX_Y
                    }
                    break
                case Direction.EAST:
                    if (World.MAX_X < targetPosition.x) {
                        targetPosition.x = World.MIN_X
                    }
                    break
                case Direction.SOUTH:
                    if (World.MAX_Y < targetPosition.y) {
                        targetPosition.y = World.MIN_Y
                    }
                    break
                case Direction.WEST:
                    if (targetPosition.x < World.MIN_X) {
                        targetPosition.x = World.MAX_X
                    }
                    break
            }

            return targetPosition
        }

        public getLeftPosition(position: core.Position, direction: Direction): core.Position {
            var targetPosition = position.getLeft(direction)
            switch (direction) {
                case Direction.NORTH:
                    if (targetPosition.x < World.MIN_X) {
                        targetPosition.x = World.MAX_X
                    }
                    break
                case Direction.EAST:
                    if (targetPosition.y < World.MIN_Y) {
                        targetPosition.y = World.MAX_Y
                    }
                    break
                case Direction.SOUTH:
                    if (World.MAX_X < targetPosition.x) {
                        targetPosition.x = World.MIN_X
                    }
                    break
                case Direction.WEST:
                    if (World.MAX_Y < targetPosition.y) {
                        targetPosition.y = World.MIN_Y
                    }
                    break
            }

            return targetPosition
        }

        public getRightPosition(position: core.Position, direction: Direction): core.Position {
            var targetPosition = position.getRight(direction)
            switch (direction) {
                case Direction.NORTH:
                    if (World.MAX_X < targetPosition.x) {
                        targetPosition.x = World.MIN_X
                    }
                    break
                case Direction.EAST:
                    if (World.MAX_Y < targetPosition.y) {
                        targetPosition.y = World.MIN_Y
                    }
                    break
                case Direction.SOUTH:
                    if (targetPosition.x < World.MIN_X) {
                        targetPosition.x = World.MAX_X
                    }
                    break
                case Direction.WEST:
                    if (targetPosition.y < World.MIN_Y) {
                        targetPosition.y = World.MAX_Y
                    }
                    break
            }

            return targetPosition
        }
    }
}