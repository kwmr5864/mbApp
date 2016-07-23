///<reference path="../utils/common.ts"/>
///<reference path="../enums/ItemType.ts"/>
///<reference path="./LifeObject.ts"/>

module entities {
    import ItemType = enums.ItemType
    import dice = utils.dice
    export class Item extends LifeObject {
        public description: string
        constructor(public name: string, public itemType: ItemType) {
            super(name, 1)
        }
        public static getRandom(): Item {
            var item: Item = null
            switch (dice()) {
                case 1:
                case 2:
                    item = new Item('塗り薬', ItemType.OINTMENT)
                    break
                case 3:
                case 4:
                    item = new Item('肉', ItemType.MEAT)
                    break
                case 5:
                    item = new Item('紙切れ', ItemType.PAPER)
                    break
            }
            return item
        }
    }
}