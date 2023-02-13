const Effect = require("../effect");

class WormManager extends Effect {
    
    static MIN_SPEED=50
    static MIN_SEG_LENGTH=1
    static MAX_SEG_LENGTH=38
    static MAX_DELTA = 5

    constructor(segments, revert=false) {
        super(segments)
        this.speed = WormManager.MIN_SPEED
        this.timeouts = []
        this.worm_length = 3
        this.delta = 2
        this.revert = revert
        
        this.effects = []
        this.reverted_segs = []
        this.unreverted_segs = []
        this.segments.forEach(seg => {
            if(seg.reverted) {
                this.reverted_segs.push(seg)
            } else {
                this.unreverted_segs.push(seg)
            }
        });
    }

    run() {
        // this.effects.forEach(e => e.run())
        let current_start_at = 0
        this.segments.forEach(s => { s.off() })
        let max_seg_length = Math.min(...this.segments.map(s => s.seg_length))
        let current_end_at = max_seg_length

        let strob_fc = () => {
            // not revert part
            let end_worm_at = current_start_at + this.worm_length
            this.unreverted_segs.forEach(s => {
                s.on_between(current_start_at, end_worm_at)
            })

            // revert part
            let start_worm_at = current_end_at - this.worm_length
            this.reverted_segs.forEach(s => {
                s.on_between(start_worm_at, current_end_at)
            })

            let change_timeout = setTimeout(() => {
                if(current_start_at >= max_seg_length) {
                    current_start_at = 0
                } else {
                    current_start_at += this.delta
                }

                if(current_end_at <= 0) {
                    current_end_at = max_seg_length
                } else {
                    current_end_at -= this.delta
                }
                strob_fc()
            }, this.speed)

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
        return WormManager.MIN_SPEED - (value * WormManager.MIN_SPEED / 127)
    }

    seg_length_calc(value) {
        return ((WormManager.MAX_SEG_LENGTH - WormManager.MIN_SEG_LENGTH) / 127) * value + WormManager.MIN_SEG_LENGTH
    }

    delta_calc(value) {
        return ((WormManager.MAX_DELTA - 1) / 127) * value + 1
    }
}

module.exports = WormManager