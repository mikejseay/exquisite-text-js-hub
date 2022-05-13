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

// const LineInput = (socket, lineInputVisibleRef, lineInputEnabledRef) => {
const LineInput = ({ socket }) => {
    const minCharsOnNewLine = 16;       // must have more than this many characters on 2nd line to make exquisite
    const maxCharsOnNewLine = 32;       // must have less than this many characters on 2nd line to make exquisite
    const lineSepString = '\n';

    // const poemInput = useRef(`Replace this text with your own line and a half<br>of pure poetry!`);
    const [poemInput, setPoemInput] = useState('');
    // const [poemInputSpacer, setPoemInputSpacer] = useState('');

    // a single boolean that determines whether the "Done Line" & "Done Poem" button should be enabled or disabled
    // it toggles based on the suitability of the current poem body to be made exquisite
    // we need an additional doneLineRef object that allows us to get its current state
    const [doneLineEnabled, setDoneLine, doneLineRef] = useStateRef(true);
    const [donePoemEnabled, setDonePoem, donePoemRef] = useStateRef(true);

    // fuck
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
                setDoneLine(true);
                setDonePoem(true);
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

        socket.on('userInfo', userInfoListener);

        // additionally, tell React to set the poem textarea to change
        // whenever a lineEdit event is emitted
        socket.on('lineEdit', lineEditListener);

        return () => {
            socket.off('lineEdit', lineEditListener);
            socket.off('userInfo', userInfoListener);
        };
    }, [socket]);

    // one for the poem body
    // handles any change to poem body, a ContentEditable div object (user entered a new character or deleted one)
    function handlePoemBodyChange(evt) {
        evt.preventDefault()

        // broadcast that there was a change
        // this broadcasts to everyone including the sender
        // socket.emit('lineEdit', evt.target.value);
        setPoemInput(evt.target.value);

        // splitting it into its lines
        const poemParts = evt.target.value.split(lineSepString)
        const poemSecondLine = poemParts[1]

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
            socket.emit('lineEdit', secondPart);
            // setPoemInput(secondPart);

            // emit a message of the first part to be posted to the Lines
            socket.emit('line', firstPart);

            // this client only tell the server to do the turn event
            socket.emit('allTurns');

            // this client only tell the server to do the sendUserInfo event
            socket.emit('sendAllUserInfo');

        }
    }

    function finishExquisite() {
        // emit a message of the current input to be posted to the Lines
        socket.emit('line', poemInput);

        // set the input textarea to be blank
        socket.emit('lineEdit', '');
        // setPoemInput('');

        // this client only tell the server to do the ending event
        socket.emit('poemDone');

        // this client only tell the server to do the sendUserInfo event
        socket.emit('sendAllUserInfo');

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
        // This is a simple form with only one input element.
        <div>
            { lineInputVisible ? (
                <textarea
                    value={poemInput}
                    onChange={handlePoemBodyChange}
                    onKeyPress={handleKeypress}
                    rows={2}
                    cols={60}
                    autoFocus={true}
                    readOnly={!lineInputEnabled}
                >
            </textarea>
            ) : (
                <div className={'input-group'}>
                    <div
                        autoFocus={true}
                        className={'text-spacer'}
                    >{poemInput}<div id="caret"></div>
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
