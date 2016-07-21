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
        public static random(): Trap {
            var trap: Trap = null
            switch (dice(2)) {
                case 5:
                    trap = new Trap('ワープゾーン', TrapType.WARP)
                    break
                case 6:
                    trap = new Trap('回転床', TrapType.ROTATION)
                    break
                case 7:
                    trap = new Trap('投石', TrapType.SLING, TargetRange.ONE, 5, 1)
                    break
                case 8:
                    trap = new Trap('クロスボウの矢', TrapType.CROSSBOW, TargetRange.ONE, 10, 5)
                    break
                case 9:
                    trap = new Trap('毒ガス', TrapType.GAS, TargetRange.ALL, 20, 1)
                    break
                case 10:
                    trap = new Trap('爆弾', TrapType.BOMB, TargetRange.ALL, 40, 4)
                    break
                case 12:
                    trap = new Trap('チェーンソー', TrapType.CHAINSAW, TargetRange.ONE, 10000)
                    break
                default:
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