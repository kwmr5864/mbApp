///<reference path="../typings/faker/faker.d.ts"/>

///<reference path="../enums/Direction.ts"/>
///<reference path="../enums/Field.ts"/>
///<reference path="../enums/ItemType.ts"/>

///<reference path="../core/Position.ts"/>
///<reference path="../core/Cell.ts"/>

///<reference path="../utils/common.ts"/>

///<reference path="../entities/Blocks.ts"/>
///<reference path="../entities/Item.ts"/>
///<reference path="../entities/Spring.ts"/>
///<reference path="../entities/TreasureBox.ts"/>

module core {
    import dice = utils.dice
    import Direction = enums.Direction
    import Field = enums.Field
    import ItemType = enums.ItemType
    import Cell = core.Cell
    import Item = entities.Item
    import Spring = entities.Spring
    import TreasureBox = entities.TreasureBox;

    export class World {
        public static MAX_X = 15
        public static MIN_X = 0
        public static MAX_Y = 15
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
                    row[j] = new Cell(Field.FLAT)
                    switch (dice()) {
                        case 4:
                            var item = Item.getRandom()
                            let lock = dice() - 1
                            var treasureBox = new TreasureBox(item, lock)
                            row[j].treasure = treasureBox
                            break
                        case 5:
                            var poison = false
                            switch (dice()) {
                                case 1:
                                case 2:
                                    poison = true
                                    break
                            }
                            row[j].spring = new Spring(poison)
                            break
                        case 6:
                            row[j].field = Field.BLOCK
                            switch (dice()) {
                                case 1:
                                    row[j].field = Field.WALL
                                    row[j].block = new entities.Wall()
                                    break
                                case 2:
                                    row[j].block = new entities.Rock()
                                    break
                                case 3:
                                    row[j].block = new entities.Tree()
                                    break
                                case 4:
                                    row[j].block = new entities.Tussock()
                                    break
                                default:
                                    row[j].block = new entities.WoodenBox()
                                    break
                            }
                            break
                    }
                }
                this.fields[i] = row
            }
            let goalX = utils.random(World.MAX_X)
            let goalY = utils.random(World.MAX_Y)
            var goalCell = this.fields[goalY][goalX]
            goalCell.field = Field.GOAL
            goalCell.treasure = null
            goalCell.block = null

            var ok = false
            while (!ok) {
                var treasureX = utils.random(World.MAX_X)
                var treasureY = utils.random(World.MAX_Y)
                if (treasureX != goalX && treasureY != goalY) {
                    var treasureCell = this.fields[treasureY][treasureX]
                    treasureCell.field = Field.FLAT
                    var treasure = new Item(`秘宝「${faker.commerce.productName()}」`, ItemType.TREASURE)
                    let lock = dice()
                    var treasureBox = new TreasureBox(treasure, lock, true)
                    treasureCell.treasure = treasureBox
                    treasureCell.block = null
                    ok = true
                }
            }
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