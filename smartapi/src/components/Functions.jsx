export const register = async (formdata) => {
  console.log("Form Data : ", formdata);
  const res = await fetch("http://localhost:8000/auth/signup", {
    credentials: "include",
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
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formdata),
  });

  const res2 = await fetch("http://localhost:8000/trade/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: formdata.email }),
  });

  await res2;
  if (!res2.ok) {
    console.error("Angel one account Login Failed");
  }

   const response = await fetch("http://localhost:8000/trade/start-feed", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: formdata.email }),
  });

  await response;
  if (!response.ok) {
    console.error("Failed to start websocket for live data");
  }

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("email", formdata.email);
    // useLiveData()
    return { status: true };
  } else {
    console.error("Login failed", data.error);
    return { status: false, error: data.error };
  }
};
