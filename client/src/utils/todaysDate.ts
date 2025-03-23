export default function todaysDate() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const day = String(today.getDate()).padStart(2, "0");
  const formattedToday = `${currentYear}-${month}-${day}`;

  return formattedToday;
}
