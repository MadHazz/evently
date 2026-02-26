"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../lib/api";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [event, setEvent] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ticketTypes, setTicketTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New ticket state
  const [newTicketName, setNewTicketName] = useState("");
  const [newTicketPrice, setNewTicketPrice] = useState("");
  const [newTicketQuantity, setNewTicketQuantity] = useState("");
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);

  useEffect(() => {
    fetchEventDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const { data } = await api.get(`/event/${eventId}`);
      setEvent({
        id: data.id,
        title: data.title,
        description: data.description,
        location: data.location,
        status: data.status,
      });
      setTicketTypes(data.ticketTypes || []);
    } catch (err) {
      console.error("Failed to fetch event", err);
      router.push("/events");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingTicket(true);
    try {
      await api.post("/ticket/type", {
        eventId: event.id,
        name: newTicketName,
        price: Number(newTicketPrice),
        quantity: Number(newTicketQuantity),
      });

      // Refresh list and reset form
      setNewTicketName("");
      setNewTicketPrice("");
      setNewTicketQuantity("");
      await fetchEventDetails();
    } catch (err) {
      console.error("Failed to create ticket", err);
      alert("Error creating ticket type.");
    } finally {
      setIsCreatingTicket(false);
    }
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading event details...
      </div>
    );
  if (!event) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{event.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
              {event.status}
            </span>
            <span className="text-sm text-muted-foreground">|</span>
            <span className="text-sm text-muted-foreground">
              {event.location}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Ticket Types List */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Tiers</CardTitle>
            <CardDescription>
              Manage available tickets and inventory for this event.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ticketTypes.length === 0 ? (
              <div className="text-sm text-muted-foreground border-2 border-dashed rounded-lg p-6 text-center">
                No tickets created yet. Add one below to start selling.
              </div>
            ) : (
              <div className="space-y-4">
                {ticketTypes.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-semibold">{ticket.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {ticket.quantity} total capacity
                      </p>
                    </div>
                    <div className="font-medium">
                      ${Number(ticket.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Ticket Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Ticket Type</CardTitle>
            <CardDescription>
              Add a new pricing tier to the event.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleCreateTicket}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Ticket Name (e.g., General Admission)
                </Label>
                <Input
                  id="name"
                  value={newTicketName}
                  onChange={(e) => setNewTicketName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newTicketPrice}
                    onChange={(e) => setNewTicketPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity Available</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={newTicketQuantity}
                    onChange={(e) => setNewTicketQuantity(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <div className="p-6 pt-0 border-t mt-6 flex justify-end">
              <Button
                type="submit"
                disabled={isCreatingTicket}
                className="mt-6"
              >
                {isCreatingTicket ? "Creating..." : "Create Ticket"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
