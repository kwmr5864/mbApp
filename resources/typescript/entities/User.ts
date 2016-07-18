///<reference path="../core/LimitedValue.ts"/>
///<reference path="../enums/ItemType.ts"/>
///<reference path="./LifeObject.ts"/>

module entities {
    import LimitedValue = core.LimitedValue;
    import ItemType = enums.ItemType;
    export class User extends LifeObject {
        public food: LimitedValue
        public water: LimitedValue
        constructor(public name: string) {
            super(name)
            this.food = new LimitedValue(1000)
            this.water = new LimitedValue(2000)
        }
        public flow() {
            if (this.water.current < 1) {
                this.life.sub(1)
            } else {
                this.water.sub(3)
            }
            if (this.food.current < 1) {
                this.life.sub(1)
            } else {
                this.food.sub(2)
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