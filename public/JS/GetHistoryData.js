const axios = require("axios");
const cheerio = require("cheerio");

////////////歷史資料
async function gethistorydata(year, month, date, id) {
  const res = await axios.get(
    `https://rate.bot.com.tw/xrt/all/${year}-${month}-${date}`
  ); //透過axios發http request
  const $ = cheerio.load(res.data); //將data存入$
  const elementselector = `tbody > tr:nth-child(${id})`; //選擇器

  const keys = [
    "month",
    "date",
    "cash_buy",
    "cash_sell",
    "deposit_buy",
    "deposit_sell",
  ];

  let Data_temp = {}; //放入每行的匯率資料
  $(elementselector).each((parentidx, parentelem) => {
    //tr
    Data_temp[keys[0]] = `${month}`;
    Data_temp[keys[1]] = `${date}`;

    let keyidx = 2;
    $(parentelem) //tr
      .children()
      .each((childrenidx, childrenelem) => {
        const tdvalue = $(childrenelem).text(); //每行td的text值

        if (childrenidx >= 1 && childrenidx <= 4) {
          //取td[1] -> td[4] 的值
          Data_temp[keys[keyidx]] = tdvalue.trim(); //tdvlue中的空白及換行字元
          keyidx++;
        }
      });
  });
  return Data_temp;
}

const HistoryData = async (id, days) => {
  let today = new Date(); //今天日期
  today.setDate(today.getDate() - 1); //要抓取歷史資料 要從前一天開始抓
  let Now_year = today.getFullYear();
  let Now_month = today.getMonth() + 1;
  let Now_date = today.getDate();
  let count = days; //計數用
  let Data = [];

  while (count > 0) {
    if (Now_month < 10) {
      Now_month = `0${Now_month}`;
    }
    if (Now_date < 10) {
      Now_date = `0${Now_date}`;
    }
    try {
      let Data_temp = await gethistorydata(Now_year, Now_month, Now_date, id);
      // console.log(Data_temp);
      //判斷物件是否為空值 object.keys(obj).length
      if (Object.keys(Data_temp).length <= 2) {
      } else {
        count--; //次數-1
        Data.push(Data_temp);
      }
      today.setDate(today.getDate() - 1); //再抓前一天的資料
      Now_year = today.getFullYear();
      Now_month = today.getMonth() + 1;
      Now_date = today.getDate();
    } catch (err) {
      console.log(err);
    }
  }

  return Data;
};

module.exports = HistoryData;
