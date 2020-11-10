import React, { useEffect, useState } from 'react';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from './Infobox';
import Map from './Map';
import './App.css';
import Table from './Table';
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css"

function App() {
  // STATE = How to write a variable in React
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 17, lng: -4});
  const [mapZoom, setMapZoom] = useState(1.5);
  const [mapCountries, setMapCountires] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, []);
  
  //console.log(`"Console log 1:" + ${mapCenter}`);
  //console.log(mapCenter);
  //console.log(JSON.parse(JSON.stringify(mapCenter)));
  // Mali (senter of World from our perspective) "lat": 49.21, "long": -2.13,
  //{lat: 34.80746, lng: -40.4796} original coordinates

  //USEEFFECT = Runs a piece of code based on a given condition
  useEffect( () => {
    // async -> send a reques, wait for it, do something with the info
    const getCountriesData = async () => {
      await fetch ("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }));

          const sortedData = sortData(data);  
          setTableData(sortedData);
          setMapCountires(data);
          setCountries(countries);
      });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    
    console.log("Console log 2:");
    console.log(mapCenter);

    const url = countryCode === 'worldwide' 
      ? 'https://disease.sh/v3/covid-19/all' 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then((response)=> response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
      if (countryCode === 'worldwide') {
        setMapCenter({lat: 17, lng: -4});
        setMapZoom(2);
      } else {
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      };
    });
  };

  return (
    <div className="app">
      <div className = "app__left">
        <div className = "app__header">
            <h1>COVID-19 TRACKER</h1>
            <FormControl className="app__dropdown">
              <Select 
              variant = "outlined"
              onChange = {onCountryChange} 
              value = {country}
              >
              <MenuItem value = "worldwide">Worldwide</MenuItem>
                {countries.map((country) => (
                    <MenuItem value = {country.value}>{country.name}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>

          <div className = "app__stats">
            <InfoBox
            isRed
            active = {casesType === "cases"}
            onClick = {e => setCasesType('cases')} 
            title = "Coronavirus Cases" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)} 
            />
            <InfoBox
            active = {casesType === "recovered"}
            onClick = {e => setCasesType('recovered')}  
            title = "Recovered" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)}
            />
            <InfoBox
            isRed
            active = {casesType === "deaths"}
            onClick = {e => setCasesType('deaths')}  
            title = "Deaths" 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)}
            />
          </div>

          {/* Map */}
          <div>
            <Map
              casesType = {casesType} 
              countries = {mapCountries}
              center = {mapCenter}
              zoom = {mapZoom}
            />
          </div>
      </div>

      <div>
        <Card className = "app__right">
          <CardContent>
            <h3 className="app__rightTableTitle">Live Cases by Country</h3>
            <Table countries = {tableData} />
            <h3 className="app__rightGraphTitle">Worldwide new {casesType}</h3>
            <LineGraph className="app__graph" casesType = {casesType}/>
          </CardContent>
        </Card>
      </div>
    </div>

  );
}

export default App;
