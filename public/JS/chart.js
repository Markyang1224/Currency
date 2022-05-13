const axios = require("axios");
const cheerio = require("cheerio");

////////////歷史資料
async function gethistorypage(year, month, date) {
  const res = await axios.get(
    `https://rate.bot.com.tw/xrt/all/${year}-${month}-${date}`
  ); //透過axios發http request
  const $ = cheerio.load(res.data); //將data存入$
  const elementselector = `.table > tbody:nth-child(2) > tr`; //選擇器

  const keys = ["cash_buy", "cash_sell", "deposit_buy", "deposit_sell"];
  const rateobj = []; //匯率總資料

  $(elementselector).each((parentidx, parentelem) => {
    //tr
    let keyidx = 0;
    let rateobj_temp = {}; //放入每行的匯率資料

    $(parentelem) //tr
      .children()
      .each((childrenidx, childrenelem) => {
        const tdvalue = $(childrenelem).text(); //每行td的text值

        if (childrenidx >= 1 && childrenidx <= 4) {
          //取td[1] -> td[4] 的值
          rateobj_temp[keys[keyidx]] = tdvalue.trim(); //tdvlue中的空白及換行字元
          keyidx++;
        }
      });

    rateobj.push(rateobj_temp); //push到總資料
  });
  // console.log(rateobj);

  return rateobj;
}

///////////////圖表
const labels = [1, 2, 3, 4, 5, 6, 7];
const data = {
  labels: labels,
  datasets: [
    {
      label: "My First Dataset",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
    {
      label: "My second Dataset",
      data: [60, 50, 80, 86, 55, 53, 40],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};
const config = {
  type: "line",
  data: data,
};
const myChart = new Chart(document.getElementById("myChart"), config);
