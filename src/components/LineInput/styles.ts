import React from "react";

export const poemInputStyle: React.CSSProperties = {
    outline: "none",
    fontFamily: "'Esteban', serif",
    fontSize: "18px",
    textAlign: "center",
    resize: "none",
    lineHeight: "150%",
    cursor: "text",
};

export const textSpacer: React.CSSProperties = {
    whiteSpace: "pre-line",
    display: "inline-block",
    color: "white"
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
    marginTop: "2em"
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
