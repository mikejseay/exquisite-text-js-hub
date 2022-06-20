import React, {useState} from 'react';
import Modal from "react-modal";
import './Tutorial.css';

const Tutorial = () => {

    // whether the modal window is open
    const [helpOpen, setHelpOpen] = useState(false);
    function toggleHelpModal() {
        setHelpOpen(!helpOpen);
    }

    return (
        <div className={'tutorial'}>
        <button onClick={toggleHelpModal}>
            ℹ
        </button>
        <Modal
            isOpen={helpOpen}
            onRequestClose={toggleHelpModal}
            contentLabel="Help Dialog Modal"
        >
            <button onClick={toggleHelpModal} className='center-button'>Close</button>
            <div className='help-modal'>{'\n'}Write a line and a half of poetry.{'\n'}
                That is, when the first line is finished, press enter and write another half-line.{'\n'}
                Once your input is suitable, press the 'Done Line' button.{'\n'}
                If you feel the poem has been finished, press the 'Done Poem' button.{'\n'}</div>
        </Modal>
        </div>
    )
}

export default Tutorial;
