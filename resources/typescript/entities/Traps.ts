///<reference path="../enums/TargetRange.ts"/>
///<reference path="../utils/common.ts"/>

module entities {
    import dice = utils.dice
    import TargetRange = enums.TargetRange;
    export class Trap {
        constructor(public name: string, public range: TargetRange, public base: number) {}
        public static random(): Trap {
            var trap: Trap = null
            switch (dice()) {
                case 1:
                    trap = new Sling()
                    break
                case 2:
                    trap = new Crossbow()
                    break
                case 3:
                    trap = new Gas()
                    break
                case 4:
                    trap = new Bomb()
                    break
                default:
                    break
            }

            return trap
        }
        public operate(): number {
            var damage = this.base + dice()

            return damage
        }
    }
    export class Sling extends Trap {
        constructor() {
            super('投石', TargetRange.ONE, 5)
        }
    }
    export class Crossbow extends Trap {
        constructor() {
            super('クロスボウの矢', TargetRange.ONE, 30)
        }
    }
    export class Gas extends Trap {
        constructor() {
            super('毒ガス', TargetRange.ALL, 20)
        }
    }
    export class Bomb extends Trap {
        constructor() {
            super('爆弾', TargetRange.ALL, 50)
        }
    }
}