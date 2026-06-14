import React, { useState } from "react";
import ProjectMap from "../../components/maps/ProjectMap";
import { addListing } from "../../store/listingStore";

const ListingCreateForm = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({ lat: null, lng: null, address: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!location.lat || !location.lng || !location.address) {
      setError("Lütfen geçerli bir konum seçiniz.");
      return;
    }
    const listing = {
      title,
      price: Number(price),
      description,
      location,
    };
    const result = await addListing(listing);
    if (result.success) {
      alert("İlan başarıyla eklendi!");
      // Reset form
      setTitle("");
      setPrice("");
      setDescription("");
      setLocation({ lat: null, lng: null, address: "" });
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
      <ProjectMap onLocationSelect={setLocation} />
      {error && <p className="text-red-600">{error}</p>}
      <button type="submit" className="bg-gold-600 text-black py-2 px-4 rounded">
        Add Listing
      </button>
    </form>
  );
};

export default ListingCreateForm;
