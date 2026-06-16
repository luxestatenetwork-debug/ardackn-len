import React, { useState } from "react";
import { addListing } from "../../store/listingStore";

const ListingCreateForm = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!country || !city) {
      setError("Please fill in the required Country and City fields.");
      return;
    }
    const listing = {
      title,
      price: Number(price),
      description,
      country,
      city,
      region,
      address,
      location: [city, region, country].filter(Boolean).join(", "),
    };
    const result = await addListing(listing);
    if (result.success) {
      alert("İlan başarıyla eklendi!");
      // Reset form
      setTitle("");
      setPrice("");
      setDescription("");
      setCountry("");
      setCity("");
      setRegion("");
      setAddress("");
    } else {
      setError("İlan eklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border rounded p-2 w-full"
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border rounded p-2 w-full"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border rounded p-2 w-full"
        required
      />
      
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Country *"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="City *"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
      </div>

      <input
        type="text"
        placeholder="Region / State (Optional)"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        className="border rounded p-2 w-full"
      />

      <input
        type="text"
        placeholder="Address (Optional)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="border rounded p-2 w-full"
      />

      {error && <p className="text-red-600">{error}</p>}
      <button type="submit" className="bg-gold-600 text-black py-2 px-4 rounded">
        Add Listing
      </button>
    </form>
  );
};

export default ListingCreateForm;
