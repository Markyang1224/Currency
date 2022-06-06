const axios = require("axios");
const cheerio = require("cheerio");
const HistoryData = require("../public/JS/GetHistoryData");
const Collection = require("../models/collection");

const index = async (req, res) => {
  //拿匯率資料
  async function GetDefaultData() {
    const res = await axios.get("https://rate.bot.com.tw/xrt?Lang=zh-TW"); //透過axios發http request
    const $ = cheerio.load(res.data); //將data存入$
    const elementselector = `tbody > tr:nth-child(1)`; //選擇器
    const keys = [
      "currency_name",
      "currency_id",
      "cash_buy",
      "cash_sell",
      "deposit_buy",
      "deposit_sell",
    ];
    const Data = []; //匯率總資料

    //解釋: 下列的element是表示<div class="test">hi</div>這種

    //抓取幣別
    const CurrencyName = [];

    const CurrencySelector = `tbody > tr:nth-child(1) > td.currency.phone-small-font > div > div.hidden-phone.print_show`;
    $(CurrencySelector).each((idx, elem) => {
      let value = $(elem).text().trim();
      CurrencyName.push(value);
    });

    //抓取金額
    $(elementselector).each((parentidx, parentelem) => {
      //tr

      let keyidx = 2; //資料從index = 2 開始存放
      let rateobj_temp = {}; //放入每行的匯率資料
      let id = 1;

      rateobj_temp[keys[0]] = CurrencyName[0]; //index = 0 為幣別名稱
      rateobj_temp[keys[1]] = id; //index = 1 為幣別id

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

      Data.push(rateobj_temp); //push到總資料
    });

    return Data;
  }

  let Data = await GetDefaultData();
  let History_Data = await HistoryData(1); //美元 id = 1

  //資料庫查看是否有沒有收藏

  function GetCollectionStatus() {
    if (req.user) {
      try {
        Collection.findOne({ user_id: req.user._id, currency_id: "1" }).then(
          (founded) => {
            if (founded) {
              Collection_status = "已收藏";
              console.log(Collection_status);
              return Collection_status;
            } else {
              Collection_status = "收藏";
              return Collection_status;
            }
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
  }

  let Collection_status = await GetCollectionStatus();

  res.render("index", {
    Data,
    History_Data,
    user: req.user,
    Collection_status,
  });
};

const formsubmit = async (req, res) => {
  let { currency_id } = req.body;
  let id = Number(currency_id); //貨幣id

  async function GetData() {
    const res = await axios.get("https://rate.bot.com.tw/xrt?Lang=zh-TW"); //透過axios發http request
    const $ = cheerio.load(res.data); //將data存入$
    // const elementselector = `.table > tbody:nth-child(2) > tr`; //選擇器
    const elementselector = `tbody > tr:nth-child(${id})`; //選擇器
    const keys = [
      "currency_name",
      "currency_id",
      "cash_buy",
      "cash_sell",
      "deposit_buy",
      "deposit_sell",
    ];
    const Data = []; //匯率總資料

    //解釋: 下列的element是表示<div class="test">hi</div>這種

    //抓取幣別
    const CurrencyName = [];

    const CurrencySelector = `tbody > tr:nth-child(${id}) > td.currency.phone-small-font > div > div.hidden-phone.print_show`;
    $(CurrencySelector).each((idx, elem) => {
      let value = $(elem).text().trim();
      CurrencyName.push(value);
    });

    //抓取金額
    $(elementselector).each((parentidx, parentelem) => {
      //tr

      let keyidx = 2; //資料從index = 2 開始存放
      let rateobj_temp = {}; //放入每行的匯率資料

      rateobj_temp[keys[0]] = CurrencyName[0]; //index = 0 為幣別名稱
      rateobj_temp[keys[1]] = id; //index = 1 為幣別id

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

      Data.push(rateobj_temp); //push到總資料
    });

    return Data;
  }

  let Data = await GetData();
  let History_Data = await HistoryData(id);

  //資料庫查看是否有沒有收藏
  let Collection_status;
  if (req.user) {
    try {
      Collection.findOne({ user_id: req.user._id, currency_id }).then(
        (founded) => {
          if (founded) {
            Collection_status = "已收藏";
          } else {
            Collection_status = "收藏";
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  res.render("index", {
    Data,
    History_Data,
    user: req.user,
    Collection_status,
  });
};

const collect = async (req, res) => {
  let { user_id, currency_name, currency_id } = req.body;

  let id = Number(currency_id); //貨幣id

  async function GetData() {
    const res = await axios.get("https://rate.bot.com.tw/xrt?Lang=zh-TW"); //透過axios發http request
    const $ = cheerio.load(res.data); //將data存入$
    // const elementselector = `.table > tbody:nth-child(2) > tr`; //選擇器
    const elementselector = `tbody > tr:nth-child(${id})`; //選擇器
    const keys = [
      "currency_name",
      "currency_id",
      "cash_buy",
      "cash_sell",
      "deposit_buy",
      "deposit_sell",
    ];
    const Data = []; //匯率總資料

    //解釋: 下列的element是表示<div class="test">hi</div>這種

    //抓取幣別
    const CurrencyName = [];

    const CurrencySelector = `tbody > tr:nth-child(${id}) > td.currency.phone-small-font > div > div.hidden-phone.print_show`;
    $(CurrencySelector).each((idx, elem) => {
      let value = $(elem).text().trim();
      CurrencyName.push(value);
    });

    //抓取金額
    $(elementselector).each((parentidx, parentelem) => {
      //tr

      let keyidx = 2; //資料從index = 2 開始存放
      let rateobj_temp = {}; //放入每行的匯率資料

      rateobj_temp[keys[0]] = CurrencyName[0]; //index = 0 為幣別名稱
      rateobj_temp[keys[1]] = id; //index = 1 為幣別id

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

      Data.push(rateobj_temp); //push到總資料
    });

    return Data;
  }

  let Data = await GetData();
  let History_Data = await HistoryData(id);

  try {
    Collection.findOne({ user_id, currency_id }).then((founded) => {
      if (!founded) {
        new Collection({
          user_id,
          currency_name,
          currency_id,
        })
          .save()
          .then(() => {
            console.log("save to db");
          })
          .catch(() => {
            console.log("failed");
          });
      } else {
        Collection.deleteOne({ user_id, currency_id }).then(() => {
          console.log("delete it");
        });
      }
    });
  } catch (err) {
    console.log(err);
  }

  res.render("index", { Data, History_Data, user: req.user });
};

module.exports = { index, formsubmit, collect };
