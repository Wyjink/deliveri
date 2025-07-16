import 'dotenv/config';

export default {
  expo: {
    name: "Deliveri Mobile",
    slug: "deliveri-mobile",
    extra: {
      API_URL: process.env.API_URL,
      ACCESS_TOKEN: process.env.ACCESS_TOKEN
    }
  }
};