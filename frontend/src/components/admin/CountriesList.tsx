import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Trash, Plus } from "lucide-react";
import { Country } from "@/lib/types";
import { toast } from "sonner";
import apiClient from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";

interface CountriesListProps {
  countries: Country[];
}

const CountriesList: React.FC<CountriesListProps> = ({
  countries: initialCountries,
}) => {
  const [countries, setCountries] = useState<Country[]>(initialCountries);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [countryName, setCountryName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCountry = () => {
    setEditingCountry(null);
    setCountryName("");
    setCountryCode("");
    setIsDialogOpen(true);
  };

  const handleEditCountry = (country: Country) => {
    setEditingCountry(country);
    setCountryName(country.name);
    setCountryCode(country.code || "");
    setIsDialogOpen(true);
  };

  const handleDeleteCountry = async (id: string) => {
    try {
      const response = await apiClient.deleteCountry(parseInt(id));

      if (response.success) {
        setCountries(countries.filter((country) => country.id !== id));
        toast.success("Country deleted successfully");
      } else {
        toast.error(response.error || "Failed to delete country");
      }
    } catch (err) {
      console.error("Error deleting country:", err);
      toast.error("An error occurred while deleting the country");
    }
  };

  const handleSaveCountry = async () => {
    if (!countryName.trim()) {
      toast.error("Country name is required");
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingCountry) {
        // Update existing country
        const response = await apiClient.updateCountry(
          parseInt(editingCountry.id),
          countryName,
          countryCode
        );

        if (response.success) {
          setCountries(
            countries.map((country) =>
              country.id === editingCountry.id
                ? { ...country, name: countryName, code: countryCode }
                : country
            )
          );
          toast.success("Country updated successfully");
        } else {
          toast.error(response.error || "Failed to update country");
        }
      } else {
        // Add new country
        const response = await apiClient.createCountry(
          countryName,
          countryCode
        );

        if (response.success) {
          const newCountry: Country = {
            id: response.data.id.toString(),
            name: response.data.name,
            code: response.data.code,
          };
          setCountries([...countries, newCountry]);
          toast.success("Country added successfully");
        } else {
          toast.error(response.error || "Failed to create country");
        }
      }
    } catch (err) {
      console.error("Error saving country:", err);
      toast.error("An error occurred while saving the country");
    } finally {
      setIsSubmitting(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Countries</h2>
        <Button onClick={handleAddCountry}>
          <Plus className="h-4 w-4 mr-2" /> Add Country
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Country Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {countries.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center py-8 text-muted-foreground"
              >
                No countries found
              </TableCell>
            </TableRow>
          ) : (
            countries.map((country) => (
              <TableRow key={country.id}>
                <TableCell>{country.name}</TableCell>
                <TableCell>{country.code || "-"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditCountry(country)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteCountry(country.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCountry ? "Edit Country" : "Add Country"}
            </DialogTitle>
            <DialogDescription>
              {editingCountry
                ? "Update the country details below."
                : "Enter the details for the new country."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="countryName">Country Name</Label>
              <Input
                id="countryName"
                value={countryName}
                onChange={(e) => setCountryName(e.target.value)}
                placeholder="Enter country name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="countryCode">Country Code (optional)</Label>
              <Input
                id="countryCode"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                placeholder="e.g. US, CA, UK"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCountry} disabled={isSubmitting}>
              {isSubmitting ? <Spinner className="h-4 w-4 mr-2" /> : null}
              {editingCountry ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CountriesList;
