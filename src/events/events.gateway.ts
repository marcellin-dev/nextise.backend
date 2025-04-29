/* eslint-disable prettier/prettier */
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ServerToClientEvents } from 'src/common';
import { LoggingService } from 'src/logging/logging.service';

@WebSocketGateway({ namespace: 'events', cors: true })

export class EventsGateway {

  constructor(private readonly _logger: LoggingService,) {
    this._logger.setContext({ service: EventsGateway.name });
  }
  @WebSocketServer()
  server: Server<any, ServerToClientEvents>;
  socketMap = new Map();


  /*to register a user to the socket map object
   * @param {id} id of user
   * @param {socket} userSocket
   * */
  @SubscribeMessage('registerUser')
  registerUser(client: Socket, id: string) {
    if (this.socketMap.has(id)) this.socketMap.delete(id);
    this.socketMap.set(id, client);

    this._logger.debug('user registered to the socket:===>', { id });
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    this._logger.log(payload);
    return 'Hello world!';
  }

  /*to get the user socket by her id
   * @param {id} userId
   * return userSocketObject or false
   * */
  getUserSocketById(id: string) {
    if (this.socketMap.get(id)) return this.socketMap.get(id);
    return false;
  }

  /*to emit an information via socket to the particular user
   * @param {userId} userId
   * @param {event} eventToSend
   * @param {data} dataToSend
   * */
  emitTo(userId: string, event: any, data: any) {
    this._logger.log('start emit to particular user ', { userId });
    this._logger.debug('this data ', data);
    const userSocket = this.getUserSocketById(userId);

    if (userSocket) {
      userSocket.emit(event, data);
      this._logger.log('success send message to socket ');
    }
  }

  /*to emit an information via socket to all registered users
   * @param {event} eventToSend
   * @param {data} dataToSend
   * */
  emitToAllRegisteredUsers(event: any, data: any) {
    this.socketMap.forEach((socket) => {
      socket.emit(event, data);
    });
  }


}
