const ws281x = require('rpi-ws281x-native')

class Segment {
    constructor(channel, seg_start, seg_end) {
        this.channel = channel
        this.leds = channel.array
        this.seg_start = seg_start
        this.seg_end = seg_end
        this.seg_length = this.seg_end - this.seg_start
        this.colors = undefined
        // silent will render black color but will set the colors
        // to the value
        this.silent = false
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

    fill_between(colors, start, end) {
        this.colors = colors

        for (let i = this.seg_start+start; i <= (this.seg_end+end - this.seg_start+start); i++) {
            if(this.silent) {
                this.leds[i] = 0x000000
            } else {
                this.leds[i] = this.colors[i % this.colors.length]
            }
        }

        this.render()
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