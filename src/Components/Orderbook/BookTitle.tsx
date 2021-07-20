/**
 * Order book header
 */
import * as React from 'react';

interface BookTitleProps {
  productName: string,
  connectionError: boolean
}

const BookTitle = ({ productName, connectionError }: BookTitleProps): JSX.Element => {

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
      <span>{connectionError ? 'Connection Issues..' : productText}</span>
    </div>
  );
};

export default React.memo(BookTitle);
