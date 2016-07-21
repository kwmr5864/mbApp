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
import TargetRange = enums.TargetRange
import EmphasisColor = enums.EmphasisColor
import ItemType = enums.ItemType
import SpringType = enums.SpringType
import TrapType = enums.TrapType

import Item = entities.Item
import TreasureBox = entities.TreasureBox
import Trap = entities.Trap
import User = entities.User

import Users = models.Users

import random = utils.random
import dice = utils.dice

import World = core.World

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
            enable: false
        },
        has: {
            compass: false,
            treasure: false,
        },
        stock: {
            key: 30,
            compass: 0,
        },
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
            this.flow(1)
            this.afterAction()
            this.after()
        },
        search: function () {
            var target = this.world.fields[this.position.y][this.position.x]
            switch (target.field) {
                case Field.GOAL:
                    if (this.has.treasure) {
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
                        this.addMessage(`${target.treasure.name}を見つけた.`, EmphasisColor.INVERSE)
                    } else if (target.spring != null) {
                        this.addMessage(`${target.spring.name}が溢れている...`, EmphasisColor.INVERSE)
                    } else {
                        this.addMessage('周囲には何もなかった.')
                    }
                    break
            }
            this.after()
        },
        take: function () {
            var target = this.world.fields[this.position.y][this.position.x]
            if (target.treasure != null) {
                if (0 < target.treasure.lock) {
                    this.addMessage('鍵がかかっているようだ.')
                } else {
                    this.addMessage('箱の中を覗いた.')
                    var item = target.treasure.item
                    if (item != null) {
                        this.addMessage(`${item.name}が入っていた.`, EmphasisColor.SUCCESS)
                        switch (item.itemType) {
                            case ItemType.KEY:
                                this.stock.key++
                                break
                            case ItemType.TREASURE:
                                this.has.treasure = true
                                this.addUserMessage(`野郎ども引き上げるぞ! 出口を探せ!`)
                                break
                            case ItemType.COMPASS:
                                this.has.compass = true
                                this.stock.compass = 100
                                this.addUserMessage(`コンパスを起動しろ! 現在位置と方角がわかるぞ!`)
                        }
                        target.treasure.item = null
                    } else {
                        this.addMessage('中はもぬけの殻だった...')
                    }
                }
            } else if (target.spring != null) {
                var hasChanged = false
                this.addMessage(`${target.spring.name}を飲んだ.`)
                for (var i = 0; i < this.users.length; i++) {
                    var user = this.users[i]
                    let amount = target.spring.getAmount()
                    user.water.add(amount)
                    switch (target.spring.type) {
                        case SpringType.POISON:
                            user.life.sub(amount)
                            break
                        case SpringType.LIFE_UP:
                            switch (dice()) {
                                case 1:
                                case 2:
                                    user.life.expand(dice())
                                    hasChanged = true
                                    break
                            }
                            break
                        case SpringType.LIFE_DOWN:
                            switch (dice()) {
                                case 1:
                                case 2:
                                    user.life.contract(dice())
                                    hasChanged = true
                                    break
                            }
                            break
                    }
                }
                target.spring.life.sub(1)
                this.addMessage('喉が少し潤った.', EmphasisColor.SUCCESS)
                switch (target.spring.type) {
                    case SpringType.POISON:
                        this.addMessage('しかしこれは汚水だ! 体調が悪くなった...', EmphasisColor.DANGER)
                        break
                    case SpringType.LIFE_UP:
                        if (hasChanged) {
                            this.addMessage('生命力が漲った気がする...', EmphasisColor.SUCCESS)
                        }
                        break
                    case SpringType.LIFE_DOWN:
                        if (hasChanged) {
                            this.addMessage('衰弱したような気がする...', EmphasisColor.INFO)
                        }
                        break
                }
                if (target.spring.life.current < 1) {
                    this.addMessage(`${target.spring.name}は干上がった.`)
                    target.spring = null
                }
                this.afterAction()
            } else {
                this.addMessage('ここには手に取るようなものが何もない.')
            }
            this.after()
        },
        useKey: function () {
            var target = this.world.fields[this.position.y][this.position.x]
            if (this.stock.key < 1) {
                this.addMessage('鍵を持っていない.')
            } else if (target.treasure == null) {
                this.addMessage('鍵を使う場所がない.')
            } else if (target.treasure.lock < 1) {
                this.addMessage('この箱は開かれている.')
            } else if (target.treasure.life.current < 1) {
                this.addMessage('この箱は錠が壊れてしまったのでもう開けられないだろう...')
            } else {
                switch (dice()) {
                    case 1:
                    case 2:
                        this.addMessage('錠を1つこじ開けた.', EmphasisColor.INFO)
                        target.treasure.lock--
                        break
                    default:
                        this.addMessage('中々開かない...')
                        break
                }
                switch (dice()) {
                    case 1:
                    case 2:
                        this.stock.key--
                        this.addMessage(`鍵が折れた. (${this.stock.key})`, EmphasisColor.INFO)
                        break
                }
                if (target.treasure.lock < 1) {
                    this.addMessage('箱が開いた!', EmphasisColor.SUCCESS)
                } else if (!target.treasure.unbreakable) {
                    let damage = dice()
                    target.treasure.life.sub(damage)
                    if (target.treasure.life.current < 1) {
                        this.addMessage('錠が壊れてしまった...', EmphasisColor.INFO)
                    }
                }
                this.flow()
                this.afterAction()
            }
            this.after()
        },
        action: function () {
            var target = this.world.getForwardCell(this.position, this.direction.value)
            switch (target.field) {
                case Field.FLAT:
                    this.addMessage('空を切った.')
                    this.flow()
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
                        if (target.block.hasTreasure) {
                            switch (dice()) {
                                case 1:
                                case 2:
                                    this.addMessage('目の前に何かが落ちた.', EmphasisColor.SUCCESS)
                                    var item = Item.getRandom()
                                    let lock = dice() - 1
                                    target.treasure = new TreasureBox(item, lock)
                                    break
                            }
                        }
                        target.field = Field.FLAT
                        target.block = null
                    }
                    this.flow(3)
                    break
            }
            this.afterAction()
            this.after()
        },
        compass: function () {
            if (this.has.compass) {
                if (this.direction.enable) {
                    this.addMessage('コンパスを止めた.', EmphasisColor.INFO)
                    this.direction.enable = false
                } else {
                    this.addMessage('コンパスを起動した.', EmphasisColor.INFO)
                    this.direction.enable = true
                }
            } else {
                this.addMessage('コンパスを持っていない.')
            }
            this.after()
        },
        goForward: function () {
            var target = this.world.getForwardCell(this.position, this.direction.value)
            switch (target.field) {
                case Field.WALL:
                case Field.BLOCK:
                    var targetName = target.block.name
                    this.addMessage(`目の前に${targetName}.${target.block.life.impression()}`, EmphasisColor.INVERSE)
                    break
                case Field.FLAT:
                case Field.GOAL:
                    var forwardCell = this.world.getForwardCell(this.position, this.direction.value)
                    if (forwardCell.treasure != null || forwardCell.spring != null) {
                        this.addMessage('前へ進んだ. 足元に何かある.', EmphasisColor.INFO)
                    } else {
                        this.addMessage('前へ進んだ.', EmphasisColor.INFO)
                    }
                    var forwardPosition = this.world.getForwardPosition(this.position, this.direction.value)
                    this.position = forwardPosition
                    this.randomEvent()
                    this.flow()
                    this.afterAction()
                    break
            }
            this.after()
        },
        turnLeft: function () {
            this.addMessage('左を向いた.', EmphasisColor.INFO)
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
            this.addMessage('右を向いた.', EmphasisColor.INFO)
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
        moveBack: function () {
            var target = this.world.getBackCell(this.position, this.direction.value)
            switch (target.field) {
                case Field.WALL:
                case Field.BLOCK:
                    this.addMessage('何かがあって通れない.', EmphasisColor.INFO)
                    break
                case Field.FLAT:
                case Field.GOAL:
                    this.addMessage('後ろに下がった.', EmphasisColor.INFO)
                    var targetPosition = this.world.getBackPosition(this.position, this.direction.value)
                    this.position = targetPosition
                    this.randomEvent()
                    this.flow(4)
                    this.afterAction()
                    break
            }
            this.after()
        },
        moveLeft: function () {
            var target = this.world.getLeftCell(this.position, this.direction.value)
            switch (target.field) {
                case Field.WALL:
                case Field.BLOCK:
                    this.addMessage('何かがあって通れない.', EmphasisColor.INFO)
                    break
                case Field.FLAT:
                case Field.GOAL:
                    this.addMessage('左へ移動した.', EmphasisColor.INFO)
                    var targetPosition = this.world.getLeftPosition(this.position, this.direction.value)
                    this.position = targetPosition
                    this.randomEvent()
                    this.flow(3)
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
                    this.addMessage('何かがあって通れない.', EmphasisColor.INFO)
                    break
                case Field.FLAT:
                case Field.GOAL:
                    this.addMessage('右へ移動した.', EmphasisColor.INFO)
                    var targetPosition = this.world.getRightPosition(this.position, this.direction.value)
                    this.position = targetPosition
                    this.randomEvent()
                    this.flow(3)
                    this.afterAction()
                    break
            }
            this.after()
        },
        flow: function (amount: number = 2) {
            for (var i = 0; i < this.users.length; i++) {
                var user = this.users[i]
                user.flow(amount)
            }
            if (this.has.compass) {
                this.stock.compass--
            }
        },
        afterAction: function() {
            for (var i = 0; i < this.users.length; i++) {
                var user = this.users[i]
                if (user.life.current < 1) {
                    this.addMessage(`${user.name}は息絶えた...`, EmphasisColor.DANGER)
                    models.Users.delete(user.name)
                    this.users = models.Users.find()
                }
            }
            if (this.has.compass && this.stock.compass < 1) {
                this.direction.enable = false
                this.has.compass = false
                this.stock.compass = 0
                this.addMessage('コンパスの電池が切れた...')
            }
            models.Users.save(this.users)
            this.users = models.Users.find()
        },
        after: function () {
            this.topMessage = `位置: (${this.position.x},${this.position.y})`
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
                        switch(trap.type) {
                            case TrapType.SLING:
                            case TrapType.CROSSBOW:
                            case TrapType.CHAINSAW:
                                var damage = trap.operate()
                                var userIndex = random(this.users.length) - 1
                                var user = this.users[userIndex]
                                user.life.sub(damage)
                                if (trap.type == TrapType.CHAINSAW) {
                                    this.addMessage(`${user.name}の体はバラバラにされた!`, EmphasisColor.DANGER)
                                } else {
                                    this.addMessage(`${user.name}は ${damage} の被害を受けた.`, EmphasisColor.DANGER)
                                }
                                break
                            case TrapType.GAS:
                            case TrapType.BOMB:
                                for (var i = 0; i < this.users.length; i++) {
                                    var user = this.users[i]
                                    var damage = trap.operate()
                                    user.life.sub(damage)
                                    this.addMessage(`${user.name}は ${damage} の被害を受けた.`, EmphasisColor.DANGER)
                                }
                                break
                            case TrapType.ROTATION:
                                var direction: Direction = null
                                switch (dice()) {
                                    case 1:
                                        direction = Direction.NORTH
                                        break
                                    case 2:
                                        direction = Direction.EAST
                                        break
                                    case 3:
                                        direction = Direction.SOUTH
                                        break
                                    case 4:
                                        direction = Direction.WEST
                                }
                                if (direction != null) {
                                    this.direction.value = direction
                                    this.addUserMessage(`目が回った... ところでどっちを向いてたっけ.`)
                                } else {
                                    this.addMessage('...錆びついていたようだ.')
                                }
                                break
                            case TrapType.WARP:
                                switch (dice()) {
                                    case 1:
                                    case 2:
                                        var position = World.getRandomPosition()
                                        var target = this.world.fields[position.y][position.x]
                                        if (target.block != null) {
                                            var damage = Math.ceil(target.block.life.current / this.users.length)
                                            for (var i = 0; i < this.users.length; i++) {
                                                var user = this.users[i]
                                                user.life.sub(damage)
                                            }
                                            this.addMessage(`落下して${target.block.name}に直撃した!`, EmphasisColor.DANGER)
                                            this.addMessage(`${target.block.name}は粉々に砕け散った.`)
                                            target.block = null
                                            target.field = Field.FLAT
                                        } else {
                                            this.addUserMessage('...ここはどこだ?')
                                        }
                                        this.position = position
                                        break
                                    default:
                                        this.addUserMessage('...どうやら壊れてたみたいだな.')
                                        break
                                }
                                break
                        }
                    } else {
                        this.addMessage('トラップだ! ...どうやら作動しなかったようだ.')
                    }
                    break
                case 4:
                    this.stock.key++
                    this.addMessage(`鍵を拾った. (${this.stock.key})`)
                    break
            }
        },
        addMessage: function (message: string, emphasis: EmphasisColor = EmphasisColor.DEFAULT) {
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