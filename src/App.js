import React, { useEffect, useState} from 'react';
import io from 'socket.io-client';
import Lines from './Lines';
import Poems from './Poems';
import LineInput from './LineInput';
import GameState from './GameState';
import Tutorial from './Tutorial';
import Settings from './Settings';
import './App.css';

function App() {

    const [socket, setSocket] = useState(null);
    useEffect(() => {
        const isProduction = true;
        const serverPath = isProduction ? `/` : `http://${window.location.hostname}:3000`;
        const newSocket = io(serverPath);
        setSocket(newSocket);
        return () => newSocket.close();
    }, [setSocket]);

    // The component then renders a page that contains a header.
    // If a socket has already been established, it will also render two components Lines and LineInput.
    // Both of these components need the socket to work, so it is being passed in as a parameter.
    return (
        <div className={'possible-socket'}>
            { socket ? (
                <div className='app'>
                    <header className={'app-header'}>
                        <Tutorial/>
                        <div className={'app-title'}>Exquisite Text</div>
                        <GameState socket={socket} />
                        <Settings socket={socket} />
                    </header>
                    <div className={'app-body'}>
                        <Lines socket={socket} />
                        <LineInput socket={socket} />
                        <Poems socket={socket} />
                    </div>
                </div>
            ) : (
                <div>Not Connected</div>
            )}
        </div>
    );
}

export default App;
