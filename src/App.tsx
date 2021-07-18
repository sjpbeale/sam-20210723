import React from 'react';
import './App.css';
import ToggleFeedButton from './Components/Actions/ToggleFeedButton';
import KillFeedButton from './Components/Actions/KillFeedButton';

function App(): JSX.Element {

  return (
    <div className="App">
      <ToggleFeedButton />
      <KillFeedButton />
    </div>
  );
}

export default App;
