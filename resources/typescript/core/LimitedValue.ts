module core {
    export class LimitedValue {
        public max: number
        constructor(public current: number) {
            this.max = current
        }
        public add(value: number) {
            this.current += value
            if (this.max < this.current) {
                this.current = this.max
            }
        }
        public sub(value: number) {
            this.current -= value
            if (this.current < 0) {
                this.current = 0
            }
        }
        public expand(value: number) {
            this.max += value
        }
        public contract(value: number) {
            this.max -= value
        }
        public isMax(): boolean {
            return this.max <= this.current
        }
        public impression(): string {
            if (this.max <= this.current) {
                return ''
            } else if (this.current < 5) {
                return ' (ボロボロ)'
            } else if (this.current < 10) {
                return ' (傷だらけ)'
            } else if (this.current < 30) {
                return ' (傷がある)'
            } else if (this.current < 1000) {
                return ''
            } else {
                return ' (壊せそうにない)'
            }
        }
    }
}