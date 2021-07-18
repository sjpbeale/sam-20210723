/**
 * Kill Feed Button
 */
import { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../../Sockets/SocketContext';

export default function KillFeedButton(): JSX.Element {

  const socketContext = useContext(SocketContext);
  const { subscribedProduct, forceError, setForceError } = socketContext;

  const [buttonEnabled, setButtonEnabled] = useState(false);

  const killFeed = (): void => setForceError?.(!forceError);

  // Enable toggle if subscribed
  useEffect(() => {
    setButtonEnabled(!!subscribedProduct);
  }, [subscribedProduct]);

  return (
    <button
      type="button"
      onClick={killFeed}
      disabled={!buttonEnabled}
    >
      Kill Feed
    </button>
  );
}
