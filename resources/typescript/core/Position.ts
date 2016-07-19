///<reference path="../enums/Direction.ts"/>

module core {
    import Direction = enums.Direction;
    export class Position {
        constructor(public x: number, public y: number) {}
        getForward(direction: Direction): core.Position {
            var position: core.Position
            switch (direction) {
                case Direction.NORTH:
                    position = new core.Position(this.x, this.y - 1)
                    break
                case Direction.EAST:
                    position = new core.Position(this.x + 1, this.y)
                    break
                case Direction.SOUTH:
                    position = new core.Position(this.x, this.y + 1)
                    break
                case Direction.WEST:
                    position = new core.Position(this.x - 1, this.y)
                    break
                default:
                    position = new core.Position(-1, -1)
                    break
            }
            return position
        }
        getLeft(direction: Direction) {
            var position: core.Position
            switch (direction) {
                case Direction.NORTH:
                    position = new core.Position(this.x - 1, this.y)
                    break
                case Direction.EAST:
                    position = new core.Position(this.x, this.y - 1)
                    break
                case Direction.SOUTH:
                    position = new core.Position(this.x + 1, this.y)
                    break
                case Direction.WEST:
                    position = new core.Position(this.x, this.y + 1)
                    break
                default:
                    position = new core.Position(-1, -1)
                    break
            }
            return position
        }
        getRight(direction: Direction) {
            var position: core.Position
            switch (direction) {
                case Direction.NORTH:
                    position = new core.Position(this.x + 1, this.y)
                    break
                case Direction.EAST:
                    position = new core.Position(this.x, this.y + 1)
                    break
                case Direction.SOUTH:
                    position = new core.Position(this.x - 1, this.y)
                    break
                case Direction.WEST:
                    position = new core.Position(this.x, this.y - 1)
                    break
                default:
                    position = new core.Position(-1, -1)
                    break
            }
            return position
        }
        getBack(direction: Direction): core.Position {
            var position: core.Position
            switch (direction) {
                case Direction.NORTH:
                    position = new core.Position(this.x, this.y + 1)
                    break
                case Direction.EAST:
                    position = new core.Position(this.x - 1, this.y)
                    break
                case Direction.SOUTH:
                    position = new core.Position(this.x, this.y - 1)
                    break
                case Direction.WEST:
                    position = new core.Position(this.x + 1, this.y)
                    break
                default:
                    position = new core.Position(-1, -1)
                    break
            }
            return position
        }
    }
}