const Collection = require("../models/collection");
const GetData = require("../public/JS/GetData");
const GetHistoryData = require("../public/JS/GetHistoryData");

const index = async (req, res) => {
  let email = req.user.email;
  const Data = []; //存放收藏資料

  try {
    await Collection.find({ email: email })
      .then(async (founded) => {
        // 抓取收藏匯率資料
        //注意: async await 不能套用在 foreach迴圈, 他會把裡面的function視為一個普通的function,
        // 不管你的return 是不是promise,也不會等到 promise被 resolve或 reject才執行下一次迴圈。

        if (founded.length > 0) {
          for (let i = 0; i < founded.length; i++) {
            let currency_id = founded[i].currency_id;
            await GetData(currency_id).then((returnvalue) => {
              Data.push(returnvalue);
            });
          }
        } else {
          res.render("NoCollectionMember", { user: req.user });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }

  let targetCurrency = Data[0];
  let History_Data = await GetHistoryData(1, 7);
  let days = 7;
  let History_Data_All;

  res.render("member", {
    user: req.user,
    Data,
    targetCurrency,
    History_Data,
    days,
  });
};

const changecurrency = async (req, res) => {
  let { currency_id } = req.params;

  let email = req.user.email;
  const Data = []; //存放收藏資料

  try {
    await Collection.find({ email: email })
      .then(async (founded) => {
        // 抓取收藏匯率資料
        //注意: async await 不能套用在 foreach迴圈, 他會把裡面的function視為一個普通的function,
        // 不管你的return 是不是promise,也不會等到 promise被 resolve或 reject才執行下一次迴圈。

        for (let i = 0; i < founded.length; i++) {
          let currency_id = founded[i].currency_id;
          await GetData(currency_id).then((returnvalue) => {
            Data.push(returnvalue);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }

  let targetCurrency = await GetData(currency_id);
  let History_Data = await GetHistoryData(1, 7);
  let days = 7;
  let History_Data_All;

  res.render("member", {
    user: req.user,
    Data,
    targetCurrency,
    History_Data,
    days,
  });
};

const chartchange = async (req, res) => {
  let { currency_id } = req.params;
  let { days } = req.query;

  let email = req.user.email;
  const Data = []; //存放收藏資料

  try {
    await Collection.find({ email: email })
      .then(async (founded) => {
        // 抓取收藏匯率資料
        //注意: async await 不能套用在 foreach迴圈, 他會把裡面的function視為一個普通的function,
        // 不管你的return 是不是promise,也不會等到 promise被 resolve或 reject才執行下一次迴圈。

        for (let i = 0; i < founded.length; i++) {
          let currency_id = founded[i].currency_id;
          await GetData(currency_id).then((returnvalue) => {
            Data.push(returnvalue);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }

  let targetCurrency = await GetData(currency_id);
  let History_Data = await GetHistoryData(currency_id, days);

  if (Object.keys(History_Data).length == 30) {
    let count = 0; //到7停

    for (let i = 0; i < History_Data.length; i = i + 4) {
      if (count != 7) {
        History_Data[count] = History_Data[i];
      } else {
        break;
      }
      count++;
    }
    History_Data.splice(7, History_Data.length - 7);
  }

  res.render("member", {
    user: req.user,
    Data,
    targetCurrency,
    History_Data,
    days,
  });
};
module.exports = { index, changecurrency, chartchange };
