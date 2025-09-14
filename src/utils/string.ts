export const getFirstName = (fullName: string | null) => {
  if (!fullName) return "Guest";
  return fullName.split(" ")[0];
};

export function mergeDateTime(date: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const merged = new Date(date);
  merged.setHours(hours || 0, minutes || 0, 0, 0);
  return merged;
}
