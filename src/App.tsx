import React from 'react';
import './App.css';
import Orderbook from './Components/Orderbook/Orderbook';
import ToggleFeedButton from './Components/Actions/ToggleFeedButton';
import KillFeedButton from './Components/Actions/KillFeedButton';

function App(): JSX.Element {

  return (
    <div className="App">
      <Orderbook />
      <ToggleFeedButton />
      <KillFeedButton />
    </div>
  );
}

export default App;
