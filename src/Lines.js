import React, { useEffect, useState } from 'react';
import './Lines.css';

// if activeEditor or inactiveEditor, NOTHING is visible here until the end
// if spectator, EVERYTHING is visible here

function Lines({ socket }) {

    // The lines state is a plain object that contains each line indexed by the line ID.
    // Using React hooks, this state is updated inside the event handlers to reflect the changes provided by the server.
    const [lines, setLines] = useState({});

    const [linesVisible, setLinesVisible] = useState(false);

    useEffect(() => {

        // Event handlers for the line and the deleteLine events are set up for the Socket.IO connection.
        const lineListener = (line) => {
            setLines((prevLines) => {
                const newLines = {...prevLines};
                newLines[line.id] = line;
                return newLines;
            });
        };

        const clearLineListener = () => {
            setLines({});
        };

        const userInfoListener = (userInfo) => {
            if (userInfo['role'] === 'activeEditor') {
                setLinesVisible(false);
            } else if (userInfo['role'] === 'inactiveEditor') {
                setLinesVisible(false);
            } else if (userInfo['role'] === 'spectator') {
                setLinesVisible(true);
            }
        };

        socket.on('userInfo', userInfoListener);
        socket.on('line', lineListener);
        socket.on('clearLines', clearLineListener);

        // tells the server for this client to do getLines
        // since this is client-side, it only happens for this client
        socket.emit('getLines');

        return () => {
            socket.off('userInfo', userInfoListener);
            socket.off('line', lineListener);
            socket.off('clearLines', clearLineListener);
        };
    }, [socket]);

    return (
        // The component then displays all lines sorted by the timestamp at which they were created.
        // we can switch this so that it renders previous lines according to a view
        <div className="poem-body">
            { linesVisible ? (
                [...Object.values(lines)]
                    .sort((a, b) => a.time - b.time)
                    .map((line) => (
                        <div
                            key={line.id}
                            className="line-container"
                            // style={{color: line.user['color']}}
                        ><span className="line">{line.value}</span>
                        </div>
                    ))
            ) : (
                [...Object.values(lines)]
                    .sort((a, b) => a.time - b.time)
                    .map((line) => (
                        <div
                            key={line.id}
                            className="line-container"
                        >
                            <span className="line">{'\n'}</span>
                        </div>
                    ))
            )}
        </div>
    );
}

export default Lines;

// title={`Sent at ${new Date(line.time).toLocaleTimeString()}`}
// <span className="user">{line.user.name}:</span>
// <span className="date">{new Date(line.time).toLocaleTimeString()}</span>
// <span className="line">{line.value}</span>
