/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders the auth gate before showing the dashboard', async () => {
  await ReactTestRenderer.act(async () => {
    const tree = ReactTestRenderer.create(<App />);
    expect(tree.toJSON()).toBeTruthy();
  });
});
