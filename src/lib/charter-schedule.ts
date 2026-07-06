export function getCharterSchedule(
  duration: "half-day" | "full-day",
  locale: "en" | "es",
): string {
  if (duration === "half-day") {
    return locale === "es"
      ? "9:00 AM – 1:00 PM o 1:30 PM – 5:30 PM"
      : "9:00 AM – 1:00 PM or 1:30 PM – 5:30 PM";
  }

  return "9:00 AM – 5:00 PM";
}

export function getCharterScheduleLabel(locale: "en" | "es"): string {
  return locale === "es" ? "Horario del charter" : "Charter times";
}
