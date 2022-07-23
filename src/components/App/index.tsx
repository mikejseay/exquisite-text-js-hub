import {
  useEffect,
  useState,
} from "react";
import {
  io,
  Socket,
} from "socket.io-client";
import Lines from "../Lines";
import Poems from "../Poems";
import LineInput from "../LineInput";
import GameState from "../GameState";
import Tutorial from "../Tutorial";
import Settings from "../Settings";
import {
  appHeader,
  appBody,
  appTitle,
  app,
  possibleSocket,
} from "./styles";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../types";

function App() {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  useEffect(() => {
    const isProduction = true;
    const serverPath = isProduction
      ? `/`
      : `http://${window.location.hostname}:3000`;
    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(serverPath);
    setSocket(newSocket);
    return () => { newSocket.close() };
  }, [setSocket]);

  // The component then renders a page that contains a header.
  // If a socket has already been established, it will also render two components Lines and LineInput.
  // Both of these components need the socket to work, so it is being passed in as a parameter.
  if (!socket) {
    return <div>Not Connected</div>;
  }
  console.log(socket);

  return (
    <div style={possibleSocket}>
      <div style={app}>
        <header style={appHeader}>
          <Tutorial />
          <div style={appTitle}>Exquisite Text</div>
          <GameState socket={socket} />
          <Settings />
        </header>
        <div style={appBody}>
          <Lines socket={socket} />
          <LineInput socket={socket} />
          <Poems socket={socket} />
        </div>
      </div>
    </div>
  );
}

export default App;
