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

interface SocketContextInterface {
  socketState: number;
  socketError: boolean;
  subscribedProduct: string,
  toggleSubscription: () => void;
  message: any;
  forceError: boolean;
  setForceError: (error: boolean) => void;
}

const SocketContext = createContext<Partial<SocketContextInterface>>({});

type SubscriptionState = {
  subscribe: string,
  unsubscribe: string,
};

const switchProducts = (state: SubscriptionState, subscribe: string): SubscriptionState => ({
  subscribe,
  unsubscribe: state.subscribe,
});

const SocketProvider = ({ children }: { children: ReactNode }): JSX.Element => {

  // Set States
  const [socketState, setSocketState] = useState(WebSocket.CLOSED);
  const [socketError, setSocketError] = useState(false);
  const [subscription, subscribe] = useReducer(switchProducts, {
    subscribe: 'PI_XBTUSD',
    unsubscribe: 'PI_ETHUSD',
  });
  const [subscribedProduct, setSubscribedProduct] = useState('');
  const [message, setMessage] = useState({});
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
    };

    let subscriptions: Array<string> = [];

    socket.addEventListener('message', (e: MessageEvent) => {

      const data = JSON.parse(e.data.toString());

      const {
        product_id: productId,
        product_ids: productIds,
        event,
      } = data;

      // Handler Subscribe / Unsubscribe
      if (event === 'subscribed') {

        subscriptions = [...new Set([
          ...subscriptions,
          ...productIds,
        ])];

        setSubscribedProduct(productIds[0]);

      } else if (event === 'unsubscribed') {
        subscriptions = subscriptions.filter((id) => !productIds.includes(id));
      }

      if (subscriptions.includes(productId)) {
        setMessage(data);
      }
    });

    return () => {
      socket.close();
    };
  }, [forceError]);

  // Send unsubscribe / subscribe
  useEffect(() => {
    if (socketState === WebSocket.OPEN) {

      // Unsubscribe
      if (subscription.unsubscribe) {

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
        socketState,
        socketError,
        toggleSubscription,
        subscribedProduct,
        message,
        forceError,
        setForceError,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
