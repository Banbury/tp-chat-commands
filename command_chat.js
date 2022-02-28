const tp = require('@tabletop-playground/api');
const Emittery = require('emittery');
const { parse, pool } = require('dicebag');

const world = tp.world;

const cmd_expr = /^\/([a-zA-Z_][a-zA-Z\d_]*)(?:\s+([^@]+))?(\s+(?:@[^@]+)*)?$/;

const commands = {
    roll: (sender, args, targets) => {
        try {
            const dice = parse(args);
            let res = pool(dice);
            console.log(args, ": ", res);
            if (res) {
                const msg = `(${args}): ${res.join(" + ")} = ${res.reduce((p, c) => p + c)}`;
                if (targets) {
                    if (targets.includes("@all")) {
                        world.broadcastChatMessage(msg);
                    } else {
                        sender.sendChatMessage(msg);
                        const players = world.getAllPlayers().filter(p => p.getName() !== sender.getName());
                        targets.forEach(t => {
                            let name = t.substring(1).toLowerCase();
                            players.find(p => p.getName().toLowerCase() === name)?.sendChatMessage(msg);
                        });
                    }
                } else {
                    sender.sendChatMessage(msg);
                }
            }
        } catch (err) {
            sender.sendChatMessage(err);
        }
    }
}

const emitter = new Emittery();

emitter.onAny((evt, data) => {
    console.log(JSON.stringify(data));
    if (commands.hasOwnProperty(evt)) {
        commands[evt](data.sender, data.args, data.targets);
    } else {
        data.sender.sendChatMessage("Unknown command.")
    }
});

tp.globalEvents.onChatMessage.add((sender, msg) => {
    let matches = msg.match(cmd_expr);
    if (matches) {
        emitter.emit(matches[1],
            {
                sender: sender,
                args: (matches.length > 1) ? matches[2]?.trim() : null,
                targets: ((matches.length > 2) ? matches[3]?.trim().split(/\s/) : null)
            }
        );
    } else {
        if (msg.startsWith("/")) {
            sender.sendChatMessage("Not a valid command.")
        }
    }
});
