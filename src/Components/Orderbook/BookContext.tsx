/**
 * Orderbook Context
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useSocket } from '../../Sockets/SocketContext';
import getSubscribedMessages from '../../Sockets/getSubscribedMessages';

// Grouping Options
const groupOptionMap = new Map([
  ['PI_XBTUSD', [0.5, 1, 2.5]],
  ['PI_ETHUSD', [0.05, 0.1, 0.25]],
]);

interface BookContextInterface {
  group: number;
  setGroup: (group: number) => void;
  groupOptions: number[],
}

const BookContext = createContext<Partial<BookContextInterface>>({});

const BookProvider = ({ children }: { children: ReactNode }): JSX.Element => {

  const { subscribedProduct } = useSocket();

  const [group, setGroup] = useState<number>(0.5);
  const [groupOptions, setGroupOptions] = useState<number[]>([]);

  // Set group options on product change
  useEffect(() => {
    if (subscribedProduct) {
      setGroupOptions(groupOptionMap.get(subscribedProduct) ?? []);
    }
  }, [subscribedProduct]);

  // Message listener for current product
  getSubscribedMessages((message) => {

    const {
      feed,
      numLevels,
      product_id: product,
      bids = [],
      asks = [],
      error,
    } = message;

    if (!error) {
      if (feed.includes('_snapshot')) {

        // Set Group Options
        const currentGroup = Number(group);
        const productGroupOptions = groupOptionMap.get(product);

        if (productGroupOptions && !productGroupOptions.includes(currentGroup)) {
          setGroup(productGroupOptions[0]);
        }

      } else {
        // console.log('UPDATE', product, bids, asks);
      }
    }
  });

  return (
    <BookContext.Provider
      value={{
        group,
        setGroup,
        groupOptions,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

// Book Consumer Hook
const useBookContext = (): Partial<BookContextInterface> => {
  const context = useContext(BookContext);
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
