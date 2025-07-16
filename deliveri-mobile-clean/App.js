import React from 'react';
import NewDeliveryScreen from './screens/NewDeliveryScreen';

// Вставьте сюда ваш рабочий access-токен
const TEST_TOKEN = 'PASTE_YOUR_ACCESS_TOKEN_HERE';

export default function App() {
  return <NewDeliveryScreen token={TEST_TOKEN} />;
}