

export async function submitAssessment(data) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${import.meta.env.BACKEND_BASEURL}/api/assessment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
}
