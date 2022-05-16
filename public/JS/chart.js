///////////////圖表
const labels = ["January", "February", "March", "April", "May", "June"];

const data = {
  labels: labels,
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132)",
      data: [0, 10, 5, 2, 20, 30, 45],
    },
    {
      label: "My Second dataset",
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132)",
      data: [0, 15, 10, 5, 15, 20, 35],
    },
  ],
};

const config = {
  type: "line",
  data: data,
  options: {
    borderWidth: 2,
    pointBorderWidth: 2,
  },
};

const myChart = new Chart(document.getElementById("myChart"), config);
