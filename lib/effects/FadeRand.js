const ws281x = require("rpi-ws281x-native");
const Effect = require("../effect");

class FadeRand extends Effect {

    static MIN_SPEED = 50
    static DELTA = 7
    static MIN_BRIGHTNESS_DEFAULT = 15
    static MAX_BRIGHTNESS_DEFAULT = 150

    constructor(segments) {
        super(segments)

        this.segments = segments
        this.speed = FadeRand.MIN_SPEED
        this.min_brightness = FadeRand.MIN_BRIGHTNESS_DEFAULT
        this.max_brightness = FadeRand.MAX_BRIGHTNESS_DEFAULT
        this.timeouts = []
        this.channel = this.segments[0].channel
    }

    run() {

        let fade_fc = () => {      
            let timeout_fc = setTimeout(() => {
                if((this.way == 'up' && this.channel.brightness >= this.brightness_goal) || (this.way == 'down' && this.channel.brightness <= this.brightness_goal) || this.brightness_goal == undefined) {
                    this.brightness_goal = this.pick_random_brightness()
                }

                if(this.channel.brightness >= this.brightness_goal) {
                    this.way = 'down'
                } else if(this.channel.brightness <= this.brightness_goal) {
                    this.way = 'up'
                }

                if(this.way == 'up') {
                    this.channel.brightness += FadeRand.DELTA
                } else {
                    this.channel.brightness -= FadeRand.DELTA
                }

                ws281x.render()

                let timeout = setTimeout(fade_fc, this.speed)
                this.timeouts.push(timeout)
            }, this.speed)

            this.timeouts.push(timeout_fc)
        }


        fade_fc()
    }

    stop() {
        this.timeouts.forEach(timeout => {
            clearTimeout(timeout)
        });

        this.min_brightness = FadeRand.MIN_BRIGHTNESS_DEFAULT
        this.max_brightness = FadeRand.MAX_BRIGHTNESS_DEFAULT
        this.segments.forEach(s => s.fill())
    }

    pick_random_brightness() {
        return Math.round(Math.random() * (this.max_brightness - this.min_brightness) + this.min_brightness);
    }

    speed_calc(value) {
        return FadeRand.MIN_SPEED - (value * FadeRand.MIN_SPEED / 127)
    }
}

module.exports = FadeRand