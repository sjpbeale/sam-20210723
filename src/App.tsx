import * as React from 'react';
import styled from 'styled-components';
import GlobalStyle from './Styles/Global';
import Orderbook from './Components/Orderbook/Orderbook';
import ToggleFeedButton from './Components/Actions/ToggleFeedButton';
import KillFeedButton from './Components/Actions/KillFeedButton';

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const isMobileResolution = ():boolean => window.innerWidth < 768;

function App(): JSX.Element {

  const [mobileResolution, setMobileResolution] = React.useState<boolean>(isMobileResolution());

  // Simple resolution check for mobile
  React.useEffect(() => {

    let debounce: ReturnType<typeof setTimeout>;

    const resizeHandler = ():void => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        setMobileResolution(isMobileResolution());
      }, 100);
    };

    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return (
    <>
      <GlobalStyle />
      <Orderbook isMobile={mobileResolution} />
      <ActionsContainer>
        <ToggleFeedButton />
        <KillFeedButton />
      </ActionsContainer>
    </>
  );
}

export default App;
