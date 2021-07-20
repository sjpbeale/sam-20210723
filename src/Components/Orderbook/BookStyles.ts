/**
 * Book Styles
 */
import styled from 'styled-components';

export const BookContainer = styled.div`
  margin: 5px auto;
  max-width: 1024px;
  color: white;
`;

interface BookSectionProps {
  flexDirection?: string;
  justifyContent?: string;
}

export const BookSection = styled.div<BookSectionProps>`
  display: flex;
  flex-direction: ${(props) => props.flexDirection ?? 'row'};
  justify-content:  ${(props) => props.justifyContent ?? 'space-between'};
  padding: 8px;
  margin-bottom: 2px;
  background-color: black;
`;

interface BookHeaderProps {
  readonly hasError?: boolean;
}

export const BookHeader = styled(BookSection)<BookHeaderProps>`
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
