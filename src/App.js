import React, { useEffect, useState} from 'react';
import Modal from 'react-modal';
import io from 'socket.io-client';
import Lines from './Lines';
import Poems from './Poems';
import LineInput from './LineInput';
import UserInfo from "./UserInfo";
import './App.css';
// import express from "express";
// import path from "path";

function App() {

    const [socket, setSocket] = useState(null);
    useEffect(() => {
        // const serverPath = `/`;
        const serverPath = `http://${window.location.hostname}:3000`;
        const newSocket = io(serverPath);
        setSocket(newSocket);
        return () => newSocket.close();
    }, [setSocket]);

    // whether the modal help window is open
    const [helpOpen, setHelpOpen] = useState(false);
    function toggleHelpModal() {
        setHelpOpen(!helpOpen)
    }

    // The component then renders a page that contains a header.
    // If a socket has already been established, it will also render two components Lines and LineInput.
    // Both of these components need the socket to work, so it is being passed in as a parameter.

    // The header shows the authentication state.
    // If a user is logged on, it will show the user’s name, and a Sign-out button;
    // otherwise, it will show that the user is not signed in and show a Sign-in button that lets the user log in.
    return (
        <div className="App">
            <header className="app-header">
                <button onClick={toggleHelpModal}>
                    Help
                </button>
            </header>
            <Modal
                isOpen={helpOpen}
                onRequestClose={toggleHelpModal}
                contentLabel="Help Dialog Modal"
            >
                <button onClick={toggleHelpModal} className='center-button'>Close</button>
                <div className='help-modal'>{'\n'}Complete a line and a half of poetry.{'\n'}
                    When your input is suitable, press the 'Done Line' button.{'\n'}
                    If you feel the poem has been finished, press the 'Done Poem' button.{'\n'}</div>
            </Modal>
            { socket ? (
                <div className="poem-container">
                    <UserInfo socket={socket} />
                    <Lines socket={socket} />
                    <LineInput socket={socket} />
                    <Poems socket={socket} />
                </div>
            ) : (
                <div>Not Connected</div>
            )}
        </div>
    );
}

export default App;
