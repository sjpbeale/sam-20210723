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

interface MobileProps {
  isMobile?: boolean;
}

export const BookSection = styled.div<FlexProps & MobileProps>`
  display: flex;
  flex-direction: ${(props) => props.flexDirection ?? 'row'};
  justify-content: ${(props) => props.justifyContent ?? 'space-between'};
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

  .order-title,
  .order-list {
    &.order-buy {
      > div {
        flex-direction: ${(props) => (props.isMobile ? 'row' : 'row-reverse')};
      }
    }

    &.order-sell {
      > div {
        flex-direction: 'row';
      }
    }
  }

  .order-title.order-buy {
    visibility: ${(props) => (props.isMobile ? 'hidden' : 'visible')};
  }

  .order-list {
    transition: opacity 0.3s;
    opacity: ${(props) => (props.hasError ? 0.6 : 1)};

    .price {
      opacity: 0.8;
      color: limegreen;
    }

    &.order-buy {
      .price {
        color: red;
      }
    }
  }
`;

export const OrderList = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${(props) => props.flexDirection ?? 'column'};
  flex-grow: 1;
  text-align: center;
`;

export const OrderRow = styled.div`
  display: flex;
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
