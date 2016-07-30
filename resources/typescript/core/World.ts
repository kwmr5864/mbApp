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
        public static MAX_Y = 4
        public static MIN_Y = 0
        public static MAX_X = 4
        public static MIN_X = 0
        public static MAX_Z = 4
        public static MIN_Z = 0

        public fields: Cell[][][]
        public goalPosition: core.Position
        public treasurePosition: core.Position

        constructor(public name: string = '') {
            if (name == '') {
                faker.locale = 'ja'
                this.name = `エリア『${faker.address.streetName()}』`
            }
        }

        public make() {
            this.setFields()
            this.setObjects()
        }

        public getCell(position: core.Position): Cell {
            var targetPosition = this.fields[position.z][position.y][position.x]

            return targetPosition
        }

        public getForwardCell(position: core.Position, direction: Direction): Cell {
            var targetPosition = this.getForwardPosition(position, direction)

            return this.fields[targetPosition.z][targetPosition.y][targetPosition.x]
        }

        public getBackCell(position: core.Position, direction: Direction): Cell {
            var targetPosition = this.getBackPosition(position, direction)

            return this.fields[targetPosition.z][targetPosition.y][targetPosition.x]
        }

        public getLeftCell(position: core.Position, direction: Direction): Cell {
            var targetPosition = this.getLeftPosition(position, direction)

            return this.fields[targetPosition.z][targetPosition.y][targetPosition.x]
        }

        public getRightCell(position: core.Position, direction: Direction): Cell {
            var targetPosition = this.getRightPosition(position, direction)

            return this.fields[targetPosition.z][targetPosition.y][targetPosition.x]
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

        public static getRandomPosition(z: number = World.MIN_Z): core.Position {
            return new core.Position(utils.random(World.MAX_X), utils.random(World.MAX_Y), z)
        }

        private setFields() {
            this.fields = new Array(World.MAX_Z + 1)
            for (var k = 0; k <= World.MAX_Z; k++) {
                var rows = new Array(World.MAX_Y + 1)
                for (var j = 0; j <= World.MAX_Y; j++) {
                    var row = new Array(World.MAX_X + 1)
                    for (var i = 0; i <= World.MAX_X; i++) {
                        row[i] = new Cell(Field.FLAT)
                        switch (dice()) {
                            case 4:
                                row[i].treasure = World.getTreasureBox()
                                break
                            case 5:
                                row[i].spring = World.getSpring()
                                break
                            case 6:
                                row[i] = World.getBlock()
                                break
                        }
                    }
                    rows[j] = row
                }
                this.fields[k] = rows
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

        private setObjects() {
            // 登り階段の設置
            for (var z = World.MIN_Z; z < World.MAX_Z; z++) {
                let upX = utils.random(World.MAX_X)
                let upY = utils.random(World.MAX_Y)
                var upCell = this.fields[z][upY][upX]
                upCell.field = Field.UPSTAIRS
                upCell.treasure = null
                upCell.block = null
            }

            // 降り階段の設置
            for (var z = World.MIN_Z; z <= World.MAX_Z; z++) {
                var downX: number
                var downY: number
                var downCell: Cell
                while (true) {
                    downX = utils.random(World.MAX_X)
                    downY = utils.random(World.MAX_Y)
                    downCell = this.fields[z][downY][downX]
                    if (downCell.field != Field.DOWNSTAIRS) {
                        break
                    }
                }
                downCell.field = Field.DOWNSTAIRS
                downCell.treasure = null
                downCell.block = null
                if (z == World.MIN_Z) {
                    this.goalPosition = new core.Position(z, downY, downX)
                }
            }

            // 秘宝を設置
            var treasureX: number
            var treasureY: number
            var treasureZ: number
            var treasureCell: Cell
            while (true) {
                treasureX = utils.random(World.MAX_Y)
                treasureY = utils.random(World.MAX_X)
                treasureZ = utils.random(World.MAX_X)
                treasureCell = this.fields[treasureZ][treasureY][treasureX]
                if (treasureZ != World.MIN_Z && treasureCell.field != Field.DOWNSTAIRS && treasureCell.field != Field.UPSTAIRS) {
                    break
                }
            }
            treasureCell.field = Field.FLAT
            var item = new Item(`秘宝「${faker.commerce.productName()}」`, ItemType.TREASURE)
            let lock = dice()
            treasureCell.treasure = new TreasureBox(item, lock, true)
            treasureCell.block = null
            this.treasurePosition = new Position(treasureX, treasureY, treasureZ)
        }
    }
}