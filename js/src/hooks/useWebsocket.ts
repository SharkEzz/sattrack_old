import { useRef, useState } from 'react';
import { APIResponse } from '../utils/types';
import { Location } from './useLocation';

export type WebsocketError = {
  status: number | null;
  message: string | null;
};

export type OpenConnectionFn = (
  baseurl: string,
  catnbr: number,
  location: Location,
) => void;

export type CloseConnectionFn = () => void;

function useWebsocket() {
  const [opened, setOpened] = useState(false);
  const [message, setMessage] = useState<APIResponse | null>(null);
  const [error, setError] = useState<WebsocketError | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const websocket = useRef<WebSocket>();

  /**
   * @param {MessageEvent} event
   */
  const handleMessage = (event: MessageEvent<string>) => {
    const receivedMessage: APIResponse = JSON.parse(event.data);
    if (receivedMessage.Status > 299 || receivedMessage.Status < 200) {
      setError({
        status: receivedMessage.Status,
        message: receivedMessage.Message,
      });
      return;
    }
    if (error) {
      setError(null);
    }
    setMessage(receivedMessage);
    websocket.current?.send('ok');
  };

  const handleClose = () => {
    setOpened(false);
    setIsClosing(false);
  };

  const handleOpen = () => {
    setOpened(true);
    setIsOpening(false);
  };

  const closeConnection = () => {
    websocket.current?.close();
    setIsClosing(true);
  };

  /**
   * @param {String} baseUrl
   * @param {Number} catNbr
   * @param {{ lat: Number, lng: Number, alt: Number }} location
   */
  const openConnection = (
    baseUrl: string,
    catNbr: number,
    location: Location,
  ) => {
    const url = new URL(baseUrl);
    url.searchParams.append('catnbr', String(catNbr));
    for (const [key, value] of Object.entries(location)) {
      url.searchParams.append(key, String(value));
    }

    websocket.current = new WebSocket(url);
    websocket.current.onclose = handleClose;
    websocket.current.onopen = handleOpen;
    websocket.current.onmessage = handleMessage;
    websocket.current.onerror = closeConnection;
    setIsOpening(true);
  };

  return {
    isOpening,
    isClosing,
    opened,
    message,
    error,
    openConnection,
    closeConnection,
  };
}

export default useWebsocket;
