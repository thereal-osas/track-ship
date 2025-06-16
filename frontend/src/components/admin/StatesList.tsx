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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Edit, Trash, Plus } from "lucide-react";
import { Country, State } from "@/lib/types";
import { toast } from "sonner";
import apiClient from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";

interface StatesListProps {
  states: State[];
  countries: Country[];
}

const StatesList: React.FC<StatesListProps> = ({
  states: initialStates,
  countries,
}) => {
  const [states, setStates] = useState<State[]>(initialStates);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingState, setEditingState] = useState<State | null>(null);
  const [stateName, setStateName] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [countryId, setCountryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterCountry, setFilterCountry] = useState("all");

  const handleAddState = () => {
    setEditingState(null);
    setStateName("");
    setStateCode("");
    setCountryId("");
    setIsDialogOpen(true);
  };

  const handleEditState = (state: State) => {
    setEditingState(state);
    setStateName(state.name);
    setStateCode(state.code || "");
    setCountryId(state.countryId);
    setIsDialogOpen(true);
  };

  const handleDeleteState = async (id: string) => {
    try {
      const response = await apiClient.deleteState(parseInt(id));

      if (response.success) {
        setStates(states.filter((state) => state.id !== id));
        toast.success("State deleted successfully");
      } else {
        toast.error(response.error || "Failed to delete state");
      }
    } catch (err) {
      console.error("Error deleting state:", err);
      toast.error("An error occurred while deleting the state");
    }
  };

  const handleSaveState = async () => {
    if (!stateName.trim()) {
      toast.error("State name is required");
      return;
    }

    if (!countryId) {
      toast.error("Country is required");
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingState) {
        // Update existing state
        const response = await apiClient.updateState(
          parseInt(editingState.id),
          stateName,
          parseInt(countryId),
          stateCode
        );

        if (response.success) {
          setStates(
            states.map((state) =>
              state.id === editingState.id
                ? {
                    ...state,
                    name: stateName,
                    countryId: countryId,
                    code: stateCode,
                  }
                : state
            )
          );
          toast.success("State updated successfully");
        } else {
          toast.error(response.error || "Failed to update state");
        }
      } else {
        // Add new state
        const response = await apiClient.createState(
          stateName,
          parseInt(countryId),
          stateCode
        );

        if (response.success) {
          const newState: State = {
            id: response.data.id.toString(),
            name: response.data.name,
            countryId: response.data.country_id.toString(),
            code: response.data.code,
          };
          setStates([...states, newState]);
          toast.success("State added successfully");
        } else {
          toast.error(response.error || "Failed to create state");
        }
      }
    } catch (err) {
      console.error("Error saving state:", err);
      toast.error("An error occurred while saving the state");
    } finally {
      setIsSubmitting(false);
      setIsDialogOpen(false);
    }
  };

  // Update the filter function to properly handle country filtering
  const handleFilterChange = async (countryId: string) => {
    setFilterCountry(countryId);

    if (countryId === "all") {
      // If "All Countries" is selected, load all states
      try {
        const response = await apiClient.getAllStates();
        if (response.success && Array.isArray(response.data)) {
          // Add null/undefined checks when mapping
          setStates(
            response.data.map((state: any) => ({
              id: state?.id ? state.id.toString() : "0",
              name: state?.name || "Unknown",
              countryId: state?.country_id ? state.country_id.toString() : "0",
              code: state?.code || "",
            }))
          );
        } else {
          console.error("Invalid response format:", response);
          toast.error("Failed to load states: Invalid response format");
        }
      } catch (err) {
        console.error("Error loading all states:", err);
        toast.error("Failed to load states");
      }
    } else {
      // If a specific country is selected, load states for that country
      try {
        const response = await apiClient.getStatesByCountry(countryId);
        if (response.success && Array.isArray(response.data)) {
          // Add null/undefined checks when mapping
          setStates(
            response.data.map((state: any) => ({
              id: state?.id ? state.id.toString() : "0",
              name: state?.name || "Unknown",
              countryId: state?.country_id ? state.country_id.toString() : "0",
              code: state?.code || "",
            }))
          );
        } else {
          console.error("Invalid response format:", response);
          toast.error("Failed to load states: Invalid response format");
        }
      } catch (err) {
        console.error(`Error loading states for country ${countryId}:`, err);
        toast.error("Failed to load states for the selected country");
      }
    }
  };

  // Filter states based on selected country
  const filteredStates =
    filterCountry === "all"
      ? states
      : states.filter((state) => state.countryId === filterCountry);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">States/Provinces</h2>
        <Button onClick={handleAddState}>
          <Plus className="h-4 w-4 mr-2" /> Add State
        </Button>
      </div>

      <div className="mb-4">
        <Label htmlFor="filterCountry" className="mr-2">
          Filter by Country:
        </Label>
        <Select value={filterCountry} onValueChange={handleFilterChange}>
          <SelectTrigger id="filterCountry" className="w-[200px]">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map((country) => (
              <SelectItem key={country.id} value={country.id}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>State/Province Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Country</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStates.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-8 text-muted-foreground"
              >
                No states found
              </TableCell>
            </TableRow>
          ) : (
            filteredStates.map((state) => (
              <TableRow key={state.id}>
                <TableCell>{state.name}</TableCell>
                <TableCell>{state.code || "-"}</TableCell>
                <TableCell>
                  {countries.find((c) => c.id === state.countryId)?.name ||
                    "Unknown"}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditState(state)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteState(state.id)}
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
              {editingState ? "Edit State/Province" : "Add State/Province"}
            </DialogTitle>
            <DialogDescription>
              {editingState
                ? "Update the state/province details below."
                : "Enter the details for the new state/province."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stateName">State/Province Name</Label>
              <Input
                id="stateName"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder="Enter state/province name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stateCode">State/Province Code (optional)</Label>
              <Input
                id="stateCode"
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                placeholder="e.g. CA, NY, TX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="countrySelect">Country</Label>
              <Select value={countryId} onValueChange={setCountryId}>
                <SelectTrigger id="countrySelect">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Button onClick={handleSaveState} disabled={isSubmitting}>
              {isSubmitting ? <Spinner className="h-4 w-4 mr-2" /> : null}
              {editingState ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StatesList;
