"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../../lib/api";
import { useAuthStore } from "../../../store/auth";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Register User
      const authRes = await api.post("/auth/register", { email, password });
      const { accessToken, user } = authRes.data;

      // Temporarily set token so the Org creation request works
      setAuth(accessToken, { id: user.id, email: user.email });

      // 2. Create Organization automatically
      const slug =
        orgName.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
        "-" +
        Math.floor(Math.random() * 1000);
      await api.post("/org", { name: orgName, slug });

      // 3. Navigate home
      router.push("/dashboard");
    } catch (err: unknown) {
      const errorResponse = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        errorResponse.response?.data?.message ||
          "Failed to register. Email may already be in use.",
      );
      // Clear token if Org creation failed midway
      useAuthStore.getState().logout();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Setup your Evently Organizer account.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@mycompany.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="pt-4 pb-2 border-b"></div>
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input
              id="orgName"
              placeholder="Acme Events Ltd."
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Setting up..." : "Register & Create Organization"}
          </Button>
          <div className="text-sm text-center text-muted-foreground mt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
