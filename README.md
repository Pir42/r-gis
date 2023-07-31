![Regis Logo](/assets/logo.png?raw=true)

# Régis - Pilot ws281x strips with a MIDI controller

*/!\ This project is WIP and DIY, do not use it in any production environment*

The aim of this project is to control a led strip with a MIDI Controller, the Launchkey Mini from Novation.

### Installation
First of all :
```
npm install
```
You will need to check what name your device is given by the computer and replace the names of variables `device_name`(keyboard) and `device_name_2`(pads) in `app.js`. To get these values you can use the library `midi` in the node shell :
```js
const midi = require('midi')
const input = new midi.Input();

const numbers_of_ports = input.getPortCount();

for (let i = 0; i < numbers_of_ports; i++) {
    console.log(input.getPortName(i))
}
```

You will also need to change the options for your LED strip, change the variable `options` in the section LED segments in `app.js`.

Change the segments according to your setup.

### Setup

You can configure colors & patterns in the files under `config/`. For the `colors.js` it's a simple key -> array hash where the key is the value of the key pressed on keyboard and the array an array of colors in hexadecimal code.

For the patterns here is the scheme of one item in the array of patterns :
```js
{
    name: '<your_pattern>',
    pad_id: '<between 3-7 and 11-15>',
    color: <0-127>,
    controls: {
        pod_1: 'speed',
        pod_2: 'divide|min_brightness|max_brightness|seg_length|delta'
    },
}
```
For the code colors you can check them [here](https://i0.wp.com/www.partsnotincluded.com/wp-content/uploads/2018/09/LKMiniII_LED127_Lbl.jpg)

### Launch
```
node app.js
```