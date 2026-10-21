import { useState } from "react";

const useHttp = () => {
  const [error, setError] = useState(null);

  const sendRequest = (url, method, body, onSuccess) => {
    fetch(process.env.REACT_APP_API_URL + url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        onSuccess(res);
      })
      .catch((err) => {
        setError(err);
      });
  };

  return [error, sendRequest];
};

export default useHttp;
