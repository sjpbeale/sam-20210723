/**
 * Book Styles
 */
import styled from 'styled-components';

export const BookContainer = styled.div`
  margin: 5px auto;
  max-width: 1024px;
  color: white;
`;

interface FlexProps {
  flexDirection?: string;
  justifyContent?: string;
}

export const BookSection = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${(props) => props.flexDirection ?? 'row'};
  justify-content:  ${(props) => props.justifyContent ?? 'space-between'};
  padding: 8px;
  margin-bottom: 2px;
  background-color: black;
`;

interface HasErrorProps {
  readonly hasError?: boolean;
}

export const BookHeader = styled(BookSection)<HasErrorProps>`
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

export const BookContent = styled(BookSection)<HasErrorProps>`
  > div {
    flex: 1;
  }

  .order-list {
    transition: opacity 0.3s;
    opacity: ${(props) => (props.hasError ? 0.6 : 1)};
  }
`;

export const OrderList = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${(props) => props.flexDirection ?? 'column'};
  flex-grow: 1;
  text-align: center;
`;

type OrderRowProps = FlexProps & {
  background?: string,
};

export const OrderRow = styled.div<OrderRowProps>`
  display: flex;
  flex-direction: ${(props) => props.flexDirection ?? 'row'};
  justify-content: ${(props) => props.justifyContent ?? 'space-between'};
  background: ${(props) => props.background ?? 'black'};
  text-transform: uppercase;

  > div {
    flex: 1;
    padding: 2px 5%;
    text-align: right;
  }
  > div:first-child {
    padding-left: 0;
  }
  > div:last-child {
    padding-right: 10%;
  }

  .price {
    color: green;
  }
`;
