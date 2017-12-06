import axios from 'axios';

export async function getEvents() {
  const res = await axios.get('/api/events');

  return res.data;
}
