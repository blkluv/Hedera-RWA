import { City, Country, State } from "country-state-city";
import { useState, useEffect } from "react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
const LocationSelector = ({
  value,
  onChange,
}: {
  value: { country: string; state: string; city: string };
  onChange: (v: { country: string; state: string; city: string }) => void;
}) => {
  const { country, state, city } = value;
  const [countries, setCountries] = useState<
    { name: string; isoCode: string }[]
  >([]);
  const [states, setStates] = useState<{ name: string; isoCode: string }[]>([]);
  const [cities, setCities] = useState<{ name: string }[]>([]);
  const [countrySearch, setCountrySearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (country) {
      setStates(State.getStatesOfCountry(country));
    } else {
      setStates([]);
    }
    setCities([]);
    setStateSearch("");
    setCitySearch("");
  }, [country]);

  useEffect(() => {
    if (country && state) {
      setCities(City.getCitiesOfState(country, state));
    } else {
      setCities([]);
    }
    setCitySearch("");
  }, [country, state]);

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );
  const filteredStates = states.filter((s) =>
    s.name.toLowerCase().includes(stateSearch.toLowerCase())
  );
  const filteredCities = cities.filter((c) =>
    c.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <div>
        <Label>Country *</Label>
        <Select
          value={country}
          onValueChange={(v) => onChange({ country: v, state: "", city: "" })}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <div className="px-2 py-1">
              <Input
                placeholder="Type to filter country"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                className="mb-2"
              />
            </div>
            {filteredCountries.map((c) => (
              <SelectItem key={c.isoCode} value={c.isoCode}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>State *</Label>
        <Select
          value={state}
          onValueChange={(v) => onChange({ country, state: v, city: "" })}
          disabled={!country}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            <div className="px-2 py-1">
              <Input
                placeholder="Type to filter state"
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                className="mb-2"
                disabled={!country}
              />
            </div>
            {filteredStates.map((s) => (
              <SelectItem key={s.isoCode} value={s.isoCode}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>City *</Label>
        <Select
          value={city}
          onValueChange={(v) => onChange({ country, state, city: v })}
          disabled={!state}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            <div className="px-2 py-1">
              <Input
                placeholder="Type to filter city"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="mb-2"
                disabled={!state}
              />
            </div>
            {filteredCities.map((c) => (
              <SelectItem key={c.name} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
export default LocationSelector;
