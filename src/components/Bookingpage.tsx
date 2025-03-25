"use client";
import { useState, useEffect } from "react";

interface Car {
  _id: string;
  make: string;
  model: string;
  year: number;
  rentalPrice: number;
  available?: boolean;
}

interface Provider {
  _id: string;
  name: string;
  address: string;
  telephone: string;
}

export default function Booko({ token }: { token: string }) {
  const [carModel, setCarModel] = useState<string>("");
  const [providerId, setProviderId] = useState<string | null>(null);
  const [pickupDate, setPickupDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");
  const [carModels, setCarModels] = useState<string[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [bookingStatus, setBookingStatus] = useState<string>("");

  useEffect(() => {
    fetchCars();
    fetchProviders();
  }, []);

  async function fetchCars() {
    try {
      const response = await fetch("https://back-end-car.vercel.app/api/cars/search?available=true");
      const data: Car[] = await response.json();
      setCarModels([...new Set(data.map((car) => car.model))]);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  }

  async function fetchProviders() {
    try {
      const response = await fetch("https://back-end-car.vercel.app/api/users/providers");
      const data: Provider[] = await response.json();
      setProviders(data);
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "model") {
      setCarModel(value);
    } else if (name === "provider") {
      setProviderId(value);
    } else if (name === "pickupDate") {
      setPickupDate(value);
    } else if (name === "returnDate") {
      setReturnDate(value);
    }
  };

  function formatDate(dateStr: string): string {
    if (!dateStr) return "";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(new Date(dateStr));
  }

  const handleBooking = async () => {
    if (!carModel || !providerId || !pickupDate || !returnDate) {
      alert("Please fill in all fields before booking.");
      return;
    }

    // Convert dates to ensure returnDate is after pickupDate
    const pickDate = new Date(pickupDate);
    const retDate = new Date(returnDate);

    if (retDate < pickDate) {
      alert("Return Date must be after the Pick-Up Date.");
      return;
    }

    console.log({
      carModel,
      pickupDate: formatDate(pickupDate),
      returnDate: formatDate(returnDate),
      providerId
    });

    try {
      const response = await fetch("https://back-end-car.vercel.app/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          carModel,
          pickupDate,
          returnDate,
          providerId,
        }),
      });

      const result = await response.json();
      console.log("Booking result:", result);

      if (!response.ok) {
        setBookingStatus(result.message || "Failed to complete booking.");
        alert(result.message || "Failed to complete booking.");
      } else {
        setBookingStatus("Booking completed successfully!");
        alert("Booking completed successfully!");
        setCarModel("");
        setProviderId(null);
        setPickupDate("");
        setReturnDate("");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setBookingStatus("Failed to complete booking. Try again.");
      alert("Failed to complete booking. Try again.");
    }
  };

  return (
    <main className="w-[100%] flex flex-col items-center space-y-4">
      <div className="text-xl font-medium">New Reservation</div>

      <div className="w-fit space-y-2">
        <div>
          <label className="block text-gray-600">Car Model</label>
          <select name="model" value={carModel} onChange={handleChange} className="px-4 py-2 border rounded">
            <option value="">All Models</option>
            {carModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-600">Provider Name</label>
          <select
            name="provider"
            value={providerId || ""}
            onChange={handleChange}
            className="px-4 py-2 border rounded"
          >
            <option value="">All Providers</option>
            {providers.map((provider) => (
              <option key={provider._id} value={provider._id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-600">Pick-Up Date</label>
          <input
            className="border p-2 rounded"
            type="date"
            name="pickupDate"
            value={pickupDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-gray-600">Return Date</label>
          <input
            className="border p-2 rounded"
            type="date"
            name="returnDate"
            value={returnDate}
            onChange={handleChange}
          />
        </div>

        {/* Display readable formatted dates */}
        {pickupDate && <div>Pickup Date: {formatDate(pickupDate)}</div>}
        {returnDate && <div>Return Date: {formatDate(returnDate)}</div>}
      </div>

      <button
        className="block rounded-md bg-sky-600 hover:bg-indigo-600 px-3 py-2 text-white shadow"
        onClick={handleBooking}
      >
        Check Car Availability & Book
      </button>

      {bookingStatus && (
        <div className="mt-4 text-center text-xl">{bookingStatus}</div>
      )}
    </main>
  );
}
