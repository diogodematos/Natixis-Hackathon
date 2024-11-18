"use client"

import { useState } from "react";

export default function AddItemPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    donation_type: "",
    image: null as File | null,
    status: "available",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files[0] && e.target.files[0].type.indexOf("image/") === -1) {
        // Check the image size
        if (e.target.files[0].size > 5 * 1024 * 1024) {
          alert("The image must be at most 5MB");
          return;
        }
        setFormData((prev) => ({
          ...prev,
          image: e.target.files ? e.target.files[0] : null, // Save the image file
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
    };

    // Send data to the API
    const response = await fetch("/api/items", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      alert("Item added successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        donation_type: "",
        image: null,
        status: "available",
      });
    } else {
      const error = await response.json();
      alert("Error adding item: " + error.message);
    }
  };

  return (
	<div className="max-w-xl mx-auto mt-10 bg-blue-50 rounded-[31px] p-6 shadow-lg"> {/* Alterando cor de fundo */}
	  <h1 className="text-2xl font-bold mb-6 text-gray-800">ADD ITEM TO THE SHELF</h1>
	  <form onSubmit={handleSubmit} className="space-y-4">
		{/* Title */}
		<div>
		  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
			Title
		  </label>
		  <input
			type="text"
			id="title"
			name="title"
			value={formData.title}
			onChange={handleChange}
			required
			className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59247A]"
		  />
		</div>
  
		{/* Description */}
		<div>
		  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
			Description
		  </label>
		  <textarea
			id="description"
			name="description"
			value={formData.description}
			onChange={handleChange}
			className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59247A]"
		  />
		</div>
  
		{/* Category */}
		<div>
		  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
			Category
		  </label>
		  <select
			id="category"
			name="category"
			value={formData.category}
			onChange={handleChange}
			required
			className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
		  >
			<option value="" disabled>
			  Select a category
			</option>
			<option value="Electronics">Electronics</option>
			<option value="Baby items">Baby Items</option>
			<option value="Books">Books</option>
			<option value="Toys">Toys</option>
			<option value="Furniture">Furniture</option>
			<option value="Tools">Tools</option>
			<option value="Sports Equipment">Sports Equipment</option>
		  </select>
		</div>
  
		{/* Donation Type */}
		<div>
		  <label htmlFor="donation_type" className="block text-sm font-medium text-gray-700">
			Donation Type
		  </label>
		  <select
			id="donation_type"
			name="donation_type"
			value={formData.donation_type}
			onChange={handleChange}
			required
			className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59247A]"
		  >
			<option value="" disabled>
			  Select the type of donation
			</option>
			<option value="Lend">Lend</option>
			<option value="Donate">Donate</option>
		  </select>
		</div>
  
		{/* Image */}
		<div>
  <label htmlFor="image" className="block text-sm font-medium text-gray-700">
    Image
  </label>
  <input
    type="file"
    id="image"
    name="image"
    accept="image/*"
    onChange={handleFileChange}
    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
  />
</div>
  
		{/* Submit Button */}
		<div className="flex justify-center">
  <button
    type="submit"
    className="px-10 py-3 bg-[#59247A] rounded-[70px] text-white shadow-md transition-all duration-300 hover:bg-[#9C5AC6] focus:outline-none focus:ring-2 focus:ring-blue-300"
  >
    SUBMIT ITEM
  </button>
</div>
	  </form>
	</div>
  );
}  