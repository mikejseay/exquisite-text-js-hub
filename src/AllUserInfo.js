import React, { useEffect, useState } from 'react';
import './AllUserInfo.css';

// note that implicitly, this is where the game state is being communicated

// for example, it could show the turn order as a table and a list of spectators

// if a user connects or disconnects, that should cause an update procedure
// the turn order would be modified and the list of spectators as well

// if there is only 1 editor left, it should prevent "done line" but not "done poem"
// but if a player connects or reconnects, it should re-enable "done line"
// and after "done line" it should pass priority to the correct next person in the queue

// a person can disconnect as spectator, inactiveEditor or activeEditor
// if spectator, simply re-assign their priority within spectators

// if a person disconnects while it is their turn, any progress they had must be discarded
// and the turn order should be updated based on the currently available info
// at the time of disconnect, then, it should check whether the disconnecting user was active
// if so, it should trigger a process to re-assign roles on first principles

// if you're spectating, and a slot opens up, and you're the senior-most spectator,
// it should give you the option of joining the queue for a certain amount of time (10 s)
// if you say no, or don't answer it will give the next spectator the opportunity to join

function AllUserInfo({ socket }) {

    const [usersArr, setUsersArr] = useState([]);
    // const updateMap = (k,v) => {
    //     setMyMap(new Map(myMap.set(k,v)));
    // }

    useEffect(() => {

        // Event handlers for the line and the deleteLine events are set up for the Socket.IO connection.
        const allUserInfoListener = (allUserInfo) => {
            // console.log('incoming', allUserInfo)
            setUsersArr(allUserInfo);
            // console.log('after setting', usersArr)
        };

        socket.on('allUserInfo', allUserInfoListener);

        // trigger the server to send all user info
        socket.emit('sendAllUserInfoToAll');

        return () => {
            socket.off('allUserInfo', allUserInfoListener);
        };
    }, [socket]);

    return (
        // The component then displays all lines sorted by the timestamp at which they were created.
        // we can switch this so that it renders previous lines according to a view
        <div className="user-info">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Turn</th>
                        <th>Color</th>
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
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    );
}

export default AllUserInfo;
