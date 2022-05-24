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
let lines = new Set();
const poems = new Set();

// The users map is intended to hold user information indexed by the socket connection.
// the key is the socket, and the value is an object full of info
const users = new Map();

const maxEditors = 2;
let turnIndex = 0;

// When a user connects, a Connection object will be created for them, which will use their socket to connect
// to the IO server. It sits there and handles events from their socket
class Connection {
    // The constructor of the Connection class sets up callbacks on events coming from the socket.
    constructor(io, socket) {
        this.socket = socket;
        this.io = io;

        this.handleUser()

        socket.on('sendAllUserInfo', () => this.sendAllUserInfo());
        socket.on('sendUserInfo', () => this.sendUserInfo());

        socket.on('allTurns', () => this.changeTurnsForAll());

        // The getLines event will be used by new clients to retrieve all existing finished lines from the server.
        socket.on('getLines', () => this.getLines());

        // The line event will be triggered by the client whenever a new line has been submitted into the poem.
        socket.on('line', (value) => this.handleLine(value));

        // The lineEdit event will be triggered whenever the input box is edited.
        socket.on('lineEdit', (value) => this.handleLineEdit(value));

        socket.on('poemDone', () => this.poemDone());
        socket.on('clearLines', () => this.clearLines());
        // socket.on('getPoems', () => this.getPoems());
        // socket.on('poem', (value) => this.handlePoem(value));

        // The disconnect and connection_error are predefined events
        // that are triggered when the socket disconnects, or when an error happens during the connection.
        socket.on('disconnect', () => this.disconnect());
        socket.on('connect_error', (err) => {
            console.log(`connect_error due to ${err.line}`);
        });
    }

    changeTurnsForAll() {
        turnIndex = (turnIndex + 1) % maxEditors; // goes from 0 to 1 to 2
        console.log('the turn switched to', turnIndex);
        function editRole(value, key, map) {
            if (value['role'] === 'activeEditor') {
                console.log(value['name'], 'is no longer activeEditor');
                value['role'] = 'inactiveEditor';
            } else if (value['role'] === 'inactiveEditor' && turnIndex === value['turn']) {
                console.log(value['name'], 'is now activeEditor');
                value['role'] = 'activeEditor';
            } else {
                console.log(value['name'], 'didnt change status');
            }
        }
        users.forEach(editRole)
    }

    clearLines() {
        this.io.emit('clearLines');
    }

    poemDone() {
        // this.allUsersSpectators(); // maybe not...
        let poemString = '';
        for (const [key, value] of lines.entries()) {
            poemString += value['value'] + '\n';
        }
        this.handlePoem(poemString)
        lines.clear();
    }

    allUsersSpectators() {
        function makeSpectator(value, key, map) {
            value['role'] = 'spectator';
        }
        users.forEach(makeSpectator)
    }

    sendAllUserInfo() {
        for (const [key, value] of users.entries()) {
            this.io.to(key.id).emit('userInfo', value)
        }
    }

    sendUserInfo() {
        console.log('sendUserInfo reached for', this.socket.id)
        this.io.to(this.socket.id).emit('userInfo', users.get(this.socket))
    }

    // Handle the initial arrival of the user
    handleUser() {
        // decide what the user's role is upon log in
        // check the current state of the users map and see what sorts of userRoles we have
        let currentExtantRoles = [];
        for (let userInfoObj of users.values()) {
            currentExtantRoles.push(userInfoObj.role);
        }

        const nInactiveEditors = currentExtantRoles.reduce(function(n, val) {return n + (val === 'inactiveEditor');}, 0);
        console.log('there are', nInactiveEditors, 'inactive editors')

        let proposedRole = 'spectator';
        if (!currentExtantRoles.includes('activeEditor')) {
            proposedRole = 'activeEditor';
        } else if (nInactiveEditors < (maxEditors - 1)) {
            proposedRole = 'inactiveEditor';
        }

        console.log('got a login attempt and want to set role to', proposedRole);

        users.set(this.socket, {
            name: randomUserNames.pop(),
            role: proposedRole,
            turn: users.size,
            color: randomColors.pop(),
        });
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
        users.delete(this.socket);

        // update the user roles
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
