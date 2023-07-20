import './App.css';

import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import MyRoutes from './Router';

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <BrowserRouter>
          <MyRoutes></MyRoutes>
        </BrowserRouter>
      </RecoilRoot>
    </div>
  );
}

export default App;
