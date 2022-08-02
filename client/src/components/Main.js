import React, { useState, useEffect, Component } from "react";
import { Flipside } from "@flipsidecrypto/sdk";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

const API_KEY = `${process.env.REACT_APP_API_KEY}`;

function Main() {
  const [votingData, setVotingData] = useState([]);
  const days = votingData.map((item) => {
    return item["block_day"].slice(0, 10);
  });
  console.log(days);
  const votes = votingData.map((item) => {
    return item["count(distinct(tx_id))"];
  });
  console.log(votes);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    Title,
    Tooltip,
    Legend
  );

  const votingChartData = {
    labels: days,
    datasets: [
      {
        data: votes,
        backgroundColor: "#edaf1c",
        borderColor: ["#e64932"],
        borderWidth: 2,
      },
    ],
  };

  const votingChartOptions = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          font: {
            family: "'Maven Pro', sans-serif",
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          font: {
            family: "'Maven Pro', sans-serif",
          },
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "",
      },
      tooltip: {
        callbacks: {
          afterTitle: function (context) {
            return "hiiiyyaaaaaa";
          },
        },
      },
      title: {
        display: true,
        text: "Voting Activity by Day",
        font: {
          size: 18,
          family: "'Maven Pro', sans-serif",
          weight: "bold",
        },
        color: "white",
      },
    },
  };

  useEffect(() => {
    // Initialize `Flipside` with your API key
    const flipside = new Flipside(
      API_KEY,
      "https://node-api.flipsidecrypto.com"
    );

    // Create a query object for the `query.run` function to execute
    const query = {
      sql: "select date_trunc('day',block_timestamp) as block_day, count(distinct(tx_id)) from solana.core.fact_proposal_votes where block_timestamp BETWEEN '2022-04-07 05:35:35.000' and '2022-04-12 05:35:35.000' and program_name = 'marinade' and succeeded = 'TRUE' group by block_day",
      ttlMinutes: 10,
    };

    // Send the `Query` to Flipside's query engine and await the results
    // Need to add the .then() in this case to parse through response
    const result = flipside.query.run(query).then((records) => {
      console.log(records);
      console.log(records.records);
      setVotingData(records.records);
    });
  }, []);

  return (
    <div>
      <Bar options={votingChartOptions} data={votingChartData} />
      <Bar options={votingChartOptions} data={votingChartData} />
    </div>

    // <div className="double-mango">
    //   <div className="small-chart-area">
    //     <Bar options={votingChartOptions} data={votingChartData} />
    //   </div>
    //   <div className="small-chart-area">
    //     <Bar options={votingChartOptions} data={votingChartData} />
    //   </div>
    // </div>
  );
}

export default Main;
