# Slash Commands for Tabletop Playground Chat

## Usage

Copy the files in the repository to a Script folder in a Tabletop Playground package.
Install the dependencies:
```javascript
npm i
```

In Tabletop Playground attach the the script `command_chat.js` to a game object. After reloading the scripts you can start typing commands in the chat.

Currently only `/roll` is supported. If you have ideas for more commands, request them in an issue.

### /roll

The `/roll` command expects a dice string as a parameter, e.g 3d6+10
The result will be send to the player, who executed the command.

For a list of all supported dice strings look here:
https://github.com/m-chrzan/dicebag/blob/master/README.md#dice-expressions
