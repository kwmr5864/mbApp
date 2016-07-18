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
        LimitedValue.prototype.isMax = function () {
            return this.max <= this.current;
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
            _super.call(this, _name + "\u300C" + faker.lorem.words(1) + "\u300D", _life);
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
            _super.call(this, '壁', 9999);
        }
        return Wall;
    }(Block));
    entities.Wall = Wall;
    var Rock = (function (_super) {
        __extends(Rock, _super);
        function Rock() {
            _super.call(this, '岩', 30 + dice());
        }
        return Rock;
    }(Block));
    entities.Rock = Rock;
    var Tree = (function (_super) {
        __extends(Tree, _super);
        function Tree() {
            _super.call(this, '木', 10 + dice());
        }
        return Tree;
    }(Block));
    entities.Tree = Tree;
    var WoodenBox = (function (_super) {
        __extends(WoodenBox, _super);
        function WoodenBox() {
            _super.call(this, '木箱', 10 + dice(2), true);
        }
        return WoodenBox;
    }(Block));
    entities.WoodenBox = WoodenBox;
    var Tussock = (function (_super) {
        __extends(Tussock, _super);
        function Tussock() {
            _super.call(this, '草むら', dice());
        }
        return Tussock;
    }(Block));
    entities.Tussock = Tussock;
})(entities || (entities = {}));
var enums;
(function (enums) {
    (function (ItemType) {
        ItemType[ItemType["TREASURE"] = 1] = "TREASURE";
        ItemType[ItemType["OINTMENT"] = 2] = "OINTMENT";
        ItemType[ItemType["MEAT"] = 3] = "MEAT";
        ItemType[ItemType["KEY"] = 4] = "KEY";
        ItemType[ItemType["PAPER"] = 5] = "PAPER";
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
                case 2:
                    item = new Item('軟膏', ItemType.OINTMENT);
                    break;
                case 3:
                case 4:
                    item = new Item('肉', ItemType.MEAT);
                    break;
                case 5:
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
            _super.call(this, faker.commerce.productMaterial() + "\u306E\u5B9D\u7BB1");
            this.item = item;
            this.lock = lock;
            this.unbreakable = unbreakable;
        }
        return TreasureBox;
    }(entities.LifeObject));
    entities.TreasureBox = TreasureBox;
})(entities || (entities = {}));
var entities;
(function (entities) {
    var Spring = (function (_super) {
        __extends(Spring, _super);
        function Spring() {
            var amount = Math.ceil(dice() / 2);
            _super.call(this, faker.commerce.color() + "\u306E\u6E67\u304D\u6C34", amount);
        }
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
        function Position(x, y) {
            this.x = x;
            this.y = y;
        }
        Position.prototype.getForward = function (direction) {
            var position;
            switch (direction) {
                case Direction.NORTH:
                    position = new core.Position(this.x, this.y - 1);
                    break;
                case Direction.EAST:
                    position = new core.Position(this.x + 1, this.y);
                    break;
                case Direction.SOUTH:
                    position = new core.Position(this.x, this.y + 1);
                    break;
                case Direction.WEST:
                    position = new core.Position(this.x - 1, this.y);
                    break;
                default:
                    position = new core.Position(-1, -1);
                    break;
            }
            return position;
        };
        Position.prototype.getLeft = function (direction) {
            var position;
            switch (direction) {
                case Direction.NORTH:
                    position = new core.Position(this.x - 1, this.y);
                    break;
                case Direction.EAST:
                    position = new core.Position(this.x, this.y - 1);
                    break;
                case Direction.SOUTH:
                    position = new core.Position(this.x + 1, this.y);
                    break;
                case Direction.WEST:
                    position = new core.Position(this.x, this.y + 1);
                    break;
                default:
                    position = new core.Position(-1, -1);
                    break;
            }
            return position;
        };
        Position.prototype.getRight = function (direction) {
            var position;
            switch (direction) {
                case Direction.NORTH:
                    position = new core.Position(this.x + 1, this.y);
                    break;
                case Direction.EAST:
                    position = new core.Position(this.x, this.y + 1);
                    break;
                case Direction.SOUTH:
                    position = new core.Position(this.x - 1, this.y);
                    break;
                case Direction.WEST:
                    position = new core.Position(this.x, this.y - 1);
                    break;
                default:
                    position = new core.Position(-1, -1);
                    break;
            }
            return position;
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
            this.fields = new Array(World.MAX_Y + 1);
            for (var i = 0; i <= World.MAX_Y; i++) {
                var row = new Array(World.MAX_X + 1);
                for (var j = 0; j <= World.MAX_X; j++) {
                    row[j] = new Cell(Field.FLAT);
                    switch (dice()) {
                        case 4:
                            var item = Item.getRandom();
                            var lock = dice() - 1;
                            var treasureBox = new TreasureBox(item, lock);
                            row[j].treasure = treasureBox;
                            break;
                        case 5:
                            row[j].spring = new Spring();
                            break;
                        case 6:
                            row[j].field = Field.BLOCK;
                            switch (dice()) {
                                case 1:
                                    row[j].field = Field.WALL;
                                    row[j].block = new entities.Wall();
                                    break;
                                case 2:
                                    row[j].block = new entities.Rock();
                                    break;
                                case 3:
                                    row[j].block = new entities.Tree();
                                    break;
                                case 4:
                                    row[j].block = new entities.Tussock();
                                    break;
                                default:
                                    row[j].block = new entities.WoodenBox();
                                    break;
                            }
                            break;
                    }
                }
                this.fields[i] = row;
            }
            var goalX = utils.random(World.MAX_X);
            var goalY = utils.random(World.MAX_Y);
            var goalCell = this.fields[goalY][goalX];
            goalCell.field = Field.GOAL;
            goalCell.treasure = null;
            goalCell.block = null;
            var ok = false;
            while (!ok) {
                var treasureX = utils.random(World.MAX_X);
                var treasureY = utils.random(World.MAX_Y);
                if (treasureX != goalX && treasureY != goalY) {
                    var treasureCell = this.fields[treasureY][treasureX];
                    treasureCell.field = Field.FLAT;
                    var treasure = new Item("\u79D8\u5B9D\u300C" + faker.commerce.productName() + "\u300D", ItemType.TREASURE);
                    var lock = dice();
                    var treasureBox = new TreasureBox(treasure, lock, true);
                    treasureCell.treasure = treasureBox;
                    treasureCell.block = null;
                    ok = true;
                }
            }
        };
        World.prototype.getForwardCell = function (position, direction) {
            var targetPosition = this.getForwardPosition(position, direction);
            return this.fields[targetPosition.y][targetPosition.x];
        };
        World.prototype.getLeftCell = function (position, direction) {
            var targetPosition = this.getLeftPosition(position, direction);
            return this.fields[targetPosition.y][targetPosition.x];
        };
        World.prototype.getRightCell = function (position, direction) {
            var targetPosition = this.getRightPosition(position, direction);
            return this.fields[targetPosition.y][targetPosition.x];
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
        World.MAX_X = 9;
        World.MIN_X = 0;
        World.MAX_Y = 9;
        World.MIN_Y = 0;
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
        User.prototype.flow = function () {
            if (this.water.current < 1) {
                this.life.sub(1);
            }
            else {
                this.water.sub(3);
            }
            if (this.food.current < 1) {
                this.life.sub(1);
            }
            else {
                this.food.sub(2);
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
    (function (TargetRange) {
        TargetRange[TargetRange["ONE"] = 1] = "ONE";
        TargetRange[TargetRange["ALL"] = 2] = "ALL";
    })(enums.TargetRange || (enums.TargetRange = {}));
    var TargetRange = enums.TargetRange;
})(enums || (enums = {}));
var entities;
(function (entities) {
    var dice = utils.dice;
    var TargetRange = enums.TargetRange;
    var Trap = (function () {
        function Trap(name, range, base) {
            this.name = name;
            this.range = range;
            this.base = base;
        }
        Trap.random = function () {
            var trap = null;
            switch (dice(2)) {
                case 8:
                    trap = new Sling();
                    break;
                case 9:
                    trap = new Crossbow();
                    break;
                case 10:
                    trap = new Gas();
                    break;
                case 11:
                    trap = new Bomb();
                    break;
                case 12:
                    trap = new Chainsaw();
                    break;
                default:
                    break;
            }
            return trap;
        };
        Trap.prototype.operate = function () {
            var damage = this.base - dice();
            return damage;
        };
        return Trap;
    }());
    entities.Trap = Trap;
    var Sling = (function (_super) {
        __extends(Sling, _super);
        function Sling() {
            _super.call(this, '投石', TargetRange.ONE, 10);
        }
        return Sling;
    }(Trap));
    entities.Sling = Sling;
    var Crossbow = (function (_super) {
        __extends(Crossbow, _super);
        function Crossbow() {
            _super.call(this, 'クロスボウの矢', TargetRange.ONE, 30);
        }
        return Crossbow;
    }(Trap));
    entities.Crossbow = Crossbow;
    var Chainsaw = (function (_super) {
        __extends(Chainsaw, _super);
        function Chainsaw() {
            _super.call(this, 'チェーンソー', TargetRange.ONE, 10000);
        }
        return Chainsaw;
    }(Trap));
    entities.Chainsaw = Chainsaw;
    var Gas = (function (_super) {
        __extends(Gas, _super);
        function Gas() {
            _super.call(this, '毒ガス', TargetRange.ALL, 20);
        }
        return Gas;
    }(Trap));
    entities.Gas = Gas;
    var Bomb = (function (_super) {
        __extends(Bomb, _super);
        function Bomb() {
            _super.call(this, '爆弾', TargetRange.ALL, 60);
        }
        return Bomb;
    }(Trap));
    entities.Bomb = Bomb;
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
var World = core.World;
var TargetRange = enums.TargetRange;
var EmphasisColor = enums.EmphasisColor;
var random = utils.random;
var dice = utils.dice;
var Trap = entities.Trap;
var Users = models.Users;
var User = entities.User;
var ItemType = enums.ItemType;
var Item = entities.Item;
var TreasureBox = entities.TreasureBox;
var appVm = new Vue({
    el: '#app',
    data: {
        topMessage: '',
        mainMessages: [],
        txt: '',
        users: models.Users.find(),
        keyCount: 10,
        direction: {
            value: Direction.NORTH,
            display: '',
            enable: false
        },
        world: new core.World(),
        hasTreasure: false,
        position: new core.Position(utils.random(World.MAX_Y), utils.random(World.MAX_X))
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
            if (added) {
                this.addMessage(name + "\u306F\u8FFD\u52A0\u6E08\u307F\u3067\u3059!");
            }
            else {
                var user = new User(name);
                Users.add(user);
                this.users = Users.find();
                this.addMessage(name + "\u3092\u8FFD\u52A0\u3057\u307E\u3057\u305F!", EmphasisColor.SUCCESS);
            }
            this.txt = '';
        },
        removeUser: function (userName) {
            for (var i = 0; i < this.users.length; i++) {
                var user = this.users[i];
                if (userName === user.name) {
                    Users.delete(userName);
                    this.users = Users.find();
                    this.addMessage(userName + "\u3092\u9664\u540D\u3057\u307E\u3057\u305F!");
                }
            }
        },
        dissolution: function () {
            models.Users.clear();
            this.users = models.Users.find();
            this.addMessage('チームを解散した');
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
            this.afterAction();
            this.after();
        },
        search: function () {
            var target = this.world.fields[this.position.y][this.position.x];
            switch (target.field) {
                case Field.GOAL:
                    if (this.hasTreasure) {
                        this.addMessage(this.world.name + "\u3092\u8131\u51FA\u3057\u305F.");
                        this.addMessage('＊ おめでとう ＊', EmphasisColor.INVERSE);
                        this.addMessage('こうして一行は宝を手に無事生還した. そして宴の後...');
                        this.addMessage('彼らは各々の次なる冒険を求め旅立っていったのだった.');
                        models.Users.clear();
                        this.users = models.Users.find();
                        this.world.make();
                    }
                    else {
                        this.addUserMessage('出口だ. 宝を見つけたらここから脱出するぞ.');
                    }
                    break;
                default:
                    if (target.treasure != null) {
                        this.addMessage(target.treasure.name + "\u304C\u3042\u308B.", EmphasisColor.INVERSE);
                    }
                    else if (target.spring != null) {
                        this.addMessage(target.spring.name + "\u3060.", EmphasisColor.INVERSE);
                    }
                    else {
                        this.addMessage('ここには何もない.');
                    }
                    break;
            }
            this.after();
        },
        take: function () {
            var target = this.world.fields[this.position.y][this.position.x];
            if (target.treasure != null) {
                if (0 < target.treasure.lock) {
                    this.addMessage('鍵がかかっているようだ.');
                }
                else {
                    this.addMessage('箱を開けた.');
                    var item = target.treasure.item;
                    if (item != null) {
                        this.addMessage(item.name + "\u3092\u624B\u306B\u5165\u308C\u305F.", EmphasisColor.SUCCESS);
                        switch (item.itemType) {
                            case ItemType.KEY:
                                this.keyCount++;
                                break;
                            case ItemType.TREASURE:
                                this.hasTreasure = true;
                                this.addUserMessage("\u91CE\u90CE\u3069\u3082\u5F15\u304D\u4E0A\u3052\u308B\u305E! \u51FA\u53E3\u3092\u63A2\u305B!");
                                break;
                        }
                        target.treasure.item = null;
                    }
                    else {
                        this.addMessage('中はもぬけの殻だった...');
                    }
                }
            }
            else if (target.spring != null) {
                this.addMessage(target.spring.name + "\u306E\u6C34\u3092\u98F2\u3093\u3060.");
                for (var i = 0; i < this.users.length; i++) {
                    var user = this.users[i];
                    var amount = 100 - dice(2);
                    user.water.add(amount);
                }
                target.spring.life.sub(1);
                this.addMessage('水分を補給した.', EmphasisColor.SUCCESS);
                if (target.spring.life.current < 1) {
                    this.addMessage(target.spring.name + "\u306F\u5E72\u4E0A\u304C\u3063\u305F.");
                    target.spring = null;
                }
            }
            else {
                this.addMessage('ここには何もない.');
            }
            this.after();
        },
        useKey: function () {
            var target = this.world.fields[this.position.y][this.position.x];
            if (this.keyCount < 1) {
                this.addMessage('鍵を持っていない.');
            }
            else if (target.treasure == null) {
                this.addMessage('鍵を使う場所がない.');
            }
            else if (target.treasure.lock < 1) {
                this.addMessage('この箱は既に鍵が外れている.');
            }
            else if (target.treasure.life.current < 1) {
                this.addMessage('この箱は壊れてしまったのでもう開けられないだろう...');
            }
            else {
                switch (dice()) {
                    case 1:
                    case 2:
                        this.addMessage('鍵を1つこじ開けた.', EmphasisColor.INFO);
                        target.treasure.lock--;
                        break;
                    default:
                        this.addMessage('中々開かない...');
                        break;
                }
                switch (dice()) {
                    case 1:
                    case 2:
                        this.addMessage("\u9375\u304C\u6298\u308C\u305F. (" + this.keyCount + ")");
                        this.keyCount--;
                        break;
                }
                if (target.treasure.lock < 1) {
                    this.addMessage('箱が開いた!.', EmphasisColor.SUCCESS);
                }
                else if (!target.treasure.unbreakable) {
                    var damage = dice();
                    target.treasure.life.sub(damage);
                    if (target.treasure.life.current < 1) {
                        this.addMessage('箱が壊れてしまった...');
                    }
                }
            }
            this.after();
        },
        action: function () {
            var target = this.world.getForwardCell(this.position, this.direction.value);
            switch (target.field) {
                case Field.FLAT:
                    this.addMessage('空を切った.');
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
                                    this.addMessage('目の前に何かが落ちた.', EmphasisColor.SUCCESS);
                                    var item = Item.getRandom();
                                    var lock = dice() - 1;
                                    target.treasure = new TreasureBox(item, lock);
                                    break;
                            }
                        }
                        target.field = Field.FLAT;
                        target.block = null;
                    }
                    this.afterAction();
                    break;
            }
            this.afterAction();
            this.after();
        },
        compass: function () {
            if (this.direction.enable) {
                this.addMessage('コンパスを止めた.');
                this.direction.enable = false;
            }
            else {
                this.addMessage('コンパスを起動した.');
                this.direction.enable = true;
            }
            this.after();
        },
        goForward: function () {
            var target = this.world.getForwardCell(this.position, this.direction.value);
            switch (target.field) {
                case Field.WALL:
                case Field.BLOCK:
                    var targetName = target.block.name;
                    this.addMessage("\u76EE\u306E\u524D\u306B" + targetName + ". (" + target.block.life.current + ")", EmphasisColor.INVERSE);
                    break;
                case Field.FLAT:
                case Field.GOAL:
                    var forwardCell = this.world.getForwardCell(this.position, this.direction.value);
                    if (forwardCell.treasure != null || forwardCell.spring != null) {
                        this.addMessage('前へ進んだ. 足元に何かある.', EmphasisColor.INFO);
                    }
                    else {
                        this.addMessage('前へ進んだ.');
                    }
                    var forwardPosition = this.world.getForwardPosition(this.position, this.direction.value);
                    this.position = forwardPosition;
                    this.randomEvent();
                    this.afterAction();
                    break;
            }
            this.after();
        },
        turnLeft: function () {
            this.addMessage('左を向いた.');
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
            this.addMessage('右を向いた.');
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
        turnBack: function () {
            this.addMessage('後ろを向いた.');
            switch (this.direction.value) {
                case Direction.NORTH:
                    this.direction.value = Direction.SOUTH;
                    break;
                case Direction.EAST:
                    this.direction.value = Direction.WEST;
                    break;
                case Direction.SOUTH:
                    this.direction.value = Direction.NORTH;
                    break;
                case Direction.WEST:
                    this.direction.value = Direction.EAST;
                    break;
                default:
                    break;
            }
            this.after();
        },
        moveLeft: function () {
            var target = this.world.getLeftCell(this.position, this.direction.value);
            switch (target.field) {
                case Field.WALL:
                case Field.BLOCK:
                    this.addMessage('何かがあって通れない.');
                    break;
                case Field.FLAT:
                case Field.GOAL:
                    this.addMessage('左へ移動した.');
                    var forwardPosition = this.world.getLeftPosition(this.position, this.direction.value);
                    this.position = forwardPosition;
                    this.randomEvent();
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
                    this.addMessage('何かがあって通れない.');
                    break;
                case Field.FLAT:
                case Field.GOAL:
                    this.addMessage('右へ移動した.');
                    var forwardPosition = this.world.getRightPosition(this.position, this.direction.value);
                    this.position = forwardPosition;
                    this.randomEvent();
                    this.afterAction();
                    break;
            }
        },
        afterAction: function () {
            for (var i = 0; i < this.users.length; i++) {
                var user = this.users[i];
                user.flow();
                if (user.life.current < 1) {
                    this.addMessage(user.name + "\u306F\u606F\u7D76\u3048\u305F...", EmphasisColor.DANGER);
                    models.Users.delete(user.name);
                    this.users = models.Users.find();
                }
            }
            models.Users.save(this.users);
            this.users = models.Users.find();
        },
        after: function () {
            this.topMessage = "\u4F4D\u7F6E: (" + this.position.x + "," + this.position.y + ")";
            if (this.users.length < 1) {
                this.direction.enable = false;
            }
            this.direction.display = this.getDirectionDisplay();
        },
        randomEvent: function () {
            switch (dice()) {
                case 1:
                    this.addUserMessage('食い物が落ちてるぜ!');
                    this.addMessage('保存のきかなさそうな果実で一行はわずかに腹を満たした.', EmphasisColor.SUCCESS);
                    for (var i = 0; i < this.users.length; i++) {
                        var user = this.users[i];
                        var food = dice(2);
                        user.food.add(food);
                    }
                    break;
                case 2:
                    this.addMessage('コウモリの群れだ!', EmphasisColor.INVERSE);
                    switch (dice()) {
                        case 1:
                            this.addMessage('だが幸い食糧を奪われずに済んだ.');
                            break;
                        default:
                            for (var i = 0; i < this.users.length; i++) {
                                var user = this.users[i];
                                var food = dice(2);
                                user.food.sub(food);
                            }
                            this.addMessage('食糧を少し奪われてしまった...');
                            break;
                    }
                    break;
                case 3:
                    var trap = Trap.random();
                    if (trap != null) {
                        this.addMessage("\u30C8\u30E9\u30C3\u30D7\u3060! " + trap.name + "!", EmphasisColor.INVERSE);
                        if (trap.range == TargetRange.ALL) {
                            for (var i = 0; i < this.users.length; i++) {
                                var user = this.users[i];
                                var damage = trap.operate();
                                user.life.sub(damage);
                                this.addMessage(user.name + "\u306F " + damage + " \u306E\u88AB\u5BB3\u3092\u53D7\u3051\u305F.", EmphasisColor.DANGER);
                            }
                        }
                        else {
                            var damage = trap.operate();
                            var userIndex = random(this.users.length) - 1;
                            var user = this.users[userIndex];
                            user.life.sub(damage);
                            if (user.life.max <= damage) {
                                this.addMessage(user.name + "\u306E\u4F53\u306F\u30D0\u30E9\u30D0\u30E9\u306B\u3055\u308C\u305F!", EmphasisColor.DANGER);
                            }
                            else {
                                this.addMessage(user.name + "\u306F " + damage + " \u306E\u88AB\u5BB3\u3092\u53D7\u3051\u305F.", EmphasisColor.DANGER);
                            }
                        }
                    }
                    else {
                        this.addMessage('トラップだ! ...どうやら作動しなかったようだ.');
                    }
                    break;
                case 4:
                    this.keyCount++;
                    this.addUserMessage("\u3061\u3063\u307D\u3051\u306A\u9375\u304C\u843D\u3061\u3066\u3044\u308B. \u8CB0\u3063\u3066\u304A\u3053\u3046. (" + this.keyCount + ")");
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
