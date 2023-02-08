const Effect = require("../effect");
const Worm = require("./Worm");
const WormRevert = require("./WormRevert");

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
        let reverted_segs = []
        let unreverted_segs = []
        this.segments.forEach(seg => {
            if(seg.reverted) {
                reverted_segs.push(seg)
            } else {
                unreverted_segs.push(seg)
            }
        });

        if(revert) {
            this.effects.push(new Worm(reverted_segs, this), new WormRevert(unreverted_segs, this))
        } else {
            this.effects.push(new WormRevert(reverted_segs, this), new Worm(unreverted_segs, this))
        }
    }

    run() {
        this.effects.forEach(e => e.run())
    }

    stop() {
        this.effects.forEach(e => e.stop())
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