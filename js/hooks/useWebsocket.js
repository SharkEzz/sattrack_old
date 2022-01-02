import { useRef, useState } from 'react';

function useWebsocket() {
  const [opened, setOpened] = useState(false);
  const [message, setMessage] = useState(null);
  const websocket = useRef(null);

  /**
   * @param {MessageEvent} event
   */
  const handleMessage = (event) => {
    setMessage(JSON.parse(event.data));
    websocket.current.send('ok');
  };

  const handleClose = () => {
    setOpened(false);
  };

  const handleOpen = () => {
    setOpened(true);
  };

  const closeConnection = () => {
    websocket.current.close();
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
  };

  return {
    opened,
    message,
    openConnection,
    closeConnection,
  };
}

export default useWebsocket;
