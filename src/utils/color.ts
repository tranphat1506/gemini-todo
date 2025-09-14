export function getContrastColor(hexColor: string): string {
  // Chuẩn hóa màu: #RGB -> #RRGGBB
  if (!hexColor) return "#000000";
  let hex = hexColor.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (hex.length !== 6) return "#000000"; // fallback

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Tính độ sáng theo công thức WCAG
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 180 ? "#000000" : "#ffffff";
}
