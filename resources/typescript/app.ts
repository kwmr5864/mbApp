///<reference path="typings/jquery/jquery.d.ts"/>
///<reference path="typings/vue/vue.d.ts"/>

///<reference path="enums/Field.ts"/>
///<reference path="enums/Direction.ts"/>

///<reference path="core/Cell.ts"/>
///<reference path="core/World.ts"/>
///<reference path="core/Position.ts"/>
///<reference path="core/Event.ts"/>

///<reference path="utils/common.ts"/>
///<reference path="entities/User.ts"/>
///<reference path="models/Users.ts"/>

import Direction = enums.Direction;
import Field = enums.Field
import World = core.World;

import random = utils.random;
import dice = utils.dice;

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
              this.displayMessage('名前を入力してください!', 2)
            } else if (jQuery.inArray(this.txt, this) < 0) {
                var user = new entities.User(this.txt)
                models.Users.add(user)
                this.users = models.Users.find()
                this.displayMessage(`${this.txt}を追加しました!`, 2)
                this.txt = ''
            } else {
                this.displayMessage('その人は追加済みです!', 2)
            }
        },
        removeUser: function (userName: string) {
            for (var i in this.users) {
                var user: entities.User = this.users[i];
                if (userName === user.name) {
                    models.Users.delete(userName)
                    this.users = models.Users.find()
                    this.displayMessage(`${userName}を除名しました!`, 2)
                }
            }
        },
        dissolution: function () {
            models.Users.clear()
            this.users = models.Users.find()
            this.displayMessage('チームを解散した', 2)
        },
        rest: function () {
            this.displayMessage('休憩中...', 2)
            this.users.forEach(function (x) {
                if (0 < x.food.current) {
                    x.life.add(dice())
                }
            })
            this.afterAction()
            this.after()
        },
        search: function () {
            var field = this.world.fields[this.position.y][this.position.x].field
            switch (field) {
                case Field.GOAL:
                    this.displayUserMessage('ついに宝を見つけたぞー!!')
                    this.displayMessage('＊ おめでとう ＊', 3)
                    this.displayMessage('こうして一行は解散した...', 4)
                    models.Users.clear()
                    this.users = models.Users.find()
                    this.world.make()
                    break
                default:
                    this.displayMessage('ここに宝はないようだ.')
                    break
            }
            this.after()
        },
        action: function () {
            var field = this.world.getForwardField(this.position, this.direction.value)
            switch (field) {
                case Field.FLAT:
                    this.displayMessage('空を切った.')
                    break
                case Field.BLOCK:
                    var forwardPosition = this.position.getForward(this.direction.value)
                    this.displayMessage('岩を破壊した.')
                    this.world.fields[forwardPosition.y][forwardPosition.x].field = Field.FLAT
                    this.world.fields[forwardPosition.y][forwardPosition.x].object = null
                    this.afterAction()
                    break
                case Field.WALL:
                    this.displayMessage('壁を蹴った.')
                    break
            }
            this.afterAction()
            this.after()
        },
        useKey: function () {
            this.displayMessage('鍵を持っていない.')
            this.after()
        },
        watch: function () {
            this.displayMessage('時計を持っていない.')
            this.after()
        },
        compass: function () {
            this.direction.enable = !this.direction.enable
            this.after()
        },
        goForward: function () {
            var field = this.world.getForwardField(this.position, this.direction.value)
            switch (field) {
                case Field.WALL:
                    this.displayMessage('壁にぶつかった!')
                    this.users.forEach(function (x) {
                        x.life.sub(dice())
                    })
                    this.displayMessage('', 3)
                    break
                case Field.BLOCK:
                    this.displayMessage('目の前に岩がある.')
                    break
                case Field.FLAT:
                case Field.GOAL:
                    this.displayMessage('前へ進んだ.')
                    this.position.moveForward(this.direction.value)
                    this.randomEvent()
                    this.afterAction()
                    break
            }
            this.after()
        },
        turnLeft: function () {
            switch (this.direction.value) {
                case Direction.NORTH:
                    this.direction.value = Direction.WEST
                    break
                case Direction.EAST:
                    this.direction.value = Direction.NORTH
                    break
                case Direction.SOUTH:
                    this.direction.value = Direction.EAST
                    break
                case Direction.WEST:
                    this.direction.value = Direction.SOUTH
                    break
                default:
                    break
            }
            this.after()
        },
        turnRight: function () {
            switch (this.direction.value) {
                case Direction.NORTH:
                    this.direction.value  = Direction.EAST
                    break
                case Direction.EAST:
                    this.direction.value = Direction.SOUTH
                    break
                case Direction.SOUTH:
                    this.direction.value = Direction.WEST
                    break
                case Direction.WEST:
                    this.direction.value = Direction.NORTH
                    break
                default:
                    break
            }
            this.after()
        },
        turnBack: function () {
            switch (this.direction.value) {
                case Direction.NORTH:
                    this.direction.value = Direction.SOUTH
                    break
                case Direction.EAST:
                    this.direction.value = Direction.WEST
                    break
                case Direction.SOUTH:
                    this.direction.value = Direction.NORTH
                    break
                case Direction.WEST:
                    this.direction.value = Direction.EAST
                    break
                default:
                    break
            }
            this.after()
        },
        moveLeft: function () {
            this.displayMessage('左へは動けない.', 2)
            this.after()
        },
        moveRight: function () {
            this.displayMessage('右へは動けない.', 2)
            this.after()
        },
        afterAction: function() {
            this.users.forEach(function (x: entities.User) {
                x.flow()
                if (x.life.current < 1) {
                    models.Users.delete(x.name)
                    this.displayMessage(`${x.name}は力尽きた...`, 3)
                }
            })
            models.Users.save(this.users)
            this.users = models.Users.find()
        },
        after: function () {
            if (this.users.length < 1) {
                this.direction.enable = false
            }
            this.direction.display = this.getDirectionDisplay()
        },
        randomEvent: function () {
            switch (dice()) {
                case 1:
                    this.displayUserMessage('いい天気だ.', 3)
                    break
                case 2:
                    this.displayUserMessage('何かが起こりそうな気がする...', 3)
                    break
                case 3:
                    this.displayUserMessage('油断するなよ.', 3)
                    break
                case 4:
                    this.displayMessage('食糧を拾った!', 3)
                    this.users.forEach(function (x) {
                        x.food.add(core.Event.getFood())
                    })
                    break
                case 5:
                    this.displayMessage('トラップだ!', 3)
                    this.users.forEach(function (x) {
                        x.life.sub(core.Event.getTrap())
                    })
                    this.displayMessage('ダメージを受けた...', 4)
                    break
                case 6:
                    this.displayMessage('...', 3)
                    break
            }
        },
        displayMessage: function (message: string, index: number = 2) {
            this.message1 = `位置: (${this.position.x},${this.position.y})`
            switch (index) {
                case 2:
                    this.message2 = message
                    this.message3 = ''
                    this.message4 = ''
                    break
                case 3:
                    this.message3 = message
                    this.message4 = ''
                    break
                case 4:
                    this.message4 = message
                    break
            }
        },
        displayUserMessage: function (message: string, index: number = 2) {
            var userIndex = random(this.users.length) - 1
            this.displayMessage(`${this.users[userIndex].name}：${message}`, index)
        },
        getDirectionDisplay: function() {
            var value = ''
            switch (this.direction.value) {
                case Direction.NORTH:
                    value = 'arrow_upward'
                    break;
                case Direction.EAST:
                    value = 'arrow_forward'
                    break
                case Direction.SOUTH:
                    value = 'arrow_downward'
                    break
                case Direction.WEST:
                    value = 'arrow_back'
                    break
            }
            return value
        },
    },
    created: function () {
        this.direction.enable = 0 < this.users.length
        this.world.make()
        this.after()
    }
})