import * as React from 'react';
import {Provider} from 'react-redux';
import RootNavigator from './src/navigator/RootNavigator';
import {store} from './src/store';

export default function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
