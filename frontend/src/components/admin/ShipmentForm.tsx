import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import apiClient from "@/lib/api";
import { Country, State } from "@/lib/types";

const ShipmentForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data
  const [originCountryId, setOriginCountryId] = useState("");
  const [originStateId, setOriginStateId] = useState("");
  const [originAddress, setOriginAddress] = useState("");
  const [destinationCountryId, setDestinationCountryId] = useState("");
  const [destinationStateId, setDestinationStateId] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");

  // Reference data
  const [countries, setCountries] = useState<Country[]>([]);
  const [allStates, setAllStates] = useState<State[]>([]);

  // State variables to store the filtered states
  const [originStates, setOriginStates] = useState<State[]>([]);
  const [destinationStates, setDestinationStates] = useState<State[]>([]);

  // Add debugging logs
  useEffect(() => {
    console.log("Origin country ID:", originCountryId);
    console.log("Available states:", allStates);
    console.log("Filtered origin states:", originStates);
  }, [originCountryId, allStates, originStates]);

  useEffect(() => {
    console.log("Destination country ID:", destinationCountryId);
    console.log("Filtered destination states:", destinationStates);
  }, [destinationCountryId, destinationStates]);

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        setLoading(true);
        const [countriesRes, statesRes] = await Promise.all([
          apiClient.getAllCountries(),
          apiClient.getAllStates(),
        ]);

        setCountries(countriesRes.data);
        setAllStates(statesRes.data);
      } catch (err) {
        console.error("Error fetching reference data:", err);
        setError("Failed to load countries and states. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReferenceData();
  }, []);

  // Add this useEffect to load states when a country is selected
  useEffect(() => {
    const loadStatesForCountry = async (countryId: string) => {
      if (!countryId) return;

      try {
        console.log(`Loading states for country ID: ${countryId}`);
        const response = await apiClient.getStatesByCountry(countryId);

        if (response.success) {
          console.log(`States loaded for country ${countryId}:`, response.data);
          // Update the filtered states based on the selected country
          const countryStates = response.data.map((state: any) => ({
            id: state.id.toString(),
            name: state.name,
            countryId: state.country_id.toString(),
            code: state.code || "",
          }));

          // Update the appropriate state list based on which country changed
          if (countryId === originCountryId) {
            console.log("Updating origin states:", countryStates);
            setOriginStates(countryStates);
          } else if (countryId === destinationCountryId) {
            console.log("Updating destination states:", countryStates);
            setDestinationStates(countryStates);
          }
        } else {
          console.error("Failed to load states:", response.error);
        }
      } catch (err) {
        console.error(`Error loading states for country ${countryId}:`, err);
      }
    };

    // When origin country changes, load its states
    if (originCountryId) {
      loadStatesForCountry(originCountryId);
    }

    // When destination country changes, load its states
    if (destinationCountryId) {
      loadStatesForCountry(destinationCountryId);
    }
  }, [originCountryId, destinationCountryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !originCountryId ||
      !originStateId ||
      !originAddress ||
      !destinationCountryId ||
      !destinationStateId ||
      !destinationAddress
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await apiClient.createShipment({
        origin_country_id: parseInt(originCountryId),
        origin_state_id: parseInt(originStateId),
        origin_address: originAddress,
        destination_country_id: parseInt(destinationCountryId),
        destination_state_id: parseInt(destinationStateId),
        destination_address: destinationAddress,
        estimated_delivery: estimatedDelivery || undefined,
      });

      if (response.success) {
        navigate("/admin/shipments");
      } else {
        setError(response.error || "Failed to create shipment");
      }
    } catch (err) {
      console.error("Error creating shipment:", err);
      setError("An error occurred while creating the shipment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Shipment</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Origin Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="originCountry">Country</Label>
                  <Select
                    value={originCountryId}
                    onValueChange={(value) => {
                      console.log("Selected origin country:", value);
                      setOriginCountryId(value);
                      // Reset state when country changes
                      setOriginStateId("");
                    }}
                  >
                    <SelectTrigger id="originCountry">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem
                          key={country.id}
                          value={country.id.toString()}
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originState">State/Province</Label>
                  <Select
                    value={originStateId}
                    onValueChange={(value) => {
                      console.log("Selected origin state:", value);
                      setOriginStateId(value);
                    }}
                    disabled={!originCountryId}
                  >
                    <SelectTrigger id="originState">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {originStates.length > 0 ? (
                        originStates.map((state) => (
                          <SelectItem
                            key={state.id}
                            value={state.id.toString()}
                          >
                            {state.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-states" disabled>
                          No states available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="originAddress">Address</Label>
                <Textarea
                  id="originAddress"
                  value={originAddress}
                  onChange={(e) => setOriginAddress(e.target.value)}
                  placeholder="Enter full address"
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Destination Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destinationCountry">Country</Label>
                  <Select
                    value={destinationCountryId}
                    onValueChange={(value) => {
                      console.log("Selected destination country:", value);
                      setDestinationCountryId(value);
                      // Reset state when country changes
                      setDestinationStateId("");
                    }}
                  >
                    <SelectTrigger id="destinationCountry">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem
                          key={country.id}
                          value={country.id.toString()}
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destinationState">State/Province</Label>
                  <Select
                    value={destinationStateId}
                    onValueChange={(value) => {
                      console.log("Selected destination state:", value);
                      setDestinationStateId(value);
                    }}
                    disabled={!destinationCountryId}
                  >
                    <SelectTrigger id="destinationState">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinationStates.length > 0 ? (
                        destinationStates.map((state) => (
                          <SelectItem
                            key={state.id}
                            value={state.id.toString()}
                          >
                            {state.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-states" disabled>
                          No states available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destinationAddress">Address</Label>
                <Textarea
                  id="destinationAddress"
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  placeholder="Enter full address"
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedDelivery">Estimated Delivery Date</Label>
              <Input
                id="estimatedDelivery"
                type="date"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/shipments")}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Spinner size="sm" className="mr-2" /> : null}
                Create Shipment
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ShipmentForm;
