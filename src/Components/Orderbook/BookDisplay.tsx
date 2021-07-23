/**
 * Order book display
 */
import { useState, useEffect } from 'react';
import * as BookTypes from './BookTypes';
import { useBookContext } from './BookContext';
import { OrderList, OrderRow } from './BookStyles';
import BookRow from './BookRow';

interface IBookDisplay {
  type: string;
  isMobile?: boolean;
  invertData?: boolean;
}

const BookDisplay = ({ type, isMobile = true, invertData = false }: IBookDisplay): JSX.Element => {

  const { bookData } = useBookContext();

  const [orders, setOrders] = useState<BookTypes.ProcessedOrders>([]);

  useEffect(() => {
    if (bookData) {
      if (type === 'buy') {
        setOrders(bookData.bids ?? []);
      } else {
        setOrders(bookData.asks ?? []);
      }
    }
  }, [bookData, type]);

  const columnDirection = (): 'row' | 'row-reverse' => (isMobile || (!isMobile && type === 'sell') ? 'row' : 'row-reverse');

  return (
    <div>
      <OrderRow flexDirection={columnDirection()}>
        <div>Price</div>
        <div>Size</div>
        <div>Total</div>
      </OrderRow>
      <OrderList flexDirection={invertData ? 'column-reverse' : 'column'}>
        {orders.map((order) => (
          <BookRow
            key={order.price}
            data={order}
            bgColor={type === 'sell' ? 'green' : 'red'}
            bgDirection={type === 'sell' && !isMobile ? 'right' : 'left'}
            columnDirection={columnDirection()}
          />
        ))}
      </OrderList>
    </div>
  );
};

export default BookDisplay;
