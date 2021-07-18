/**
 * Order book header
 */
import * as React from 'react';

type BookTitleProps = {
  productName: string,
  connectionState: string
};

const BookTitle = ({ productName, connectionState }: BookTitleProps): JSX.Element => {

  const productText = productName.replace(/PI_(\w{3})(\w{3})/, (match, first, second) => {
    let text = '';
    if (first && second) {
      text = `${first}/${second}`;
    }
    return text;
  });

  return (
    <div>
      Order Book
      <span>{connectionState ?? productText}</span>
    </div>
  );
};

export default React.memo(BookTitle);
