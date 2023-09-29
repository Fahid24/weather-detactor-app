import icon from "./search.svg"
import { useEffect, useState } from "react";
import "./weather.css"
import Spiner from "../components/spiner";
import { CiTempHigh } from 'react-icons/ci';
import { WiHumidity } from 'react-icons/wi';
import { GiWindsock } from 'react-icons/gi';
const API_key = `b0d4ce51b0759ab8d2f7af06c0667dd4`;



const Weather = () => {
    const [weather, setWeather] = useState(null);
    const [temperature, Settemperature] = useState("");
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState("");
    const [error, setError] = useState("");
    const [selectedOption, setSelectedOption] = useState('Celsius');
    const celsius = (temperature?.temp - 273.15).toFixed(2);
    const celsiusFeel = (temperature?.feels_like - 273.15).toFixed(2);
    const fahrenheit = ((celsius * 9 / 5) + 32).toFixed(2);
    const fahrenheitFeel = ((celsiusFeel * 9 / 5) + 32).toFixed(2);
  

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };


    useEffect(() => {

        const fetchCityByGeolocation = () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        try {
                            const { latitude, longitude } = position.coords;
                            const response = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                            );
                            if (response.ok) {
                                const data = await response.json();
                                const userCity = data.address.city || data.address.town || "Unknown";
                                // setCity(userCity);

                                if (userCity) {
                                    searchLocation(userCity)
                                    setLoading(false);

                                }
                            } else {
                                throw new Error("City not found");
                            }
                        } catch (error) {
                            console.error("Error fetching city:", error);
                            setError("Error fetching city. Please try again later.");
                        } finally {
                            setLoading(false);
                        }
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                        setError("Geolocation error. Please enable location services.");
                        setLoading(false);
                    }
                );
            } else {
                setError("Geolocation is not supported by your browser.");
                setLoading(false);
            }

        };

        fetchCityByGeolocation();
    }, []);



    const searchLocation = async (city) => {
        setLoading(true);

        if (location || city) {
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location ? location : city}&appid=${API_key}`)
                .then(res => {
                    if (res?.ok) {
                        setError("")
                        return res.json();

                    } else {
                        setError('City not found')
                    }

                })
                .then(data => {
                    setWeather(data)
                    Settemperature(data?.main);
                    setLoading(false);


                })
        }



        setLocation("");

    };


    return (
        <div
            className="container"
            style={{
                backgroundImage: `url("https://images.unsplash.com/photo-1580193769210-b8d1c049a7d9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=874&q=80")`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }}
        >


            <div className="main">

                <div className="search">

                    <form className="search" >
                        <input
                            className="weather-input"
                            value={location}
                            onChange={(event) => setLocation(event.target.value)}
                            // onKeyPress={searchLocation}
                            placeholder="Enter Location"
                            type="text"
                            name="city"
                            
                        // onKeyPress={searchLocation}
                        />
                        <button disabled={!location} type="submit" onClick={searchLocation}>
                            <img className="icon" src={icon} alt="" />
                        </button>
                    </form>
                </div>
                {/* Top */}
                <div className="radio">
                    <p>Select a unit of temperature :</p> <br />

                    <label>
                        <input
                            className="radio-inout"
                            type="radio"
                            value={'Celsius'}
                            checked={selectedOption === 'Celsius'}
                            onChange={handleOptionChange}
                        />
                        Celsius
                    </label>



                    <label>
                        <input
                            type="radio"
                            value={'Fahrenheit'}
                            checked={selectedOption === 'Fahrenheit'}
                            onChange={handleOptionChange}
                        />
                        Fahrenheit
                    </label>


                </div>
                {
                    error ? <p className="title1">Opps! {error}</p> : (
                        <div>

                            {
                                loading ? <Spiner /> : (

                                    <div>
                                        {
                                            weather && (
                                                <div className="weather">
                                                    <p className="title1">
                                                        Weather in {weather?.name}
                                                    </p>




                                                </div>
                                            )
                                        }
                                        <div className="details">
                                            {weather ? (

                                                <div className="">
                                                    <div className="weather-icon">
                                                        <img
                                                            src={`http://openweathermap.org/img/wn/${weather?.weather[0]?.icon}@2x.png`}
                                                            alt="/"
                                                            width="100"
                                                            height="100"
                                                        />
                                                        <p style={{ marginTop: "-10px" }} className="">{weather?.weather[0]?.description}</p>

                                                    </div>
                                                    <div className="des"><p>Temperature </p> <p>{selectedOption === 'Celsius' ? (celsius + "°C") : (fahrenheit + "°F")} <CiTempHigh size={30} /></p> </div>
                                                    <div className="des">
                                                        <p className="">Feels Like </p>
                                                        <p className="">{selectedOption === 'Celsius' ? (celsiusFeel + "°C") : (fahrenheitFeel + "°F")} <CiTempHigh size={30} /></p>


                                                    </div>
                                                    <div className="des">
                                                        <p className="">Humidity</p>

                                                        <p className="">{weather?.main?.humidity}% <WiHumidity size={30} /></p>
                                                    </div>
                                                    <div className="des">
                                                        <p className="">Winds</p>

                                                        <p className="">

                                                            {weather?.wind?.speed.toFixed(0)} MPH
                                                        </p>
                                                        <GiWindsock size={30} />
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                )}

                        </div>
                    )
                }


            </div>

        </div>
    );
};

export default Weather;