const fetchIndianAPI = async (endpoint) => {
  const response = await fetch(`https://stock.indianapi.in/${endpoint}`, {
    method: "GET",
    headers: {
      "x-api-key": process.env.INDIAN_API_KEY,
    },
  });

  return response.json();
};

export default fetchIndianAPI;