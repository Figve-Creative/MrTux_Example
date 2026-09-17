const fmt = (d: Date) =>
  d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

export const formatDate = fmt;

export const rentalWindow = (eventDate?: string, rentalDays = 4) => {
  const base = eventDate ? new Date(`${eventDate}T12:00:00`) : new Date(Date.now() + 14 * 864e5);
  const from = new Date(base.getTime() - 3 * 864e5);
  const to = new Date(base.getTime() - 2 * 864e5);
  const returnBy = new Date(from.getTime() + rentalDays * 864e5);
  return {
    deliveryFrom: fmt(from),
    deliveryTo: fmt(to),
    returnBy: fmt(returnBy),
    returnByISO: returnBy.toISOString(),
  };
};

export const countdown = (isoDate: string) => {
  const ms = new Date(isoDate).getTime() - Date.now();
  if (ms <= 0) return "Return window closed";
  const days = Math.floor(ms / 864e5);
  const hours = Math.floor((ms % 864e5) / 36e5);
  const minutes = Math.floor((ms % 36e5) / 6e4);
  return `${days}d ${hours}h ${minutes}m`;
};
