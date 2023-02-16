const ws281x = require("rpi-ws281x-native");
const Effect = require("../effect");

class Fade extends Effect {

    static MIN_SPEED = 50
    static DELTA = 7
    static MIN_BRIGHTNESS_DEFAULT = 15
    static MAX_BRIGHTNESS_DEFAULT = 150

    constructor(segments) {
        super(segments)

        this.segments = segments
        this.speed = Fade.MIN_SPEED
        this.min_brightness = Fade.MIN_BRIGHTNESS_DEFAULT
        this.max_brightness = Fade.MAX_BRIGHTNESS_DEFAULT
        this.timeouts = []
        this.channel = this.segments[0].channel
    }

    run() {
        this.way = 'up'
        this.segments.forEach(s => s.fill())

        let fade_fc = () => {
            let timeout_fc = setTimeout(() => {

                if(this.way == 'up') {
                    this.channel.brightness += Fade.DELTA
                } else {
                    this.channel.brightness -= Fade.DELTA
                }

                if(this.channel.brightness >= this.max_brightness) {
                    this.way = 'down'
                } else if(this.channel.brightness <= this.min_brightness) {
                    this.way = 'up'
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

        this.min_brightness = Fade.MIN_BRIGHTNESS_DEFAULT
        this.max_brightness = Fade.MAX_BRIGHTNESS_DEFAULT
        this.segments.forEach(s => s.fill())
    }

    speed_calc(value) {
        return Fade.MIN_SPEED - (value * Fade.MIN_SPEED / 127)
    }
}

module.exports = Fade