const BASE_URL = "http://localhost:5003";

export async function submitAssessment(data) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/assessment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
}
