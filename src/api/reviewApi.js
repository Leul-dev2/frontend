export async function getPendingReviews() {
  const response = await fetch("/api/reviews/pending");
  if (!response.ok) throw new Error("Failed to fetch pending reviews");
  return response.json(); // array of reviews
}
