const ws281x = require('rpi-ws281x-native')
const { change_brightness, hexToHSL, intToHex } = require('./helpers/colors')

class Segment {
    constructor(channel, seg_start, seg_end, reverted=false) {
        this.channel = channel
        this.leds = channel.array
        this.seg_start = seg_start
        this.seg_end = seg_end
        this.seg_length = this.seg_end - this.seg_start
        this.colors = undefined
        // silent will render black color but will set the colors
        // to the value
        this.silent = false
        this.reverted = reverted
    }

    fill(colors=this.colors, assign=true) {
        let colors_to_use;
        
        if(assign) {
            this.colors = colors
            colors_to_use = this.colors
        } else {
            colors_to_use = colors
        }

        for (let i = this.seg_start; i <= this.seg_end; i++) {
            if(this.silent) {
                this.leds[i] = 0x000000
            } else {
                this.leds[i] = colors_to_use[i % colors_to_use.length]
            }
        }

        this.render()
    }

    on_between(start, end) {
        let real_start = this.seg_start + start
        let real_end = this.seg_start + end - 1

        for (let i = this.seg_start; i <= this.seg_end; i++) {
            if(this.silent) {
                this.leds[i] = 0x000000
            } else if(i >= real_start && i <= real_end) {
                this.leds[i] = this.colors[i % this.colors.length]
            } else {
                this.leds[i] = 0x000000
            }
        }

        this.render()
    }

    off_between(start, end) {
        let real_start = this.seg_start + start
        let real_end = this.seg_start + end - 1

        for (let i = this.seg_start; i <= this.seg_end; i++) {
            if(this.silent) {
                this.leds[i] = 0x000000
            } else if(i >= real_start && i <= real_end) {
                this.leds[i] = 0x000000
            } else {
                this.leds[i] = this.colors[i % this.colors.length]
            }
        }

        this.render()
    }

    decrease_brightness_by_color(speed=100, bright_decrease_ratio=0.7, end_in_silence=false) {
        let retrieved_colors = this.colors
        let color_off = false

        this.decrease_callback = () => {
            let all_luma = []
            retrieved_colors.forEach(() => all_luma.push(true))

            retrieved_colors = retrieved_colors.map((c, i) => {
                let HSL = hexToHSL(intToHex(c))
                let luma = HSL[2]
                if(luma <= 0) {
                    all_luma[i] = false
                }
                
                return change_brightness(intToHex(c), bright_decrease_ratio)
            })
            
            color_off = !all_luma.every(Boolean)
            this.fill(retrieved_colors, false)

            if(color_off) {
                this.off()
                this.silent = end_in_silence
                this.clear_decrease_callback()
                return
            }

            setTimeout(() => {
                if(this.decrease_callback) {
                    this.decrease_callback()
                }
            }, speed)
        }

        this.decrease_callback()
    }

    clear_decrease_callback() {
        clearTimeout(this.decrease_callback)
        this.decrease_callback = undefined
    }

    off() {
        for (let i = this.seg_start; i <= this.seg_end; i++) {
            this.leds[i] = 0x000000
        }

       this.render()
    }

    render () {
        ws281x.render()
    }
}

module.exports = Segment