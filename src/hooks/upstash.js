export const upstashSet = async (key, value) => {
  const response = await fetch(
    `${import.meta.env.VITE_UPSTASH_URL}/set/${key}/${value}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_UPSTASH_TOKEN}`,
      },
    }
  );

  const result = await response.json();
  return result;
};

export const upstashGet = async (key) => {
  const response = await fetch(
    `${import.meta.env.VITE_UPSTASH_URL}/get/${key}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_UPSTASH_TOKEN}`,
      },
    }
  );

  const result = await response.json();
  return result.result;
};
