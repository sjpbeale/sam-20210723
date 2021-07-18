/**
 * Book Styles
 */
import styled from 'styled-components';

export const BookContainer = styled.div`
  margin: 5px auto;
  max-width: 1024px;
`;

interface BookHeaderProps {
  readonly hasError?: boolean;
}

export const BookHeader = styled.div<BookHeaderProps>`
  display: flex;
  justify-content: space-between;
  background-color: black;
  color: white;
  padding: 8px;
  font-weight: bold;
  font-size: 16px;

  span {
    font-size: 12px;
    padding-left: 5px;
    color: ${(props) => (props.hasError ? 'darkorange' : 'grey')};
  }
`;

export const Select = styled.select`
  background-color: grey;
  color: white;
  padding: 2px;
  border-radius: 2px;
`;
