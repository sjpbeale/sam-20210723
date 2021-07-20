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

// Socket Settings
let socket: WebSocket;
const socketUrl = 'wss://www.cryptofacilities.com/ws/v1';
const failUrl = 'wss://www.cryptofacilities.com';
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
  socket: WebSocket;
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
  const [socketState, setSocketState] = useState(WebSocket.CLOSED);
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
      socket.close();
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

    return () => {
      socket.close();
    };
  }, [forceError]);

  // Send unsubscribe / subscribe
  useEffect(() => {
    if (socketState === WebSocket.OPEN) {

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
  }, [socketState, subscription]);

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
