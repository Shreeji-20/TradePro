import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLiveData } from "../slices/liveDataSlice";

export const useLiveData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const res = await fetch("http://localhost:8000/trade/websocketdata", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const response = await res.json();

        if (res.ok && response.code == 200) {
          dispatch(setLiveData({ payload: response.data }));
        }

        if (response.code == 300) {
          const response = await fetch(
            "http://localhost:8000/trade/start-feed",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: sessionStorage.getItem("email") }),
            }
          );
        }
      } catch (err) {
        console.error("Error fetching live data:", err);
      }
    };

    const interval = setInterval(fetchLiveData, 1000); // Fetch every second
    return () => clearInterval(interval);
  }, []);
};
