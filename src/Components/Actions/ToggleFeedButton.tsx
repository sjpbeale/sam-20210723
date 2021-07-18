/**
 * Toggle Feed Button
 */
import { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../../Sockets/SocketContext';

export default function ToggleFeedButton(): JSX.Element {

  const socketContext = useContext(SocketContext);
  const { subscribedProduct, toggleSubscription } = socketContext;

  const [buttonEnabled, setButtonEnabled] = useState(false);

  // Toggle Feed
  const toggleFeed = (): void => {
    toggleSubscription?.();
  };

  // Enable toggle if subscribed
  useEffect(() => {
    setButtonEnabled(!!subscribedProduct);
  }, [subscribedProduct]);

  return (
    <button
      type="button"
      onClick={toggleFeed}
      disabled={!buttonEnabled}
    >
      Toggle Feed
    </button>
  );
}
