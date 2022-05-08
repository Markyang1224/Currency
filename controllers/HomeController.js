const router = require("express").Router; //import express
const axios = require("axios");
const cheerio = require("cheerio");

const index = (req, res) => {
  async function GetDefaultData() {
    const res = await axios.get("https://rate.bot.com.tw/xrt?Lang=zh-TW"); //透過axios發http request
    const $ = cheerio.load(res.data); //將data存入$
    const elementselector = `.table > tbody:nth-child(2) > tr`; //選擇器
    const keys = ["cash_buy", "cash_sell", "deposit_buy", "deposit_sell"];
    const default_data = []; //匯率總資料

    $(elementselector).each((parentidx, parentelem) => {
      //tr
      console.log(parentidx);
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

      default_data.push(rateobj_temp); //push到總資料
    });

    // return default_data;
  }

  GetDefaultData();

  res.send("Checking");
};

module.exports = { index };
