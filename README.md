![Regis Logo](/assets/logo.png?raw=true)

# Régis - Pilot ws281x strips with a MIDI controller

*/!\ This project is WIP and DIY, do not use it in any production environment*

The aim of this project is to controller a led strip with a MIDI Controller.

Implemented controllers :
- Launchkey Mini from Novation

### Installation & Setup
First of all :
```
npm install
```
You will need to check what name your device is given by the computer is plugged in and replace the names in `app.js` of variables `device_name` (keyboard) and `device_name_2` (pads). To get these values you can use the library `midi` in the node shell :
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

### Launch
```
node app.js
```