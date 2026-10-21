import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const useFetch = () => {
  const [res, setRes] = useState({
    dataLoading: false,
    loading: false,
    data: [],
  });

  const sendHttpRequest = useCallback(
    async (url, method, body = null, action) => {
      setRes((prevState) => ({
        ...prevState,
        data: [],
        dataLoading: method === "GET" ? true : false,
        loading: true,
      }));

      try {
        const response = await fetch(process.env.REACT_APP_API_URL + url, {
          method: method,
          body: body ? JSON.stringify(body) : null,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          let promise = await response.json();
          // throw new Error(response.statusText);
          throw new Error(promise?.Message);
        }

        if (method === "GET") {
          let data = await response.json();

          setRes((prevState) => ({
            ...prevState,
            data: data,
          }));
        }

        if (method === "POST" || method === "PUT") {
          toast.success("Data saved Successfuly", {
            position: "bottom-right",
          });
        } else if (method === "DELETE") {
          toast.success("Data deleted Successfuly", {
            position: "bottom-right",
          });
        }

        if (action) {
          action();
        }
      } catch (error) {
        toast.error(error.message);
        if (action) {
          action();
        }
      } finally {
        setRes((prevState) => ({
          ...prevState,
          dataLoading: false,
          loading: false,
        }));
      }
    },
    []
  );
  return [res, sendHttpRequest];
};

export default useFetch;
