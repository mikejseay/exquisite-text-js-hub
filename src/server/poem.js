// Handle lines passed between users and the server
// and using that content, we maintain the user list and current history of the poem.
// as far as I can tell, this will be the equivalent of the exquisite functionality, etc.

const defaultUser = {
    id: 'anon',
    name: 'Anonymous',
};

let loginCount = 0;
const randomUserNames = ['Johnald', 'Jimothy', 'Gouglas', 'Bobson', 'Danthony', 'Davery',
    'Johnald', 'Jimothy', 'Gouglas', 'Bobson', 'Danthony', 'Davery'];
const randomColors = ['red', 'blue', 'orange', 'green', 'purple'];

const uuidv4 = require('uuid').v4; // a function that generates a random uuid for lines

// The poem room holds two global data structures, lines and users.

// The lines object is a set that simply contains all lines together with some metadata.
let lineEditCurrentVal = '';
let lines = new Set();
const poems = new Set();

// The users map is intended to hold user information indexed by the socket connection.
// the key is the socket, and the value is an object full of info
// note that a map is ordered -- can you pop?
const users = new Map();

const maxEditors = 4;
let nEditors = 0;
let turnIndex = 0;

// When a user connects, a Connection object will be created for them, which will use their socket to connect
// to the IO server. It sits there and handles events from their socket
class Connection {
    // The constructor of the Connection class sets up callbacks on events coming from the socket.
    constructor(io, socket) {
        this.socket = socket;
        this.io = io;

        this.handleUser()

        socket.on('sendEachUserTheirInfo', () => this.sendEachUserTheirInfo());
        socket.on('sendUserInfo', () => this.sendUserInfo());

        socket.on('sendAllUserInfoToAll', () => this.sendAllUserInfoToAll());

        socket.on('allTurns', () => this.changeTurnsForAll());

        // The getLines event will be used by new clients to retrieve all existing finished lines from the server.
        socket.on('getLines', () => this.getLines());
        socket.on('getLineEdit', () => this.getLineEdit());

        // The line event will be triggered by the client whenever a new line has been submitted into the poem.
        socket.on('line', (value) => this.handleLine(value));

        // The lineEdit event will be triggered whenever the input box is edited.
        socket.on('lineEdit', (value) => this.handleLineEdit(value));

        socket.on('poemDone', () => this.poemDone());
        socket.on('clearLines', () => this.clearLines());
        socket.on('getPoems', () => this.getPoems());
        // socket.on('poem', (value) => this.handlePoem(value));

        // The disconnect and connection_error are predefined events
        // that are triggered when the socket disconnects, or when an error happens during the connection.
        socket.on('disconnect', () => this.disconnect());
        socket.on('connect_error', (err) => {
            console.log(`connect_error due to ${err.line}`);
        });
    }

    changeTurnsForAll() {
        turnIndex = (turnIndex + 1) % nEditors; // cycles through 0 up to nEditors - 1
        this.assignRolesOnPrinciples()
        // console.log('the turn switched to', turnIndex);
        // function editRole(value, key, map) {
        //     if (value['role'] === 'activeEditor') {
        //         console.log(value['name'], 'is no longer activeEditor');
        //         value['role'] = 'inactiveEditor';
        //     } else if (value['role'] === 'inactiveEditor' && turnIndex === value['turn']) {
        //         console.log(value['name'], 'is now activeEditor');
        //         value['role'] = 'activeEditor';
        //     } else {
        //         console.log(value['name'], 'didnt change status');
        //     }
        // }
        // users.forEach(editRole)
    }

    clearLines() {
        this.io.emit('clearLines');
    }

    poemDone() {
        // this.allUsersSpectators(); // maybe not...
        let poemString = '';
        for (let line of lines) {
            poemString += line['value'] + '\n';
        }
        this.handlePoem(poemString)
        lines.clear();
    }

    // allUsersSpectators() {
    //     function makeSpectator(value, key, map) {
    //         value['role'] = 'spectator';
    //     }
    //     users.forEach(makeSpectator)
    // }

    // to be critical: there are multiple pieces of the app that listen for this
    sendEachUserTheirInfo() {
        for (const [key, value] of users.entries()) {
            this.io.to(key.id).emit('userInfo', value)
        }
    }

    sendUserInfo() {
        console.log('sendUserInfo reached for', this.socket.id)
        this.io.to(this.socket.id).emit('userInfo', users.get(this.socket))
    }

    sendAllUserInfoToAll() {
        this.io.sockets.emit('allUserInfo', Array.from(users.values()));
    }

    assignRolesOnPrinciples () {
        console.log('assigning user roles from first principles');
        let turnCounter = 0;
        nEditors = Math.min(users.size, maxEditors);
        console.log('nEditors', nEditors)
        for (let userInfoObj of users.values()) {
            userInfoObj['turn'] = turnCounter;
            if (turnCounter === turnIndex) {
                userInfoObj['role'] = 'activeEditor';
                userInfoObj['turnsAway'] = 0;
            } else if (turnCounter < maxEditors) {
                userInfoObj['role'] = 'inactiveEditor';
                userInfoObj['turnsAway'] = (turnCounter - turnIndex + maxEditors) % maxEditors;
            } else {
                userInfoObj['role'] = 'spectator';
                userInfoObj['turnsAway'] = undefined;
            }
            turnCounter += 1;
        }
        // console.log('afterwards it was', users)
    }

