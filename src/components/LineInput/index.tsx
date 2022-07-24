import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import isNil from "lodash/isNil";
import { Socket } from "socket.io-client";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";

import "./LineInput.css";
import {
  caret,
  donePoemAccordionText,
  donePoemButton,
  errorMessage,
  helpMessageStyle,
  inactiveInput,
  inputBox,
  lineInputContainer,
  mainInputContainer,
  passButton,
  poemInputStyle,
  poemInputStyleHover,
  textSpacer,
  donePoemAccordionTitle,
} from "./styles";

import type {
  ClientToServerEvents,
  IUserInfo,
  ServerToClientEvents,
} from "../../types";

// if activeEditor, the letters are visible and textarea is editable
// if inactiveEditor, the letters are invisible, and textarea is not editable
// if spectator, the letters are visible, but the textarea is not editable

// this function allows us to get the most current value of a state variable
// with the third output argument "ref"
// https://stackoverflow.com/questions/53845595/wrong-react-hooks-behaviour-with-event-listener
function useStateRef(initialValue: boolean) {
  const [value, setValue] = useState(initialValue);
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return [value, setValue, ref] as const;
}

const LineInput = ({
  socket,
}: {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
}) => {
  const minCharsOnLineOne = 30;
  const maxCharsOnLineOne = 70;
  const minCharsOnLineTwo = 18; // must have more than this many characters on 2nd line to make exquisite
  const maxCharsOnLineTwo = 36; // must have less than this many characters on 2nd line to make exquisite
  const idealCharsOnLineOne = 60;
  const idealCharsOnLineTwo = 30;
  const lineSepString = "\n";

  const [poemInput, setPoemInput] = useState("");

  // a single boolean that determines whether the "Done Line" button should be enabled or disabled
  // it toggles based on the suitability of the current poem body to be made exquisite
  // we need an additional doneLineRef object that allows us to get its current state
  const [doneLineEnabled, setDoneLine, doneLineRef] = useStateRef(true);

  const [donePoemEnabled, setDonePoem] = useState(true);
  const [lineInputVisible, setLineInputVisible] = useState(false);
  const [lineInputEnabled, setLineInputEnabled] = useState(false);
  const [poemDoneAccordionVisible, setPoemDoneAccordionVisible] =
    useState(true);

  const [helpMessage, setHelpMessage] = useState("");
  // const [messageType, setMessageType] = useState(1);
  // const [progress, setProgress] = useState(0);

  const [inputErrorMsg, setInputErrorMsg] = useState(lineSepString);

  // const textareaRef = useRef() as React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  const textareaRef =
    useRef() as React.MutableRefObject<HTMLTextAreaElement | null>;

  // const yourTurnAudio = new Audio(yourTurnSound);

  const [snackMessage, setSnackMessage] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const handleClose = () => {
    setSnackOpen(false);
  };

  useEffect(() => {
    const lineEditListener = (lineEdit: React.SetStateAction<string>) => {
      setPoemInput(lineEdit);
    };

    const userInfoListener = (userInfo: IUserInfo) => {
      if (userInfo["role"] === "activeEditor") {
        setHelpMessage("Complete a line of poetry.");
        setLineInputVisible(true);
        setLineInputEnabled(true);
        setDoneLine(false);
        setDonePoem(true);
        setPoemDoneAccordionVisible(true);
        // yourTurnAudio.play();  // note this is a promise, won't play on mobile automatically
        document.title = "Your turn!";
        setTimeout(() => (document.title = "Exquisite Text"), 3000);
        snackBasedOnTurnsAway(userInfo["turnsAway"]);
        setSnackOpen(true);
        setTimeout(() => setSnackOpen(false), 3000);
      } else if (userInfo["role"] === "inactiveEditor") {
        setHelpMessage("Your friend is writing 👇");
        setLineInputVisible(false);
        setLineInputEnabled(false);
        setDoneLine(false);
        setDonePoem(false);
        setPoemDoneAccordionVisible(false);
        snackBasedOnTurnsAway(userInfo["turnsAway"]);
        setSnackOpen(true);
        setTimeout(() => setSnackOpen(false), 3000);
      } else if (userInfo["role"] === "spectator") {
        setHelpMessage("");
        setLineInputVisible(true);
        setLineInputEnabled(false);
        setDoneLine(false);
        setDonePoem(false);
        setPoemDoneAccordionVisible(false);
        setInputErrorMsg("");
        setHelpMessage(lineSepString);
      }
    };

    // additionally, tell React to set the poem textarea to change
    // whenever a lineEdit event is emitted
    socket.on("lineEdit", lineEditListener);

    // tells the server for this client to do getLineEdit
    // since this is client-side, it only happens for this client
    socket.emit("getLineEdit");

    socket.on("userInfo", userInfoListener);
    socket.emit("sendUserInfo");

    return () => {
      socket.off("lineEdit", lineEditListener);
      socket.off("userInfo", userInfoListener);
    };
  }, [socket]);

  function snackBasedOnTurnsAway(turnsAway: IUserInfo["turnsAway"]) {
    if (turnsAway === 0) {
      setSnackMessage("It's your turn!");
    } else if (turnsAway === 1) {
      setSnackMessage("You go next!");
    } else if (turnsAway === undefined) {
      setSnackMessage("You spectate something exquisite");
    } else {
      setSnackMessage("You're up in " + turnsAway.toString() + " turns.");
    }
  }

  function helpBasedOnProgress(messageType: number, progressProp: number) {
    if (messageType === 1) {
      if (progressProp < 0.3) {
        setHelpMessage("Write a line of poetry.");
      } else if (progressProp < 0.75) {
        setHelpMessage("That's it, keep going!");
      } else {
        setHelpMessage("Go to next line when ready ⏎");
      }
    } else {
      if (progressProp < 0.6) {
        setHelpMessage("Now start the next line (Next player will see this.)");
      } else {
        setHelpMessage("Perfect. Pass the turn!");
      }
    }
  }

  function sendNotification(msg: React.SetStateAction<string>) {
    setInputErrorMsg(msg);
    setTimeout(() => setInputErrorMsg(lineSepString), 3000);
  }

  // handles any change to the textarea element. written to be as fast as possible, so a bit verbose
  function handlePoemBodyChange(evt: {
    preventDefault: () => void;
    target: { value: string };
  }) {
    evt.preventDefault();

    const lines = String(evt.target.value).split(lineSepString);

    if (lines.length === 1) {
      // only one line

      if (lines[0].length > maxCharsOnLineOne) {
        const useInput = lines[0].slice(0, maxCharsOnLineOne);
        setPoemInput(useInput);
        socket.emit("lineEdit", useInput);
        sendNotification("You hit the max for first line, press Enter/Return!");
        // setMessageType(1);
        // setProgress(useInput.length / idealCharsOnLineOne);
        helpBasedOnProgress(1, useInput.length / idealCharsOnLineOne);
        setDoneLine(false);
      } else {
        setPoemInput(evt.target.value);
        socket.emit("lineEdit", evt.target.value);
        // setMessageType(1);
        // setProgress(evt.target.value.length / idealCharsOnLineOne);
        helpBasedOnProgress(1, evt.target.value.length / idealCharsOnLineOne);
        setDoneLine(false);
      }
    } else if (lines.length === 2) {
      if (lines[1].length > maxCharsOnLineTwo) {
        // second line too long

        const useInput =
          lines[0] + lineSepString + lines[1].slice(0, maxCharsOnLineTwo);
        setPoemInput(useInput);
        socket.emit("lineEdit", useInput);
        sendNotification("That's enough. If done, click pass!");
        // setMessageType(2);
        // setProgress(maxCharsOnLineTwo / idealCharsOnLineTwo);
        helpBasedOnProgress(2, maxCharsOnLineTwo / idealCharsOnLineTwo);
        setDoneLine(true);
      } else if (lines[0].length < minCharsOnLineOne) {
        // first line too short

        setPoemInput(lines[0]);
        socket.emit("lineEdit", lines[0]);
        sendNotification("More on first line!");
        // setMessageType(1);
        // setProgress(lines[0].length / idealCharsOnLineOne);
        helpBasedOnProgress(1, lines[0].length / idealCharsOnLineOne);
        setDoneLine(false);
      } else {
        // just right!

        setPoemInput(evt.target.value);
        socket.emit("lineEdit", evt.target.value);
        // setMessageType(2);
        // setProgress(lines[1].length / idealCharsOnLineTwo);
        helpBasedOnProgress(2, lines[1].length / idealCharsOnLineTwo);
        // console.log('just right zone', lines);
        setDoneLine(
          lines[1].length >= minCharsOnLineTwo &&
            lines[1].length <= maxCharsOnLineTwo
        );
      }
    } else {
      // more than 2 lines somehow (e.g. large copy-paste or press enter on line two)

      const useInput =
        lines[0] + lineSepString + lines[1].slice(0, maxCharsOnLineTwo);
      setPoemInput(useInput);
      socket.emit("lineEdit", useInput);
      const linesTwo = useInput.split(lineSepString);
      sendNotification("Two lines only. If done click Pass.");
      helpBasedOnProgress(2, linesTwo[1].length / idealCharsOnLineTwo);
      // setMessageType(2);
      // setProgress(maxCharsOnLineTwo / idealCharsOnLineTwo);
      setDoneLine(
        linesTwo[1].length >= minCharsOnLineTwo &&
          linesTwo[1].length <= maxCharsOnLineTwo
      );
    }
  }

  function makeExquisite() {
    // console.log('try to make exquisite');

    // this function takes approximately 1.5 lines of poem, and "makes them exquisite" by clipping the 1st line.
    // the next person who sees the result should not be aware of the 1st line but must continue with a new line
    const poemParts = poemInput.split(lineSepString);

    // check user input, should be two lines, although access to even executing this function is regulated
    // by the doneLineRef value, which enables and disables the button
    if (poemParts.length > 1) {
      const [firstPart, secondPart] = poemParts;

      // broadcast that there was a change
      setPoemInput(secondPart);
      socket.emit("lineEdit", secondPart);

      // emit a message of the first part to be posted to the Lines
      socket.emit("line", firstPart);

      // this client only tell the server to do the turn event
      socket.emit("allTurns");

      // this client only tell the server to do the sendUserInfo event
      socket.emit("sendEachUserTheirInfo");
      socket.emit("sendAllUserInfoToAll");
    }
  }

  function finishExquisite() {
    // emit a message of the current input to be posted to the Lines
    socket.emit("line", poemInput);

    // set the input textarea to be blank
    setPoemInput("");
    socket.emit("lineEdit", "");

    // this client only tell the server to do the ending event
    socket.emit("poemDone");

    // this event should also set the value of the "lines" variable
    // in Lines.js to be initialized (an empty object)...
    socket.emit("clearLines");

    // trigger the turn event on the server (switch the turn index and assign roles)
    socket.emit("allTurns");

    // since roles have changed, we must update user info
    socket.emit("sendEachUserTheirInfo");
    socket.emit("sendAllUserInfoToAll");
  }

  function handleKeypress({ charCode, ctrlKey }: KeyboardEvent) {
    // it triggers by pressing ctrl + enter (13), when the "Done Line" button is enabled
    // might not be necessary, but it's kind of nice
    // note we use doneLineRef instead of doneLineEnabled because it gets the current value
    if (doneLineRef.current && charCode === 13 && ctrlKey) {
      makeExquisite();
    }
  }

  return (
    // the initial idea here was to have a single textarea element that was editable
    // an alternative idea is to have this element be composed of a non-editable portion
    // and an editable portion
    <div
      className={"line-input-container"}
      style={lineInputContainer}
    >
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackOpen}
        onClose={handleClose}
        message={snackMessage}
      />
      <div
        className={"main-input-container"}
        style={mainInputContainer}
      >
        <div
          className={"help-message"}
          style={helpMessageStyle}
        >
          {helpMessage}
        </div>
        <div
          className={"input-box"}
          style={inputBox}
        >
          {lineInputVisible ? (
            <div className={"active-input"}>
              <div
                className={"error-message"}
                style={errorMessage}
              >
                {inputErrorMsg}
              </div>
              <textarea
                className={"poem-input"}
                ref={textareaRef}
                value={poemInput}
                style={poemInputStyle}
                onChange={handlePoemBodyChange}
                onKeyPress={handleKeypress}
                rows={2}
                // cols={idealCharsOnLineOne}
                autoFocus={true}
                readOnly={!lineInputEnabled}
                onFocus={() =>
                  !isNil(textareaRef) && !isNil(textareaRef.current)
                    ? textareaRef.current.setSelectionRange(-1, -1)
                    : {}
                }
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  if (!isNil(poemInputStyleHover.boxShadow)) {
                    target.style.boxShadow = poemInputStyleHover.boxShadow;
                  }
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  if (!isNil(poemInputStyle.boxShadow)) {
                    target.style.boxShadow = poemInputStyle.boxShadow;
                  }
                }}
              ></textarea>
            </div>
          ) : (
              <div
                className={"inactive-input"}
                style={inactiveInput}
              >
                <div
                  className={"text-spacer"}
                  data-autofocus={true}
                  style={textSpacer}
                >
                {poemInput.replaceAll(/[^\n]/g, "*")}
                  <div
                    id="caret"
                    style={caret}
                  ></div>
              </div>
            </div>
          )}
        </div>
        <div className={"pass-button-container"}>
          <div
            className={"pass-button"}
            style={passButton}
          >
            {doneLineEnabled && (
              <Button
                variant={"contained"}
                onClick={makeExquisite}
                disabled={!doneLineEnabled}
              >
                Pass
              </Button>
            )}
          </div>
        </div>
        {poemDoneAccordionVisible && (
          <div
            className={"done-poem-accordion"}
          >
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <div
                  className={"done-poem-accordion-title"}
                  style={donePoemAccordionTitle}
                >
                  <Typography>
                    <strong>Does the poem seem like it's done?</strong>
                  </Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                {/*<Typography>*/}
                <div
                  className={"done-poem-accordion-text"}
                  style={donePoemAccordionText}
                >
                  Only press this button if you're absolutely certain the poem
                  is done!
                </div>
                {/*</Typography>*/}
                <div
                  className={"done-poem-button"}
                  style={donePoemButton}
                >
                  <Button
                    variant={"contained"}
                    onClick={finishExquisite}
                    disabled={!donePoemEnabled}
                  >
                    Complete Poem
                  </Button>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        )}
      </div>
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

// {'*'.repeat(poemInput.length)}
