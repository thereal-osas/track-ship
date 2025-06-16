import React, { useState, useEffect } from "react";
import CountriesList from "@/components/admin/CountriesList";
import apiClient from "@/lib/api";
import { Country } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";

const Countries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getAllCountries();

        // Transform API data to match our frontend types if needed
        const transformedCountries = response.data.map((country: any) => ({
          id: country.id.toString(),
          name: country.name,
          code: country.code,
        }));

        setCountries(transformedCountries);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError("Failed to load countries. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Countries</h1>
      <CountriesList countries={countries} />
    </div>
  );
};

export default Countries;
