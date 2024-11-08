export const commonAPI = async (method: string, url: string, body: any, headers: HeadersInit = {}): Promise<any> => {
  const response = await fetch(url, {
    method,
    body,
    headers: {
      'Accept': 'application/json',
      ...headers, // Spread any additional headers
    },
  });

  if (!response.ok) {
    const errorData = await response.json(); // Get error data if available
    throw new Error(errorData.message || 'Network response was not ok');
  }

  return response.json() ; // Assuming the response is JSON
};
