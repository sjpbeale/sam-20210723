/**
 * Orderbook Context
 */
import React, {
  useState,
  useReducer,
  useEffect,
} from 'react';
import * as BookTypes from './BookTypes';

// Grouping Options
const groupOptionMap = new Map([
  ['PI_XBTUSD', [0.5, 1, 2.5]],
  ['PI_ETHUSD', [0.05, 0.1, 0.25]],
]);

/**
 * Merge Orders
 *
 * Merge existing orders and order updates sorting in
 * descending order to keep largest first and limit
 * array length to specified amount.
 */
const mergeOrders = (
  orders: BookTypes.Orders,
  updates: BookTypes.Orders,
  limit: number,
): BookTypes.Orders => {

  // Merge orders removing 0 size elements
  const merged = updates.reduce((acc, [price, size]) => {
    if (!size) {
      acc.delete(price);
    } else {
      acc.set(price, size);
    }
    return acc;
  }, new Map(orders));

  // Sort descending
  const sorted = [...merged].sort((a, b) => b[0] - a[0]);

  // Limit Length
  if (sorted.length > limit) {
    sorted.length = limit;
  }

  return sorted;
};

const groupOrders = (orders: BookTypes.Orders, group: number): BookTypes.Orders => {

  const orderMap = new Map(orders);

  orderMap.forEach((size, price) => {

    let decimalCount = 0;

    // Find decimals in group
    if (group % 1 !== 0) {
      const decimals = String(group).split('.')[1];
      decimalCount = decimals.length ? decimals.length : 0;
    }

    // Round down current price to closest group
    const rounded = parseFloat((Math.floor(price / group) * group).toFixed(decimalCount));

    if (rounded !== price) {

      // Remove invalid price for group
      orderMap.delete(price);

      // Combine or add rounded price / size
      if (orderMap.has(rounded)) {
        const storedSize = orderMap.get(rounded) ?? 0;
        orderMap.set(rounded, size + storedSize);
      } else {
        orderMap.set(rounded, size);
      }
    }
  });

  return [...orderMap];
};

const formatOrders = (orders: BookTypes.Orders, bookTotal: number): BookTypes.ProcessedOrders => {

  let total = 0;

  return orders.map(([price, size]) => {

    total += size;

    return {
      price,
      size,
      total,
      percent: Math.round((total / bookTotal) * 100),
    };
  });
};

// Group / format with totals - percent worked out in display
const processOrders = (
  state: BookTypes.ProcessedState,
  orders: BookTypes.ProcessData,
): BookTypes.ProcessedState => {

  // Group orders
  const bids = groupOrders(orders.bids, orders.group);
  const asks = groupOrders(orders.asks, orders.group);

  // Limit display row amount
  // @note cuts largest totals off / maybe should be least
  if (bids.length > orders.limit) {
    bids.length = orders.limit;
  }
  if (asks.length > orders.limit) {
    asks.length = orders.limit;
  }

  // Highest total
  const highestTotal = Math.max(
    [...new Map(bids).values()].reduce((a, b) => (a + b), 0),
    [...new Map(asks).values()].reduce((a, b) => (a + b), 0),
  );

  return {
    bids: formatOrders(bids, highestTotal),
    asks: formatOrders(asks, highestTotal),
  };
};

const BookContext = React.createContext<Partial<BookTypes.IBookContext>>({});

const BookProvider = ({ socket, mobile, children }: BookTypes.IBookProvider): JSX.Element => {

  // Context states
  const [group, setGroup] = useState<number>(0.5);
  const [groupOptions, setGroupOptions] = useState<number[]>([]);
  const [bookData, setBookData] = useReducer(processOrders, {
    bids: [],
    asks: [],
  });

  // Book stores to hold data over rerenders
  const bidsStore = React.useRef<BookTypes.OrdersUpdate>({
    orders: [],
    hasUpdate: false,
    levels: 0,
  });
  const asksStore = React.useRef<BookTypes.OrdersUpdate>({
    orders: [],
    hasUpdate: false,
    levels: 0,
  });

  // Order Update Id to hold RAF id
  const ordersUpdateId = React.useRef<number>(0);

  // Update orders with requestAnimationFrame to avoid
  // forcing updates from socket which would not be seen.
  useEffect(() => {

    // Indicate update in useEffect props
    let dependecyUpdate = true;

    const testUpdate = (): void => {

      const { orders: bids, hasUpdate: bidsUpdate } = bidsStore.current;
      const { orders: asks, hasUpdate: asksUpdate } = asksStore.current;

      if (bidsUpdate || asksUpdate || dependecyUpdate) {

        // Reset update state
        bidsStore.current.hasUpdate = false;
        asksStore.current.hasUpdate = false;
        dependecyUpdate = false;

        setBookData({
          bids,
          asks,
          group,
          limit: mobile ? 13 : 15,
        });
      }

      // Request new animation frame
      ordersUpdateId.current = requestAnimationFrame(testUpdate);
    };

    ordersUpdateId.current = requestAnimationFrame(testUpdate);

    return () => {
      cancelAnimationFrame(ordersUpdateId.current);
    };
  }, [group, mobile]);

  useEffect(() => {

    console.log('BOOK CONTEXT SOCKET HANDLER');

    let current = '';

    const handleUpdates = (e: MessageEvent): void => {
      try {
        const data = JSON.parse(e.data);

        const {
          event,
          product_ids: ids,
          product_id: id,
          feed,
        } = data;

        // Ensure current subscribed id
        if (event === 'unsubscribed') {
          current = '';
        } else if (event === 'subscribed') {
          current = ids[0] ?? '';
        }

        if (id && id === current) {

          if (feed.includes('_snapshot')) {

            // Set Group Options
            const currentGroup = Number(group);
            const productGroupOptions = groupOptionMap.get(id);

            setGroupOptions(productGroupOptions ?? []);

            if (productGroupOptions && !productGroupOptions.includes(currentGroup)) {
              setGroup(productGroupOptions[0]);
            }

            bidsStore.current = { orders: data.bids, hasUpdate: true, levels: data.numLevels };
            asksStore.current = { orders: data.asks, hasUpdate: true, levels: data.numLevels };

          } else {

            // Update bidsStore and mark updated
            if (data.bids.length) {
              bidsStore.current.orders = mergeOrders(
                bidsStore.current.orders,
                data.bids,
                bidsStore.current.levels,
              );
              bidsStore.current.hasUpdate = true;
            }

            if (data.asks.length) {
              asksStore.current.orders = mergeOrders(
                asksStore.current.orders,
                data.asks,
                asksStore.current.levels,
              ).reverse();
              asksStore.current.hasUpdate = true;
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    // Add / Remove listeners
    socket?.addEventListener('message', handleUpdates);

  }, []);

  return (
    <BookContext.Provider
      value={{
        group,
        setGroup,
        groupOptions,
        bookData,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

// Book Consumer Hook
const useBookContext = (): Partial<BookTypes.IBookContext> => {
  const context = React.useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBookContext must be with BookProvider');
  }
  return context;
};

export {
  BookContext,
  BookProvider,
  useBookContext,
};
