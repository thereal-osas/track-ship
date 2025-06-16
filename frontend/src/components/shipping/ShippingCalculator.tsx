import React, { useState } from "react";
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
import { Calculator, Package } from "lucide-react";

const ShippingCalculator = () => {
  const [weight, setWeight] = useState("");
  const [fromCountry, setFromCountry] = useState("");
  const [toCountry, setToCountry] = useState("");
  const [price, setPrice] = useState<number | null>(null);

  const handleCalculate = () => {
    // This is a simple mock calculation
    const basePrice = 15;
    const weightMultiplier = parseFloat(weight) * 2;
    const calculatedPrice = basePrice + weightMultiplier;
    setPrice(calculatedPrice);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-5 w-5 text-orange-500 mr-2" />
          Shipping Rate Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromCountry">From</Label>
              <Select value={fromCountry} onValueChange={setFromCountry}>
                <SelectTrigger id="fromCountry">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="toCountry">To</Label>
              <Select value={toCountry} onValueChange={setToCountry}>
                <SelectTrigger id="toCountry">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Package Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="Enter weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <Button
            onClick={handleCalculate}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            Calculate Shipping Rate
          </Button>

          {price !== null && (
            <div className="mt-4 p-4 bg-muted rounded-md text-center">
              <p className="text-sm text-muted-foreground">
                Estimated Shipping Cost
              </p>
              <p className="text-2xl font-bold">${price.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Delivery in 3-5 business days
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShippingCalculator;
