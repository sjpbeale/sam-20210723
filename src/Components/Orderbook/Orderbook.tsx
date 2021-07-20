/**
 * Orderbook component
 */
import { useState, useEffect } from 'react';
import { useSocket } from '../../Sockets/SocketContext';
import {
  BookContainer,
  BookHeader,
} from './BookStyles';
import BookTitle from './BookTitle';
import BookGrouping from './BookGrouping';

export default function Orderbook(): JSX.Element {

  const { subscribedProduct, socketError } = useSocket();

  return (
    <BookContainer>

      <BookHeader hasError={socketError}>
        <BookTitle
          productName={subscribedProduct ?? ''}
          connectionError={socketError ?? false}
        />
        <BookGrouping
          isEnabled={!socketError && !!subscribedProduct}
        />
      </BookHeader>

    </BookContainer>
  );
}
