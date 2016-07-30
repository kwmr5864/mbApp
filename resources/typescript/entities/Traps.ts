///<reference path="../enums/TrapType.ts"/>
///<reference path="../enums/TargetRange.ts"/>
///<reference path="../utils/common.ts"/>

module entities {
    import dice = utils.dice
    import TrapType = enums.TrapType;
    import TargetRange = enums.TargetRange;
    export class Trap {
        constructor(
            public name: string,
            public type: TrapType,
            public range: TargetRange = TargetRange.NONE,
            public baseAmount: number = 0,
            public addAmount: number = 0
        ) {}
        public static random(level: number): Trap {
            var trap: Trap = null
            var warp = new Trap('ワープゾーン', TrapType.WARP)
            var rotation = new Trap('回転床', TrapType.ROTATION)

            switch (level) {
                case 1:
                    switch (dice()) {
                        case 1:
                            trap = rotation
                            break
                        case 2:
                            trap = new Trap('投石', TrapType.SLING, TargetRange.ONE, 0, 1)
                            break
                    }
                    break
                case 2:
                    switch (dice()) {
                        case 1:
                            trap = rotation
                            break
                        case 2:
                            trap = new Trap('クロスボウの矢', TrapType.CROSSBOW, TargetRange.ONE, 0, 5)
                            break
                        case 3:
                            trap = new Trap('落石', TrapType.SLING, TargetRange.ALL, 0, 5)
                            break
                    }
                    break
                case 3:
                    switch (dice()) {
                        case 1:
                            trap = rotation
                            break
                        case 2:
                            trap = new Trap('火炎放射', TrapType.BOMB, TargetRange.ONE, 0, 10)
                            break
                        case 3:
                            trap = new Trap('毒ガス', TrapType.GAS, TargetRange.ALL, 20, 1)
                            break
                        case 4:
                            trap = warp
                            break
                    }
                    break
                case 4:
                    switch (dice()) {
                        case 1:
                            trap = rotation
                            break
                        case 2:
                            trap = new Trap('電撃', TrapType.BOMB, TargetRange.ONE, 0, 15)
                            break
                        case 3:
                            trap = new Trap('爆弾', TrapType.BOMB, TargetRange.ALL, 0, 10)
                            break
                        case 4:
                            trap = warp
                            break
                        case 5:
                            trap = new Trap('チェーンソー', TrapType.CHAINSAW, TargetRange.ONE, 10000)
                            break
                    }
                    break
            }

            return trap
        }
        public operate(): number {
            var damage = this.baseAmount + dice(this.addAmount)

            return damage
        }
    }
}