import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";

interface TrackingFormProps {
  minimal?: boolean;
  className?: string;
}

const TrackingForm: React.FC<TrackingFormProps> = ({
  minimal = false,
  className = "",
}) => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingNumber.trim()) {
      toast.error("Please enter a tracking number");
      return;
    }

    // Redirect to tracking results page with the tracking number
    navigate(`/tracking/${trackingNumber}`);
  };

  if (minimal) {
    return (
      <form onSubmit={handleSubmit} className={`flex w-full ${className}`}>
        <Input
          type="text"
          placeholder="Enter tracking #"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="rounded-r-none focus-visible:ring-0"
        />
        <Button
          type="submit"
          className="rounded-l-none bg-orange-500 hover:bg-orange-500/90 px-3"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter your tracking number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-500/90"
          >
            Track Shipment
            <Search className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TrackingForm;