    // Handle the initial arrival of the user
    // triggers a role-check
    handleUser() {
        // // decide what the user's role is upon log in
        // // check the current state of the users map and see what sorts of userRoles we have
        // // since users is a map, we automatically iterate through it in order of insertion (first user first)
        // let currentExtantRoles = [];
        // let currentExtantTurns = [];
        // for (let userInfoObj of users.values()) {
        //     currentExtantRoles.push(userInfoObj.role);
        //     currentExtantTurns.push(userInfoObj.turn);
        // }
        //
        // const nInactiveEditors = currentExtantRoles.reduce(function(n, val) {return n + (val === 'inactiveEditor');}, 0);
        // const nSpectators = currentExtantRoles.reduce(function(n, val) {return n + (val === 'spectator');}, 0);
        //
        // let proposedRole = 'spectator';
        // let proposedTurn = nSpectators;  // functions as priority ?
        // if (!currentExtantRoles.includes('activeEditor')) {
        //     proposedRole = 'activeEditor';
        //     proposedTurn = 0;
        // } else if (nInactiveEditors < (maxEditors - 1)) {
        //     proposedRole = 'inactiveEditor';
        //     proposedTurn =
        // }

        // console.log('at the time of this log in, there are', users.size, 'users with',
        //     nInactiveEditors, 'inactive editors, want to set role to', proposedRole);

        users.set(this.socket, {
            id: uuidv4(),
            name: randomUserNames.pop(),
            // role: proposedRole,
            // turn: users.size,
            color: randomColors.pop(),
        });

        this.assignRolesOnPrinciples();
    }

    sendLine(line) {
        // emit is a crucial method that sends the line to all users
        // note that here we name this emitted signal "line," which allows us to identify it within IO
        this.io.sockets.emit('line', line);
    }

    // this is used to bring a new user up to date on what's happening, could be good for Spectator mode
    getLines() {
        lines.forEach((line) => this.sendLine(line));
    }

    // this is used to bring a new user up to date on what's happening in the lineEdit
    getLineEdit() {
        this.io.to(this.socket.id).emit('lineEdit', lineEditCurrentVal);
    }

    // When a new line arrives from this Connection, handleMessage() creates a line object and adds it to lines
    handleLine(value) {
        const line = {
            id: uuidv4(),
            user: users.get(this.socket) || defaultUser,
            value,
            time: Date.now()
        };
        lines.add(line);

        // It will then call sendMessage() which uses the Socket.IO server
        // to send the line to all sockets that are currently connected.
        // It is this call that will update all clients simultaneously.
        this.sendLine(line);
    }

    handleLineEdit(value) {
        // this.io.sockets.emit('lineEdit', value);
        this.socket.broadcast.emit('lineEdit', value);
        lineEditCurrentVal = value;
    }

    sendPoem(poem) {
        // emit is a crucial method that sends the poem to all users
        // note that here we name this emitted signal "poem," which allows us to identify it within IO
        this.io.sockets.emit('poem', poem);
    }

    // this is used to bring a new user up to date on what's happening, could be good for Spectator mode
    getPoems() {
        poems.forEach((poem) => this.sendPoem(poem));
    }

    // When a new poem arrives from this Connection, handleMessage() creates a poem object and adds it to poems
    handlePoem(poemString) {

        const poem = {
            id: uuidv4(),
            user: users.get(this.socket) || defaultUser,
            poemString,
            time: Date.now(),
            title: `exquisite text #${Math.round(Math.random() * 100)}`,
        };
        poems.add(poem);

        // It will then call sendMessage() which uses the Socket.IO server
        // to send the poem to all sockets that are currently connected.
        // It is this call that will update all clients simultaneously.
        this.sendPoem(poem);
    }

    disconnect() {
        const thisUserInfo = users.get(this.socket);
        console.log(thisUserInfo, 'headed out');

        randomUserNames.push(thisUserInfo.name);
        randomColors.push(thisUserInfo.color);
        users.delete(this.socket);

        // update the user roles
        this.assignRolesOnPrinciples()
        this.sendEachUserTheirInfo()
        this.sendAllUserInfoToAll()
    }
}

// The module exports a single function poem that takes the Socket.IO server instance as a parameter.
function poem(io) {

    // connection is a reserved name for a socket event when someone connects
    io.on('connection', (socket) => {
        // When a client requests a connection, the callback will create a new Collection instance
        // and pass the Socket.IO server instance and the new socket to the constructor.

        // this is about where we would declare or handle their status
        // as the active editor, an inactive editor, or a spectator

        new Connection(io, socket);
    });
}

module.exports = poem;
