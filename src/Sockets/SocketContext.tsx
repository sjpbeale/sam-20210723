/**
 * Socket Context
 */
import {
  createContext, useState, useEffect, ReactNode,
} from 'react';

// Socket Settings
let socket: WebSocket;
const socketUrl = 'wss://www.cryptofacilities.com/ws/v1';
const failUrl = 'wss://www.cryptofacilities.com';
const feedId = 'book_ui_1';

const SocketContext = createContext({});

const SocketProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  // Set States
  const [socketState, setSocketState] = useState<number>(WebSocket.CLOSED);
  const [socketError, setSocketError] = useState<boolean>(false);
  const [forceError, setForceError] = useState(false);

  useEffect(() => {

    // New socket connection
    socket = new WebSocket(forceError ? failUrl : socketUrl);

    socket.onopen = () => {
      setSocketError(false);
      setSocketState(socket.readyState);
    };

    socket.onclose = () => {
      setSocketState(socket.readyState);
    };

    socket.onerror = () => {
      setSocketError(true);
    };

    return () => {
      socket.close();
    };
  }, [forceError]);

  return (
    <SocketContext.Provider
      value={{
        socketState,
        socketError,
        forceError,
        setForceError,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
