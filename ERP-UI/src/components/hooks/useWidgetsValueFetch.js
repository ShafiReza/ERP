import { useState, useEffect } from "react";

const useWidgetsValueFetch = (end_point, searchCriteria) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(
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
      .then((res) => {
        if (res.ok)
          res.json().then((result) => {
            setData(result);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [end_point, searchCriteria]);

  return [data];
};

export default useWidgetsValueFetch;
