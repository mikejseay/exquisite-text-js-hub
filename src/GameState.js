import React, {useEffect, useState} from 'react';
import Modal from "react-modal";
import './GameState.css';

function GameState({ socket }) {

    // whether the modal window is open
    const [gameStateOpen, setGameStateOpen] = useState(false);
    function toggleGameStateModal() {
        setGameStateOpen(!gameStateOpen);
    }

    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [turn, setTurn] = useState(0);
    const [usersArr, setUsersArr] = useState([]);

    useEffect(() => {

        // Event handlers for the line and the deleteLine events are set up for the Socket.IO connection.
        const userInfoListener = (userInfo) => {
            setName(userInfo['name']);
            setRole(userInfo['role']);
            setTurn(userInfo['turn']);
        };

        // Event handlers for the line and the deleteLine events are set up for the Socket.IO connection.
        const allUserInfoListener = (allUserInfo) => {
            setUsersArr(allUserInfo);
        };

        socket.on('userInfo', userInfoListener);
        socket.on('allUserInfo', allUserInfoListener);

        // send only this user their info to initially set them up
        // note that there is a userInfoListener in GameState, Lines, and LineInput
        // is that bad?
        socket.emit('sendUserInfo');

        // trigger the server to send all user info
        socket.emit('sendAllUserInfoToAll');

        return () => {
            socket.off('userInfo', userInfoListener);
            socket.off('allUserInfo', allUserInfoListener);
        };
    }, [socket]);

    return (
        <div className={'game-state'}>
            <button onClick={toggleGameStateModal}>
                🎲
            </button>
            <Modal
                isOpen={gameStateOpen}
                onRequestClose={toggleGameStateModal}
                contentLabel="Help Dialog Modal"
            >
                <button onClick={toggleGameStateModal} className='center-button'>Close</button>
                <div className={'user-info'}>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Turn</th>
                            <th>Color</th>
                            <th>You?</th>
                        </tr>
                        </thead>
                        <tbody>
                        {usersArr.map(val => {
                            return (
                                <tr key={val.id}>
                                    <td>{val.name}</td>
                                    <td>{val.role}</td>
                                    <td>{val.turn}</td>
                                    <td>{val.color}</td>
                                    <td>{val.turn === turn ? ('yes') : ('no')}</td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                    <p>Your name is {name}, your role is {role}, and your turn is {turn}.</p>
                </div>
            </Modal>
        </div>
    );
}

export default GameState;
