import React, { useState } from "react";
import SearchableDropdown from "../src/SearchableDropdown";
import Logo from "./logo.png";

const FlightSearch = () => {
  const origins = ["JFK", "DEL", "SYD", "BOM", "BNE", "BLR"];
  const destinations = ["JFK", "DEL", "SYD", "LHR", "CDG", "DOH", "SIN"];
  const cabinSelections = ["Economy", "Business", "First"];

  const [origin, setOrigin] = useState("SYD");
  const [destination, setDestination] = useState("JFK");
  const [value, setValue] = useState("economy");

  const [tempOrigin, setTempOrigin] = useState("SYD");
  const [tempDestination, setTempDestination] = useState("JFK");

  const [response, setResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setOrigin(tempOrigin);
    setDestination(tempDestination);
    setIsSearched(true);
    const headers = {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9,hi;q=0.8",
      "cache-control": "no-cache",
      "content-type": "application/json",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    };

    const jsonData = {
      origin: tempOrigin,
      destination: tempDestination,
      partnerPrograms: [
        "Air Canada",
        "United Airlines",
        "KLM",
        "Qantas",
        "American Airlines",
        "Etihad Airways",
        "Alaska Airlines",
        "Qatar Airways",
        "LifeMiles",
      ],
      stops: 2,
      departureTimeFrom: "2024-07-09T00:00:00Z",
      departureTimeTo: "2024-10-07T00:00:00Z",
      isOldData: false,
      limit: 302,
      offset: 0,
      cabinSelection: [value],
      date: "2024-07-09T12:00:17.796Z",
    };

    try {
      const response = await fetch("https://cardgpt.in/apitest", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(jsonData),
      });

      const data = await response.json();
      setResponse(data);
      console.log(data);
    } catch (error) {
      setErrorMessage("Try another search route.");
    }
  };

  return (
    <>
      <div className="container">
        <h4 className="heading">Choose Origin & Destination Airports:</h4>
        <form onSubmit={handleSearch}>
          <div className="dropdown-container">
            <label>Origin</label>
            <select
              value={tempOrigin}
              onChange={(e) => setTempOrigin(e.target.value)}
            >
              {origins.map((origin) => (
                <option key={origin} value={origin}>
                  {origin}
                </option>
              ))}
            </select>
          </div>
          <div className="dropdown-container">
            <label>Destination</label>
            <select
              value={tempDestination}
              onChange={(e) => setTempDestination(e.target.value)}
            >
              {destinations.map((destination) => (
                <option key={destination} value={destination}>
                  {destination}
                </option>
              ))}
            </select>
          </div>
          <div className="dropdown-search-container">
            <p>Cabin Selection</p>
            <SearchableDropdown
              options={cabinSelections}
              className="search"
              id="id"
              selectedVal={value}
              handleChange={(val) => setValue(val)}
            />
          </div>
          <button className="search-btn">Search</button>
        </form>
      </div>
      {isSearched && response && response.data && response.data.length > 0 ? (
        <div className="card">
          {response.data.map((item, index) => (
            <div key={index} className="card-details">
              <div className="flight-card">
                <img src={Logo} alt="Logo" />
                <p>{item.partner_program}</p>
                <p className="para-heading">
                  {origin} &rarr; {destination}
                </p>
                <p className="para-heading1">
                  {item.min_business_miles === null
                    ? "N/A"
                    : item?.min_business_miles}{" "}
                  <span className="min">
                    {item.min_business_tax === null
                      ? ""
                      : `+ $ ${item.min_business_tax}`}
                  </span>
                </p>
                <p className="para-heading2">Min Business Miles</p>
                <p className="para-heading1">
                  {item.min_economy_miles === null
                    ? "N/A"
                    : item.min_economy_miles}{" "}
                  <span className="min">
                    {item.min_economy_tax === null
                      ? ""
                      : `+ $ ${item.min_economy_tax}`}
                  </span>
                </p>
                <p className="para-heading2">Min Economy Miles</p>
                <p className="para-heading1">
                  {item.min_first_miles === null ? "N/A" : item.min_first_miles}{" "}
                  <span className="min">
                    {item.min_first_tax === null
                      ? ""
                      : `+ $ ${item.min_first_tax}`}
                  </span>
                </p>
                <p className="para-heading2 spacing">Min First Miles</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        response?.data?.length === 0 && (
          <p className="err-msg">
            {errorMessage || "Try another search route."}
          </p>
        )
      )}
    </>
  );
};

export default FlightSearch;
