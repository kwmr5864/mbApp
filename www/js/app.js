var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var enums;
(function (enums) {
    (function (Field) {
        Field[Field["WALL"] = 0] = "WALL";
        Field[Field["FLAT"] = 1] = "FLAT";
        Field[Field["BLOCK"] = 2] = "BLOCK";
        Field[Field["GOAL"] = 3] = "GOAL";
        Field[Field["UPSTAIRS"] = 4] = "UPSTAIRS";
        Field[Field["DOWNSTAIRS"] = 5] = "DOWNSTAIRS";
    })(enums.Field || (enums.Field = {}));
    var Field = enums.Field;
})(enums || (enums = {}));
var enums;
(function (enums) {
    (function (Direction) {
        Direction[Direction["NORTH"] = 0] = "NORTH";
        Direction[Direction["EAST"] = 1] = "EAST";
        Direction[Direction["SOUTH"] = 2] = "SOUTH";
        Direction[Direction["WEST"] = 3] = "WEST";
    })(enums.Direction || (enums.Direction = {}));
    var Direction = enums.Direction;
})(enums || (enums = {}));
var enums;
(function (enums) {
    (function (EmphasisColor) {
        EmphasisColor[EmphasisColor["DEFAULT"] = 1] = "DEFAULT";
        EmphasisColor[EmphasisColor["DANGER"] = 2] = "DANGER";
        EmphasisColor[EmphasisColor["ALERT"] = 3] = "ALERT";
        EmphasisColor[EmphasisColor["SUCCESS"] = 4] = "SUCCESS";
        EmphasisColor[EmphasisColor["INFO"] = 5] = "INFO";
        EmphasisColor[EmphasisColor["INVERSE"] = 6] = "INVERSE";
    })(enums.EmphasisColor || (enums.EmphasisColor = {}));
    var EmphasisColor = enums.EmphasisColor;
})(enums || (enums = {}));
var core;
(function (core) {
    var LimitedValue = (function () {
        function LimitedValue(current) {
            this.current = current;
            this.max = current;
        }
        LimitedValue.prototype.add = function (value) {
            this.current += value;
            if (this.max < this.current) {
                this.current = this.max;
            }
        };
        LimitedValue.prototype.sub = function (value) {
            this.current -= value;
            if (this.current < 0) {
                this.current = 0;
            }
        };
        LimitedValue.prototype.expand = function (value) {
            this.max += value;
        };
        LimitedValue.prototype.contract = function (value) {
            this.max -= value;
        };
        LimitedValue.prototype.isMax = function () {
            return this.max <= this.current;
        };
        LimitedValue.prototype.impression = function () {
            if (this.max <= this.current) {
                return '';
            }
            else if (this.current < 5) {
                return ' (ボロボロ)';
            }
            else if (this.current < 10) {
                return ' (傷だらけ)';
            }
            else if (this.current < 30) {
                return ' (傷がある)';
            }
            else if (this.current < 1000) {
                return '';
            }
            else {
                return ' (壊せそうにない)';
            }
        };
        return LimitedValue;
    }());
    core.LimitedValue = LimitedValue;
})(core || (core = {}));
var entities;
(function (entities) {
    var LimitedValue = core.LimitedValue;
    var LifeObject = (function () {
        function LifeObject(name, _life) {
            if (_life === void 0) { _life = 100; }
            this.name = name;
            this._life = _life;
            this.life = new LimitedValue(_life);
        }
        return LifeObject;
    }());
    entities.LifeObject = LifeObject;
})(entities || (entities = {}));
var utils;
(function (utils) {
    function dice(count) {
        if (count === void 0) { count = 1; }
        var result = 0;
        for (var i = 0; i < count; i++) {
            result += random(6);
        }
        return result;
    }
    utils.dice = dice;
    function random(max) {
        var result = Math.ceil(Math.random() * max);
        return result;
    }
    utils.random = random;
})(utils || (utils = {}));
var entities;
(function (entities) {
    var dice = utils.dice;
    var Block = (function (_super) {
        __extends(Block, _super);
        function Block(_name, _life, hasTreasure) {
            if (hasTreasure === void 0) { hasTreasure = false; }
            _super.call(this, _name, _life);
            this._name = _name;
            this._life = _life;
            this.hasTreasure = hasTreasure;
        }
        return Block;
    }(entities.LifeObject));
    entities.Block = Block;
    var Wall = (function (_super) {
        __extends(Wall, _super);
        function Wall() {
            _super.call(this, faker.lorem.words(1) + "\u3068\u66F8\u304B\u308C\u305F\u58C1", 9999);
        }
        return Wall;
    }(Block));
    entities.Wall = Wall;
    var Rock = (function (_super) {
        __extends(Rock, _super);
        function Rock() {
            _super.call(this, faker.commerce.productAdjective() + "\u306A\u5CA9", 30 + dice());
        }
        return Rock;
    }(Block));
    entities.Rock = Rock;
    var Tree = (function (_super) {
        __extends(Tree, _super);
        function Tree() {
            _super.call(this, faker.commerce.productAdjective() + "\u306A\u6728", 10 + dice());
        }
        return Tree;
    }(Block));
    entities.Tree = Tree;
    var WoodenBox = (function (_super) {
        __extends(WoodenBox, _super);
        function WoodenBox() {
            _super.call(this, faker.lorem.words(1) + "\u3068\u66F8\u304B\u308C\u305F\u6728\u7BB1", 10 + dice(2), true);
        }
        return WoodenBox;
    }(Block));
    entities.WoodenBox = WoodenBox;
    var Tussock = (function (_super) {
        __extends(Tussock, _super);
        function Tussock() {
            _super.call(this, faker.commerce.color() + "\u306E\u8349\u3080\u3089", dice());
        }
        return Tussock;
    }(Block));
    entities.Tussock = Tussock;
})(entities || (entities = {}));
var enums;
(function (enums) {
    (function (ItemType) {
        ItemType[ItemType["TREASURE"] = 1] = "TREASURE";
        ItemType[ItemType["COMPASS"] = 2] = "COMPASS";
        ItemType[ItemType["OINTMENT"] = 3] = "OINTMENT";
        ItemType[ItemType["MEAT"] = 4] = "MEAT";
        ItemType[ItemType["KEY"] = 5] = "KEY";
        ItemType[ItemType["PAPER"] = 6] = "PAPER";
    })(enums.ItemType || (enums.ItemType = {}));
    var ItemType = enums.ItemType;
})(enums || (enums = {}));
var entities;
(function (entities) {
    var ItemType = enums.ItemType;
    var dice = utils.dice;
    var Item = (function (_super) {
        __extends(Item, _super);
        function Item(name, itemType) {
            _super.call(this, name, 1);
            this.name = name;
            this.itemType = itemType;
        }
        Item.getRandom = function () {
            var item = null;
            switch (dice()) {
                case 1:
                    item = new Item('塗り薬', ItemType.OINTMENT);
                    break;
                case 2:
                    item = new Item('肉', ItemType.MEAT);
                    break;
                case 3:
                    item = new Item("\u30B3\u30F3\u30D1\u30B9", ItemType.COMPASS);
                    break;
                case 4:
                    item = new Item('紙切れ', ItemType.PAPER);
                    break;
            }
            return item;
        };
        return Item;
    }(entities.LifeObject));
    entities.Item = Item;
})(entities || (entities = {}));
var entities;
(function (entities) {
    var TreasureBox = (function (_super) {
        __extends(TreasureBox, _super);
        function TreasureBox(item, lock, unbreakable) {
            if (lock === void 0) { lock = 0; }
            if (unbreakable === void 0) { unbreakable = false; }
            _super.call(this, faker.commerce.color() + " " + faker.commerce.productMaterial() + "\u306E\u5B9D\u7BB1", 50);
            this.item = item;
            this.lock = lock;
            this.unbreakable = unbreakable;
        }
        return TreasureBox;
    }(entities.LifeObject));
    entities.TreasureBox = TreasureBox;
})(entities || (entities = {}));
var enums;
(function (enums) {
    (function (SpringType) {
        SpringType[SpringType["WATER"] = 1] = "WATER";
        SpringType[SpringType["POISON"] = 2] = "POISON";
        SpringType[SpringType["LIFE_UP"] = 3] = "LIFE_UP";
        SpringType[SpringType["LIFE_DOWN"] = 4] = "LIFE_DOWN";
    })(enums.SpringType || (enums.SpringType = {}));
    var SpringType = enums.SpringType;
})(enums || (enums = {}));
var entities;
(function (entities) {
    var SpringType = enums.SpringType;
    var dice = utils.dice;
    var Spring = (function (_super) {
        __extends(Spring, _super);
        function Spring(type, baseAmount) {
            if (type === void 0) { type = SpringType.WATER; }
            if (baseAmount === void 0) { baseAmount = 1; }
            _super.call(this, faker.commerce.color() + "\u306E\u6E67\u304D\u6C34", Math.ceil(dice() / 2));
            this.type = type;
            this.baseAmount = baseAmount;
        }
        Spring.prototype.getAmount = function () {
            return dice(this.baseAmount);
        };
        return Spring;
    }(entities.LifeObject));
    entities.Spring = Spring;
})(entities || (entities = {}));
var core;
(function (core) {
    var Cell = (function () {
        function Cell(field) {
            this.field = field;
        }
        return Cell;
    }());
    core.Cell = Cell;
})(core || (core = {}));
var core;
(function (core) {
    var Direction = enums.Direction;
    var Position = (function () {
        function Position(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        Position.prototype.getForward = function (direction) {
            var position;
            switch (direction) {
                case Direction.NORTH:
                    position = new core.Position(this.x, this.y - 1, this.z);
                    break;
                case Direction.EAST:
                    position = new core.Position(this.x + 1, this.y, this.z);
                    break;
                case Direction.SOUTH:
                    position = new core.Position(this.x, this.y + 1, this.z);
                    break;
                case Direction.WEST:
                    position = new core.Position(this.x - 1, this.y, this.z);
                    break;
                default:
                    position = new core.Position(-1, -1, -1);
                    break;
            }
            return position;
        };
        Position.prototype.getLeft = function (direction) {
            var position;
            switch (direction) {
                case Direction.NORTH:
                    position = new core.Position(this.x - 1, this.y, this.z);
                    break;
                case Direction.EAST:
                    position = new core.Position(this.x, this.y - 1, this.z);
                    break;
                case Direction.SOUTH:
                    position = new core.Position(this.x + 1, this.y, this.z);
                    break;
                case Direction.WEST:
                    position = new core.Position(this.x, this.y + 1, this.z);
                    break;
                default:
                    position = new core.Position(-1, -1, -1);
                    break;
            }
            return position;
        };
        Position.prototype.getRight = function (direction) {
            var position;
            switch (direction) {
                case Direction.NORTH:
                    position = new core.Position(this.x + 1, this.y, this.z);
                    break;
                case Direction.EAST:
                    position = new core.Position(this.x, this.y + 1, this.z);
                    break;
                case Direction.SOUTH:
                    position = new core.Position(this.x - 1, this.y, this.z);
                    break;
                case Direction.WEST:
                    position = new core.Position(this.x, this.y - 1, this.z);
                    break;
                default:
                    position = new core.Position(-1, -1, -1);
                    break;
            }
            return position;
        };
        Position.prototype.getBack = function (direction) {
            var position;
            switch (direction) {
                case Direction.NORTH:
                    position = new core.Position(this.x, this.y + 1, this.z);
                    break;
                case Direction.EAST:
                    position = new core.Position(this.x - 1, this.y, this.z);
                    break;
                case Direction.SOUTH:
                    position = new core.Position(this.x, this.y - 1, this.z);
                    break;
                case Direction.WEST:
                    position = new core.Position(this.x + 1, this.y, this.z);
                    break;
                default:
                    position = new core.Position(-1, -1, -1);
                    break;
            }
            return position;
        };
        Position.prototype.toString = function () {
            return "(" + this.x + "," + this.y + ")";
        };
        return Position;
    }());
    core.Position = Position;
})(core || (core = {}));
var core;
(function (core) {
    var dice = utils.dice;
    var Direction = enums.Direction;
    var Field = enums.Field;
    var ItemType = enums.ItemType;
    var Cell = core.Cell;
    var Item = entities.Item;
    var Spring = entities.Spring;
    var TreasureBox = entities.TreasureBox;
    var SpringType = enums.SpringType;
    var World = (function () {
        function World(name) {
            if (name === void 0) { name = ''; }
            this.name = name;
            if (name == '') {
                faker.locale = 'ja';
                this.name = "\u30A8\u30EA\u30A2\u300E" + faker.address.streetName() + "\u300F";
            }
        }
        World.prototype.make = function () {
            this.setFields();
            this.setObjects();
        };
        World.prototype.getCell = function (position) {
            var targetPosition = this.fields[position.z][position.y][position.x];
            return targetPosition;
        };
        World.prototype.getForwardCell = function (position, direction) {
            var targetPosition = this.getForwardPosition(position, direction);
            return this.fields[targetPosition.z][targetPosition.y][targetPosition.x];
        };
        World.prototype.getBackCell = function (position, direction) {
            var targetPosition = this.getBackPosition(position, direction);
            return this.fields[targetPosition.z][targetPosition.y][targetPosition.x];
        };
        World.prototype.getLeftCell = function (position, direction) {
            var targetPosition = this.getLeftPosition(position, direction);
            return this.fields[targetPosition.z][targetPosition.y][targetPosition.x];
        };
        World.prototype.getRightCell = function (position, direction) {
            var targetPosition = this.getRightPosition(position, direction);
            return this.fields[targetPosition.z][targetPosition.y][targetPosition.x];
        };
        World.prototype.getForwardPosition = function (position, direction) {
            var targetPosition = position.getForward(direction);
            switch (direction) {
                case Direction.NORTH:
                    if (targetPosition.y < World.MIN_Y) {
                        targetPosition.y = World.MAX_Y;
                    }
                    break;
                case Direction.EAST:
                    if (World.MAX_X < targetPosition.x) {
                        targetPosition.x = World.MIN_X;
                    }
                    break;
                case Direction.SOUTH:
                    if (World.MAX_Y < targetPosition.y) {
                        targetPosition.y = World.MIN_Y;
                    }
                    break;
                case Direction.WEST:
                    if (targetPosition.x < World.MIN_X) {
                        targetPosition.x = World.MAX_X;
                    }
                    break;
            }
            return targetPosition;
        };
        World.prototype.getBackPosition = function (position, direction) {
            var targetPosition = position.getBack(direction);
            switch (direction) {
                case Direction.NORTH:
                    if (World.MAX_Y < targetPosition.y) {
                        targetPosition.y = World.MIN_Y;
                    }
                    break;
                case Direction.EAST:
                    if (targetPosition.x < World.MIN_X) {
                        targetPosition.x = World.MAX_X;
                    }
                    break;
                case Direction.SOUTH:
                    if (targetPosition.y < World.MIN_Y) {
                        targetPosition.y = World.MAX_Y;
                    }
                    break;
                case Direction.WEST:
                    if (World.MAX_X < targetPosition.x) {
                        targetPosition.x = World.MIN_X;
                    }
                    break;
            }
            return targetPosition;
        };
        World.prototype.getLeftPosition = function (position, direction) {
            var targetPosition = position.getLeft(direction);
            switch (direction) {
                case Direction.NORTH:
                    if (targetPosition.x < World.MIN_X) {
                        targetPosition.x = World.MAX_X;
                    }
                    break;
                case Direction.EAST:
                    if (targetPosition.y < World.MIN_Y) {
                        targetPosition.y = World.MAX_Y;
                    }
                    break;
                case Direction.SOUTH:
                    if (World.MAX_X < targetPosition.x) {
                        targetPosition.x = World.MIN_X;
                    }
                    break;
                case Direction.WEST:
                    if (World.MAX_Y < targetPosition.y) {
                        targetPosition.y = World.MIN_Y;
                    }
                    break;
            }
            return targetPosition;
        };
        World.prototype.getRightPosition = function (position, direction) {
            var targetPosition = position.getRight(direction);
            switch (direction) {
                case Direction.NORTH:
                    if (World.MAX_X < targetPosition.x) {
                        targetPosition.x = World.MIN_X;
                    }
                    break;
                case Direction.EAST:
                    if (World.MAX_Y < targetPosition.y) {
                        targetPosition.y = World.MIN_Y;
                    }
                    break;
                case Direction.SOUTH:
                    if (targetPosition.x < World.MIN_X) {
                        targetPosition.x = World.MAX_X;
                    }
                    break;
                case Direction.WEST:
                    if (targetPosition.y < World.MIN_Y) {
                        targetPosition.y = World.MAX_Y;
                    }
                    break;
            }
            return targetPosition;
        };
        World.getRandomPosition = function (z) {
            if (z === void 0) { z = World.MIN_Z; }
            return new core.Position(utils.random(World.MAX_X), utils.random(World.MAX_Y), z);
        };
        World.prototype.setFields = function () {
            this.fields = new Array(World.MAX_Z + 1);
            for (var k = 0; k <= World.MAX_Z; k++) {
                var rows = new Array(World.MAX_Y + 1);
                for (var j = 0; j <= World.MAX_Y; j++) {
                    var row = new Array(World.MAX_X + 1);
                    for (var i = 0; i <= World.MAX_X; i++) {
                        row[i] = new Cell(Field.FLAT);
                        switch (dice()) {
                            case 4:
                                row[i].treasure = World.getTreasureBox();
                                break;
                            case 5:
                                row[i].spring = World.getSpring();
                                break;
                            case 6:
                                row[i] = World.getBlock();
                                break;
                        }
                    }
                    rows[j] = row;
                }
                this.fields[k] = rows;
            }
        };
        World.getTreasureBox = function () {
            var item = Item.getRandom();
            var lock = dice() - 1;
            return new TreasureBox(item, lock);
        };
        World.getSpring = function () {
            var springType = SpringType.WATER;
            var baseAmount = 2;
            switch (dice()) {
                case 1:
                    springType = SpringType.POISON;
                    break;
                case 2:
                    springType = SpringType.LIFE_UP;
                    baseAmount = 1;
                    break;
                case 3:
                    springType = SpringType.LIFE_DOWN;
                    baseAmount = 1;
                    break;
            }
            return new Spring(springType);
        };
        World.getBlock = function () {
            var cell = new Cell(Field.FLAT);
            cell.field = Field.BLOCK;
            switch (dice()) {
                case 1:
                    cell.field = Field.WALL;
                    cell.block = new entities.Wall();
                    break;
                case 2:
                    cell.block = new entities.Rock();
                    break;
                case 3:
                    cell.block = new entities.Tree();
                    break;
                case 4:
                    cell.block = new entities.Tussock();
                    break;
                default:
                    cell.block = new entities.WoodenBox();
                    break;
            }
            return cell;
        };
        World.prototype.setObjects = function () {
            for (var z = World.MIN_Z; z < World.MAX_Z; z++) {
                var upX = utils.random(World.MAX_X);
                var upY = utils.random(World.MAX_Y);
                var upCell = this.fields[z][upY][upX];
                upCell.field = Field.UPSTAIRS;
                upCell.treasure = null;
                upCell.block = null;
            }
            for (var z = World.MIN_Z; z <= World.MAX_Z; z++) {
                var downX;
                var downY;
                var downCell;
                while (true) {
                    downX = utils.random(World.MAX_X);
                    downY = utils.random(World.MAX_Y);
                    downCell = this.fields[z][downY][downX];
                    if (downCell.field != Field.DOWNSTAIRS) {
                        break;
                    }
                }
                downCell.field = Field.DOWNSTAIRS;
                downCell.treasure = null;
                downCell.block = null;
                if (z == World.MIN_Z) {
                    this.goalPosition = new core.Position(z, downY, downX);
                }
            }
            var treasureX;
            var treasureY;
            var treasureZ;
            var treasureCell;
            while (true) {
                treasureX = utils.random(World.MAX_Y);
                treasureY = utils.random(World.MAX_X);
                treasureZ = utils.random(World.MAX_X);
                treasureCell = this.fields[treasureZ][treasureY][treasureX];
                if (treasureZ != World.MIN_Z && treasureCell.field != Field.DOWNSTAIRS && treasureCell.field != Field.UPSTAIRS) {
                    break;
                }
            }
            treasureCell.field = Field.FLAT;
            var item = new Item("\u79D8\u5B9D\u300C" + faker.commerce.productName() + "\u300D", ItemType.TREASURE);
            var lock = dice();
            treasureCell.treasure = new TreasureBox(item, lock, true);
            treasureCell.block = null;
            this.treasurePosition = new core.Position(treasureX, treasureY, treasureZ);
        };
        World.MAX_Y = 4;
        World.MIN_Y = 0;
        World.MAX_X = 4;
        World.MIN_X = 0;
        World.MAX_Z = 4;
        World.MIN_Z = 0;
        return World;
    }());
    core.World = World;
})(core || (core = {}));
var entities;
(function (entities) {
    var LimitedValue = core.LimitedValue;
    var ItemType = enums.ItemType;
    var User = (function (_super) {
        __extends(User, _super);
        function User(name) {
            _super.call(this, name);
            this.name = name;
            this.food = new LimitedValue(1000);
            this.water = new LimitedValue(2000);
        }
        User.prototype.flow = function (amount) {
            if (this.water.current < 1) {
                this.life.sub(1);
            }
            else {
                this.water.sub(amount * 2);
            }
            if (this.food.current < 1) {
                this.life.sub(1);
            }
            else {
                this.food.sub(amount);
            }
        };
        User.prototype.useItem = function (item) {
            switch (item.itemType) {
                case ItemType.OINTMENT:
                    this.life.add(this.life.max / 2);
                    break;
                case ItemType.MEAT:
                    this.food.add(this.food.max / 10);
                    break;
                case ItemType.PAPER:
                    break;
            }
        };
        return User;
    }(entities.LifeObject));
    entities.User = User;
})(entities || (entities = {}));
var enums;
(function (enums) {
    (function (TrapType) {
        TrapType[TrapType["SLING"] = 1] = "SLING";
        TrapType[TrapType["CROSSBOW"] = 2] = "CROSSBOW";
        TrapType[TrapType["CHAINSAW"] = 3] = "CHAINSAW";
        TrapType[TrapType["GAS"] = 4] = "GAS";
        TrapType[TrapType["BOMB"] = 5] = "BOMB";
        TrapType[TrapType["ROTATION"] = 6] = "ROTATION";
        TrapType[TrapType["WARP"] = 7] = "WARP";
    })(enums.TrapType || (enums.TrapType = {}));
    var TrapType = enums.TrapType;
})(enums || (enums = {}));
var enums;
(function (enums) {
    (function (TargetRange) {
        TargetRange[TargetRange["NONE"] = 0] = "NONE";
        TargetRange[TargetRange["ONE"] = 1] = "ONE";
        TargetRange[TargetRange["ALL"] = 2] = "ALL";
    })(enums.TargetRange || (enums.TargetRange = {}));
    var TargetRange = enums.TargetRange;
})(enums || (enums = {}));
var entities;
(function (entities) {
    var dice = utils.dice;
    var TrapType = enums.TrapType;
    var TargetRange = enums.TargetRange;
    var Trap = (function () {
        function Trap(name, type, range, baseAmount, addAmount) {
            if (range === void 0) { range = TargetRange.NONE; }
            if (baseAmount === void 0) { baseAmount = 0; }
            if (addAmount === void 0) { addAmount = 0; }
            this.name = name;
            this.type = type;
            this.range = range;
            this.baseAmount = baseAmount;
            this.addAmount = addAmount;
        }
        Trap.random = function () {
            var trap = null;
            switch (dice(2)) {
                case 5:
                    trap = new Trap('ワープゾーン', TrapType.WARP);
                    break;
                case 6:
                    trap = new Trap('回転床', TrapType.ROTATION);
                    break;
                case 7:
                    trap = new Trap('投石', TrapType.SLING, TargetRange.ONE, 5, 1);
                    break;
                case 8:
                    trap = new Trap('クロスボウの矢', TrapType.CROSSBOW, TargetRange.ONE, 10, 5);
                    break;
                case 9:
                    trap = new Trap('毒ガス', TrapType.GAS, TargetRange.ALL, 20, 1);
                    break;
                case 10:
                    trap = new Trap('爆弾', TrapType.BOMB, TargetRange.ALL, 40, 4);
                    break;
                case 12:
                    trap = new Trap('チェーンソー', TrapType.CHAINSAW, TargetRange.ONE, 10000);
                    break;
                default:
                    break;
            }
            return trap;
        };
        Trap.prototype.operate = function () {
            var damage = this.baseAmount + dice(this.addAmount);
            return damage;
        };
        return Trap;
    }());
    entities.Trap = Trap;
})(entities || (entities = {}));
var core;
(function (core) {
    var LocalStorage = (function () {
        function LocalStorage() {
        }
        LocalStorage.get = function (key) {
            var data = localStorage.getItem(key);
            var value = data;
            return JSON.parse(value);
        };
        LocalStorage.set = function (key, value) {
            var data = JSON.stringify(value);
            localStorage[key] = data;
        };
        LocalStorage.CRYPTO_SECRET_KEY = 'mbapp';
        return LocalStorage;
    }());
    core.LocalStorage = LocalStorage;
})(core || (core = {}));
var models;
(function (models) {
    var Users = (function () {
        function Users() {
        }
        Users.find = function () {
            var rows = core.LocalStorage.get("users");
            var users = (rows != null) ? rows.map(function (row) {
                var user = new entities.User(row.name);
                user.life.current = row.life.current;
                user.life.max = row.life.max;
                user.food.current = row.food.current;
                user.food.max = row.food.max;
                user.water.current = row.water.current;
                user.water.max = row.water.max;
                return user;
            }) : [];
            return users;
        };
        Users.save = function (users) {
            core.LocalStorage.set("users", users);
        };
        Users.add = function (user) {
            var users = this.find();
            if (!Array.isArray(users)) {
                users = [];
            }
            users.push(user);
            Users.save(users);
        };
        Users.delete = function (userName) {
            var users = this.find();
            for (var i in users) {
                if (userName === users[i].name) {
                    users.splice(parseInt(i), 1);
                }
            }
            Users.save(users);
        };
        Users.clear = function () {
            Users.save([]);
        };
        return Users;
    }());
    models.Users = Users;
})(models || (models = {}));
var Direction = enums.Direction;
var Field = enums.Field;
var TargetRange = enums.TargetRange;
var EmphasisColor = enums.EmphasisColor;
var ItemType = enums.ItemType;
var SpringType = enums.SpringType;
var TrapType = enums.TrapType;
var Item = entities.Item;
var TreasureBox = entities.TreasureBox;
var Trap = entities.Trap;
var User = entities.User;
var Users = models.Users;
var random = utils.random;
var dice = utils.dice;
var World = core.World;
var appVm = new Vue({
    el: '#app',
    data: {
        topMessage: '',
        mainMessages: [],
        txt: '',
        users: models.Users.find(),
        world: new core.World(),
        position: World.getRandomPosition(),
        direction: {
            value: Direction.NORTH,
            display: '',
        },
        has: {
            treasure: false,
        },
        enable: {
            compass: false,
        },
        stock: {
            money: 400,
            key: 20,
            compass: 0,
        },
    },
    methods: {
        addMember: function () {
            var name = this.txt.trim();
            if (name == '') {
                name = faker.name.lastName() + " " + faker.name.firstName();
            }
            var added = false;
            for (var i = 0; i < this.users.length; i++) {
                if (name == this.users[i].name) {
                    added = true;
                    break;
                }
            }
            var basePrice = 100;
            if (added) {
                this.addMessage(name + "\u306F\u30C1\u30FC\u30E0\u306B\u52A0\u5165\u6E08\u307F\u3067\u3059!");
            }
            else if (this.stock.money < basePrice) {
                this.addMessage("\u30E1\u30F3\u30D0\u3092\u52A0\u3048\u308B\u306B\u306F " + basePrice + " \u91D1\u306E\u4F9D\u983C\u6599\u3092\u652F\u6255\u3046\u5FC5\u8981\u304C\u3042\u308B.");
            }
            else {
                var user = new User(name);
                Users.add(user);
                this.users = Users.find();
                this.addMessage("\u4F9D\u983C\u6599\u3092 " + basePrice + " \u91D1\u652F\u6255\u3063\u3066" + name + "\u3092\u30C1\u30FC\u30E0\u306B\u52A0\u3048\u305F!", EmphasisColor.SUCCESS);
                this.stock.money -= basePrice;
            }
            this.txt = '';
        },
        removeUser: function (userName) {
            for (var i = 0; i < this.users.length; i++) {
                var user = this.users[i];
                if (userName === user.name) {
                    var basePrice = 50;
                    if (this.stock.money < basePrice) {
                        this.addMessage("\u30E1\u30F3\u30D0\u3092\u9664\u540D\u3059\u308B\u306B\u306F " + basePrice + " \u91D1\u306E\u6170\u8B1D\u6599\u3092\u652F\u6255\u3046\u5FC5\u8981\u304C\u3042\u308B.");
                    }
                    else {
                        Users.delete(userName);
                        this.users = Users.find();
                        this.addMessage("\u6170\u8B1D\u6599\u3092 " + basePrice + " \u91D1\u652F\u6255\u3063\u3066" + userName + "\u3092\u9664\u540D\u3057\u305F.");
                        this.stock.money -= basePrice;
                    }
                }
            }
        },
        dissolution: function () {
            models.Users.clear();
            this.users = models.Users.find();
            this.addMessage('チームを解散した...');
        },
        rest: function () {
            this.addMessage('休憩中...');
            for (var i = 0; i < this.users.length; i++) {
                var user = this.users[i];
                if (0 < user.food.current) {
                    user.life.add(dice());
                }
                if (user.life.isMax()) {
                    this.addUserMessage('体調は万全だ!', user);
                }
            }
            this.flow(1);
            this.afterAction();
            this.after();
        },
        search: function () {
            var target = this.world.getCell(this.position);
            switch (target.field) {
                case Field.DOWNSTAIRS:
                    if (World.MIN_Z < this.position.z) {
                        this.addMessage('下に降りる階段がある.', EmphasisColor.INFO);
                    }
                    else {
                        this.addMessage('島を脱出する船着き場がある.', EmphasisColor.INFO);
                    }
                    break;
                case Field.UPSTAIRS:
                    this.addMessage('上に登る階段がある.', EmphasisColor.INFO);
                    break;
                default:
                    if (target.treasure != null) {
                        this.addMessage(target.treasure.name + "\u3092\u898B\u3064\u3051\u305F.", EmphasisColor.INVERSE);
                    }
                    else if (target.spring != null) {
                        this.addMessage(target.spring.name + "\u304C\u6EA2\u308C\u3066\u3044\u308B...", EmphasisColor.INVERSE);
                    }
                    else {
                        this.addMessage('周囲には何もなかった.');
                    }
                    break;
            }
            this.after();
        },
        take: function () {
            var target = this.world.getCell(this.position);
            switch (target.field) {
                case Field.DOWNSTAIRS:
                    if (World.MIN_Z < this.position.z) {
                        this.position.z--;
                        if (World.MIN_Z < this.position.z) {
                            this.addMessage("\u968E\u6BB5\u3092\u964D\u308A\u5854\u306E " + this.position.z + " \u968E\u3078\u3068\u9032\u3093\u3060...", EmphasisColor.INFO);
                        }
                        else {
                            this.addMessage('階段を降り地上へと戻った.', EmphasisColor.INFO);
                        }
                        this.afterAction();
                    }
                    else {
                        if (this.has.treasure) {
                            this.addMessage(this.world.name + "\u3092\u8131\u51FA\u3057\u305F.");
                            this.addMessage('＊ おめでとう ＊', EmphasisColor.INVERSE);
                            this.addMessage('こうして一行は宝を手に無事生還した. そして宴の後...');
                            this.addMessage('彼らは各々の次なる冒険を求め旅立っていったのだった.');
                            models.Users.clear();
                            this.users = models.Users.find();
                            this.world.make();
                        }
                        else {
                            this.addUserMessage('秘宝を手に入れるまでは帰れないぜ.');
                        }
                    }
                    break;
                case Field.UPSTAIRS:
                    this.position.z++;
                    this.addMessage("\u968E\u6BB5\u3092\u767B\u308A\u5854\u306E " + this.position.z + " \u968E\u3078\u3068\u9032\u3093\u3060...", EmphasisColor.INFO);
                    this.afterAction();
                    break;
                default:
                    if (target.treasure != null) {
                        if (0 < target.treasure.lock) {
                            this.addMessage('鍵がかかっているようだ.');
                        }
                        else {
                            this.addMessage('箱の中を覗いた.');
                            var item = target.treasure.item;
                            if (item != null) {
                                this.addMessage(item.name + "\u304C\u5165\u3063\u3066\u3044\u305F.", EmphasisColor.SUCCESS);
                                switch (item.itemType) {
                                    case ItemType.OINTMENT:
                                        for (var i = 0; i < this.users.length; i++) {
                                            var user = this.users[i];
                                            user.life.add(50);
                                        }
                                        this.addMessage('君たちは傷と疲れを癒した.', EmphasisColor.SUCCESS);
                                        break;
                                    case ItemType.MEAT:
                                        for (var i = 0; i < this.users.length; i++) {
                                            var user = this.users[i];
                                            user.food.add(100);
                                        }
                                        this.addMessage('君たちは空腹を満たした.', EmphasisColor.SUCCESS);
                                        break;
                                    case ItemType.PAPER:
                                        if (item.description != null && item.description != '') {
                                            this.addMessage(item.description, EmphasisColor.INVERSE);
                                        }
                                        else {
                                            this.addMessage('何か書いてあるがそれを読むことはできなかった...');
                                        }
                                        break;
                                    case ItemType.TREASURE:
                                        this.has.treasure = true;
                                        this.addUserMessage("\u91CE\u90CE\u3069\u3082\u5F15\u304D\u4E0A\u3052\u308B\u305E! \u51FA\u53E3\u3092\u63A2\u305B!");
                                        break;
                                    case ItemType.COMPASS:
                                        this.stock.compass += item.life.current;
                                        this.addUserMessage("\u30B3\u30F3\u30D1\u30B9\u3092\u8D77\u52D5\u3057\u308D! \u73FE\u5728\u4F4D\u7F6E\u3068\u65B9\u89D2\u304C\u308F\u304B\u308B\u305E!");
                                }
                                target.treasure.item = null;
                            }
                            else {
                                this.addMessage('中はもぬけの殻だった...');
                            }
                        }
                    }
                    else if (target.spring != null) {
                        var hasChanged = false;
                        this.addMessage(target.spring.name + "\u3092\u98F2\u3093\u3060.");
                        for (var i = 0; i < this.users.length; i++) {
                            var user = this.users[i];
                            var amount = target.spring.getAmount();
                            user.water.add(amount);
                            switch (target.spring.type) {
                                case SpringType.POISON:
                                    user.life.sub(amount);
                                    break;
                                case SpringType.LIFE_UP:
                                    switch (dice()) {
                                        case 1:
                                        case 2:
                                            user.life.expand(dice());
                                            hasChanged = true;
                                            break;
                                    }
                                    break;
                                case SpringType.LIFE_DOWN:
                                    switch (dice()) {
                                        case 1:
                                        case 2:
                                            user.life.contract(dice());
                                            hasChanged = true;
                                            break;
                                    }
                                    break;
                            }
                        }
                        target.spring.life.sub(1);
                        this.addMessage('喉が少し潤った.', EmphasisColor.SUCCESS);
                        switch (target.spring.type) {
                            case SpringType.POISON:
                                this.addMessage('しかしこれは汚水だ! 体調が悪くなった...', EmphasisColor.DANGER);
                                break;
                            case SpringType.LIFE_UP:
                                if (hasChanged) {
                                    this.addMessage('生命力が漲った気がする...', EmphasisColor.SUCCESS);
                                }
                                break;
                            case SpringType.LIFE_DOWN:
                                if (hasChanged) {
                                    this.addMessage('衰弱したような気がする...', EmphasisColor.INFO);
                                }
                                break;
                        }
                        if (target.spring.life.current < 1) {
                            this.addMessage(target.spring.name + "\u306F\u5E72\u4E0A\u304C\u3063\u305F.");
                            target.spring = null;
                        }
                        this.afterAction();
                    }
                    else {
                        this.addMessage('ここには手に取るようなものが何もない.');
                    }
                    break;
            }
            this.after();
        },
        useKey: function () {
            var target = this.world.getCell(this.position);
            if (this.stock.key < 1) {
                this.addMessage('鍵を持っていない.');
            }
            else if (target.treasure == null) {
                this.addMessage('鍵を使う場所がない.');
            }
            else if (target.treasure.lock < 1) {
                this.addMessage('この箱は開かれている.');
            }
            else if (target.treasure.life.current < 1) {
                this.addMessage('この箱は錠が壊れてしまったのでもう開けられないだろう...');
            }
            else {
                switch (dice()) {
                    case 1:
                    case 2:
                        this.addMessage('錠を1つこじ開けた.', EmphasisColor.INFO);
                        target.treasure.lock--;
                        break;
                    default:
                        this.addMessage('中々開かない...');
                        break;
                }
                switch (dice()) {
                    case 1:
                    case 2:
                        this.stock.key--;
                        this.addMessage("\u9375\u304C\u6298\u308C\u305F. (" + this.stock.key + ")", EmphasisColor.INFO);
                        break;
                }
                if (target.treasure.lock < 1) {
                    this.addMessage('箱が開いた!', EmphasisColor.SUCCESS);
                    target.treasure.name = "\u958B\u3044\u305F" + target.treasure.name;
                }
                else if (!target.treasure.unbreakable) {
                    var damage = dice();
                    target.treasure.life.sub(damage);
                    if (target.treasure.life.current < 1) {
                        this.addMessage('錠が壊れてしまった...', EmphasisColor.INFO);
                        target.treasure.name = "\u58CA\u308C\u305F" + target.treasure.name;
                    }
                }
                this.flow();
                this.afterAction();
            }
            this.after();
        },
        action: function () {
            var target = this.world.getForwardCell(this.position, this.direction.value);
            switch (target.field) {
                case Field.FLAT:
                    this.addMessage('空を切った.');
                    this.flow();
                    break;
                case Field.BLOCK:
                case Field.WALL:
                    var targetName = target.block.name;
                    var addMessage = this.addMessage;
                    this.users.forEach(function (x) {
                        var damage = dice();
                        target.block.life.sub(damage);
                        addMessage(x.name + "\u306F" + targetName + "\u3092\u653B\u6483\u3057 " + damage + " \u306E\u640D\u50B7\u3092\u4E0E\u3048\u305F.", EmphasisColor.INFO);
                    });
                    if (target.block.life.current < 1) {
                        this.addMessage(targetName + "\u3092\u7834\u58CA.");
                        if (target.block.hasTreasure) {
                            switch (dice()) {
                                case 1:
                                case 2:
                                case 3:
                                    this.addMessage('目の前に何かが落ちた.', EmphasisColor.SUCCESS);
                                    var item = Item.getRandom();
                                    if (item != null && item.itemType == ItemType.PAPER) {
                                        var memo = '';
                                        switch (dice()) {
                                            case 1:
                                                memo = "\u3053\u306E\u8FF7\u5BAE\u306E\u51FA\u53E3\u306F " + this.world.goalPosition.toString() + " \u306E\u4F4D\u7F6E\u306B\u3042\u308B.";
                                                break;
                                            case 2:
                                                memo = "\u79D8\u5B9D\u306F " + this.world.treasurePosition.toString() + " \u306E\u4F4D\u7F6E\u306B\u96A0\u3055\u308C\u3066\u3044\u308B.";
                                                break;
                                        }
                                        item.description = memo;
                                    }
                                    var lock = dice() - 1;
                                    target.treasure = new TreasureBox(item, lock);
                                    break;
                            }
                        }
                        target.field = Field.FLAT;
                        target.block = null;
                    }
                    this.flow(3);
                    break;
            }
            this.afterAction();
            this.after();
        },
        compass: function () {
            if (0 < this.stock.compass) {
                if (this.enable.compass) {
                    this.addMessage('コンパスを止めた.', EmphasisColor.INFO);
                    this.enable.compass = false;
                }
                else {
                    this.addMessage('コンパスを起動した.', EmphasisColor.INFO);
                    this.enable.compass = true;
                }
            }
            else {
                this.addMessage('コンパスを持っていない.');
            }
            this.after();
        },
        goForward: function () {
            var target = this.world.getForwardCell(this.position, this.direction.value);
            switch (target.field) {
                case Field.WALL:
                case Field.BLOCK:
                    var targetName = "" + target.block.name + target.block.life.impression();
                    this.addMessage("\u76EE\u306E\u524D\u306B" + targetName + ".", EmphasisColor.INVERSE);
                    break;
                default:
                    var forwardCell = this.world.getForwardCell(this.position, this.direction.value);
                    if (forwardCell.field == Field.DOWNSTAIRS || forwardCell.field == Field.UPSTAIRS || forwardCell.treasure != null || forwardCell.spring != null) {
                        this.addMessage('前へ進んだ. 足元に何かある.', EmphasisColor.INFO);
                    }
                    else {
                        this.addMessage('前へ進んだ.', EmphasisColor.INFO);
                    }
                    var forwardPosition = this.world.getForwardPosition(this.position, this.direction.value);
                    this.position = forwardPosition;
                    this.randomEvent();
                    this.flow();
                    this.afterAction();
                    break;
            }
            this.after();
        },
        turnLeft: function () {
            this.addMessage('左を向いた.', EmphasisColor.INFO);
            switch (this.direction.value) {
                case Direction.NORTH:
                    this.direction.value = Direction.WEST;
                    break;
                case Direction.EAST:
                    this.direction.value = Direction.NORTH;
                    break;
                case Direction.SOUTH:
                    this.direction.value = Direction.EAST;
                    break;
                case Direction.WEST:
                    this.direction.value = Direction.SOUTH;
                    break;
                default:
                    break;
            }
            this.after();
        },
        turnRight: function () {
            this.addMessage('右を向いた.', EmphasisColor.INFO);
            switch (this.direction.value) {
                case Direction.NORTH:
                    this.direction.value = Direction.EAST;
                    break;
                case Direction.EAST:
                    this.direction.value = Direction.SOUTH;
                    break;
                case Direction.SOUTH:
                    this.direction.value = Direction.WEST;
                    break;
                case Direction.WEST:
                    this.direction.value = Direction.NORTH;
                    break;
                default:
                    break;
            }
            this.after();
        },
        moveBack: function () {
            var target = this.world.getBackCell(this.position, this.direction.value);
            switch (target.field) {
                case Field.WALL:
                case Field.BLOCK:
                    this.addMessage('何かがあって通れない.', EmphasisColor.INFO);
                    break;
                default:
                    this.addMessage('後ろに下がった.', EmphasisColor.INFO);
                    var targetPosition = this.world.getBackPosition(this.position, this.direction.value);
                    this.position = targetPosition;
                    this.randomEvent();
                    this.flow(4);
                    this.afterAction();
                    break;
            }
            this.after();
        },
        moveLeft: function () {
            var target = this.world.getLeftCell(this.position, this.direction.value);
            switch (target.field) {
                case Field.WALL:
                case Field.BLOCK:
                    this.addMessage('何かがあって通れない.', EmphasisColor.INFO);
                    break;
                default:
                    this.addMessage('左へ移動した.', EmphasisColor.INFO);
                    var targetPosition = this.world.getLeftPosition(this.position, this.direction.value);
                    this.position = targetPosition;
                    this.randomEvent();
                    this.flow(3);
                    this.afterAction();
                    break;
            }
            this.after();
        },
        moveRight: function () {
            var target = this.world.getRightCell(this.position, this.direction.value);
            switch (target.field) {
                case Field.WALL:
                case Field.BLOCK:
                    this.addMessage('何かがあって通れない.', EmphasisColor.INFO);
                    break;
                default:
                    this.addMessage('右へ移動した.', EmphasisColor.INFO);
                    var targetPosition = this.world.getRightPosition(this.position, this.direction.value);
                    this.position = targetPosition;
                    this.randomEvent();
                    this.flow(3);
                    this.afterAction();
                    break;
            }
            this.after();
        },
        flow: function (amount) {
            if (amount === void 0) { amount = 2; }
            for (var i = 0; i < this.users.length; i++) {
                var user = this.users[i];
                user.flow(amount);
            }
            if (this.enable.compass && 0 < this.stock.compass) {
                this.stock.compass--;
            }
        },
        afterAction: function () {
            for (var i = 0; i < this.users.length; i++) {
                var user = this.users[i];
                if (user.life.current < 1) {
                    this.addMessage(user.name + "\u306F\u606F\u7D76\u3048\u305F...", EmphasisColor.DANGER);
                    models.Users.delete(user.name);
                    this.users = models.Users.find();
                }
            }
            if (this.enable.compass && this.stock.compass < 1) {
                this.enable.compass = false;
                this.stock.compass = 0;
                this.addMessage('コンパスの電池が切れた...');
            }
            models.Users.save(this.users);
            this.users = models.Users.find();
        },
        after: function () {
            this.topMessage = "\u4F4D\u7F6E: (" + this.position.x + "," + this.position.y + ")";
            if (this.users.length < 1) {
                this.enable.compass = false;
            }
            this.direction.display = this.getDirectionDisplay();
        },
        randomEvent: function () {
            switch (dice()) {
                case 1:
                    switch (dice()) {
                        case 1:
                        case 3:
                        case 5:
                            var money = dice(2);
                            this.addMessage(money + " \u91D1\u62FE\u3063\u305F.", EmphasisColor.SUCCESS);
                            this.stock.money += money;
                            break;
                        default:
                            this.stock.key++;
                            this.addMessage("\u9375\u3092\u62FE\u3063\u305F. (" + this.stock.key + ")", EmphasisColor.SUCCESS);
                            break;
                    }
                    break;
                case 2:
                    switch (dice()) {
                        case 1:
                        case 2:
                        case 3:
                            this.addMessage('コウモリの群れだ!', EmphasisColor.INVERSE);
                            switch (dice()) {
                                case 1:
                                    this.addMessage('だが幸い何も奪われずに済んだ.');
                                    break;
                                default:
                                    var amount = dice(2);
                                    this.stock.money -= amount;
                                    this.addMessage('お金を少し奪われてしまった...', EmphasisColor.INFO);
                                    break;
                            }
                            break;
                        default:
                            this.addMessage('ねずみの群れだ!', EmphasisColor.INVERSE);
                            switch (dice()) {
                                case 1:
                                    this.addMessage('だが幸い何も奪われずに済んだ.');
                                    break;
                                default:
                                    for (var i = 0; i < this.users.length; i++) {
                                        var user = this.users[i];
                                        var amount = dice(2);
                                        user.food.sub(amount);
                                    }
                                    this.addMessage('食糧を少し奪われてしまった...');
                                    break;
                            }
                            break;
                    }
                    break;
                case 3:
                    var trap = Trap.random();
                    if (trap != null) {
                        this.addMessage("\u30C8\u30E9\u30C3\u30D7\u3060! " + trap.name + "!", EmphasisColor.INVERSE);
                        switch (trap.type) {
                            case TrapType.SLING:
                            case TrapType.CROSSBOW:
                            case TrapType.CHAINSAW:
                                var damage = trap.operate();
                                var userIndex = random(this.users.length) - 1;
                                var user = this.users[userIndex];
                                user.life.sub(damage);
                                if (trap.type == TrapType.CHAINSAW) {
                                    this.addMessage(user.name + "\u306E\u4F53\u306F\u30D0\u30E9\u30D0\u30E9\u306B\u3055\u308C\u305F!", EmphasisColor.DANGER);
                                }
                                else {
                                    this.addMessage(user.name + "\u306F " + damage + " \u306E\u88AB\u5BB3\u3092\u53D7\u3051\u305F.", EmphasisColor.DANGER);
                                }
                                break;
                            case TrapType.GAS:
                            case TrapType.BOMB:
                                for (var i = 0; i < this.users.length; i++) {
                                    var user = this.users[i];
                                    var damage = trap.operate();
                                    user.life.sub(damage);
                                    this.addMessage(user.name + "\u306F " + damage + " \u306E\u88AB\u5BB3\u3092\u53D7\u3051\u305F.", EmphasisColor.DANGER);
                                }
                                break;
                            case TrapType.ROTATION:
                                var direction = null;
                                switch (dice()) {
                                    case 1:
                                        direction = Direction.NORTH;
                                        break;
                                    case 2:
                                        direction = Direction.EAST;
                                        break;
                                    case 3:
                                        direction = Direction.SOUTH;
                                        break;
                                    case 4:
                                        direction = Direction.WEST;
                                }
                                if (direction != null) {
                                    this.direction.value = direction;
                                    this.addUserMessage("\u76EE\u304C\u56DE\u3063\u305F... \u3068\u3053\u308D\u3067\u3069\u3063\u3061\u3092\u5411\u3044\u3066\u305F\u3063\u3051.");
                                }
                                else {
                                    this.addMessage('...錆びついていたようだ.');
                                }
                                break;
                            case TrapType.WARP:
                                switch (dice()) {
                                    case 1:
                                    case 2:
                                        var position = World.getRandomPosition(this.position.z);
                                        var target = this.world.getCell(this.position);
                                        if (target.block != null) {
                                            var damage = Math.ceil(target.block.life.current / this.users.length);
                                            for (var i = 0; i < this.users.length; i++) {
                                                var user = this.users[i];
                                                user.life.sub(damage);
                                            }
                                            this.addMessage("\u843D\u4E0B\u3057\u3066" + target.block.name + "\u306B\u76F4\u6483\u3057\u305F!", EmphasisColor.DANGER);
                                            this.addMessage(target.block.name + "\u306F\u7C89\u3005\u306B\u7815\u3051\u6563\u3063\u305F.");
                                            target.block = null;
                                            target.field = Field.FLAT;
                                        }
                                        else {
                                            this.addUserMessage('...ここはどこだ?');
                                        }
                                        this.position = position;
                                        break;
                                    default:
                                        this.addUserMessage('...どうやら壊れてたみたいだな.');
                                        break;
                                }
                                break;
                        }
                    }
                    else {
                        this.addMessage('トラップだ! ...どうやら作動しなかったようだ.');
                    }
                    break;
            }
        },
        addMessage: function (message, emphasis) {
            if (emphasis === void 0) { emphasis = EmphasisColor.DEFAULT; }
            if (4 < this.mainMessages.length) {
                this.mainMessages.shift();
            }
            var em = {};
            switch (emphasis) {
                case EmphasisColor.DANGER:
                    em['danger'] = true;
                    break;
                case EmphasisColor.ALERT:
                    em['alert'] = true;
                    break;
                case EmphasisColor.SUCCESS:
                    em['success'] = true;
                    break;
                case EmphasisColor.INFO:
                    em['info'] = true;
                    break;
                case EmphasisColor.INVERSE:
                    em['inverse'] = true;
                    break;
            }
            this.mainMessages.push({
                text: message,
                em: em
            });
        },
        addUserMessage: function (message, user) {
            if (user === void 0) { user = null; }
            if (user == null) {
                var userIndex = random(this.users.length) - 1;
                user = this.users[userIndex];
            }
            this.addMessage(user.name + "\uFF1A" + message);
        },
        getDirectionDisplay: function () {
            var value = '';
            switch (this.direction.value) {
                case Direction.NORTH:
                    value = 'arrow_upward';
                    break;
                case Direction.EAST:
                    value = 'arrow_forward';
                    break;
                case Direction.SOUTH:
                    value = 'arrow_downward';
                    break;
                case Direction.WEST:
                    value = 'arrow_back';
                    break;
            }
            return value;
        },
    },
    created: function () {
        this.addMessage('mbAppの世界にようこそ!', EmphasisColor.INVERSE);
        this.addMessage('メンバを4人追加してチームを作ってください!');
        this.world.make();
        this.after();
    }
});
