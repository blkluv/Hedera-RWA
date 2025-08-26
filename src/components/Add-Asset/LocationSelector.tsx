import React from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

// Location Selector Component
const LocationSelector = ({
  value,
  onChange,
}: {
  value: { country: string; state: string; city: string };
  onChange: (v: { country: string; state: string; city: string }) => void;
}) => {
  // Simplified location selector - in a real app, you'd use a proper location API
  const countries = [
    { name: "United States", code: "US" },
    { name: "Canada", code: "CA" },
    { name: "United Kingdom", code: "UK" },
    { name: "Germany", code: "DE" },
    { name: "France", code: "FR" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>Country *</Label>
        <Select
          value={value.country}
          onValueChange={(v) => onChange({ country: v, state: "", city: "" })}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>State/Province *</Label>
        <Input
          value={value.state}
          onChange={(e) => onChange({ ...value, state: e.target.value })}
          placeholder="Enter state/province"
          className="h-11"
          disabled={!value.country}
        />
      </div>
      <div className="space-y-2">
        <Label>City *</Label>
        <Input
          value={value.city}
          onChange={(e) => onChange({ ...value, city: e.target.value })}
          placeholder="Enter city"
          className="h-11"
          disabled={!value.state}
        />
      </div>
    </div>
  );
};

export default LocationSelector;
