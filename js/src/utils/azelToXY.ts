/**
 * Return the polar coordinates in a circle using the current azimuth and elevation
 */
const azelToXY = (
  centerX: number,
  centerY: number,
  radius: number,
  azimuth: number | null,
  elevation: number | null,
): { x: number | null; y: number | null } => {
  if (!azimuth || !elevation || azimuth < 0 || elevation < 0) {
    return {
      x: null,
      y: null,
    };
  }

  // Convert to radian
  const az = (azimuth * Math.PI) / 180;
  const el = (elevation * Math.PI) / 180;

  const rel = radius - (2 * radius * el) / Math.PI;

  // Return X and Y positions
  return {
    x: centerX + rel * Math.sin(az),
    y: centerY - rel * Math.cos(az),
  };
};

export default azelToXY;
