/**
 * Order book row
 */
import * as BookTypes from './BookTypes';
import { OrderRow } from './BookStyles';

interface IBookRow {
  data: BookTypes.ProcessedOrder;
  bgColor: 'green' | 'red';
  bgDirection: 'left' | 'right';
  columnDirection: 'row' | 'row-reverse';
}

const BookRow = ({
  data, bgColor, bgDirection, columnDirection,
}: IBookRow): JSX.Element => {

  const { percent, ...order } = data;

  // Create background linear gradient
  const backgroundPercent = (): string => {

    let background = 'black';

    if (bgColor && bgDirection && percent) {

      const rgba = bgColor === 'red' ? 'rgba(100, 40, 40, 0.3)' : 'rgba(40, 100, 40, 0.3)';

      const gradientProps = [
        `to ${bgDirection}`,
        `${rgba} ${percent}%`,
        `black ${percent}%`,
      ];

      background = `linear-gradient(${gradientProps.join(', ')})`;
    }

    return background;
  };

  return (
    <OrderRow
      background={backgroundPercent()}
      flexDirection={columnDirection}
    >
      {Object.entries(order).map(([name, value]) => (
        <div
          key={name}
          className={name}
        >
          {name === 'price' ? value.toFixed(2) : value}
        </div>
      ))}
    </OrderRow>
  );
};

export default BookRow;
