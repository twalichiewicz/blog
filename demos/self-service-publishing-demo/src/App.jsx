import React, { useState } from 'react';
import { DemoWrapper } from '@portfolio/demo-shared';
import '@portfolio/demo-shared/styles';
import '../../shared/components/custom-cursors.css';
import PackageLibrary from './components/PackageLibrary';
import './components/PackageLibrary.css';
import './App.css';

function App() {
  return (
    <DemoWrapper url="manage.autodesk.com/packages">
      <PackageLibrary />
    </DemoWrapper>
  );
}

export default App;