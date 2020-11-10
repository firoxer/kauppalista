const CONNECTION_TIMEOUT_MS = 10000;
const CONNECTION_RETRIES = 5;

export class ServerConnection {
  constructor(url, token) {
    this._url = url;
    this._token = token;

    this._echo = 0;
    this._messagesAwaitingResponse = new Map();
    this._statusCheck = null;
    this._messageListeners = [];
    this._errorListeners = [];
    this._connectionRetriesLeft = CONNECTION_RETRIES;

    this.socketOpen = false;

    this._reconnect();

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this._connectionRetriesLeft = CONNECTION_RETRIES;
        this._reconnect();
      }
    });
  }

  _reconnect() {
    this.socketOpen = false;

    if (this._connectionRetriesLeft <= 0) {
      for (const listener of this._errorListeners) {
        listener('cannot connect to the server, try again later');
      }
      return;
    }

    this._connectionRetriesLeft -= 1;

    this._socket = new WebSocket(this._url);

    this._socket.onopen = () => {
      console.debug('socket open');

      // To clear any prior errors
      for (const listener of this._errorListeners) {
        listener(null);
      }

      this.socketOpen = true;
      this._connectionRetriesLeft = CONNECTION_RETRIES;

      this.send({ doReplyWithData: true });

      this._timeStatusCheck();
    };

    this._socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.echo) {
        this._messagesAwaitingResponse.delete(data.echo);
      }

      if (data.status !== 'success') {
        console.error('failure message from socket', data);
        return;
      }

      console.debug('data from socket', data);

      for (const listener of this._messageListeners) {
        listener(data);
      }

      this._timeStatusCheck();
    };

    this._socket.onerror = (event) => {
      console.error('socket error', event);

      this.socketOpen = false;

      this._reconnect();
    }

    this._timeStatusCheck();
  }

  _timeStatusCheck() {
    clearInterval(this._statusCheck);

    this._statusCheck = setTimeout(() => {
      if (this._socket.readyState !== WebSocket.OPEN) {
        this._reconnect()
        return;
      }

      const currentTime = new Date().valueOf();
      for (const { sentAt } of this._messagesAwaitingResponse.values()) {
        if (currentTime - sentAt > CONNECTION_TIMEOUT_MS) {
          console.error('timeout, message got no response');
          this._reconnect();
        }
      }

      console.debug('no timeout')

      this.send();

      this._timeStatusCheck();
    }, 5000);
  }

  send(message) {
    this._echo += 1;

    const payload = {
      ...message,
      echo: this._echo,
      token: this._token,
    };

    console.debug('sending to socket', payload);

    this._socket.send(JSON.stringify(payload));

    this._messagesAwaitingResponse.set(this._echo, { sentAt: new Date().valueOf(), message });
  }

  listen(callback) {
    this._messageListeners.push(callback);
  }

  onError(callback) {
    this._errorListeners.push(callback);
  }
}
