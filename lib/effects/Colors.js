const Effect = require("../effect");

class Colors extends Effect {
    
    static MIN_SPEED=500

    constructor(segments) {
        super(segments)
        this.speed = Colors.MIN_SPEED
        this.timeouts = []
        this.original_colors = segments.map(seg => seg.colors)
    }

    run() {
        let colors_fc = () => {
            this.segments.forEach(s => {
                let shuffledArrayColors = s.colors.sort((a, b) => 0.5 - Math.random());
                s.fill(shuffledArrayColors)
            })
            let timeout = setTimeout(colors_fc, this.speed)
            this.timeouts.push(timeout)
        }

        colors_fc()
    }

    stop() {
        this.timeouts.forEach(timeout => {
            clearTimeout(timeout)
        });

        this.segments.forEach(s => s.fill())
    }

    speed_calc(value) {
        return Colors.MIN_SPEED - (value * Colors.MIN_SPEED / 127)
    }
}

module.exports = Colors