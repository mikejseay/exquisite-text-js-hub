import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";
import "./Settings.css";

const Tutorial = ({ socket }) => {
  return (
    <div className={"settings"}>
      <IconButton aria-label="players" size={"large"}>
        <SettingsIcon />
      </IconButton>
    </div>
  );
};

export default Tutorial;
