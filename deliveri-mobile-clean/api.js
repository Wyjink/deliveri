
const API_URL = 'http://192.168.0.107:8000';

export async function fetchTransportModels(token) {
  const res = await fetch(`${API_URL}/transport-models/`, {
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  });
  if (!res.ok) throw new Error('Ошибка загрузки моделей транспорта');
  return await res.json();
}

export async function createDelivery(data, token) {
  const res = await fetch(`${API_URL}/deliveries/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Ошибка создания доставки');
  return await res.json();
}