module utils {
    /**
     * サイコロを振って1から6までのどれかの数字を返す。
     *
     * @param {number} count 振る回数
     *
     * @returns {number} 出た目
     */
    export function dice(count: number = 1): number {
        var result = 0
        for (var i = 0; i < count; i++) {
            result += random(6)
        }

        return result
    }

    export function random(max: number): number {
        var result = Math.ceil(Math.random() * max)

        return result
    }
}