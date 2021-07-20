/**
 * Get Message Updates for subscribed product
 */
import { useEffect } from 'react';
import { useSocket } from './SocketContext';

const useSocketMessage = (callback: (message: any) => void): void => {

  const { socket, subscribedProduct } = useSocket();

  useEffect(() => {

    // Local copy to update as socket updates can occur faster
    // than state updates
    let product = subscribedProduct;

    const callbackHandler = (e: MessageEvent): void => {
      try {
        const data = JSON.parse(e.data);

        if (data.event === 'unsubscribed') {
          product = '';
        } else if (data.event === 'subscribed') {
          product = data.product_ids[0] ?? '';
        }

        if (data.product_id && data.product_id === product) {
          callback(data);
        }
      } catch (err) {
        callback({ error: err });
      }
    };

    if (socket) {
      socket.addEventListener('message', callbackHandler);
    }

    return () => {
      if (socket) {
        socket.removeEventListener('message', callbackHandler);
      }
    };
  }, [socket, subscribedProduct, callback]);
};

export default useSocketMessage;
