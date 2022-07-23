import { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Modal from "@mui/material/Modal";
import { modalContent, modalTitle, tutorial } from "./styles";

const Tutorial = () => {
  // whether the modal window is open
  const [helpOpen, setHelpOpen] = useState(false);
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
            {"\n"}
            Write a line and a half of poetry.{"\n"}
            {"\n"}
            That is, when the first line is finished, press enter and write
            another half-line.{"\n"}
            {"\n"}
            Once you're ready, press the 'Pass' button.{"\n"}
            {"\n"}
            If you feel the poem has been finished, press the 'Complete Poem'
            button.
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Tutorial;
