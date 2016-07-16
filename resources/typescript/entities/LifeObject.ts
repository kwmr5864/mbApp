///<reference path="../core/LimitedValue.ts"/>
///<reference path="../enums/ItemType.ts"/>

module entities {
    import LimitedValue = core.LimitedValue;
    import ItemType = enums.ItemType
    export abstract class LifeObject {
        public life: LimitedValue
        public items: Item[] = []
        public itemLimit: number = 3
        constructor(public name: string, private _life: number = 100) {
            this.life = new LimitedValue(_life)
        }
        public addItem(item: Item) {
            if (this.items.length <= this.itemLimit) {
                this.items.push(item)
            }
        }
        public addRandomItem() {
            var item = Item.getRandom()
            if (item != null) {
                this.addItem(item)
            }
        }
    }
}