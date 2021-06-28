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

export default feathersClient;
