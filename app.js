const patterns = require('./config/patterns')
const { midi_codes: mc } = require('./config/midi_codes')
const colors = require('./config/colors')
const Device = require('./lib/device')
const Launchkey = require('./lib/launckey')
const ws281x = require('rpi-ws281x-native')
const Segment = require('./lib/segment')
const Strob = require('./lib/effects/Strob')
const Fade = require('./lib/effects/Fade')
const Colors = require('./lib/effects/Colors')
const StrobPerSeg = require('./lib/effects/StrobPerSeg')
const WormManager = require('./lib/effects/WormManager')
const StrobDivide = require('./lib/effects/StrobDivide')
const ColorsTrans = require('./lib/effects/ColorsTrans')
const FadeRand = require('./lib/effects/FadeRand')
const WormReactive = require('./lib/effects/WormReactive')
const Auto = require('./lib/effects/Auto')

// Helpers
const speed_calc_pot = (value, min) => min - (value * min / 127)

// Config and initialization process
const device_name = 'Launchkey Mini:Launchkey Mini LK Mini MIDI 20:0'
const device_name_2 = 'Launchkey Mini:Launchkey Mini LK Mini InContro 20:1'

console.info("Initializing keyboard and pads devices by finding and opening ports...")

const keyboard = new Device(device_name)
const pads = new Device(device_name_2)

console.info("Keyboard and Pads are initialized, activate InControl for pads")

pads.activateInControl()
lc = new Launchkey(pads)

// Setup the LED Segments
const options = { dma: 10, freq: 800000, gpio: 18, invert: false, brightness: 10, stripType: ws281x.stripType.WS2812 }
const channel = ws281x(150, options)

// Setup the 4 control LED area
console.info("Assigning LED Segments")

const seg0 = new Segment(channel, 0, 36)
const seg1 = new Segment(channel, 37, 74, true)
const seg2 = new Segment(channel, 75, 111)
const seg3 = new Segment(channel, 112, 149, true)
const allsegs = [seg0, seg1, seg2, seg3]

seg0.fill([0xff0000])
seg1.fill([0xff0000])
seg2.fill([0xff0000])
seg3.fill([0xff0000])

const segmentPad = (pad_id) => {
    let seg = undefined
    switch (pad_id) {
        case '1':
            seg = seg1
            break;
        case '2':
            seg = seg2
            break;
        case '9':
            seg = seg0
            break;
        case '10':
            seg = seg3
            break;
        default:
            break;
    }
    return seg
}

// Effect setup
let is_effect_in_use = false
let effect_in_use = undefined

// Setting up Auto FX
let autog_fade_fx = new Fade(allsegs)
autog_fade_fx.speed = 400
let autog_colors_fx = new ColorsTrans(allsegs)
autog_colors_fx.speed = ColorsTrans.MAX_STEP_COLORS
let autog_worm_fx = new WormManager(allsegs)
autog_worm_fx.worm_length = WormManager.MAX_SEG_LENGTH
autog_worm_fx.speed = 500
let autog_worm_revert_fx = new WormManager(allsegs, true)
autog_worm_revert_fx.worm_length = WormManager.MAX_SEG_LENGTH
autog_worm_revert_fx.speed = 500
let autog_strob_fx = new Strob(allsegs, true)

let auto_gentle_effects = [autog_fade_fx, autog_colors_fx, autog_worm_fx, autog_worm_revert_fx, autog_strob_fx]

let autoh_strob_fx = new Strob(allsegs, false)
autoh_strob_fx.speed = 100
let autoh_strob_per_seg_fx = new StrobPerSeg(allsegs)
autoh_strob_per_seg_fx.speed = 200
let autoh_strob_divide_fx = new StrobDivide(allsegs)
autoh_strob_divide_fx.speed = 140
autoh_strob_fx.divide = StrobDivide.MAX_DIVIDE
let autoh_worm_fx = new WormManager(allsegs)
autoh_worm_fx.worm_length = 3
autoh_worm_fx.speed = 50
let autoh_worm_revert_fx = new WormManager(allsegs, true)
autoh_worm_revert_fx.worm_length = 5
autoh_worm_revert_fx.speed = 100

let auto_hard_effects = [autoh_strob_fx, autoh_strob_fx, autoh_strob_per_seg_fx, autoh_strob_divide_fx, autoh_worm_fx, autoh_worm_revert_fx]

