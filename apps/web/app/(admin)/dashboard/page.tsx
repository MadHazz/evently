"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { CalendarDays, Ticket } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({ events: 0, ticketsSold: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // For MVP, we'll just fetch all events and sum up stats
        // A production app would have a dedicated `/stats` aggregation endpoint
        const { data: events } = await api.get("/event");

        const totalSold = 0;
        // We'd ideally need a new endpoint to get total tickets sold OR update the Event response
        // to include order sums. For now we will display the event count.

        setStats({
          events: events.length,
          ticketsSold: totalSold, // Placeholder until deeper aggregate logic is written
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Overview of your organization and active events.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.events}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active and Draft
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.ticketsSold}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all events
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
