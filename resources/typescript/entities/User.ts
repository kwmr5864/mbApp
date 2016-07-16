///<reference path="../core/LimitedValue.ts"/>
///<reference path="../enums/ItemType.ts"/>
///<reference path="./LifeObject.ts"/>

module entities {
    import LimitedValue = core.LimitedValue;
    import ItemType = enums.ItemType;
    export class User extends LifeObject {
        public food: LimitedValue
        constructor(public name: string) {
            super(name)
            this.food = new LimitedValue(1000)
        }
        public flow() {
            if (this.food.current < 1) {
                this.life.current--
            } else {
                this.food.current--
            }
        }
        public useItem(item: Item) {
            switch (item.itemType) {
                case ItemType.OINTMENT:
                    this.life.add(this.life.max / 2)
                    break
                case ItemType.MEAT:
                    this.food.add(this.food.max / 10)
                    break
                case ItemType.PAPER:
                    break
            }
        }
    }
}