import { useRef, useState } from 'react';

function useWebsocket() {
  const [opened, setOpened] = useState(false);
  const [message, setMessage] = useState(null);
  const websocketRef = useRef();

  /**
   * @param {MessageEvent} event
   */
  const handleMessage = (event) => {
    setMessage(JSON.parse(event.data));
  };

  const handleClose = () => {
    setOpened(false);
  };

  const handleOpen = () => {
    setOpened(true);
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

    const ws = new WebSocket(url);
    ws.onopen = handleOpen;
    ws.onmessage = handleMessage;
    ws.onclose = handleClose;

    websocketRef.current = ws;
  };

  const closeConnection = () => {
    websocketRef.current.close();
  };

  return {
    opened,
    message,
    openConnection,
    closeConnection,
  };
}

export default useWebsocket;
