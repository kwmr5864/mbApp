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
        EmphasisColor[EmphasisColor["SUCCESS"] = 3] = "SUCCESS";
        EmphasisColor[EmphasisColor["INVERSE"] = 4] = "INVERSE";
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
        return LimitedValue;
    }());
    core.LimitedValue = LimitedValue;
})(core || (core = {}));
var enums;
(function (enums) {
    (function (ItemType) {
        ItemType[ItemType["OINTMENT"] = 1] = "OINTMENT";
        ItemType[ItemType["MEAT"] = 2] = "MEAT";
        ItemType[ItemType["PAPER"] = 3] = "PAPER";
    })(enums.ItemType || (enums.ItemType = {}));
    var ItemType = enums.ItemType;
})(enums || (enums = {}));
var entities;
(function (entities) {
    var LimitedValue = core.LimitedValue;
    var LifeObject = (function () {
        function LifeObject(name, _life) {
            if (_life === void 0) { _life = 100; }
            this.name = name;
            this._life = _life;
            this.items = [];
            this.itemLimit = 3;
            this.life = new LimitedValue(_life);
        }
        LifeObject.prototype.addItem = function (item) {
            if (this.items.length <= this.itemLimit) {
                this.items.push(item);
            }
        };
        LifeObject.prototype.addRandomItem = function () {
            var item = entities.Item.getRandom();
            if (item != null) {
                this.addItem(item);
            }
        };
        return LifeObject;
    }());
    entities.LifeObject = LifeObject;
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
    var Rock = (function (_super) {
        __extends(Rock, _super);
        function Rock() {
            _super.call(this, '岩', 30 + dice());
        }
        return Rock;
    }(entities.LifeObject));
    entities.Rock = Rock;
    var Tree = (function (_super) {
        __extends(Tree, _super);
        function Tree() {
            _super.call(this, '木', 10 + dice());
        }
        return Tree;
    }(entities.LifeObject));
    entities.Tree = Tree;
    var TreasureBox = (function (_super) {
        __extends(TreasureBox, _super);
        function TreasureBox() {
            _super.call(this, '木箱', 10 + dice(2));
        }
        return TreasureBox;
    }(entities.LifeObject));
    entities.TreasureBox = TreasureBox;
    var Tussock = (function (_super) {
        __extends(Tussock, _super);
        function Tussock() {
            _super.call(this, '草むら', dice());
        }
        return Tussock;
    }(entities.LifeObject));
    entities.Tussock = Tussock;
})(entities || (entities = {}));
var entities;
(function (entities) {
    var ItemType = enums.ItemType;
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
var core;
(function (core) {
    var dice = utils.dice;
    var Direction = enums.Direction;
    var Field = enums.Field;
    var Cell = core.Cell;
    var Item = entities.Item;
    var World = (function () {
        function World() {
        }
        World.prototype.make = function () {
            this.fields = new Array(World.MAX_Y + 1);
            for (var i = 0; i <= World.MAX_Y; i++) {
                var row = new Array(World.MAX_X + 1);
                for (var j = 0; j <= World.MAX_X; j++) {
                    switch (dice()) {
                        case 5:
                        case 6:
                            switch (dice()) {
                                case 1:
                                    row[j] = new Cell(Field.WALL);
                                    break;
                                case 2:
                                    row[j] = new Cell(Field.BLOCK);
                                    row[j].block = new entities.Rock();
                                    break;
                                case 3:
                                    row[j] = new Cell(Field.BLOCK);
                                    row[j].block = new entities.Tree();
                                    break;
                                case 4:
                                    row[j] = new Cell(Field.BLOCK);
                                    row[j].block = new entities.TreasureBox();
                                    row[j].block.addRandomItem();
                                    break;
                                case 5:
                                    row[j] = new Cell(Field.BLOCK);
                                    row[j].block = new entities.Tussock();
                                    break;
                                case 6:
                                    row[j] = new Cell(Field.FLAT);
                                    break;
                            }
                            switch (dice()) {
                                case 1:
                                case 2:
                                    var item = Item.getRandom();
                                    if (item != null) {
                                        row[j].treasure = item;
                                    }
                                    break;
                            }
                            break;
                        default:
                            row[j] = new Cell(Field.FLAT);
                            break;
                    }
                }
                this.fields[i] = row;
            }
            var endX = utils.random(World.MAX_X);
            var endY = utils.random(World.MAX_Y);
            this.fields[endY][endX].field = Field.GOAL;
            this.fields[endY][endX].block = null;
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
        World.MAX_X = 7;
        World.MIN_X = 0;
        World.MAX_Y = 7;
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
        }
        User.prototype.flow = function () {
            if (this.food.current < 1) {
                this.life.current--;
            }
            else {
                this.food.current--;
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
            switch (dice()) {
                case 1:
                    trap = new Sling();
                    break;
                case 2:
                    trap = new Crossbow();
                    break;
                case 3:
                    trap = new Gas();
                    break;
                case 4:
                    trap = new Bomb();
                    break;
                default:
                    break;
            }
            return trap;
        };
        Trap.prototype.operate = function () {
            var damage = this.base + dice();
            return damage;
        };
        return Trap;
    }());
    entities.Trap = Trap;
    var Sling = (function (_super) {
        __extends(Sling, _super);
        function Sling() {
            _super.call(this, '投石', TargetRange.ONE, 5);
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
            _super.call(this, '爆弾', TargetRange.ALL, 50);
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
var appVm = new Vue({
    el: '#app',
    data: {
        topMessage: '',
        mainMessages: [],
        txt: '',
        users: models.Users.find(),
        direction: {
            value: Direction.NORTH,
            display: '',
            enable: false
        },
        world: new core.World(),
        position: new core.Position(utils.random(World.MAX_Y), utils.random(World.MAX_X))
    },
    methods: {
        add: function () {
            if (this.txt.trim() == '') {
                this.addMessage('名前を入力してください!');
            }
            else if (jQuery.inArray(this.txt, this) < 0) {
                var user = new entities.User(this.txt);
                models.Users.add(user);
                this.users = models.Users.find();
                this.addMessage(this.txt + "\u3092\u8FFD\u52A0\u3057\u307E\u3057\u305F!", EmphasisColor.SUCCESS);
                this.txt = '';
            }
            else {
                this.addMessage('その人は追加済みです!');
            }
        },
        removeUser: function (userName) {
            for (var i = 0; i < this.users.length; i++) {
                var user = this.users[i];
                if (userName === user.name) {
                    models.Users.delete(userName);
                    this.users = models.Users.find();
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
            this.users.forEach(function (x) {
                if (0 < x.food.current) {
                    x.life.add(dice());
                }
            });
            this.afterAction();
            this.after();
        },
        search: function () {
            var target = this.world.fields[this.position.y][this.position.x];
            switch (target.field) {
                case Field.GOAL:
                    this.addUserMessage('ついに宝を見つけたぞー!!');
                    this.addMessage('＊ おめでとう ＊');
                    this.addMessage('こうして一行は解散した...');
                    models.Users.clear();
                    this.users = models.Users.find();
                    this.world.make();
                    break;
                default:
                    if (target.treasure != null) {
                        this.addMessage('宝箱を見つけた!', EmphasisColor.INVERSE);
                        this.addMessage(target.treasure.name + "\u3092\u624B\u306B\u5165\u308C\u305F.", EmphasisColor.SUCCESS);
                        target.treasure = null;
                    }
                    else {
                        this.addMessage('ここに宝はないようだ.');
                    }
                    break;
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
                    var targetName = target.block.name;
                    var addMessage = this.addMessage;
                    this.users.forEach(function (x) {
                        var damage = dice();
                        target.block.life.sub(damage);
                        addMessage(x.name + "\u306F" + targetName + "\u3092\u653B\u6483\u3057 " + damage + " \u306E\u640D\u50B7\u3092\u4E0E\u3048\u305F.");
                    });
                    if (target.block.life.current < 1) {
                        this.addMessage(targetName + "\u3092\u7834\u58CA.");
                        if (0 < target.block.items.length) {
                            this.addMessage('目の前に何かが落ちた.', EmphasisColor.SUCCESS);
                            target.treasure = target.block.items[0];
                        }
                        target.field = Field.FLAT;
                        target.block = null;
                    }
                    this.afterAction();
                    break;
                case Field.WALL:
                    this.addMessage('壁を蹴った.');
                    break;
            }
            this.afterAction();
            this.after();
        },
        useKey: function () {
            this.addMessage('鍵を持っていない.');
            this.after();
        },
        watch: function () {
            this.addMessage('時計を持っていない.');
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
                    this.addMessage('目の前には壁. (どうやっても壊せそうにない)');
                    break;
                case Field.BLOCK:
                    var targetName = target.block.name;
                    this.addMessage("\u76EE\u306E\u524D\u306B" + targetName + ". (" + target.block.life.current + " / " + target.block.life.max + ")");
                    break;
                case Field.FLAT:
                case Field.GOAL:
                    this.addMessage('前へ進んだ.');
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
                    this.addMessage(user.name + "\u306F\u529B\u5C3D\u304D\u305F...", EmphasisColor.DANGER);
                    models.Users.delete(user.name);
                    this.users = models.Users.find();
                }
            }
            models.Users.save(this.users);
            this.users = models.Users.find();
        },
        after: function () {
            if (this.users.length < 1) {
                this.direction.enable = false;
            }
            this.direction.display = this.getDirectionDisplay();
        },
        randomEvent: function () {
            switch (dice()) {
                case 1:
                    this.addUserMessage('いい天気だ.');
                    break;
                case 2:
                    this.addUserMessage('何かが起こりそうな気がする...');
                    break;
                case 3:
                    this.addUserMessage('油断するなよ.');
                    break;
                case 4:
                    this.addMessage('食糧を拾った!', EmphasisColor.SUCCESS);
                    this.users.forEach(function (x) {
                        var food = dice(2);
                        x.food.add(food);
                    });
                    break;
                case 5:
                    var trap = Trap.random();
                    if (trap != null) {
                        this.addMessage("\u30C8\u30E9\u30C3\u30D7\u3060! " + trap.name + "!", EmphasisColor.INVERSE);
                        if (trap.range == TargetRange.ALL) {
                            var addMessage = this.addMessage;
                            this.users.forEach(function (x) {
                                var damage = trap.operate();
                                x.life.sub(damage);
                                addMessage(x.name + "\u306F " + damage + " \u306E\u88AB\u5BB3\u3092\u53D7\u3051\u305F.", EmphasisColor.DANGER);
                            });
                        }
                        else {
                            var damage = trap.operate();
                            var userIndex = random(this.users.length) - 1;
                            var user = this.users[userIndex];
                            user.life.sub(damage);
                            this.addMessage(user.name + "\u306F " + damage + " \u306E\u88AB\u5BB3\u3092\u53D7\u3051\u305F.", EmphasisColor.DANGER);
                        }
                    }
                    else {
                        this.addMessage('トラップだ! ...どうやら作動しなかったようだ.');
                    }
                    break;
                case 6:
                    this.addUserMessage('...');
                    break;
            }
        },
        addMessage: function (message, emphasis) {
            if (emphasis === void 0) { emphasis = EmphasisColor.DEFAULT; }
            this.topMessage = "\u4F4D\u7F6E: (" + this.position.x + "," + this.position.y + ")";
            if (4 < this.mainMessages.length) {
                this.mainMessages.shift();
            }
            var em = {};
            switch (emphasis) {
                case EmphasisColor.DANGER:
                    em['danger'] = true;
                    break;
                case EmphasisColor.SUCCESS:
                    em['success'] = true;
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
        addUserMessage: function (message) {
            var userIndex = random(this.users.length) - 1;
            this.addMessage(this.users[userIndex].name + "\uFF1A" + message);
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
