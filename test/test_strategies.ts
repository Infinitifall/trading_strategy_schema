import { StrategySchema } from "../src/strategy_schema";

let example_strategy = {
  name: "RSI + ATR WRB Buy",
  author: "vader",
  strategy: {
    function: "ifthen",
    if: {
      function: "AND",
      args: [
        {
          function: ">",
          args: [
            30,
            {
              function: "RSI",
              instrument: { name:"R", type:"equity", ticker:"R" },
              candletime: "1day",
              period: 14
            }
          ]
        },
        {
          function: ">",
          args: [
            {
              function: "-",
              args: [
                {
                  function: "Get Candle",
                  instrument: { name:"R", type:"equity", ticker:"R" },
                  candletime: "1day",
                  index: 0,
                  key: "high"
                },
                {
                  function: "Get Candle",
                  instrument: { name:"R", type:"equity", ticker:"R" },
                  candletime: "1day",
                  index: 0,
                  key: "low"
                }
              ]
            },
            {
              function: "ATR",
              instrument: { name:"R", type:"equity", ticker:"R" },
              candletime: "1day",
              period: 14
            }
          ]
        }
      ]
    },
    then: [
      {
        function: "Place Market Order",
        exchange: "NSE",
        instrument: { name: "R", type: "equity", ticker: "R" },
        quantity: 12
      },
      {
        function: "Place Market Order",
        exchange: "NSE",
        instrument: { name: "R2", type: "equity", ticker: "R2" },
        quantity: 3
      }
    ]
  }
}


let result = StrategySchema.safeParse(example_strategy);

if (result.success) {
  console.log("Strategy is valid! Yay!");

} else {
  console.log("Strategy is NOT valid! Oh no!");
}
