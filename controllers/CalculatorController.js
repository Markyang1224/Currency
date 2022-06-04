const axios = require("axios");
const cheerio = require("cheerio");

const index = async (req, res) => {
  async function GetDefaultData() {
    const res = await axios.get("https://rate.bot.com.tw/xrt?Lang=zh-TW"); //透過axios發http request
    const $ = cheerio.load(res.data); //將data存入$

    const keys = [
      "currency_name",
      "currency_id",
      "cash_buy",
      "cash_sell",
      "deposit_buy",
      "deposit_sell",
      "money",
    ];
    const Data = []; //匯率總資料

    //抓取幣別
    const CurrencyName = [];

    /////////////以下根據使用者選擇的轉換方式進行轉換, 存放位置在data[2], keyidx根據type + 1////////////////

    //總共19筆

    let i = 1;
    while (i < 20) {
      let CurrencySelector = `tbody > tr:nth-child(${i}) > td.currency.phone-small-font > div > div.hidden-phone.print_show`;
      $(CurrencySelector).each((idx, elem) => {
        let value = $(elem).text().trim();
        CurrencyName.push(value);
      });

      //解釋: 下列的element是表示<div class="test">hi</div>這種
      //抓取金額
      let elementselector = `tbody > tr:nth-child(${i})`; //選擇器
      $(elementselector).each((parentidx, parentelem) => {
        //tr

        let rateobj_temp = {}; //放入每行的匯率資料

        rateobj_temp[keys[0]] = CurrencyName[i - 1]; //index = 0 為幣別名稱
        rateobj_temp[keys[1]] = i; //index = 1 為幣別id

        $(parentelem) //tr
          .children()
          .each((childrenidx, childrenelem) => {
            let tdvalue = $(childrenelem).text(); //每行td的text值
            if (childrenidx == type) {
              //取td[1] -> td[4] 的值中, 看type在哪個位置
              // rateobj_temp[keys[keyidx]] = tdvalue.trim(); //tdvlue中的空白及換行字元 keyidx = 2 + type

              ////////////計算換算金額//////////////

              //先取得被轉換的貨幣資料
              let OriginalCurrency = `table > tbody > tr:nth-child(1) > td:nth-child(2)`;
              let OriginalValue = $(OriginalCurrency).text();

              if (tdvalue.trim() == "-") {
                rateobj_temp[keys[6]] = "..";
              } else {
                //計算
                rateobj_temp[keys[6]] =
                  Math.floor((OriginalValue / Number(tdvalue.trim())) * 1000) /
                  1000;
              }
            }
          });

        Data.push(rateobj_temp); //push到總資料
      });

      i++;
    }

    return Data;
  }
  //預設資料
  let currency_id = 1;
  let type = 1;
  let money = 1;

  let Data = await GetDefaultData();

  res.render("calculator", { Data, currency_id, type, money, user: req.user });
};

const calculate = async (req, res) => {
  let { currency_id, type, money } = req.body;
  async function GetDefaultData() {
    const res = await axios.get("https://rate.bot.com.tw/xrt?Lang=zh-TW"); //透過axios發http request
    const $ = cheerio.load(res.data); //將data存入$

    const keys = [
      "currency_name",
      "currency_id",
      "cash_buy",
      "cash_sell",
      "deposit_buy",
      "deposit_sell",
      "money",
    ];
    const Data = []; //匯率總資料

    //抓取幣別
    const CurrencyName = [];

    /////////////以下根據使用者選擇的轉換方式進行轉換, 存放位置在data[2], keyidx根據type + 1////////////////

    let i = 1;
    while (i < 20) {
      let CurrencySelector = `tbody > tr:nth-child(${i}) > td.currency.phone-small-font > div > div.hidden-phone.print_show`;
      $(CurrencySelector).each((idx, elem) => {
        let value = $(elem).text().trim();
        CurrencyName.push(value);
      });

      //解釋: 下列的element是表示<div class="test">hi</div>這種
      //抓取金額
      let elementselector = `tbody > tr:nth-child(${i})`; //選擇器
      $(elementselector).each((parentidx, parentelem) => {
        //tr

        let rateobj_temp = {}; //放入每行的匯率資料

        rateobj_temp[keys[0]] = CurrencyName[i - 1]; //index = 0 為幣別名稱
        rateobj_temp[keys[1]] = i; //index = 1 為幣別id

        $(parentelem) //tr
          .children()
          .each((childrenidx, childrenelem) => {
            let tdvalue = $(childrenelem).text(); //每行td的text值
            if (childrenidx == type) {
              //取td[1] -> td[4] 的值中, 看type在哪個位置
              // rateobj_temp[keys[keyidx]] = tdvalue.trim(); //tdvlue中的空白及換行字元 keyidx = 2 + type

              ////////////計算換算金額//////////////

              //先取得被轉換的貨幣資料
              let OriginalCurrency = `table > tbody > tr:nth-child(${currency_id}) > td:nth-child(${
                childrenidx + 1
              })`;
              let OriginalValue = $(OriginalCurrency).text();

              if (tdvalue.trim() == "-") {
                rateobj_temp[keys[6]] = "..";
              } else {
                //計算
                rateobj_temp[keys[6]] =
                  Math.floor(
                    (OriginalValue / Number(tdvalue.trim())) *
                      Number(money) *
                      1000
                  ) / 1000;
              }
            }
          });

        Data.push(rateobj_temp); //push到總資料
      });

      i++;
    }

    return Data;
  }

  let Data = await GetDefaultData();

  res.render("calculator", { Data, currency_id, type, money, user: req.user });
};
module.exports = { index, calculate };
