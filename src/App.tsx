import React from 'react';
import { createGlobalStyle } from 'styled-components';
import MainLayout from './components/UI/Layout/MainLayout';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #1a1a1a;
    color: #ffffff;
    overflow: hidden;
  }

  #root {
    width: 100vw;
    height: 100vh;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #2a2a2a;
  }

  ::-webkit-scrollbar-thumb {
    background: #555555;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #666666;
  }

  /* Selection styling */
  ::selection {
    background-color: #4a9eff;
    color: #ffffff;
  }

  /* Focus outline */
  button:focus,
  input:focus,
  select:focus {
    outline: 2px solid #4a9eff;
    outline-offset: 2px;
  }

  /* Disable text selection on UI elements */
  button,
  .no-select {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
`;

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <MainLayout />
    </>
  );
};

export default App;