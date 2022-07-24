import React from "react";

export const inputBox: React.CSSProperties = {
    width: "100%",
}

export const donePoemAccordionTitle: React.CSSProperties = {
    margin: "auto",
}

export const poemInputStyle: React.CSSProperties = {
    outline: "none",
    fontFamily: "'Esteban', serif",
    fontSize: "18px",
    textAlign: "center",
    resize: "none",
    lineHeight: "150%",
    cursor: "text",
    border: "none",
    backgroundImage: "linear-gradient(to right, #ffffff, #eeeeee)",
    boxShadow: "0.1em 0.1em 0.5em #bbbbbb",
    borderRadius: "0.75em",
    padding: "0.2em 0",
    whiteSpace: "nowrap",
    width: "100%",
    maxWidth: "100%",
    overflowX: "hidden",
};

export const poemInputStyleHover: React.CSSProperties = {
    boxShadow: "0.1em 0.1em 0.6em grey",
};

export const textSpacer: React.CSSProperties = {
    whiteSpace: "pre-line",
    display: "inline-block",
    color: "white",
    // maxWidth: "52ch",
    width: "52ch",
};

export const errorMessage: React.CSSProperties = {
    fontSize: "small",
    color: "red",
    whiteSpace: "pre-line",
    textAlign: "center"
};

export const passButton: React.CSSProperties = {
    minHeight: "40px",
    marginBottom: "1em",
};

export const helpMessageStyle: React.CSSProperties = {
    fontFamily: "sans-serif",
    whiteSpace: "pre-line",
};

export const donePoemButton: React.CSSProperties = {
    textAlign: "center"
};

export const donePoemAccordionText: React.CSSProperties = {
    marginBottom: "1em",
    fontFamily: "sans-serif"
};

export const lineInputContainer: React.CSSProperties = {
    marginTop: "2em",
    width: "80%",
};

export const mainInputContainer: React.CSSProperties = {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    alignItems: "center",
};

export const inactiveInput: React.CSSProperties = {
    marginTop: "1em",
};

export const caret: React.CSSProperties = {
    display: "inline-block",
    background: "black",
    height: "20px",
    width: "1px",
    animationDuration: "1s",
    animationName: "blink",
    animationIterationCount: "infinite",
};
