const baseUrlConfig = {
  'development' : 'http://172.16.16.212:8810',
  'test' : 'http://172.16.16.212:8810',
  'production' : '',
}

const getBaseurl = mode => baseUrlConfig[mode];

const config = {
  method : 'GET',
  baseURL : getBaseurl(process.env.NODE_ENV),
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  timeout: 1000 * 60
}

export default config
