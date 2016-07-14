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
              this.addMessage('名前を入力してください!')
            } else if (jQuery.inArray(this.txt, this) < 0) {
                var user = new entities.User(this.txt)
                models.Users.add(user)
                this.users = models.Users.find()
                this.addMessage(`${this.txt}を追加しました!`)
                this.txt = ''
            } else {
                this.addMessage('その人は追加済みです!')
            }
        },
        removeUser: function (userName: string) {
            for (var i in this.users) {
                var user: entities.User = this.users[i];
                if (userName === user.name) {
                    models.Users.delete(userName)
                    this.users = models.Users.find()
                    this.addMessage(`${userName}を除名しました!`)
                }
            }
        },
        dissolution: function () {
            models.Users.clear()
            this.users = models.Users.find()
            this.addMessage('チームを解散した')
        },
        rest: function () {
            this.addMessage('休憩中...')
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
                    this.addUserMessage('ついに宝を見つけたぞー!!')
                    this.addMessage('＊ おめでとう ＊')
                    this.addMessage('こうして一行は解散した...')
                    models.Users.clear()
                    this.users = models.Users.find()
                    this.world.make()
                    break
                default:
                    this.addMessage('ここに宝はないようだ.')
                    break
            }
            this.after()
        },
        action: function () {
            var target = this.world.getForwardCell(this.position, this.direction.value)
            switch (target.field) {
                case Field.FLAT:
                    this.addMessage('空を切った.')
                    break
                case Field.BLOCK:
                    var targetName = target.object.name
                    var addMessage = this.addMessage
                    this.users.forEach(function (x) {
                        var damage = dice()
                        target.object.life.sub(damage)
                        addMessage(`${x.name}は${targetName}を攻撃し ${damage} の損傷を与えた.`)
                    })
                    if (target.object.life.current < 1) {
                        this.addMessage(`${targetName}を破壊した.`)
                        target.field = Field.FLAT
                        target.object = null
                    }
                    this.afterAction()
                    break
                case Field.WALL:
                    this.addMessage('壁を蹴った.')
                    break
            }
            this.afterAction()
            this.after()
        },
        useKey: function () {
            this.addMessage('鍵を持っていない.')
            this.after()
        },
        watch: function () {
            this.addMessage('時計を持っていない.')
            this.after()
        },
        compass: function () {
            this.direction.enable = !this.direction.enable
            this.after()
        },
        goForward: function () {
            var target = this.world.getForwardCell(this.position, this.direction.value)
            switch (target.field) {
                case Field.WALL:
                    this.addMessage('壁にぶつかった!')
                    this.users.forEach(function (x) {
                        x.life.sub(dice())
                    })
                    break
                case Field.BLOCK:
                    var targetName = target.object.name
                    this.addMessage(`目の前に${targetName}. (${target.object.life.current} / ${target.object.life.max})`)
                    break
                case Field.FLAT:
                case Field.GOAL:
                    this.addMessage('前へ進んだ.')
                    var forwardPosition = this.world.getForwardPosition(this.position, this.direction.value)
                    this.position = forwardPosition
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
            this.addMessage('左へは動けない.')
            this.after()
        },
        moveRight: function () {
            this.addMessage('右へは動けない.')
            this.after()
        },
        afterAction: function() {
            this.users.forEach(function (x: entities.User) {
                x.flow()
                if (x.life.current < 1) {
                    models.Users.delete(x.name)
                    this.addMessage(`${x.name}は力尽きた...`)
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
                    this.addUserMessage('いい天気だ.')
                    break
                case 2:
                    this.addUserMessage('何かが起こりそうな気がする...')
                    break
                case 3:
                    this.addUserMessage('油断するなよ.')
                    break
                case 4:
                    this.addMessage('食糧を拾った!')
                    this.users.forEach(function (x) {
                        x.food.add(core.Event.getFood())
                    })
                    break
                case 5:
                    this.addMessage('トラップだ!')
                    this.users.forEach(function (x) {
                        x.life.sub(core.Event.getTrap())
                    })
                    this.addMessage('ダメージを受けた...')
                    break
                case 6:
                    this.addUserMessage('...')
                    break
            }
        },
        addMessage: function (message: string) {
            this.topMessage = `位置: (${this.position.x},${this.position.y})`
            if (4 < this.mainMessages.length) {
                this.mainMessages.shift()
            }
            this.mainMessages.push({text: message});
        },
        addUserMessage: function (message: string) {
            var userIndex = random(this.users.length) - 1
            this.addMessage(`${this.users[userIndex].name}：${message}`)
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
        this.addMessage('mbAppの世界にようこそ!')
        this.addMessage('メンバを4人追加してチームを作ってください!')
        this.direction.enable = 0 < this.users.length
        this.world.make()
        this.after()
    }
})