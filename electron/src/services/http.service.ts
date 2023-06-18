export const postData = (url: string, body: any, headers = {}) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
}