const API_ORIGIN = 'http://localhost:3000';

export function getImageUrl(image, placeholder) {
  const imagePath = typeof image === 'object' && image !== null
    ? image.url
    : image;

  if (typeof imagePath !== 'string' || !imagePath) {
    return placeholder;
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  return `${API_ORIGIN}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}
