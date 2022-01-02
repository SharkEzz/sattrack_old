/**
 * Return the polar coordinates in a circle using the current azimuth and elevation
 *
 * @param {Number} centerX Polar view circle center X position
 * @param {Number} centerY Polar view circle center Y position
 * @param {Number} radius Polar view circle radius
 * @param {Number} azimuth Current azimuth (in deg)
 * @param {Number} elevation Current elevation (in deg)
 * @returns {{x: Number, y: Number}} The polar coordinates of the tracked element
 */
 const azelToXY = (centerX, centerY, radius, azimuth, elevation) => {
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
  
    // Compute X and Y positions
    const x = centerX + rel * Math.sin(az);
    const y = centerY - rel * Math.cos(az);
  
    return {
      x,
      y,
    };
  };
  
  export default azelToXY;