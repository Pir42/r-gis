const Effect = require("../effect");

class WormRevert extends Effect {
    
    static MIN_SPEED=50
    static MIN_SEG_LENGTH=1
    static MAX_SEG_LENGTH=38
    static MAX_DELTA = 5

    constructor(segments, manager) {
        super(segments)
        this.timeouts = []
        this.manager = manager
    }

    run() {
        this.segments.forEach(s => { s.off() })
        let max_seg_length = Math.max(...this.segments.map(s => s.seg_length))
        let current_end_at = max_seg_length

        let strob_fc = () => {
            this.segments.forEach(s => {
                let start_worm_at = current_end_at - this.manager.worm_length

                if(start_worm_at < 0) {
                    start_worm_at = 0
                }

                s.on_between(start_worm_at, current_end_at)
            })

            let change_timeout = setTimeout(() => {
                if(current_end_at <= 0) {
                    current_end_at = max_seg_length
                } else {
                    current_end_at -= this.manager.delta
                }
                strob_fc()
            }, this.manager.speed)

            this.timeouts.push(change_timeout)
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
        return WormRevert.MIN_SPEED - (value * WormRevert.MIN_SPEED / 127)
    }

    seg_length_calc(value) {
        return ((WormRevert.MAX_SEG_LENGTH - WormRevert.MIN_SEG_LENGTH) / 127) * value + WormRevert.MIN_SEG_LENGTH
    }

    delta_calc(value) {
        return ((WormRevert.MAX_DELTA - 1) / 127) * value + 1
    }
}

module.exports = WormRevert