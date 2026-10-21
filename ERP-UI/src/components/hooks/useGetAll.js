import { useState, useEffect } from "react";

const useGetAll = (end_point, searchCriteria = undefined, toggle = true) => {
  const [res, setRes] = useState({
    error: null,
    dataLoading: true,
    data: [],
  });

  useEffect(() => {
    async function fetchData() {
      setRes((prevState) => ({
        ...prevState,
        dataLoading: true,
        data: [],
      }));
      const response = await fetch(
        process.env.REACT_APP_API_URL +
          end_point +
          new URLSearchParams(searchCriteria),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((res) => res.json())
        .then((result) => {
          if (result.length) {
            return result;
          } else {
            return [];
          }
        })
        .catch((err) => {
          return [];
        });

      setRes((prevState) => ({
        ...prevState,
        dataLoading: false,
        error: null,
        data: response,
      }));
    }

    fetchData();
  }, [toggle, searchCriteria, end_point]);

  return [res];
};

export default useGetAll;
