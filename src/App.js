import { Header, HeaderMenuItem, HeaderName, HeaderNavigation } from 'carbon-components-react';
import APIPage from './pages/APIPage';
import './App.scss';

function App() {
  const prefix = "IBM";
  const name = "Security Verify";
  return (
    <>
      <Header aria-label={`${prefix} ${name}`}>
        <HeaderName href="/" prefix={prefix}>
          [{name}]
        </HeaderName>
        <HeaderNavigation aria-label={`${prefix} [${name}]`}>
          <HeaderMenuItem href="/">API</HeaderMenuItem>
        </HeaderNavigation>
      </Header>
      <div className="app">
        <APIPage />
      </div>
    </>
  );
}

export default App;
