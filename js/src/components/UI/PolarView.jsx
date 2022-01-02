import { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import azelToXY from '../../utils/azelToXY';

function PolarView({ azimuth, elevation }) {
  const canvasRef = useRef(null);

  const draw = useCallback(
    (canvas) => {
      const ctx = canvas.getContext('2d');
      ctx.font = '12px sans-serif';
      const { height } = canvas.getBoundingClientRect();
      const { width } = canvas.getBoundingClientRect();
      const centerX = width / 2;
      const centerY = height / 2;
      const offset = 15;
      const circleRadius = width / 2 - offset;

      const { x, y } = azelToXY(
        centerX,
        centerY,
        circleRadius,
        azimuth,
        elevation,
      );

      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = '#00000066';

      // Draw circles
      ctx.beginPath();
      ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX, centerY, width / 3.3, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX, centerY, width / 6.6, 0, 2 * Math.PI);
      ctx.stroke();
      // Draw lines
      ctx.beginPath();
      ctx.moveTo(centerX, offset);
      ctx.lineTo(centerX, height - offset);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(15, centerY);
      ctx.lineTo(width - offset, centerY);
      ctx.stroke();
      // Draw N/S/E/W
      ctx.fillStyle = '#00000099';
      ctx.beginPath();
      ctx.fillText('N', centerX - 4, offset - 5);
      ctx.beginPath();
      ctx.fillText('S', centerX - 4, height - 1);
      ctx.beginPath();
      ctx.fillText('E', width - offset + 5, centerY + 4);
      ctx.beginPath();
      ctx.fillText('W', 0, centerY + 5);
      // Draw satellite position
      ctx.fillStyle = '#FF5500';
      if (x !== null || y !== null) {
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    },
    [azimuth, elevation],
  );

  useEffect(() => {
    if (canvasRef.current) {
      draw(canvasRef.current);
    }
  }, [canvasRef, draw]);

  return (
    <div className="w-100 text-center">
      <canvas className="mb-3" height="320" width="320" ref={canvasRef} />
    </div>
  );
}

PolarView.propTypes = {
  azimuth: PropTypes.number,
  elevation: PropTypes.number,
};

PolarView.defaultProps = {
  azimuth: null,
  elevation: null,
};

export default PolarView;
