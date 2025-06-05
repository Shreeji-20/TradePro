import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLiveData } from "../slices/liveDataSlice";

export const useLiveData = () => {
  const dispatch = useDispatch();
  const liveDataRef = useRef({});
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const res = await fetch("http://localhost:8000/trade/websocketdata", {
          method: "GET",
          credentials: "include" ,
          headers: {
            "Content-Type": "application/json",
          },
        });

        const response = await res.json();
        
        if (res.ok && response.code == 200) {
          liveDataRef.current = response.data
          dispatch(setLiveData({ payload: liveDataRef.current }));
        }

        if (response.code == 300) {
          const response = await fetch(
            "http://localhost:8000/trade/start-feed",
            {
              method: "POST",
              credentials: "include" ,
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: localStorage.getItem("email") }),
            }
          );
        }
      } catch (err) {
        console.error("Error fetching live data:", err);
      }
    };

    const interval = setInterval(fetchLiveData, 500); // Fetch every second
    console.log("Started fetching live data");
    // return () => clearInterval(interval);
  }, []);
};
