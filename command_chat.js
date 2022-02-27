const tp = require('@tabletop-playground/api');
const Emittery = require('emittery');
const { parse, pool } = require('dicebag');

const cmd_expr = /^\/([a-zA-Z_][a-zA-Z\d_]*)\s*(?:\s+(.+))?$/;

const commands = {
    roll: (sender, args) => {
        try {
            const dice = parse(args);
            let res = pool(dice);
            sender.sendChatMessage(`(${args}): ${res.join(" + ")} = ${res.reduce((p, c) => p + c)}`);
        } catch (err) {
            sender.sendChatMessage(err);
        }
    }
}

const emitter = new Emittery();

emitter.onAny((evt, data) => {
    console.log(JSON.stringify(data));
    if (commands.hasOwnProperty(evt)) {
        commands[evt](data.sender, data.args);
    } else {
        data.sender.sendChatMessage("Unknown command.")
    }
});

tp.globalEvents.onChatMessage.add((sender, msg) => {
    let matches = msg.match(cmd_expr);
    if (matches) {
        emitter.emit(matches[1], { sender: sender, args: (matches.length > 1) ? matches[2] : null });
    } else {
        if (msg.startsWith("/")) {
            sender.sendChatMessage("Not a valid command.")
        }
    }
});
