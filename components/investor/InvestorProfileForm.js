'use client';
import React, { useState } from 'react';
import { updateInvestorProfile } from '../../store/userStore';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

/**
 * Simple profile form for investors to update their preferences.
 * Props:
 *   uid - current user uid (required)
 *   currentPrefs - object with existing preference fields (optional)
 */
export default function InvestorProfileForm({ uid, currentPrefs }) {
  const [preferences, setPreferences] = useState({
    location: currentPrefs.location || '',
    budget: currentPrefs.budget || '',
    projectType: currentPrefs.projectType || '',
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('saving');
    try {
      // Update only the investorProfile.preferences field in Firestore
      await updateInvestorProfile(uid, { preferences });
      setStatus('saved');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gold-500 mb-1" htmlFor="location">Location</label>
        <input
          id="location"
          name="location"
          type="text"
          value={preferences.location}
          onChange={handleChange}
          className="w-full bg-gray-800 text-white rounded p-2 focus:ring-2 focus:ring-gold-600"
        />
      </div>
      <div>
        <label className="block text-gold-500 mb-1" htmlFor="budget">Budget</label>
        <input
          id="budget"
          name="budget"
          type="text"
          value={preferences.budget}
          onChange={handleChange}
          className="w-full bg-gray-800 text-white rounded p-2 focus:ring-2 focus:ring-gold-600"
        />
      </div>
      <div>
        <label className="block text-gold-500 mb-1" htmlFor="projectType">Project Type</label>
        <select
          id="projectType"
          name="projectType"
          value={preferences.projectType}
          onChange={handleChange}
          className="w-full bg-gray-800 text-white rounded p-2 focus:ring-2 focus:ring-gold-600"
        >
          <option value="">Select…</option>
          <option value="Luxury Residential">Luxury Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Mixed Use">Mixed Use</option>
        </select>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-gold-600 text-black rounded hover:bg-gold-500 transition"
        disabled={status === 'saving'}
      >
        {status === 'saving' ? 'Saving…' : 'Save Preferences'}
      </button>
      {status === 'saved' && <p className="text-green-500 mt-2">Preferences saved!</p>}
      {status === 'error' && <p className="text-red-500 mt-2">Error saving preferences.</p>}
    </form>
  );
}
