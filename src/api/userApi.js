export async function getUsersCount() {
  const response = await fetch("/api/users/count");
  if (!response.ok) throw new Error("Failed to fetch users count");
  return response.json(); // { count: number }
}
