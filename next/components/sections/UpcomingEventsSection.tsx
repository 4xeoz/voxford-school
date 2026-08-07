import { getUpcomingEvents } from "@/actions/events";
import UpcomingEventsClient from "./UpcomingEventsClient";

interface UpcomingEventsSectionProps {
  locale: string;
}

export default async function UpcomingEventsSection({ locale }: UpcomingEventsSectionProps) {
  const events = await getUpcomingEvents(8);
  if (events.length === 0) return null;
  return <UpcomingEventsClient events={events} locale={locale} />;
}
