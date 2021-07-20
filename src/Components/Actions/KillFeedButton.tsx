/**
 * Kill Feed Button
 */
import { useState, useEffect } from 'react';
import { useSocket } from '../../Sockets/SocketContext';
import { KillButton } from './ActionsStyles';

export default function KillFeedButton(): JSX.Element {

  const {
    subscribedProduct,
    forceError,
    setForceError,
  } = useSocket();

  const [buttonEnabled, setButtonEnabled] = useState(false);

  const killFeed = (): void => setForceError?.(!forceError);

  // Enable toggle if subscribed
  useEffect(() => {
    setButtonEnabled(!!subscribedProduct);
  }, [subscribedProduct]);

  return (
    <KillButton
      type="button"
      onClick={killFeed}
      disabled={!buttonEnabled}
    >
      Kill Feed
    </KillButton>
  );
}
