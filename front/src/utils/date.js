export function toLocalISO(d) {
  const YYYY = d.getFullYear();
  const MM   = String(d.getMonth()+1).padStart(2,'0');
  const DD   = String(d.getDate()).padStart(2,'0');
  const hh   = String(d.getHours()).padStart(2,'0');
  const mm   = String(d.getMinutes()).padStart(2,'0');
  return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;
}
