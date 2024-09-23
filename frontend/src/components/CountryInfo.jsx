import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables); // Registrar las escalas

const CountryInfo = () => {
  const { countryCode } = useParams();
  const [countryData, setCountryData] = useState(null);
  const [error, setError] = useState(null);
  const previousCountryCode = useRef(null);
  const navigate = useNavigate(); // Hook para navegar entre rutas

  useEffect(() => {
    const fetchCountryInfo = async () => {
      if (previousCountryCode.current !== countryCode) {
        previousCountryCode.current = countryCode;
        try {
          const response = await axios.get(
            `http://localhost:4000/country-info/${countryCode}`
          );
          setCountryData(response.data);
          setError(null);
        } catch (error) {
          console.error("Error fetching country info:", error);
          setError("Error fetching country information. Please try again.");
        }
      }
    };

    fetchCountryInfo();
  }, [countryCode]);

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (!countryData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  const populationData = countryData.populationCounts.map((item) => ({
    year: item.year,
    value: item.value,
  }));

  const chartData = {
    labels: populationData.map((item) => item.year),
    datasets: [
      {
        label: "Population",
        data: populationData.map((item) => item.value),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="container mx-auto p-5 max-w-3xl">
      <div className="flex justify-start mb-4">
        {/* Botón para regresar a la lista de países */}
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
        >
          Back to Country List
        </button>
      </div>

      <h1 className="text-4xl font-bold text-center mb-6">
        {countryData.commonName}
      </h1>

      <div className="flex justify-center mb-6">
        <img
          src={countryData.flagUrl}
          alt={`Flag of ${countryData.commonName}`}
          className="w-48 h-auto shadow-md rounded"
        />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Border Countries:</h2>
      <ul className="list-disc ml-6 mb-6">
        {countryData.borders.length > 0 ? (
          countryData.borders.map((border) => (
            <li key={border.countryCode} className="mb-2">
              <Link
                to={`/country/${border.countryCode}`}
                className="text-blue-500 hover:underline"
              >
                {border.commonName}
              </Link>
            </li>
          ))
        ) : (
          <li>No bordering countries available.</li>
        )}
      </ul>

      <h2 className="text-2xl font-semibold mb-4">Population Over Time</h2>
      {populationData.length > 0 ? (
        <div className="p-4 border rounded-md shadow-lg">
          <Line data={chartData} />
        </div>
      ) : (
        <p>No population data available.</p>
      )}
    </div>
  );
};

export default CountryInfo;
