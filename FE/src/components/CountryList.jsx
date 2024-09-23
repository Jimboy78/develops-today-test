import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/available-countries`
        );
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-3xl font-bold text-center mb-4">
        Available Countries
      </h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for a country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="max-h-96 overflow-y-auto border rounded p-4">
        <ul className="list-none">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <li key={country.countryCode} className="mb-2">
                <Link
                  to={`/country/${country.countryCode}`}
                  className="text-blue-500 hover:underline"
                >
                  {country.name}
                </Link>
              </li>
            ))
          ) : (
            <li>No countries found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CountryList;
