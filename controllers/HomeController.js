const router = require("express").Router; //import express
const axios = require("axios");
const cheerio = require("cheerio");

const index = async (req, res) => {
  async function GetDefaultData() {
    const res = await axios.get("https://rate.bot.com.tw/xrt?Lang=zh-TW"); //透過axios發http request
    const $ = cheerio.load(res.data); //將data存入$
    // const elementselector = `.table > tbody:nth-child(2) > tr`; //選擇器
    const elementselector = `tbody > tr:nth-child(1)`; //選擇器
    const keys = ["cash_buy", "cash_sell", "deposit_buy", "deposit_sell"];
    const default_data = []; //匯率總資料

    //解釋: 下列的element是表示<div class="test">hi</div>這種

    //抓取金額
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

      default_data.push(rateobj_temp); //push到總資料
    });

    //抓取幣別
    const CurrencySelector = `tbody > tr:nth-child(1) > td.currency.phone-small-font > div > div.hidden-phone.print_show`;
    $(CurrencySelector).each((idx, elem) => {
      let value = $(elem).text().trim();
      console.log(value);
    });

    return default_data;
  }

  let DefaultData = await GetDefaultData();
  console.log(DefaultData);
  res.render("index", { DefaultData });
};

module.exports = { index };
