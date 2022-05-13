import React, { useEffect, useState } from 'react';
import './UserInfo.css';

// if activeEditor or inactiveEditor, NOTHING is visible here until the end
// if spectator, EVERYTHING is visible here

function UserInfo({ socket }) {

    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [turn, setTurn] = useState('');

    useEffect(() => {

        // Event handlers for the line and the deleteLine events are set up for the Socket.IO connection.
        const userInfoListener = (userInfo) => {
            setName(userInfo['name']);
            setRole(userInfo['role']);
            setTurn(userInfo['turn']);
        };

        socket.on('userInfo', userInfoListener);
        socket.emit('sendUserInfo');

        return () => {
            socket.off('userInfo', userInfoListener);
        };
    }, [socket]);

    return (
        // The component then displays all lines sorted by the timestamp at which they were created.
        // we can switch this so that it renders previous lines according to a view
        <div className="user-info">
            <p>Your name is {name}, your role is {role}, and your turn is {turn}.</p>
        </div>
    );
}

export default UserInfo;
