import env from 'dotenv';
env.config()

export default {
  // server
  DB_PATH: process.env.DATABASE_PATH || './databases/mercadopago.db',
  PORT: process.env.PORT || 7777,

  // MercadoPago KEYS
  MP_PUBLIC_KEY: process.env.MP_PUBLIC_KEY,
  MP_ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN,
  MP_CLIENT_ID: process.env.MP_CLIENT_ID,
  MP_CLIENT_SECRET_ID: process.env.MP_CLIENT_SECRET_ID,
  MP_TEST_ACCESS_TOKEN: process.env.MP_TEST_ACCESS_TOKEN,
  MP_TEST_PUBLIC_KEY: process.env.MP_TEST_PUBLIC_KEY,

  // WS Connection
  WS_USER: process.env.WS_USER,
  WS_PASSWORD: process.env.PASSWORD
}
