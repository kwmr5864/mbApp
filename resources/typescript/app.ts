///<reference path="typings/jquery/jquery.d.ts"/>
///<reference path="typings/vue/vue.d.ts"/>
///<reference path="typings/faker/faker.d.ts"/>

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
import User = entities.User
import ItemType = enums.ItemType;

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
        hasTreasure: false,
        position: new core.Position(utils.random(World.MAX_Y), utils.random(World.MAX_X))
    },
    methods: {
        addMember: function () {
            var name = this.txt.trim()
            if (name == '') {
                name = `${faker.name.lastName()} ${faker.name.firstName()}`
            }
            var added = false
            for (var i = 0; i < this.users.length; i++) {
                if (name == this.users[i].name) {
                    added = true
                    break
                }
            }
            if (added) {
                this.addMessage(`${name}は追加済みです!`)
            } else {
                var user = new User(name)
                Users.add(user)
                this.users = Users.find()
                this.addMessage(`${name}を追加しました!`, EmphasisColor.SUCCESS)
            }
            this.txt = ''
        },
        removeUser: function (userName: string) {
            for (var i = 0; i < this.users.length; i++) {
                var user: User = this.users[i];
                if (userName === user.name) {
                    Users.delete(userName)
                    this.users = Users.find()
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
            for (var i = 0; i < this.users.length; i++) {
                var user = this.users[i]
                if (0 < user.food.current) {
                    user.life.add(dice())
                }
                if (user.life.isMax()) {
                    this.addUserMessage('体調は万全だ!', user)
                }
            }
            this.afterAction()
            this.after()
        },
        search: function () {
            var target = this.world.fields[this.position.y][this.position.x]
            switch (target.field) {
                case Field.GOAL:
                    if (this.hasTreasure) {
                        this.addMessage(`${this.world.name}を脱出した.`)
                        this.addMessage('＊ おめでとう ＊', EmphasisColor.INVERSE)
                        this.addMessage('こうして一行は宝を手に無事生還した. そして宴の後...')
                        this.addMessage('彼らは各々の次なる冒険を求め旅立っていったのだった.')
                        models.Users.clear()
                        this.users = models.Users.find()
                        this.world.make()
                    } else {
                        this.addUserMessage('出口だ. 宝を見つけたらここから脱出するぞ.')
                    }
                    break
                default:
                    if (target.treasure != null) {
                        this.addMessage('宝箱を見つけた!', EmphasisColor.INVERSE)
                        this.addMessage(`${target.treasure.name}を手に入れた.`, EmphasisColor.SUCCESS)
                        if (target.treasure.itemType == ItemType.TREASURE) {
                            this.hasTreasure = true
                            this.addUserMessage(`野郎ども引き上げるぞ! 出口を探せ!`)
                        }
                        target.treasure = null
                    } else {
                        this.addMessage('何もない.')
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
                case Field.WALL:
                    var targetName = target.block.name
                    var addMessage = this.addMessage
                    this.users.forEach(function (x) {
                        var damage = dice()
                        target.block.life.sub(damage)
                        addMessage(`${x.name}は${targetName}を攻撃し ${damage} の損傷を与えた.`, EmphasisColor.INFO)
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
            if (this.direction.enable) {
                this.addMessage('コンパスを止めた.')
                this.direction.enable = false
            } else {
                this.addMessage('コンパスを起動した.')
                this.direction.enable = true
            }
            this.after()
        },
        goForward: function () {
            var target = this.world.getForwardCell(this.position, this.direction.value)
            switch (target.field) {
                case Field.WALL:
                case Field.BLOCK:
                    var targetName = target.block.name
                    this.addMessage(`目の前に${targetName}. (${target.block.life.current})`, EmphasisColor.INVERSE)
                    break
                case Field.FLAT:
                case Field.GOAL:
                    var forwardCell = this.world.getForwardCell(this.position, this.direction.value)
                    this.addMessage(`前へ進んだ. ${forwardCell.treasure != null ? '足元に何かある.' : ''}`)
                    var forwardPosition = this.world.getForwardPosition(this.position, this.direction.value)
                    this.position = forwardPosition
                    this.randomEvent()
                    this.afterAction()
                    break
            }
            this.after()
        },
        turnLeft: function () {
            this.addMessage('左を向いた.')
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
            this.addMessage('右を向いた.')
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
            this.addMessage('後ろを向いた.')
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
                    this.addUserMessage('食い物が落ちてるぜ!')
                    this.addMessage('保存のきかなさそうな果実で一行はわずかに腹を満たした.', EmphasisColor.SUCCESS)
                    for (var i = 0; i < this.users.length; i++) {
                        var user = this.users[i]
                        var food = dice(2)
                        user.food.add(food)
                    }
                    break
                case 2:
                    this.addMessage('コウモリの群れだ!', EmphasisColor.INVERSE)
                    switch (dice()) {
                        case 1:
                            this.addMessage('だが幸い食糧を奪われずに済んだ.')
                            break
                        default:
                            for (var i = 0; i < this.users.length; i++) {
                                var user = this.users[i]
                                var food = dice(2)
                                user.food.sub(food)
                            }
                            this.addMessage('食糧を少し奪われてしまった...')
                            break
                    }
                    break
                case 3:
                    var trap = Trap.random()
                    if (trap != null) {
                        this.addMessage(`トラップだ! ${trap.name}!`, EmphasisColor.INVERSE)
                        if (trap.range == TargetRange.ALL) {
                            for (var i = 0; i < this.users.length; i++) {
                                var user = this.users[i]
                                var damage = trap.operate()
                                user.life.sub(damage)
                                this.addMessage(`${user.name}は ${damage} の被害を受けた.`, EmphasisColor.DANGER)
                            }
                        } else {
                            var damage = trap.operate()
                            var userIndex = random(this.users.length) - 1
                            var user = this.users[userIndex]
                            user.life.sub(damage)
                            if (user.life.max <= damage) {
                                this.addMessage(`${user.name}の体はバラバラにされた!`, EmphasisColor.DANGER)
                            } else {
                                this.addMessage(`${user.name}は ${damage} の被害を受けた.`, EmphasisColor.DANGER)
                            }
                        }
                    } else {
                        this.addMessage('トラップだ! ...どうやら作動しなかったようだ.')
                    }
                    break
                case 4:
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
                case EmphasisColor.ALERT:
                    em['alert'] = true
                    break
                case EmphasisColor.SUCCESS:
                    em['success'] = true
                    break
                case EmphasisColor.INFO:
                    em['info'] = true
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
        addUserMessage: function (message: string, user: User = null) {
            if (user == null) {
                var userIndex = random(this.users.length) - 1
                user = this.users[userIndex]
            }
            this.addMessage(`${user.name}：${message}`)
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
        this.world.make()
        this.after()
    }
})