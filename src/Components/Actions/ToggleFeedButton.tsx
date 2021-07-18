/**
 * Toggle Feed Button
 */
import { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../../Sockets/SocketContext';
import { ToggleButton } from './ActionsStyles';

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
    <ToggleButton
      type="button"
      onClick={toggleFeed}
      disabled={!buttonEnabled}
    >
      Toggle Feed
    </ToggleButton>
  );
}
