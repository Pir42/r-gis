const Effect = require("../effect");
const { intToRgb } = require("../helpers/colors");

class ColorsTrans extends Effect {
    

    static MIN_STEP_COLORS=5
    static MAX_STEP_COLORS=40

    constructor(segments) {
        super(segments)
        this.refresh = 5
        this.timeouts = []
        this.speed = 20
        this.original_colors = segments[0].colors // considering that all segments have same color
    }

    run() {
        this.original_colors = this.segments[0].colors // considering that all segments have same color
        let count = 0
        let transition_color = this.original_colors[count] 
        let transition_colors = []
        let count_transition = 0

        let colors_fc = () => {
            this.original_colors = this.segments[0].colors // considering that all segments have same color
            
            let next_count = count+1
            if(count == this.original_colors.length-1) {
                next_count = 0
            }

            let current_color = intToRgb(this.original_colors[count])
            let parsed_current_color = `rgb(${current_color.red}, ${current_color.green}, ${current_color.blue})`

            let next_color = intToRgb(this.original_colors[next_count])
            let parsed_next_color = `rgb(${next_color.red}, ${next_color.green}, ${next_color.blue})`

            transition_colors = this.interpolateColors(parsed_current_color, parsed_next_color, this.speed)
            transition_colors = transition_colors.map(rgb => (rgb[0] << 16) + (rgb[1] << 8) + (rgb[2]))
            count_transition = 0
        }


        let change_color = () => {
            if(count_transition >= this.speed-1) {
                if(count >= this.original_colors.length-1) {
                    count = 0
                } else {
                    count += 1
                }
                colors_fc()
            } else {
                transition_color = transition_colors[count_transition]
            }

            if(transition_color) {
                this.segments.forEach(s => {
                    s.fill([transition_color], false)
                })
            }

            count_transition += 1
            let timeout = setTimeout(change_color, this.refresh)
            this.timeouts.push(timeout)
        } 

        colors_fc()
        change_color()
    }

    stop() {
        this.timeouts.forEach(timeout => {
            clearTimeout(timeout)
        });

        this.segments.forEach(s => { 
            s.colors = this.original_colors
            s.fill()
        })
    }

    interpolateColor(color1, color2, factor) {
        if (arguments.length < 3) { 
            factor = 0.5; 
        }
        var result = color1.slice();
        for (var i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
        }
        return result;
    };

    interpolateColors(color1, color2, steps) {
        var stepFactor = 1 / (steps - 1),
            interpolatedColorArray = [];
    
        color1 = color1.match(/\d+/g).map(Number);
        color2 = color2.match(/\d+/g).map(Number);
    
        for(var i = 0; i < steps; i++) {
            interpolatedColorArray.push(this.interpolateColor(color1, color2, stepFactor * i));
        }
    
        return interpolatedColorArray;
    }

    speed_calc(value) {
        return ((ColorsTrans.MIN_STEP_COLORS - ColorsTrans.MAX_STEP_COLORS) / 127) * value + ColorsTrans.MAX_STEP_COLORS
    }
}

module.exports = ColorsTrans