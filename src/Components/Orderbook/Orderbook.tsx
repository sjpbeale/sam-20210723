/**
 * Orderbook component
 */
import { useContext, useState, useEffect } from 'react';
import { SocketContext } from '../../Sockets/SocketContext';
import { BookContainer, BookHeader } from './BookStyles';
import BookTitle from './BookTitle';
import BookGrouping from './BookGrouping';

export default function Orderbook(): JSX.Element {

  const socketContext = useContext(SocketContext);
  const { subscribedProduct, socketState, socketError } = socketContext;

  const [connectionMessage, setConnectionMessage] = useState('Loading..');

  useEffect(() => {
    let message = '';
    if (socketState === WebSocket.CLOSED) {
      message = socketError ? 'Connection Issues..' : 'Loading..';
    }
    setConnectionMessage(message);
  }, [socketState, socketError]);

  return (
    <BookContainer>
      <BookHeader hasError={socketError}>
        <BookTitle
          productName={subscribedProduct ?? ''}
          connectionState={connectionMessage}
        />
        <BookGrouping />

      </BookHeader>

    </BookContainer>
  );
}
