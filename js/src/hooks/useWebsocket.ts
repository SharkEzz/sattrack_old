import { useRef, useState } from 'react';
import { APIResponse, TrackingResponse } from '../types/api';

export type WebsocketErrorType = {
  status: number | null;
  message: string | null;
};

export type OpenConnectionFnType = (wsUrl: string) => void;

export type CloseConnectionFnType = () => void;

function useWebsocket() {
  const [opened, setOpened] = useState(false);
  const [message, setMessage] = useState<APIResponse<TrackingResponse>>();
  const [error, setError] = useState<WebsocketErrorType | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const websocket = useRef<WebSocket>();

  /**
   * @param {MessageEvent} event
   */
  const handleMessage = (event: MessageEvent<string>) => {
    const receivedMessage: APIResponse<TrackingResponse> = JSON.parse(
      event.data,
    );
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

  const openConnection = (wsUrl: string) => {
    websocket.current = new WebSocket(wsUrl);
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
