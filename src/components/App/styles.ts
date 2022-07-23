import React from "react";

export const appHeader: React.CSSProperties = {
  height: "60px",
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  justifyContent: "space-between",
  alignItems: "center",
};

export const appBody: React.CSSProperties = {
  alignItems: "center",
  height: "calc(100vh - 60px)",
  display: "flex",
  flexDirection: "column",
  fontFamily: "'Esteban', serif",
  fontSize: "18px",
  flexWrap: "nowrap",
  justifyContent: "flex-start",
  width: "99vw",
};

export const appTitle: React.CSSProperties = {
  fontFamily: "'Esteban', serif",
  fontSize: "24px",
  left: "50%",
  position: "absolute",
  transform: "translate(-50%, 0)",
};

export const app: React.CSSProperties = {
  height: "100%",
  margin: "0 auto",
  width: "100%",
};

export const possibleSocket: React.CSSProperties = {
  height: "100%",
  margin: "0 auto",
  width: "100%",
};
