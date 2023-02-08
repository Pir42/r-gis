const Effect = require("../effect");

class StrobPerSeg extends Effect {
    
    static MIN_SPEED=500

    constructor(segments, random=false) {
        super(segments)
        this.speed = StrobPerSeg.MIN_SPEED
        this.timeouts = []
        this.random = random
    }

    run() {
        let count = 0
        let previous_count = 0

        let strob_fc = () => {
            if(this.random) {
                while(count == previous_count) {
                    count = Math.floor(Math.random() * 4)
                }
            }

            this.segments[count].fill()

            let change_timeout = setTimeout(() => {
                this.segments[count].off()
                if(!this.random) {
                    if(count >= this.segments.length-1) {
                        count = 0
                    } else {
                        count +=1
                    }
                } else {
                    previous_count = count
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
        return StrobPerSeg.MIN_SPEED - (value * StrobPerSeg.MIN_SPEED / 127)
    }
}

module.exports = StrobPerSeg