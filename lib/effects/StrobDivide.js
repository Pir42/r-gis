const Effect = require("../effect");

class StrobDivide extends Effect {
    
    static MIN_SPEED=500
    static MIN_DIVIDE=2
    static MAX_DIVIDE=8

    constructor(segments) {
        super(segments)
        this.speed = StrobDivide.MIN_SPEED
        this.timeouts = []
        this.divide = StrobDivide.MIN_DIVIDE
    }

    run() {
        let max_seg_length = Math.min(...this.segments.map(s => s.seg_length))
        let start_at = 0
        let count = 0

        let strob_fc = () => {
            let current_divide = this.divide
            let portion = max_seg_length / current_divide
            start_at = count * portion

            this.segments.forEach(s => {
                s.on_between(start_at, start_at + portion)
            })

            let off_timeout = setTimeout(() => {
                this.segments.forEach(s => s.off())
                if(count >= current_divide-1 || current_divide != this.divide) {
                    count = 0
                } else {
                    count += 1
                }
                let on_timeout = setTimeout(strob_fc, this.speed)
                this.timeouts.push(on_timeout)
            }, this.speed)

            this.timeouts.push(off_timeout)
        }


        strob_fc()
    }

    stop() {
        this.timeouts.forEach(timeout => {
            clearTimeout(timeout)
        });

        this.segments.forEach(s => s.fill())
    }

    speed_calc(value) {
        return StrobDivide.MIN_SPEED - (value * StrobDivide.MIN_SPEED / 127)
    }

    divide_calc(value) {
        return ((StrobDivide.MAX_DIVIDE - StrobDivide.MIN_DIVIDE) / 127) * value + StrobDivide.MIN_DIVIDE
    }
}

module.exports = StrobDivide