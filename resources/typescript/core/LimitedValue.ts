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
        public isMax(): boolean {
            return this.max <= this.current
        }
        public impression(): string {
            if (this.max <= this.current) {
                return ''
            } else if (this.current < 5) {
                return ' (瀕死)'
            } else if (this.current < 10) {
                return ' (重傷)'
            } else if (this.current < 30) {
                return ' (傷ついている)'
            } else if (this.current < 1000) {
                return ''
            } else {
                return ' (壊せそうにない)'
            }
        }
    }
}