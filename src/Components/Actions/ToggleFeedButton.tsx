/**
 * Toggle Feed Button
 */
import { useState, useEffect } from 'react';
import { useSocket } from '../../Sockets/SocketContext';
import { ToggleButton } from './ActionsStyles';

export default function ToggleFeedButton(): JSX.Element {

  const {
    toggleSubscription,
    subscribedProduct,
    socketError,
  } = useSocket();

  const [buttonEnabled, setButtonEnabled] = useState(false);

  // Toggle Feed
  const toggleFeed = (): void => {
    toggleSubscription?.();
  };

  // Enable toggle if subscribed
  useEffect(() => {
    setButtonEnabled(!!subscribedProduct && !socketError);
  }, [subscribedProduct, socketError]);

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
