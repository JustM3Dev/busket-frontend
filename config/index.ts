interface Config {
  backend: string,
  isBeta: boolean,
  version: string,
}

const config: Config = {
  backend: 'https://busket.bux.at',
  isBeta: false,
  version: '1.0',
};

export default config;