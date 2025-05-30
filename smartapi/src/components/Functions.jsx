import axios from "axios";

export const register = async (formdata) => {
  const res = await fetch("http://localhost:8000/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formdata),
  });
  const data = await res.json();
  if (res.ok) {
    return { status: true };
  } else {
    return { status: false, error: data.error };
  }
};

export const login = async (formdata) => {
  const res = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formdata),
  });

  const data = await res.json();
  console.log(data);

  const response = await fetch("http://localhost:8000/trade/start-feed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: formdata.email }),
  });

  if (res.ok && data.access_token) {
    sessionStorage.setItem("access_token", data.access_token);
    sessionStorage.setItem("email", formdata.email);
    return { status: true };
  } else {
    console.error("Login failed", data.error);
    return { status: false, error: data.error };
  }
  // return data;
};
