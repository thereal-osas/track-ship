import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Shipment, ShipmentStatus, Country, State } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import apiClient from "@/lib/api";

interface ShipmentsListProps {
  shipments: Shipment[];
  countries: Country[];
  states: State[];
  setShipments?: React.Dispatch<React.SetStateAction<Shipment[]>>;
}

const statusColors: Record<ShipmentStatus, string> = {
  Processing: "bg-blue-500",
  "In Transit": "bg-yellow-500",
  "Out for Delivery": "bg-purple-500",
  Delivered: "bg-green-500",
  Exception: "bg-red-500",
};

const ShipmentsList: React.FC<ShipmentsListProps> = ({
  shipments,
  countries,
  states,
  setShipments,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [shipmentToDelete, setShipmentToDelete] = useState<Shipment | null>(
    null
  );
  const [isStatusUpdateDialogOpen, setIsStatusUpdateDialogOpen] =
    useState(false);
  const [shipmentToUpdate, setShipmentToUpdate] = useState<Shipment | null>(
    null
  );
  const [newStatus, setNewStatus] = useState<ShipmentStatus>("Processing");
  const [statusLocation, setStatusLocation] = useState("");
  const [statusDescription, setStatusDescription] = useState("");
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!shipmentToDelete) return;

    try {
      const response = await apiClient.deleteShipment(
        parseInt(shipmentToDelete.id)
      );

      if (response.success) {
        toast({
          title: "Shipment deleted",
          description: `Shipment ${shipmentToDelete.trackingNumber} has been deleted.`,
        });

        // Remove from the list or refresh the page
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete shipment",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error deleting shipment:", err);
      toast({
        title: "Error",
        description: "An error occurred while deleting the shipment",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setShipmentToDelete(null);
    }
  };

  const handleStatusUpdate = async () => {
    if (!shipmentToUpdate) return;

    try {
      const response = await apiClient.updateShipmentStatus(
        parseInt(shipmentToUpdate.id),
        {
          status: newStatus,
          location: statusLocation,
          description: statusDescription,
        }
      );

      if (response.success) {
        toast({
          title: "Status updated",
          description: `Shipment ${shipmentToUpdate.trackingNumber} status updated to ${newStatus}`,
        });

        // Update the shipment in the list
        const updatedShipments = shipments.map((s) =>
          s.id === shipmentToUpdate.id ? { ...s, status: newStatus } : s
        );

        // Update the shipments list if setShipments is provided
        if (setShipments) {
          setShipments(updatedShipments);
        } else {
          // If no setShipments function is provided, refresh the page
          window.location.reload();
        }
      } else {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: response.error || "Failed to update shipment status",
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while updating the status",
      });
    } finally {
      setIsStatusUpdateDialogOpen(false);
      setShipmentToUpdate(null);
      setNewStatus("Processing");
      setStatusLocation("");
      setStatusDescription("");
    }
  };

  // Filter states based on selected country
  const filteredStates =
    selectedCountry === "all" || selectedCountry === ""
      ? states
      : states.filter((state) => {
          const country = countries.find((c) => c.id === selectedCountry);
          return country && state.countryId === country.id;
        });

  // Filter shipments based on search term and filters
  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      searchTerm === "" ||
      shipment.trackingNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      shipment.origin.address
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      shipment.destination.address
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Update these conditions
    const matchesCountry =
      selectedCountry === "all" ||
      selectedCountry === "" ||
      countries.find((c) => c.id === selectedCountry)?.name ===
        shipment.origin.country ||
      countries.find((c) => c.id === selectedCountry)?.name ===
        shipment.destination.country;

    const matchesState =
      selectedState === "all" ||
      selectedState === "" ||
      states.find((s) => s.id === selectedState)?.name ===
        shipment.origin.state ||
      states.find((s) => s.id === selectedState)?.name ===
        shipment.destination.state;

    return matchesSearch && matchesCountry && matchesState;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search shipments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Country" />
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

          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {filteredStates.map((state) => (
                <SelectItem key={state.id} value={state.id}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSearchTerm("");
              setSelectedCountry("all");
              setSelectedState("all");
            }}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Shipments Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tracking Number</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Est. Delivery</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredShipments.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No shipments found
              </TableCell>
            </TableRow>
          ) : (
            filteredShipments.map((shipment) => {
              // Add debugging to see what's being rendered
              console.log("Rendering shipment:", shipment);

              // Format dates properly
              const formatDate = (dateStr) => {
                if (!dateStr) return "Not set";
                try {
                  const date = new Date(dateStr);
                  return date.toLocaleDateString();
                } catch (e) {
                  return dateStr;
                }
              };

              return (
                <TableRow key={shipment.id}>
                  <TableCell className="font-medium">
                    {shipment.trackingNumber || "Unknown"}
                  </TableCell>
                  <TableCell>
                    {shipment.origin?.state || "Unknown"},{" "}
                    {shipment.origin?.country || "Unknown"}
                  </TableCell>
                  <TableCell>
                    {shipment.destination?.state || "Unknown"},{" "}
                    {shipment.destination?.country || "Unknown"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        statusColors[shipment.status] || "bg-gray-500"
                      }`}
                    >
                      {shipment.status || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(shipment.createdAt)}</TableCell>
                  <TableCell>
                    {formatDate(shipment.estimatedDelivery)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Link
                            to={`/tracking/${shipment.trackingNumber}`}
                            className="flex items-center"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault();
                            navigate(`/admin/shipments/update/${shipment.id}`);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault();
                            setShipmentToDelete(shipment);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault();
                            setShipmentToUpdate(shipment);
                            setNewStatus(shipment.status);
                            setIsStatusUpdateDialogOpen(true);
                          }}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          <span>Update Status</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the shipment with tracking number{" "}
              <span className="font-medium">
                {shipmentToDelete?.trackingNumber}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {isStatusUpdateDialogOpen && shipmentToUpdate && (
        <AlertDialog
          open={isStatusUpdateDialogOpen}
          onOpenChange={setIsStatusUpdateDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Update Shipment Status</AlertDialogTitle>
              <AlertDialogDescription>
                Update the status for shipment {shipmentToUpdate.trackingNumber}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newStatus}
                  onValueChange={(value: ShipmentStatus) => setNewStatus(value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Out for Delivery">
                      Out for Delivery
                    </SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Exception">Exception</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={statusLocation}
                  onChange={(e) => setStatusLocation(e.target.value)}
                  placeholder="e.g., New York, USA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={statusDescription}
                  onChange={(e) => setStatusDescription(e.target.value)}
                  placeholder="e.g., Package arrived at sorting facility"
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleStatusUpdate}>
                Update
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default ShipmentsList;
