import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import Hours from "./components/Hours";
import Miles from "./components/Miles";
import Rates from "./components/Rates";
import data from "./lp.csv";
import Output from "./components/Output";
import Header from "./components/Header";
import Intro from "./components/Intro";

function App() {
  const [rate, setRate] = useState("");
  const [miles, setMiles] = useState(0);
  const [hours, setHours] = useState(null);
  let rawDataArr = [];
  let parsedData = [];
  const [loadprofile, setLoadprofile] = useState([]);
  const [totalLoad, setTotalLoad] = useState(0);

  useEffect(() => {
    let totalconsumption = 0;

    d3.csv(data, function (data) {
      const datetime = data["Date/Time"];
      const [date, a, time] = datetime.trim().split(" ");
      const consumption = parseFloat(
        data["Electricity:Facility [kWh](Hourly)"]
      );
      totalconsumption += consumption; // save data to var instead of updating state 8760 times
      rawDataArr = [...rawDataArr, [date, time, consumption]];
    }).then((res) => {
      for (let i = 0; i < 365; i++) {
        parsedData[i] = [];
        for (let j = i * 24; j < i * 24 + 24; j++) {
          parsedData[i].push(rawDataArr[j]); // save data to var instead of updating state 8760 times
        }
      }

      //once all data is parsed, save it to state
      setLoadprofile([...parsedData]);
      setTotalLoad(totalconsumption);
    });
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        <div className="input">
          <Intro />
          <Rates rate={rate} setRate={setRate} />
          <Miles miles={miles} setMiles={setMiles} />
          <Hours hours={hours} setHours={setHours} />
        </div>
        <div className="output">
          <Output
            rate={rate}
            miles={miles}
            hours={hours}
            totalLoad={totalLoad}
            loadprofile={loadprofile}
          />
        </div>
      </div>
    </>
  );
}

export default App;
