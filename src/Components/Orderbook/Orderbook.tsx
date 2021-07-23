/**
 * Orderbook component
 */
import { useSocket } from '../../Sockets/SocketContext';
import { BookProvider } from './BookContext';
import {
  BookContainer,
  BookHeader,
  BookContent,
} from './BookStyles';
import BookTitle from './BookTitle';
import BookGrouping from './BookGrouping';
import BookDisplay from './BookDisplay';

interface IOrderbook {
  isMobile: boolean;
}

export default function Orderbook({ isMobile }: IOrderbook): JSX.Element {

  const { socket, subscribedProduct, socketError } = useSocket();

  return (
    <BookContainer>
      <BookProvider socket={socket}>

        <BookHeader hasError={socketError}>
          <BookTitle
            productName={subscribedProduct ?? ''}
            connectionError={socketError ?? false}
          />
          <BookGrouping
            isEnabled={!socketError && !!subscribedProduct}
          />
        </BookHeader>

        <BookContent isMobile={isMobile} hasError={socketError} flexDirection={isMobile ? 'column-reverse' : 'row'}>
          <BookDisplay
            type="buy"
            isMobile={isMobile}
          />
          <BookDisplay
            type="sell"
            isMobile={isMobile}
            invertData={isMobile}
          />
        </BookContent>

      </BookProvider>
    </BookContainer>
  );
}
