import { useRef, useState } from 'react';

function useWebsocket() {
  const [opened, setOpened] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isOpening, setIsOpening] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const websocket = useRef(null);

  /**
   * @param {MessageEvent} event
   */
  const handleMessage = (event) => {
    const receivedMessage = JSON.parse(event.data);
    if (receivedMessage?.Status && receivedMessage.Status !== 200) {
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
    websocket.current.send('ok');
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
    websocket.current.close();
    setIsClosing(true);
  };

  /**
   * @param {String} baseUrl
   * @param {Number} catNbr
   * @param {{ lat: Number, lng: Number, alt: Number }} location
   */
  const openConnection = (baseUrl, catNbr, location) => {
    const url = new URL(baseUrl);
    url.searchParams.append('catnbr', catNbr);
    Object.keys(location).forEach((item) => {
      url.searchParams.append(item, location[item]);
    });

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
