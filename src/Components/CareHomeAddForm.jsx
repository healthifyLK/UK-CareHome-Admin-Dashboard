import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import locationsService from "../services/locationService";

// helpers
const isFilled = (v) =>
  v !== undefined && v !== null && String(v).trim() !== "";
const toInt = (v) => {
  if (!isFilled(v)) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

function CareHomeAddForm() {
  // Align with backend CreateLocationDto + keep a few UI helpers
  const initialFormState = {
    // backend required
    name: "",
    address: "",
    // backend optional
    city: "",
    postcode: "",
    phoneNumber: "",
    email: "",
    numberOfRooms: "",
    bedsPerRoom: "",
    capacity: "",
    isActive: true,
    // UI helpers
    tagName: "",
    // optional structured settings
    settings_note: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  // Helper to auto-calculate capacity
  const autoCalculateCapacity = (fields) => {
    const numRooms = toInt(fields.numberOfRooms);
    const bedsRoom = toInt(fields.bedsPerRoom);
    if (numRooms && bedsRoom) {
      return numRooms * bedsRoom;
    }
    return "";
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      // Auto-calculate capacity if numberOfRooms or bedsPerRoom changes
      if (name === "numberOfRooms" || name === "bedsPerRoom") {
        updated.capacity = autoCalculateCapacity(updated);
      }
      return updated;
    });
  };

  const validate = (f) => {
    const errs = {};
    if (!isFilled(f.name)) errs.name = "Name is required";
    if (!isFilled(f.address)) errs.address = "Address is required";
    if (isFilled(f.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
      errs.email = "Invalid email";
    if (isFilled(f.numberOfRooms) && !toInt(f.numberOfRooms))
      errs.numberOfRooms = "numberOfRooms must be numeric";
    if (isFilled(f.bedsPerRoom)) {
      const b = toInt(f.bedsPerRoom);
      if (!b) errs.bedsPerRoom = "bedsPerRoom must be numeric";
      else if (b < 1 || b > 26)
        errs.bedsPerRoom = "bedsPerRoom must be between 1 and 26";
    }
    if (isFilled(f.capacity) && !toInt(f.capacity))
      errs.capacity = "capacity must be numeric";
    return errs;
  };

  const buildPayload = (f) => {
    const payload = {
      name: f.name.trim(),
      address: f.address.trim(),
      city: isFilled(f.city) ? f.city.trim() : undefined,
      postcode: isFilled(f.postcode) ? f.postcode.trim() : undefined,
      phoneNumber: isFilled(f.phoneNumber) ? f.phoneNumber.trim() : undefined,
      email: isFilled(f.email) ? f.email.trim() : undefined,
      numberOfRooms: toInt(f.numberOfRooms),
      bedsPerRoom: toInt(f.bedsPerRoom),
      capacity: toInt(f.capacity),
      isActive: !!f.isActive,
      // Put extra UI-only fields into settings
      settings:
        isFilled(f.tagName) || isFilled(f.settings_note)
          ? {
              tagName: isFilled(f.tagName) ? f.tagName.trim() : undefined,
              note: isFilled(f.settings_note)
                ? f.settings_note.trim()
                : undefined,
            }
          : undefined,
    };
    return payload;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      Object.values(errs).forEach((m) => toast.error(m));
      return;
    }
    try {
      setSubmitting(true);
      const payload = buildPayload(form);
      await locationsService.createLocation(payload);
      toast.success("Care Home created");
      // setForm(initialFormState); // optional reset
    } catch (err) {
      const status = err?.status || err?.response?.status;
      toast.error(
        status
          ? `Failed (HTTP ${status})`
          : err?.message || "Failed to create care home"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onCancel = () => setForm(initialFormState);

  return (
    <>
      <ToastContainer />
      <form
        onSubmit={onSubmit}
        className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-6"
      >
        <h2 className="text-2xl font-semibold text-blue-600 mb-2">
          Add Care Home (Location)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col text-gray-700">
            Name*
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              className="mt-1 border border-gray-500 rounded px-3 py-2"
              required
            />
          </label>

          <label className="flex flex-col text-gray-700">
            Address* (street and number)
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={onChange}
              className="mt-1 border border-gray-500 rounded px-3 py-2"
              required
            />
          </label>

          <label className="flex flex-col text-gray-700">
            City
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={onChange}
              className="mt-1 border border-gray-500 rounded px-3 py-2"
            />
          </label>

          <label className="flex flex-col text-gray-700">
            Postcode
            <input
              type="text"
              name="postcode"
              value={form.postcode}
              onChange={onChange}
              className="mt-1 border border-gray-500 rounded px-3 py-2"
            />
          </label>

          <label className="flex flex-col text-gray-700">
            Phone Number
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={onChange}
              className="mt-1 border border-gray-500 rounded px-3 py-2"
            />
          </label>

          <label className="flex flex-col text-gray-700">
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className="mt-1 border border-gray-500 rounded px-3 py-2"
            />
          </label>

          <label className="flex flex-col text-gray-700">
            Number of Rooms
            <input
              type="number"
              min="1"
              name="numberOfRooms"
              value={form.numberOfRooms}
              onChange={onChange}
              className="mt-1 border border-gray-500 rounded px-3 py-2"
              placeholder="e.g. 20"
            />
          </label>

          <label className="flex flex-col text-gray-700">
            Beds Per Room (1-26)
            <input
              type="number"
              min="1"
              max="26"
              name="bedsPerRoom"
              value={form.bedsPerRoom}
              onChange={onChange}
              className="mt-1 border border-gray-500 rounded px-3 py-2"
              placeholder="e.g. 2"
            />
          </label>

          <label className="flex flex-col text-gray-700">
            Capacity 
            <input
              type="number"
              min="1"
              name="capacity"
              value={form.capacity}
              onChange={onChange}
              className="mt-1 border border-gray-500 rounded px-3 py-2"
              placeholder="If known"
            />
          </label>

          <label className="flex items-center gap-3 text-gray-700 mt-6">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={onChange}
              className="h-5 w-5"
            />
            <span>Active</span>
          </label>
        </div>

        <h3 className="text-lg font-semibold text-gray-700">
          Optional Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col text-gray-700">
            Tag/Identifier (optional)
            <input
              type="text"
              name="tagName"
              value={form.tagName}
              onChange={onChange}
              className="mt-1 border border-gray-500 rounded px-3 py-2"
              placeholder="Internal code"
            />
          </label>

          <label className="flex flex-col text-gray-700 md:col-span-2">
            Settings note (optional)
            <input
              type="text"
              name="settings_note"
              value={form.settings_note}
              onChange={onChange}
              className="mt-1 border border-gray-500 rounded px-3 py-2"
              placeholder="Any additional info"
            />
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Add"}
          </button>
          <button
            type="button"
            onClick={() => setForm(initialFormState)}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

export default CareHomeAddForm;
