import React from 'react'

import { Provider } from 'react-redux'
import store from '../data/app'

export default ({ element }) => (
  <Provider store={store}>{element}</Provider>
);
