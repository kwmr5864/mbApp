///<reference path="../typings/faker/faker.d.ts"/>

///<reference path="../enums/Direction.ts"/>
///<reference path="../enums/Field.ts"/>
///<reference path="../enums/ItemType.ts"/>
///<reference path="../enums/SpringType.ts"/>

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
    import SpringType = enums.SpringType;

    export class World {
        public static MAX_Y = 15
        public static MIN_Y = 0
        public static MAX_X = 15
        public static MIN_X = 0

        public fields: Cell[][]

        constructor(public name: string = '') {
            if (name == '') {
                faker.locale = 'ja'
                this.name = `エリア『${faker.address.streetName()}』`
            }
        }

        public make() {
            this.setFields()
            this.setGoal()
        }

        public getForwardCell(position: core.Position, direction: Direction): Cell {
            var targetPosition = this.getForwardPosition(position, direction)

            return this.fields[targetPosition.y][targetPosition.x]
        }

        public getBackCell(position: core.Position, direction: Direction): Cell {
            var targetPosition = this.getBackPosition(position, direction)

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

        public getBackPosition(position: core.Position, direction: Direction): core.Position {
            var targetPosition = position.getBack(direction)
            switch (direction) {
                case Direction.NORTH:
                    if (World.MAX_Y < targetPosition.y) {
                        targetPosition.y = World.MIN_Y
                    }
                    break
                case Direction.EAST:
                    if (targetPosition.x < World.MIN_X) {
                        targetPosition.x = World.MAX_X
                    }
                    break
                case Direction.SOUTH:
                    if (targetPosition.y < World.MIN_Y) {
                        targetPosition.y = World.MAX_Y
                    }
                    break
                case Direction.WEST:
                    if (World.MAX_X < targetPosition.x) {
                        targetPosition.x = World.MIN_X
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

        public static getRandomPosition(): core.Position {
            return new core.Position(utils.random(World.MAX_Y), utils.random(World.MAX_X))
        }

        private setFields() {
            this.fields = new Array(World.MAX_Y + 1)
            for (var i = 0; i <= World.MAX_Y; i++) {
                var row = new Array(World.MAX_X + 1)
                for (var j = 0; j <= World.MAX_X; j++) {
                    row[j] = new Cell(Field.FLAT)
                    switch (dice()) {
                        case 4:
                            row[j].treasure = World.getTreasureBox()
                            break
                        case 5:
                            row[j].spring = World.getSpring()
                            break
                        case 6:
                            row[j] = World.getBlock()
                            break
                    }
                }
                this.fields[i] = row
            }
        }

        private static getTreasureBox(): TreasureBox {
            var item = Item.getRandom()
            let lock = dice() - 1

            return new TreasureBox(item, lock)
        }

        private static getSpring(): Spring {
            var springType = SpringType.WATER
            var baseAmount = 2
            switch (dice()) {
                case 1:
                    springType = SpringType.POISON
                    break
                case 2:
                    springType = SpringType.LIFE_UP
                    baseAmount = 1
                    break
                case 3:
                    springType = SpringType.LIFE_DOWN
                    baseAmount = 1
                    break
            }

            return new Spring(springType)
        }

        private static getBlock(): Cell {
            var cell = new Cell(Field.FLAT)
            cell.field = Field.BLOCK
            switch (dice()) {
                case 1:
                    cell.field = Field.WALL
                    cell.block = new entities.Wall()
                    break
                case 2:
                    cell.block = new entities.Rock()
                    break
                case 3:
                    cell.block = new entities.Tree()
                    break
                case 4:
                    cell.block = new entities.Tussock()
                    break
                default:
                    cell.block = new entities.WoodenBox()
                    break
            }

            return cell
        }

        private setGoal() {
            // 出口の設置
            let goalY = utils.random(World.MAX_Y)
            let goalX = utils.random(World.MAX_X)
            var goalCell = this.fields[goalY][goalX]
            goalCell.field = Field.GOAL
            goalCell.treasure = null
            goalCell.block = null
            // 出口以外の場所に秘宝を設置
            var treasureY: number
            var treasureX: number
            while (true) {
                treasureY = utils.random(World.MAX_Y)
                treasureX = utils.random(World.MAX_X)
                if (treasureY != goalY && treasureX != goalX) {
                    var targetCell = this.fields[treasureY][treasureX]
                    targetCell.field = Field.FLAT
                    var item = new Item(`秘宝「${faker.commerce.productName()}」`, ItemType.TREASURE)
                    let lock = dice()
                    targetCell.treasure = new TreasureBox(item, lock, true)
                    targetCell.block = null
                    break
                }
            }
            // 出口と秘宝以外の場所にコンパスを設置
            var compassY: number
            var compassX: number
            while (true) {
                compassY = utils.random(World.MAX_Y)
                compassX = utils.random(World.MAX_X)
                if (compassY != goalY && compassY != treasureY && compassX != goalX && compassX != treasureX) {
                    var targetCell = this.fields[compassY][compassX]
                    targetCell.field = Field.FLAT
                    var item = new Item(`コンパス`, ItemType.COMPASS)
                    let lock = dice()
                    targetCell.treasure = new TreasureBox(item, lock)
                    targetCell.block = null
                    break
                }
            }
        }
    }
}