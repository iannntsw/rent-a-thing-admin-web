"use client";

import { useEffect, useState } from "react";
import CardDataStats from "@/components/CardDataStats";
import { getAllUsers } from "@/lib/api/user";
import { getAllBookings } from "@/lib/api/booking";
import { fetchAllListings } from "@/lib/api/listings";
import { Users, CalendarDays, Home } from "lucide-react";

export default function ECommerce() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalListings, setTotalListings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No access token found");
        setLoading(false);
        return;
      }

      try {
        const usersRes = await getAllUsers(token);
        const customers = usersRes?.filter((u: any) => u.userType === "CUSTOMER") || [];
        setTotalUsers(customers.length);

        const bookingsRes = await getAllBookings(token);
        console.log("bookingsRes", bookingsRes);
        setTotalBookings(bookingsRes?.length || 0);

        const listingsRes = await fetchAllListings();
        console.log("listingsRes", listingsRes);
        setTotalListings(listingsRes?.length || 0);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <CardDataStats title="Total Users" total={totalUsers.toString()} rate="" >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
      </CardDataStats>

      <CardDataStats title="Total Bookings" total={totalBookings.toString()} rate="" >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-left-right-icon lucide-arrow-left-right"><path d="M8 3 4 7l4 4" /><path d="M4 7h16" /><path d="m16 21 4-4-4-4" /><path d="M20 17H4" /></svg>      </CardDataStats>

      <CardDataStats title="Total Listings" total={totalListings.toString()} rate="" >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-notebook-tabs-icon lucide-notebook-tabs"><path d="M2 6h4" /><path d="M2 10h4" /><path d="M2 14h4" /><path d="M2 18h4" /><rect width="16" height="20" x="4" y="2" rx="2" /><path d="M15 2v20" /><path d="M15 7h5" /><path d="M15 12h5" /><path d="M15 17h5" /></svg>      </CardDataStats>
    </div>
  );
}
