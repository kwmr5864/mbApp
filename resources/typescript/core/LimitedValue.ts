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
    }
}