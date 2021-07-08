interface Config {
  backend: string,
  isBeta: boolean,
}

const config: Config = {
  backend: 'http://192.168.4.48:3030',
  isBeta: true,
};

export default config;
