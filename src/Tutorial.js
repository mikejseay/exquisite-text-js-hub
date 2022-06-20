import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Modal from '@mui/material/Modal';
import './Tutorial.css';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Tutorial = () => {

    // whether the modal window is open
    const [helpOpen, setHelpOpen] = useState(false);
    const handleHelpOpen = () => setHelpOpen(true);
    const handleHelpClose = () => setHelpOpen(false);

    return (
        <div className={'tutorial'}>
        <IconButton aria-label="info" onClick={handleHelpOpen} size={'large'}>
            <InfoOutlinedIcon />
        </IconButton>
        <Modal
            open={helpOpen}
            onClose={handleHelpClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Exquisite Text Tutorial
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Write a line and a half of poetry.
                    That is, when the first line is finished, press enter and write another half-line.
                    Once your input is suitable, press the 'Done Line' button.
                    If you feel the poem has been finished, press the 'Done Poem' button.
                </Typography>
            </Box>
        </Modal>
        </div>
    )
}

export default Tutorial;
