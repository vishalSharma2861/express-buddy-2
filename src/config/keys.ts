export class Keys {
  PORT: string = null;
  MONGO_URL: string = null;
  JWT_SECRET: string = null;
  LOCAL_URL: string = null;
  URL: string = null;
  SERVER_TYPE: string = null;

  constructor() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('dotenv').config();
    } catch (error) {}
    this.prepareKeys();
  }

  prepareKeys() {
    this.PORT = process.env.PORT;
    this.MONGO_URL = process.env.MONGO_URL;
    this.JWT_SECRET = process.env.JWT_SECRET;
    this.URL = process.env.URL;
    this.SERVER_TYPE = process.env.SERVER_TYPE;
  }
}
