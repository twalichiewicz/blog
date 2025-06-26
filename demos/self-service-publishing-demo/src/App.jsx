import React, { useState } from 'react';
import { DemoWrapper } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/styles';
import ContentAuthoringTool from './components/ContentAuthoringTool';
import DemoWalkthrough from './components/DemoWalkthrough';
import './App.css';

function App() {
  const [showWalkthrough, setShowWalkthrough] = useState(true);

  return (
    <DemoWrapper url="manage.autodesk.com/insights">
      <ContentAuthoringTool />
      {showWalkthrough && (
        <DemoWalkthrough onComplete={() => setShowWalkthrough(false)} />
      )}
    </DemoWrapper>
  );
}

export default App;