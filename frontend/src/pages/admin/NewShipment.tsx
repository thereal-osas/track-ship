import React from "react";
import ShipmentForm from "@/components/admin/ShipmentForm";

const NewShipment = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Shipment</h1>
      <ShipmentForm />
    </div>
  );
};

export default NewShipment;