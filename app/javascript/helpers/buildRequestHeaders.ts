const buildRequestHeaders = (authenticityToken: string, contentType: string = 'application/json') => ({
  Accept: 'application/json',
  'Content-Type': contentType,
  'X-CSRF-Token': authenticityToken,
});

export default buildRequestHeaders;