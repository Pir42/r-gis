const Effect = require("../effect");

class Auto extends Effect {

    static MIN_SPEED = 500
    static MAX_SPEED = 10000

    constructor(segments, effects=[]) {
        super(segments)
        this.speed = 3000
        this.timeouts = []
        this.effects = []
        this.current_effect = null
    }

    run() {
        let refresh_fc = () => {
            let effect = this.pick_effect()
            while (effect == this.current_effect) {
                effect = this.pick_effect()
            }

            this.current_effect.stop()
            this.current_effect = effect
            this.current_effect.run()

            let change_timeout = setTimeout(() => {
                refresh_fc()
            }, this.speed)

            this.timeouts.push(change_timeout)
        }


        refresh_fc()
    }

    pick_effect() {
        return this.effects[Math.floor(Math.random() * this.effects.length)]
    }

    stop() {
        this.timeouts.forEach(timeout => {
            clearTimeout(timeout)
        });

        this.segments.forEach(s => s.fill())
    }

    speed_calc(value) {
        return ((Auto.MAX_SPEED - Auto.MIN_SPEED) / 127) * value + Auto.MIN_SPEED
    }
}

module.exports = Strob