import React, { useState, useEffect } from "react";
import StatesList from "@/components/admin/StatesList";
import apiClient from "@/lib/api";
import { Country, State } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";

const States = () => {
  const [states, setStates] = useState<State[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch both states and countries
        const [statesRes, countriesRes] = await Promise.all([
          apiClient.getAllStates(),
          apiClient.getAllCountries(),
        ]);

        // Transform API data to match our frontend types
        const transformedStates = statesRes.data.map((state: any) => {
          // Add null/undefined checks
          return {
            id: state?.id ? state.id.toString() : "0",
            name: state?.name || "Unknown",
            countryId: state?.country_id ? state.country_id.toString() : "0",
            code: state?.code || "",
          };
        });

        const transformedCountries = countriesRes.data.map((country: any) => {
          // Add null/undefined checks
          return {
            id: country?.id ? country.id.toString() : "0",
            name: country?.name || "Unknown",
            code: country?.code || "",
          };
        });

        setStates(transformedStates);
        setCountries(transformedCountries);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      <h1 className="text-2xl font-bold mb-6">Manage States</h1>
      <StatesList states={states} countries={countries} />
    </div>
  );
};

export default States;
