///<reference path="../core/LocalStorage.ts"/>
///<reference path="../entities/User.ts"/>

module models {
    export class Users {
        public static find(): entities.User[] {
            var rows = core.LocalStorage.get<entities.User[]>("users")
            var users: entities.User[] = (rows != null) ? rows.map(function (row) {
                var user = new entities.User(row.name)
                user.life.current = row.life.current
                user.life.max = row.life.max
                user.food.current = row.food.current
                user.food.max = row.food.max
                user.water.current = row.water.current
                user.water.max = row.water.max
                return user
            }) : []

            return users
        }

        public static save(users: entities.User[]) {
            core.LocalStorage.set<Users[]>("users", users)
        }

        public static add(user: entities.User) {
            var users = this.find()
            if (!Array.isArray(users)) {
                users = []
            }
            users.push(user)
            Users.save(users)
        }

        public static delete(userName: string) {
            var users = this.find()
            for (var i in users) {
                if (userName === users[i].name) {
                    users.splice(parseInt(i), 1)
                }
            }
            Users.save(users)
        }

        public static clear() {
            Users.save([])
        }
    }
}