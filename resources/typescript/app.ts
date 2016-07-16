///<reference path="typings/jquery/jquery.d.ts"/>
///<reference path="typings/vue/vue.d.ts"/>

///<reference path="enums/Field.ts"/>
///<reference path="enums/Direction.ts"/>
///<reference path="enums/EmphasisColor.ts"/>

///<reference path="core/Cell.ts"/>
///<reference path="core/World.ts"/>
///<reference path="core/Position.ts"/>

///<reference path="utils/common.ts"/>

///<reference path="entities/User.ts"/>
///<reference path="entities/Traps.ts"/>

///<reference path="models/Users.ts"/>

import Direction = enums.Direction
import Field = enums.Field
import World = core.World

import TargetRange = enums.TargetRange
import EmphasisColor = enums.EmphasisColor

import random = utils.random
import dice = utils.dice
import Trap = entities.Trap
import Users = models.Users

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
                this.addMessage(`${this.txt}を追加しました!`, EmphasisColor.SUCCESS)
                this.txt = ''
            } else {
                this.addMessage('その人は追加済みです!')
            }
        },
        removeUser: function (userName: string) {
            for (var i = 0; i < this.users.length; i++) {
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
            var target = this.world.fields[this.position.y][this.position.x]
            switch (target.field) {
                case Field.GOAL:
                    this.addUserMessage('ついに宝を見つけたぞー!!')
                    this.addMessage('＊ おめでとう ＊')
                    this.addMessage('こうして一行は解散した...')
                    models.Users.clear()
                    this.users = models.Users.find()
                    this.world.make()
                    break
                default:
                    if (target.treasure != null) {
                        this.addMessage('宝箱を見つけた!', EmphasisColor.INVERSE)
                        this.addMessage(`${target.treasure.name}を手に入れた.`, EmphasisColor.SUCCESS)
                        target.treasure = null
                    } else {
                        this.addMessage('ここに宝はないようだ.')
                    }
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
                    var targetName = target.block.name
                    var addMessage = this.addMessage
                    this.users.forEach(function (x) {
                        var damage = dice()
                        target.block.life.sub(damage)
                        addMessage(`${x.name}は${targetName}を攻撃し ${damage} の損傷を与えた.`)
                    })
                    if (target.block.life.current < 1) {
                        this.addMessage(`${targetName}を破壊.`)
                        if (0 < target.block.items.length) {
                            // TODO: 所有のアイテムからランダムで設置する
                            this.addMessage('目の前に何かが落ちた.', EmphasisColor.SUCCESS)
                            target.treasure = target.block.items[0]
                        }
                        target.field = Field.FLAT
                        target.block = null
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
                    this.addMessage('目の前には壁. (どうやっても壊せそうにない)')
                    break
                case Field.BLOCK:
                    var targetName = target.block.name
                    this.addMessage(`目の前に${targetName}. (${target.block.life.current} / ${target.block.life.max})`)
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
            var target = this.world.getLeftCell(this.position, this.direction.value)
            switch (target.field) {
                case Field.WALL:
                case Field.BLOCK:
                    this.addMessage('何かがあって通れない.')
                    break
                case Field.FLAT:
                case Field.GOAL:
                    this.addMessage('左へ移動した.')
                    var forwardPosition = this.world.getLeftPosition(this.position, this.direction.value)
                    this.position = forwardPosition
                    this.randomEvent()
                    this.afterAction()
                    break
            }
            this.after()
        },
        moveRight: function () {
            var target = this.world.getRightCell(this.position, this.direction.value)
            switch (target.field) {
                case Field.WALL:
                case Field.BLOCK:
                    this.addMessage('何かがあって通れない.')
                    break
                case Field.FLAT:
                case Field.GOAL:
                    this.addMessage('右へ移動した.')
                    var forwardPosition = this.world.getRightPosition(this.position, this.direction.value)
                    this.position = forwardPosition
                    this.randomEvent()
                    this.afterAction()
                    break
            }
        },
        afterAction: function() {
            for (var i = 0; i < this.users.length; i++) {
                var user = this.users[i]
                user.flow()
                if (user.life.current < 1) {
                    this.addMessage(`${user.name}は力尽きた...`, EmphasisColor.DANGER)
                    models.Users.delete(user.name)
                    this.users = models.Users.find()
                }
            }
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
                    this.addMessage('食糧を拾った!', EmphasisColor.SUCCESS)
                    this.users.forEach(function (x) {
                        var food = dice(2)
                        x.food.add(food)
                    })
                    break
                case 5:
                    var trap = Trap.random()
                    if (trap != null) {
                        this.addMessage(`トラップだ! ${trap.name}!`, EmphasisColor.INVERSE)
                        if (trap.range == TargetRange.ALL) {
                            var addMessage = this.addMessage
                            this.users.forEach(function (x) {
                                var damage = trap.operate()
                                x.life.sub(damage)
                                addMessage(`${x.name}は ${damage} の被害を受けた.`, EmphasisColor.DANGER)
                            })
                        } else {
                            var damage = trap.operate()
                            var userIndex = random(this.users.length) - 1
                            var user = this.users[userIndex]
                            user.life.sub(damage)
                            this.addMessage(`${user.name}は ${damage} の被害を受けた.`, EmphasisColor.DANGER)
                        }
                    } else {
                        this.addMessage('トラップだ! ...どうやら作動しなかったようだ.')
                    }
                    break
                case 6:
                    this.addUserMessage('...')
                    break
            }
        },
        addMessage: function (message: string, emphasis: EmphasisColor = EmphasisColor.DEFAULT) {
            this.topMessage = `位置: (${this.position.x},${this.position.y})`
            if (4 < this.mainMessages.length) {
                this.mainMessages.shift()
            }
            var em = {}
            switch (emphasis) {
                case EmphasisColor.DANGER:
                    em['danger'] = true
                    break
                case EmphasisColor.SUCCESS:
                    em['success'] = true
                    break
                case EmphasisColor.INVERSE:
                    em['inverse'] = true
                    break
            }
            this.mainMessages.push({
                text: message,
                em: em
            });
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
        this.addMessage('mbAppの世界にようこそ!', EmphasisColor.INVERSE)
        this.addMessage('メンバを4人追加してチームを作ってください!')
        this.direction.enable = 0 < this.users.length
        this.world.make()
        this.after()
    }
})