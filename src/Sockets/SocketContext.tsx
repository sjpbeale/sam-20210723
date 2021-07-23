/**
 * Socket Context
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
  ReactNode,
} from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

// Socket Settings
const socket = new ReconnectingWebSocket('wss://www.cryptofacilities.com/ws/v1', [], {
  startClosed: true,
});
const feedId = 'book_ui_1';

type SubscriptionState = {
  subscribe: string,
  unsubscribe: string,
};

// Switch products reducer
const switchProducts = (state: SubscriptionState, subscribe: string): SubscriptionState => ({
  subscribe,
  unsubscribe: state.subscribe,
});

interface SocketContextInterface {
  socket: ReconnectingWebSocket;
  socketState: number;
  socketError: boolean;
  subscribedProduct: string,
  toggleSubscription: () => void;
  forceError: boolean;
  setForceError: (error: boolean) => void;
}

// Socket Context
const SocketContext = createContext<Partial<SocketContextInterface>>({});

// Socket Provider
const SocketProvider = ({ children }: { children: ReactNode }): JSX.Element => {

  // Set States
  const [socketState, setSocketState] = useState(socket.readyState);
  const [socketError, setSocketError] = useState(false);
  const [subscribedProduct, setSubscribedProduct] = useState('');
  const [subscription, subscribe] = useReducer(switchProducts, {
    subscribe: 'PI_XBTUSD',
    unsubscribe: 'PI_ETHUSD',
  });
  const [forceError, setForceError] = useState(false);

  // Toggle Subscription
  const toggleSubscription = (): void => {
    subscribe(subscription.unsubscribe);
  };

  // Handle socket events
  useEffect(() => {

    socket.onopen = (): void => {
      setSocketError(false);
      setSocketState(socket.readyState);
    };

    socket.onclose = (): void => {
      setSocketState(socket.readyState);
    };

    socket.onmessage = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);

        // Set on subscribe to update that we have switched
        if (data.event === 'subscribed') {
          setSubscribedProduct(data.product_ids[0] ?? '');
        }

      } catch (err) {
        setSocketError(true);
      }
    };

    // Event listener as reconnecting onerror not triggering
    socket.addEventListener('error', () => {
      setSocketError(true);
    });

  }, []);

  // Send unsubscribe / subscribe
  useEffect(() => {
    if (socketState === WebSocket.OPEN && !socketError) {

      // Unsubscribe
      if (subscription.unsubscribe) {

        // Set early to update that we are switching
        setSubscribedProduct('');

        socket.send(JSON.stringify({
          event: 'unsubscribe',
          feed: feedId,
          product_ids: [subscription.unsubscribe],
        }));
      }

      // Subscribe
      if (subscription.subscribe) {
        socket.send(JSON.stringify({
          event: 'subscribe',
          feed: feedId,
          product_ids: [subscription.subscribe],
        }));
      }
    }
  }, [socketState, subscription, socketError]);

  // Initial Connect / Force Error
  useEffect(() => {

    // Trigger error from socket
    if (forceError) {
      socket.dispatchEvent(new ErrorEvent('error'));
      socket.close();
    } else {
      socket.reconnect();
    }

  }, [forceError]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        socketState,
        socketError,
        toggleSubscription,
        subscribedProduct,
        forceError,
        setForceError,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// Socket Consumer Hook
const useSocket = (): Partial<SocketContextInterface> => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be with SocketProvider');
  }
  return context;
};

export {
  SocketContext,
  SocketProvider,
  useSocket,
};
