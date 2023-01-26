// MIDI Codes to readable and understable format
//
// Good to know : pads and keys are note_on / note_off when pressed
// and released and all of the other controls send control_change
// information.
// The octave plus and less do not send any informations but
// change the range of the keyboard.
//
const midi_codes = {
    pad_1: 96,
    pad_2: 97,
    pad_3: 98,
    pad_4: 99,
    pad_5: 100,
    pad_6: 101,
    pad_7: 102,
    pad_8: 103,
    pad_9: 112,
    pad_10: 113,
    pad_11: 114,
    pad_12: 115,
    pad_13: 116,
    pad_14: 117,
    pad_15: 118,
    pad_16: 119,
    circle_top: 104,
    circle_down: 120,
    track_right: 107,
    track_left: 106,
    scene_top: 104,
    scene_down: 105,
    pot_1: 21,
    pot_2: 22,
    pot_3: 23,
    pot_4: 24,
    pot_5: 25,
    pot_6: 26,
    pot_7: 27,
    pot_8: 28,
    note_on: 144,
    note_off: 128,
    control_change: 176,
}

module.exports = midi_codes