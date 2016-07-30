///<reference path="../enums/Direction.ts"/>

module core {
    import Direction = enums.Direction;
    export class Position {
        constructor(public x: number, public y: number, public z: number) {}
        getForward(direction: Direction): core.Position {
            var position: core.Position
            switch (direction) {
                case Direction.NORTH:
                    position = new core.Position(this.x, this.y - 1, this.z)
                    break
                case Direction.EAST:
                    position = new core.Position(this.x + 1, this.y, this.z)
                    break
                case Direction.SOUTH:
                    position = new core.Position(this.x, this.y + 1, this.z)
                    break
                case Direction.WEST:
                    position = new core.Position(this.x - 1, this.y, this.z)
                    break
                default:
                    position = new core.Position(-1, -1, -1)
                    break
            }
            return position
        }
        getLeft(direction: Direction) {
            var position: core.Position
            switch (direction) {
                case Direction.NORTH:
                    position = new core.Position(this.x - 1, this.y, this.z)
                    break
                case Direction.EAST:
                    position = new core.Position(this.x, this.y - 1, this.z)
                    break
                case Direction.SOUTH:
                    position = new core.Position(this.x + 1, this.y, this.z)
                    break
                case Direction.WEST:
                    position = new core.Position(this.x, this.y + 1, this.z)
                    break
                default:
                    position = new core.Position(-1, -1, -1)
                    break
            }
            return position
        }
        getRight(direction: Direction) {
            var position: core.Position
            switch (direction) {
                case Direction.NORTH:
                    position = new core.Position(this.x + 1, this.y, this.z)
                    break
                case Direction.EAST:
                    position = new core.Position(this.x, this.y + 1, this.z)
                    break
                case Direction.SOUTH:
                    position = new core.Position(this.x - 1, this.y, this.z)
                    break
                case Direction.WEST:
                    position = new core.Position(this.x, this.y - 1, this.z)
                    break
                default:
                    position = new core.Position(-1, -1, -1)
                    break
            }
            return position
        }
        getBack(direction: Direction): core.Position {
            var position: core.Position
            switch (direction) {
                case Direction.NORTH:
                    position = new core.Position(this.x, this.y + 1, this.z)
                    break
                case Direction.EAST:
                    position = new core.Position(this.x - 1, this.y, this.z)
                    break
                case Direction.SOUTH:
                    position = new core.Position(this.x, this.y - 1, this.z)
                    break
                case Direction.WEST:
                    position = new core.Position(this.x + 1, this.y, this.z)
                    break
                default:
                    position = new core.Position(-1, -1, -1)
                    break
            }
            return position
        }
        toString(): string {
            return `(${this.x},${this.y})`
        }
    }
}