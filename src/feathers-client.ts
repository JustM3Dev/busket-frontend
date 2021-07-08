import io from 'socket.io-client';
import socketio from '@feathersjs/socketio-client';
import feathers from '@feathersjs/feathers';
import auth from '@feathersjs/authentication-client';
import config from '../config';

const socket = io(config.backend, { transports: ['websocket'] });

const feathersClient = feathers()
  .configure(socketio(socket, { timeout: 30000 }))
  .configure(auth());

feathersClient.authentication.app.set('auth', null);

export async function isLoggedIn (): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    if (!feathersClient.authentication.authenticated) {
      feathersClient.authenticate().then(() => resolve(true)).catch(() => resolve(false));
    }
  });
}

export interface IList {
  owner: string,
  name: string;
  pinned: boolean;
  items: Record<string, string>;
  // eslint-disable-next-line camelcase
  list_id: string;

  // eslint-disable-next-line camelcase
  created_at: Date;
  // eslint-disable-next-line camelcase
  updated_at: Date;
}

export interface Item {
  checked: boolean,
  cachedName: string,
  name: string,
  id: string
}

export default feathersClient;
