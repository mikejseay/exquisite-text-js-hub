import React, { useEffect, useState } from 'react';
import './Poems.css';

function Poems({ socket }) {

    // The poems state is a plain object that contains each poem indexed by the poem ID.
    // Using React hooks, this state is updated inside the event handlers to reflect the changes provided by the server.
    const [poems, setPoems] = useState({});

    // const [poemsVisible, setPoemsVisible] = useState(false);

    useEffect(() => {

        // Event handlers for the poem and the deletePoem events are set up for the Socket.IO connection.
        const poemListener = (poem) => {
            setPoems((prevPoems) => {
                const newPoems = {...prevPoems};
                newPoems[poem.id] = poem;
                return newPoems;
            });
        };

        socket.on('poem', poemListener);

        // tells the server for this client to do getPoems
        // since this is client-side, it only happens for this client
        socket.emit('getPoems');

        return () => {
            socket.off('poem', poemListener);
        };
    }, [socket]);

    return (
        // The component then displays all poems sorted by the timestamp at which they were created.
        // we can switch this so that it renders previous poems according to a view
        <div className="poems-body">
            {[...Object.values(poems)]
                    .sort((a, b) => b.time - a.time)
                    .map((poem) => (
                        <div
                            key={poem.id}
                            className="poem-container"
                        >
                            <span className="poem-title">{poem.title}</span><br></br>
                            <span className="poem">{poem.poemString}</span>
                        </div>
                    ))}
        </div>
    );
}

export default Poems;
