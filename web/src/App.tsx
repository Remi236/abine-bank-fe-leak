import { BrowserRouter } from 'react-router-dom';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';
import './App.scss';

import { Router } from './Routes';

function App() {
  return (
    <>
      <ReactNotifications />
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </>
  );
}

export default App;