const effects = {
    'auto_gentle': new Auto(allsegs, auto_gentle_effects),
    'auto_hard': new Auto(allsegs, auto_hard_effects),
    'strob': new Strob(allsegs, true),
    'fade': new FadeRand(allsegs),
    'colors': new Colors(allsegs),
    'colors_trans': new ColorsTrans(allsegs),
    'strob_per_seg': new StrobPerSeg(allsegs),
    'strob_rand': new StrobPerSeg(allsegs, true),
    'strob_divide': new StrobDivide(allsegs),
    'worm': new WormManager(allsegs),
    'worm_revert': new WormManager(allsegs, true),
    'worm_fill': new WormManager(allsegs, false, true),
    'worm_reactive': new WormReactive(allsegs)
}

// Helpers function for FX
const change_fading_fx_mode = (value) => {
    for (const [effect_name, effect] of Object.entries(effects)) {
        if(effect.fade != undefined) {
            effect.fade = value
        }
    }
}

// PADs setup
lc.state.pad_1['mode'] = 'keep'
lc.state.pad_2['mode'] = 'keep'
lc.state.pad_9['mode'] = 'keep'
lc.state.pad_10['mode'] = 'keep'

lc.light_on_pad(1)
lc.light_on_pad(2)
lc.light_on_pad(9)
lc.light_on_pad(10)

// touch and keep mode
lc.state.pad_8['mode'] = 'keep'
lc.state.pad_8['color'] = 113
lc.light_on_pad(8)

// Aftertouch
lc.state.pad_16['mode'] = 'keep'
lc.state.pad_16['color'] = 113

let touch_mode = 'keep'
let aftertouch = false
let aftertouch_speed = 40

// Events

lc.on('pad_input', (data) => {
    if(['1', '2', '9', '10'].includes(data.id)) {
        console.log(`Segment LED control pressed on ${data.id}, should send turn ${data.state.light}`)
        let seg = segmentPad(data.id)
        
        if(effect_in_use instanceof WormReactive) {
            lc.state[`pad_${data.id}`].color = 1
            lc.light_on_pad(data.id)
            seg.shift_color = seg.colors[Math.floor(Math.random() * seg.colors.length)]
            return
        }

        if(data.state.light) {
            if (aftertouch) {
                if(seg.decrease_callback) {
                    seg.clear_decrease_callback()
                }
            }
            seg.silent = false
            seg.fill()
        } else {
            seg.off()
            seg.silent = true
        }
    }

    if(data.id == 8) {
        if(!lc.state.pad_8.light) {
            lc.state.pad_1['mode'] = 'touch'
            lc.state.pad_2['mode'] = 'touch'
            lc.state.pad_9['mode'] = 'touch'
            lc.state.pad_10['mode'] = 'touch'

            lc.light_off_pad(1)
            lc.light_off_pad(2)
            lc.light_off_pad(9)
            lc.light_off_pad(10)

            console.log('Turn on Touch mode for effects')
            touch_mode = 'touch'
            allsegs.forEach((seg) => { seg.off(); seg.silent = true })
        } else {
            lc.state.pad_1['mode'] = 'keep'
            lc.state.pad_2['mode'] = 'keep'
            lc.state.pad_9['mode'] = 'keep'
            lc.state.pad_10['mode'] = 'keep'

            lc.light_on_pad(1)
            lc.light_on_pad(2)
            lc.light_on_pad(9)
            lc.light_on_pad(10)

            // turn off aftertouch + be sure to turn off fading mode
            lc.light_off_pad(16)
            aftertouch = false
            change_fading_fx_mode(false)


            console.log('Turn off Touch mode for effects')
            touch_mode = 'keep'
            allsegs.forEach((seg) => { seg.silent = false; seg.fill() })
        }
    }

    // AfterTouch or Fading Mode
    if(data.id == 16) {
        if(!lc.state.pad_8.light) {
            aftertouch = lc.state.pad_16.light
            // Turn off fading beacause aftertouch will have priority
            if(aftertouch) {
                change_fading_fx_mode(false)
            }
        } else {
            change_fading_fx_mode(lc.state.pad_16.light)
        }
    }

})

lc.on('pad_release', (data) => {
    if(['1', '2', '9', '10'].includes(data.id)) {
        let seg = segmentPad(data.id)

        if(effect_in_use instanceof WormReactive) {
            lc.state[`pad_${data.id}`].color = 17
            lc.light_on_pad(data.id)
            seg.shift_color = 0x000000
            return
        }

        if(touch_mode == 'touch') {
            if(aftertouch) {
                seg.decrease_brightness_by_color(aftertouch_speed, 0.7, (seg) => { seg.silent = true })
            } else {
                seg.off()
                seg.silent = true
            }
        }
    }
})

// Patterns setup

let setup_patterns = []
patterns.forEach(pattern => {
    lc.setup_for_pattern(pattern.pad_id, pattern.color)
    setup_patterns.push(pattern)
})

