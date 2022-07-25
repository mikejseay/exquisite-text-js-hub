import { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Modal from "@mui/material/Modal";
import { modalContent, modalTitle, tutorial } from "./styles";
import exampleGif from '../../assets/images/exquisiteExample.gif';

const Tutorial = () => {
  // whether the modal window is open
  const [helpOpen, setHelpOpen] = useState(true);
  const handleHelpOpen = () => setHelpOpen(true);
  const handleHelpClose = () => setHelpOpen(false);

  return (
    <div>
      <IconButton aria-label="info" onClick={handleHelpOpen} size={"large"}>
        <InfoOutlinedIcon />
      </IconButton>
      <Modal
        open={helpOpen}
        onClose={handleHelpClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={tutorial}>
          <div style={modalTitle}>
            <strong>HOW TO PLAY</strong>
          </div>
          <div style={modalContent}>
            <p>Exquisite Text is a collaborative writing game.</p>
            <p>When it's your turn, you will write a snippet of poetry split across two lines.</p>
            <p>The first line is yours to complete: write until the underlined region is filled. This part will be kept
              secret.</p>
            <p>Then, press Return ⏎.</p>
            <p> </p>
            <img src={exampleGif} alt="Example"/>
            <p>The second line is for the next player, so write a short fragment that will be passed on.</p>
            <p>When you've written enough on the second line, press the "Pass Turn" button that will appear.</p>
            <p>Express your creativity! Give your collaborator a tricky prompt!</p>
            <p>If you feel the poem has been finished, press the 'Complete Poem' button.</p>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Tutorial;
