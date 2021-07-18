import React from 'react';
import styled from 'styled-components';
import GlobalStyle from './Styles/Global';
import Orderbook from './Components/Orderbook/Orderbook';
import ToggleFeedButton from './Components/Actions/ToggleFeedButton';
import KillFeedButton from './Components/Actions/KillFeedButton';

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

function App(): JSX.Element {

  return (
    <>
      <GlobalStyle />
      <Orderbook />
      <ActionsContainer>
        <ToggleFeedButton />
        <KillFeedButton />
      </ActionsContainer>
    </>
  );
}

export default App;
