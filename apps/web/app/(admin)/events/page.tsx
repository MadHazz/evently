"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../../lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Plus } from "lucide-react";

export default function EventsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get("/event");
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Events</h2>
          <p className="text-muted-foreground mt-2">
            Manage your physical events, dates, and ticket tiers.
          </p>
        </div>
        <Link href="/events/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <CalendarDays className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No events created</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
              You haven&apos;t created any events yet. Start by creating your
              first event to start selling tickets.
            </p>
            <Link href="/events/new">
              <Button>Create Event</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card
              key={event.id}
              className="flex flex-col hover:border-black transition-colors"
            >
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-sm font-medium mt-2">
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {event.status}
                  </span>
                </div>
                <div className="text-sm font-medium mt-2">
                  <span className="text-muted-foreground">Location:</span>{" "}
                  {event.location}
                </div>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                <Link href={`/events/${event.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    Manage Event
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Just for the empty state icon
import { CalendarDays } from "lucide-react";
