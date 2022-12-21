import * as React from 'react';
import {Provider} from 'react-redux';
import Navigator from './src/components/Navigator';
import {store} from './src/store';

export default function App() {
  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
  );
}
