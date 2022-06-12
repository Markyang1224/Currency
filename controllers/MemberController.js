const Collection = require("../models/collection");
const GetData = require("../public/JS/GetData");

const index = async (req, res) => {
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

  res.render("member", { user: req.user, Data });
};

module.exports = { index };