lc.on('pad_selected', (data) => {
    let pattern = setup_patterns.find(p => p.pad_id == data.pad_id )

    if(pattern) {
        console.log(`Received a pad_selected event assigned to pattern "${pattern.name}"`)
        // should activate pattern and manage
        // Use trigger function ?
        if(effects[pattern.name]) {
            // consider that fade is not effect in use cause fading is managed
            // by changing brightness and will not update colors
            if(!(effects[pattern.name] instanceof Fade && effects[pattern.name] instanceof FadeRand)) {
                is_effect_in_use = true
            }

            effect_in_use = effects[pattern.name]

            for (const [pod_id, parameter] of Object.entries(pattern.controls)) {
                if(parameter == 'speed') {
                    effects[pattern.name].speed = effects[pattern.name].speed_calc(lc.state[pod_id])
                } else if(parameter == 'min_brightness') {
                    effects[pattern.name].min_brightness = lc.state[pod_id] * 255 / 127
                } else if(parameter == 'max_brightness') {
                    effects[pattern.name].max_brightness = lc.state[pod_id] * 255 / 127
                } else if(parameter == 'seg_length') {
                    effects[pattern.name].worm_length = effects[pattern.name].seg_length_calc(lc.state[pod_id])
                } else if(parameter == 'delta') {
                    effects[pattern.name].delta = effects[pattern.name].delta_calc(lc.state[pod_id])
                } else if(parameter == 'divide') {
                    effects[pattern.name].divide = effects[pattern.name].divide_calc(lc.state[pod_id])
                } else if(parameter == 'effects_speed') {
                    effects[pattern.name].change_current_effect_speed(lc.state[pod_id])
                }
            }
            effects[pattern.name].run()
        }
    }
})

lc.on('pad_deselected', (data) => {
    let pattern = setup_patterns.find(p => p.pad_id == data.pad_id )

    if(pattern) {
        console.log(`Received a pad_deselected event assigned to pattern "${pattern.name}"`)
        // should activate pattern and manage
        // Use trigger function ?
        if(effects[pattern.name]) {
            is_effect_in_use = false
            effect_in_use = undefined
            effects[pattern.name].stop()
        }
    }
})

// Pot Management

lc.on('pot_input', (data) => {

    lc.state[`pod_${data.id}`] = data.state

    if(data.id == 8){
        let value = data.state
        channel.brightness = (value * 255) / 127
        ws281x.render()
        return
    }

    if(data.id == 7){
        aftertouch_speed = speed_calc_pot(data.state, 40)
        return
    }

    if(lc.selected_pattern_pad) {
        let pattern = setup_patterns.find(p => p.pad_id == lc.selected_pattern_pad )
        
        if(pattern && pattern.controls[`pod_${data.id}`]) {
            console.log(`Pod ${data.id} changed, a pattern is selected and this control is assigned to effect ${pattern.controls[`pod_${data.id}`]}`)
            // if so, update and send informations
            let effect = effects[pattern.name]
            let parameter = pattern.controls[`pod_${data.id}`]
            if(effect && parameter) {
                if(parameter == 'speed') {
                    effect.speed = effect.speed_calc(data.state)
                } else if(parameter == 'min_brightness') {
                    effect.min_brightness = data.state * 255 / 127
                } else if(parameter == 'max_brightness') {
                    effect.max_brightness = data.state * 255 / 127
                } else if(parameter == 'seg_length') {
                    effect.worm_length = effect.seg_length_calc(data.state)
                } else if(parameter == 'delta') {
                    effect.delta = effect.delta_calc(data.state)
                } else if(parameter == 'divide') {
                    effect.divide = effect.divide_calc(data.state)
                } else if(parameter == 'effects_speed') {
                    effect.change_current_effect_speed(data.state)
                }
            }

        }
    }
})

// Colors (no need for complex class as for the pads... for now)

let additive = false
keyboard.input.on('message', (deltaTime, message) => {
    const [code_event, id, value] = message
    if(code_event == mc.note_on && colors[id]) {
        console.log(`Change the color palette with ${colors[id]}`);
        let colors_to_assign = colors[id]

        allsegs.forEach((seg) => {
            if(additive) {
                colors_to_assign = seg.colors.concat(colors[id])
            }

            if(is_effect_in_use) {
                seg.colors = colors_to_assign
            } else {
                seg.fill(colors_to_assign) 
            }
        })
    }

    if(id == 72) {
        if(code_event == mc.note_on) {
            additive = true
        } else if(code_event == mc.note_off) {
            additive = false
        }
    }
})