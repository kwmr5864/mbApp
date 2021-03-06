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
        Position.prototype.moveForward = function (direction) {
            switch (direction) {
                case Direction.NORTH:
                    this.y--;
                    break;
                case Direction.EAST:
                    this.x++;
                    break;
                case Direction.SOUTH:
                    this.y++;
                    break;
                case Direction.WEST:
                    this.x--;
                    break;
            }
        };
        Position.prototype.moveLeft = function (direction) {
            switch (direction) {
                case Direction.NORTH:
                    this.x--;
                    break;
                case Direction.EAST:
                    this.y--;
                    break;
                case Direction.SOUTH:
                    this.x++;
                    break;
                case Direction.WEST:
                    this.y++;
                    break;
            }
        };
        Position.prototype.moveRight = function (direction) {
            switch (direction) {
                case Direction.NORTH:
                    this.x++;
                    break;
                case Direction.EAST:
                    this.y++;
                    break;
                case Direction.SOUTH:
                    this.x--;
                    break;
                case Direction.WEST:
                    this.y--;
                    break;
            }
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
    var Block = (function (_super) {
        __extends(Block, _super);
        function Block() {
            _super.call(this, '岩', 30);
        }
        return Block;
    }(entities.LifeObject));
    entities.Block = Block;
})(entities || (entities = {}));
var core;
(function (core) {
    var Direction = enums.Direction;
    var Field = enums.Field;
    var Block = entities.Block;
    var Cell = core.Cell;
    var World = (function () {
        function World() {
        }
        World.prototype.make = function () {
            this.fields = new Array(World.MAX_Y + 1);
            for (var i = 0; i <= World.MAX_Y; i++) {
                var row = new Array(World.MAX_X + 1);
                for (var j = 0; j <= World.MAX_X; j++) {
                    switch (utils.dice()) {
                        case 6:
                            row[j] = new Cell(Field.BLOCK);
                            row[j].object = new Block();
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
            this.fields[endY][endX].object = null;
        };
        World.prototype.getForwardField = function (position, direction) {
            var field = Field.WALL;
            var forwardPosition = position.getForward(direction);
            if (forwardPosition.x === -1 || forwardPosition.y === -1) {
                return field;
            }
            switch (direction) {
                case Direction.NORTH:
                    if (World.MIN_Y <= forwardPosition.y) {
                        field = this.fields[forwardPosition.y][forwardPosition.x].field;
                    }
                    break;
                case Direction.EAST:
                    if (forwardPosition.x <= World.MAX_X) {
                        field = this.fields[forwardPosition.y][forwardPosition.x].field;
                    }
                    break;
                case Direction.SOUTH:
                    if (forwardPosition.y <= World.MAX_Y) {
                        field = this.fields[forwardPosition.y][forwardPosition.x].field;
                    }
                    break;
                case Direction.WEST:
                    if (World.MIN_X <= forwardPosition.x) {
                        field = this.fields[forwardPosition.y][forwardPosition.x].field;
                    }
                    break;
            }
            return field;
        };
        World.MAX_X = 3;
        World.MIN_X = 0;
        World.MAX_Y = 3;
        World.MIN_Y = 0;
        return World;
    }());
    core.World = World;
})(core || (core = {}));
var core;
(function (core) {
    var dice = utils.dice;
    var Event = (function () {
        function Event() {
        }
        Event.getFood = function () {
            return dice(2);
        };
        Event.getTrap = function () {
            return dice();
        };
        return Event;
    }());
    core.Event = Event;
})(core || (core = {}));
var entities;
(function (entities) {
    var LimitedValue = core.LimitedValue;
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
        return User;
    }(entities.LifeObject));
    entities.User = User;
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
var random = utils.random;
var dice = utils.dice;
var appVm = new Vue({
    el: '#app',
    data: {
        message1: '',
        message2: 'mbAppの世界にようこそ!',
        message3: 'メンバを4人追加してチームを作ってください!',
        message4: '',
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
                this.displayMessage('名前を入力してください!', 2);
            }
            else if (jQuery.inArray(this.txt, this) < 0) {
                var user = new entities.User(this.txt);
                models.Users.add(user);
                this.users = models.Users.find();
                this.displayMessage(this.txt + "\u3092\u8FFD\u52A0\u3057\u307E\u3057\u305F!", 2);
                this.txt = '';
            }
            else {
                this.displayMessage('その人は追加済みです!', 2);
            }
        },
        removeUser: function (userName) {
            for (var i in this.users) {
                var user = this.users[i];
                if (userName === user.name) {
                    models.Users.delete(userName);
                    this.users = models.Users.find();
                    this.displayMessage(userName + "\u3092\u9664\u540D\u3057\u307E\u3057\u305F!", 2);
                }
            }
        },
        dissolution: function () {
            models.Users.clear();
            this.users = models.Users.find();
            this.displayMessage('チームを解散した', 2);
        },
        rest: function () {
            this.displayMessage('休憩中...', 2);
            this.users.forEach(function (x) {
                if (0 < x.food.current) {
                    x.life.add(dice());
                }
            });
            this.afterAction();
            this.after();
        },
        search: function () {
            var field = this.world.fields[this.position.y][this.position.x].field;
            switch (field) {
                case Field.GOAL:
                    this.displayUserMessage('ついに宝を見つけたぞー!!');
                    this.displayMessage('＊ おめでとう ＊', 3);
                    this.displayMessage('こうして一行は解散した...', 4);
                    models.Users.clear();
                    this.users = models.Users.find();
                    this.world.make();
                    break;
                default:
                    this.displayMessage('ここに宝はないようだ.');
                    break;
            }
            this.after();
        },
        action: function () {
            var field = this.world.getForwardField(this.position, this.direction.value);
            switch (field) {
                case Field.FLAT:
                    this.displayMessage('空を切った.');
                    break;
                case Field.BLOCK:
                    var forwardPosition = this.position.getForward(this.direction.value);
                    this.displayMessage('岩を破壊した.');
                    this.world.fields[forwardPosition.y][forwardPosition.x].field = Field.FLAT;
                    this.world.fields[forwardPosition.y][forwardPosition.x].object = null;
                    this.afterAction();
                    break;
                case Field.WALL:
                    this.displayMessage('壁を蹴った.');
                    break;
            }
            this.afterAction();
            this.after();
        },
        useKey: function () {
            this.displayMessage('鍵を持っていない.');
            this.after();
        },
        watch: function () {
            this.displayMessage('時計を持っていない.');
            this.after();
        },
        compass: function () {
            this.direction.enable = !this.direction.enable;
            this.after();
        },
        goForward: function () {
            var field = this.world.getForwardField(this.position, this.direction.value);
            switch (field) {
                case Field.WALL:
                    this.displayMessage('壁にぶつかった!');
                    this.users.forEach(function (x) {
                        x.life.sub(dice());
                    });
                    this.displayMessage('', 3);
                    break;
                case Field.BLOCK:
                    this.displayMessage('目の前に岩がある.');
                    break;
                case Field.FLAT:
                case Field.GOAL:
                    this.displayMessage('前へ進んだ.');
                    this.position.moveForward(this.direction.value);
                    this.randomEvent();
                    this.afterAction();
                    break;
            }
            this.after();
        },
        turnLeft: function () {
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
            this.displayMessage('左へは動けない.', 2);
            this.after();
        },
        moveRight: function () {
            this.displayMessage('右へは動けない.', 2);
            this.after();
        },
        afterAction: function () {
            this.users.forEach(function (x) {
                x.flow();
                if (x.life.current < 1) {
                    models.Users.delete(x.name);
                    this.displayMessage(x.name + "\u306F\u529B\u5C3D\u304D\u305F...", 3);
                }
            });
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
                    this.displayUserMessage('いい天気だ.', 3);
                    break;
                case 2:
                    this.displayUserMessage('何かが起こりそうな気がする...', 3);
                    break;
                case 3:
                    this.displayUserMessage('油断するなよ.', 3);
                    break;
                case 4:
                    this.displayMessage('食糧を拾った!', 3);
                    this.users.forEach(function (x) {
                        x.food.add(core.Event.getFood());
                    });
                    break;
                case 5:
                    this.displayMessage('トラップだ!', 3);
                    this.users.forEach(function (x) {
                        x.life.sub(core.Event.getTrap());
                    });
                    this.displayMessage('ダメージを受けた...', 4);
                    break;
                case 6:
                    this.displayMessage('...', 3);
                    break;
            }
        },
        displayMessage: function (message, index) {
            if (index === void 0) { index = 2; }
            this.message1 = "\u4F4D\u7F6E: (" + this.position.x + "," + this.position.y + ")";
            switch (index) {
                case 2:
                    this.message2 = message;
                    this.message3 = '';
                    this.message4 = '';
                    break;
                case 3:
                    this.message3 = message;
                    this.message4 = '';
                    break;
                case 4:
                    this.message4 = message;
                    break;
            }
        },
        displayUserMessage: function (message, index) {
            if (index === void 0) { index = 2; }
            var userIndex = random(this.users.length) - 1;
            this.displayMessage(this.users[userIndex].name + "\uFF1A" + message, index);
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
        }
    },
    created: function () {
        this.direction.enable = 0 < this.users.length;
        this.world.make();
        this.after();
    }
});
