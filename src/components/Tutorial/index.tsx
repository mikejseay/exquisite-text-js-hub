import React, { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Modal from "@mui/material/Modal";
import {
  tutorial,
  modalContent,
  modalTitle
 } from "./styles"

const Tutorial = () => {
  // whether the modal window is open
  const [helpOpen, setHelpOpen] = useState(false);
  const handleHelpOpen = () => setHelpOpen(true);
  const handleHelpClose = () => setHelpOpen(false);

  return (
    <div className={"tutorial"}>
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
          {/*    <Typography id="modal-modal-title" variant="h6" component="h2">*/}
          {/*        HOW TO PLAY*/}
          {/*    </Typography>*/}
          {/*    <Typography id="modal-modal-description" sx={{ mt: 2 }}>*/}
          {/*        Write a line and a half of poetry.{'\n'}*/}
          {/*        That is, when the first line is finished, press enter and write another half-line.*/}
          {/*        Once your input is suitable, press the 'Done Line' button.*/}
          {/*        If you feel the poem has been finished, press the 'Done Poem' button.*/}
          {/*    </Typography>*/}
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