const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const dd = String(date.getDate()).padStart(2, "0")
  const mm = months[date.getMonth()]
  const yyyy = date.getFullYear()
  return `${dd} ${mm} ${yyyy}`
}

export const formatTime = (dateStr) => {
  if (!dateStr) return "-"
  const date = new Date(dateStr)
  let h = date.getHours()
  const m = date.getMinutes()
  const ampm = h >= 12 ? "PM" : "AM"
  h = h % 12 || 12
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`
}