import React, { useState, useRef, useEffect } from 'react';
import './LineInput.css';

// if activeEditor, the letters are visible and textarea is editable
// if inactiveEditor, the letters are invisible, and textarea is not editable
// if spectator, the letters are visible, but the textarea is not editable

// this function allows us to get the most current value of a state variable
// with the third output argument "ref"
// black magic from stack overflow
// https://stackoverflow.com/questions/53845595/wrong-react-hooks-behaviour-with-event-listener
function useStateRef(initialValue) {
    const [value, setValue] = useState(initialValue);
    const ref = useRef(value);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return [value, setValue, ref];
}

const LineInput = ({ socket }) => {
    const minCharsOnNewLine = 16;       // must have more than this many characters on 2nd line to make exquisite
    const maxCharsOnNewLine = 32;       // must have less than this many characters on 2nd line to make exquisite
    const lineSepString = '\n';

    const [poemInput, setPoemInput] = useState('');
    // const [poemInput, setPoemInput, poemInputRef] = useStateRef('');

    // a single boolean that determines whether the "Done Line" button should be enabled or disabled
    // it toggles based on the suitability of the current poem body to be made exquisite
    // we need an additional doneLineRef object that allows us to get its current state
    const [doneLineEnabled, setDoneLine, doneLineRef] = useStateRef(true);
    const [donePoemEnabled, setDonePoem] = useState(true);
    const [lineInputVisible, setLineInputVisible] = useState(false);
    const [lineInputEnabled, setLineInputEnabled] = useState(false);

    useEffect(() => {
        const lineEditListener = (lineEdit) => {
            setPoemInput(lineEdit);
        };

        const userInfoListener = (userInfo) => {
            if (userInfo['role'] === 'activeEditor') {
                setLineInputVisible(true);
                setLineInputEnabled(true);
                setDonePoem(true);
                setDoneLine(false); // was true, but it will become true if formatted correctly

                // console.log(poemInput);

                // const evt = {'target': {'value': poemInput}};
                // handlePoemBodyChange(evt);

            } else if (userInfo['role'] === 'inactiveEditor') {
                setLineInputVisible(false);
                setLineInputEnabled(false);
                setDoneLine(false);
                setDonePoem(false);
            } else if (userInfo['role'] === 'spectator') {
                setLineInputVisible(true);
                setLineInputEnabled(false);
                setDoneLine(false);
                setDonePoem(false);
            }
        };

        // additionally, tell React to set the poem textarea to change
        // whenever a lineEdit event is emitted
        socket.on('lineEdit', lineEditListener);

        // tells the server for this client to do getLineEdit
        // since this is client-side, it only happens for this client
        socket.emit('getLineEdit');

        socket.on('userInfo', userInfoListener);

        return () => {
            socket.off('lineEdit', lineEditListener);
            socket.off('userInfo', userInfoListener);
        };
    }, [socket]);

    // one for the poem body
    // handles any change to poem body, a ContentEditable div object (user entered a new character or deleted one)
    function handlePoemBodyChange(evt) {
        // console.log(evt);
        evt.preventDefault();

        // broadcast that there was a change
        // this broadcasts to everyone including the sender
        setPoemInput(evt.target.value);                         // heroku
        socket.emit('lineEdit', evt.target.value);              // heroku

        // socket.emit('lineEdit', evt.target.value);           // local

        // splitting it into its lines
        const poemParts = evt.target.value.split(lineSepString);

        if (poemParts.length < 2) {
            return
        }

        const poemSecondLine = poemParts[1].trim();

        // only enable the button if there are 2 lines AND the 2nd line is between 20 and 40 characters
        setDoneLine(poemParts.length === 2 &&
            poemSecondLine.length > minCharsOnNewLine &&
            poemSecondLine.length < maxCharsOnNewLine);
    }

    function makeExquisite() {

        // this function takes approximately 1.5 lines of poem, and "makes them exquisite" by clipping the 1st line.
        // the next person who sees the result should not be aware of the 1st line but must continue with a new line
        const poemParts = poemInput.split(lineSepString);

        // check user input, should be two lines, although access to even executing this function is regulated
        // by the doneLineRef value, which enables and disables the button
        if (poemParts.length > 1) {
            const [firstPart, secondPart] = poemParts;

            // broadcast that there was a change
            setPoemInput(secondPart);
            socket.emit('lineEdit', secondPart);

            // emit a message of the first part to be posted to the Lines
            socket.emit('line', firstPart);

            // this client only tell the server to do the turn event
            socket.emit('allTurns');

            // this client only tell the server to do the sendUserInfo event
            socket.emit('sendEachUserTheirInfo');
            socket.emit('sendAllUserInfoToAll');

        }
    }

    function finishExquisite() {
        // emit a message of the current input to be posted to the Lines
        socket.emit('line', poemInput);

        // set the input textarea to be blank
        setPoemInput('');
        socket.emit('lineEdit', '');

        // this client only tell the server to do the ending event
        socket.emit('poemDone');

        // this event should also set the value of the "lines" variable
        // in Lines.js to be initialized (an empty object)...
        socket.emit('clearLines');

        // trigger the turn event on the server (switch the turn index and assign roles)
        socket.emit('allTurns');

        // since roles have changed, we must update user info
        socket.emit('sendEachUserTheirInfo');
        socket.emit('sendAllUserInfoToAll');

    }

    function handleKeypress(e) {
        // it triggers by pressing ctrl + enter (13), when the "Done Line" button is enabled
        // might not be necessary, but it's kind of nice
        // note we use doneLineRef instead of doneLineEnabled because it gets the current value

        if (doneLineRef.current && e.charCode === 13 && e.ctrlKey) {
            makeExquisite();
        }
    }

    return (
        // the initial idea here was to have a single textarea element that was editable
        // an alternative idea is to have this element be composed of a non-editable portion
        // and an editable portion
        <div>
            { lineInputVisible ? (
                // <div id={'container'}>
                <textarea
                    // id={'editable-textarea'}
                    value={poemInput}
                    onChange={handlePoemBodyChange}
                    onKeyPress={handleKeypress}
                    rows={2}
                    cols={60}
                    autoFocus={true}
                    readOnly={!lineInputEnabled}
                >
                </textarea>
                // <div id={'uneditable-div'}>
                //     Uneditable portion.
                // </div>
                // </div>
            ) : (
                <div className={'input-group'}>
                    <div
                        autoFocus={true}
                        className={'text-spacer'}
                    >{'*'.repeat(poemInput.length)}<div id="caret"></div>
                    </div>
                </div>
            )}
            <br></br>
            <button onClick={makeExquisite} disabled={!doneLineEnabled}>
                Done Line
            </button>
            <button onClick={finishExquisite} disabled={!donePoemEnabled}>
                Done Poem
            </button>
        </div>
    );
};

export default LineInput;

// const poemParts = poemInputRef.split(lineSepString);
// console.log(poemParts);
// const poemSecondLine = poemParts[1].trim();
// setDoneLine(poemParts.length === 2 &&
//     poemSecondLine.length > minCharsOnNewLine &&
//     poemSecondLine.length < maxCharsOnNewLine);
