import { StrategySchema } from "../src/strategy_schema";

// LLM generated file !!!

// RUN: npm run test

// ============================================================================
// VALID STRATEGIES
// ============================================================================

const validStrategies = [

  // 1. RSI Oversold + ATR WRB = Buy
  {
    name: "Valid 1 — RSI + ATR WRB Buy",
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
          instrument: { name: "RELIANCE", type: "equity", ticker: "RELIANCE" },
          quantity: 12
        }
      ]
    }
  },

  // 2. ADX + DMI Bullish + SMA Trend — long entry
  {
    name: "Valid 2 — ADX/DMI/SMA Trend Long",
    author: "vader",
    strategy: {
      function: "ifthen",
      if: {
        function: "AND",
        args: [
          {
            function: ">",
            args: [
              {
                function: "ADX",
                instrument:{name:"I",type:"equity",ticker:"I"},
                candletime:"1day",
                period:14
              },
              20
            ]
          },
          {
            function: ">",
            args: [
              {
                function: "DMI",
                instrument:{name:"I",type:"equity",ticker:"I"},
                candletime:"1day",
                period:14,
                key:"plus"
              },
              {
                function: "DMI",
                instrument:{name:"I",type:"equity",ticker:"I"},
                candletime:"1day",
                period:14,
                key:"minus"
              }
            ]
          },
          {
            function: ">",
            args: [
              {
                function: "Get Candle",
                instrument:{name:"I",type:"equity",ticker:"I"},
                candletime:"1day",
                index:0,
                key:"close"
              },
              {
                function: "SMA",
                instrument:{name:"I",type:"equity",ticker:"I"},
                candletime:"1day",
                period:50
              }
            ]
          }
        ]
      },
      then:[
        {
          function:"Place Market Order",
          exchange:"NSE",
          instrument:{ name:"INFY", type:"equity", ticker:"INFY"},
          quantity:10
        }
      ]
    }
  },

  // 3. MACD Trend + Stochastic Pullback Buy
  // NOTE: removed nested ifthen-as-expression (nonsensical). Use a clear AND clause.
  {
    name:"Valid 3 — MACD Trend + Stoch Pullback Entry",
    author:"vader",
    strategy:{
      function:"ifthen",
      if:{
        function:"AND",
        args:[
          {
            function:">",
            args:[
              {
                function:"MACD",
                instrument:{name:"T",type:"equity",ticker:"T"},
                candletime:"1day",
                fast:12,
                slow:26,
                signal:9,
                key:"macd"
              },
              {
                function:"MACD",
                instrument:{name:"T",type:"equity",ticker:"T"},
                candletime:"1day",
                fast:12,
                slow:26,
                signal:9,
                key:"signal"
              }
            ]
          },
          {
            function: ">",
            args: [
              25,
              {
                function:"Stochastic",
                instrument:{name:"T",type:"equity",ticker:"T"},
                candletime:"1day",
                k_period:14,
                d_period:3,
                key:"k"
              }
            ]
          }
        ]
      },
      then:[
        {
          function:"Place Market Order",
          exchange:"NSE",
          instrument:{name:"TCS", type:"equity", ticker:"TCS"},
          quantity:15
        }
      ]
    }
  },

  // 4. Ichimoku cloud trend + ATR + SMA confirmation — long entry
  // NOTE: ichimoku keys use tenkan/kijun per schema (not conversion/base)
  {
    name:"Valid 4 — Ichimoku + ATR + SMA Trend Entry",
    author:"vader",
    strategy:{
      function:"ifthen",
      if:{
        function:"AND",
        args:[
          {
            function:">",
            args:[
              {
                function:"Ichimoku",
                instrument:{name:"S",type:"equity",ticker:"S"},
                candletime:"1day",
                tenkan:9,
                kijun:26,
                senkou_a:52,
                senkou_b:52,
                key:"tenkan"
              },
              {
                function:"Ichimoku",
                instrument:{name:"S",type:"equity",ticker:"S"},
                candletime:"1day",
                tenkan:9,
                kijun:26,
                senkou_a:52,
                senkou_b:52,
                key:"kijun"
              }
            ]
          },
          {
            function:">",
            args:[
              {
                function:"ATR",
                instrument:{name:"S",type:"equity",ticker:"S"},
                candletime:"1day",
                period:14
              },
              2
            ]
          },
          {
            function:">",
            args:[
              {
                function:"Get Candle",
                instrument:{name:"S",type:"equity",ticker:"S"},
                candletime:"1day",
                index:0,
                key:"close"
              },
              {
                function:"SMA",
                instrument:{name:"S",type:"equity",ticker:"S"},
                candletime:"1day",
                period:100
              }
            ]
          }
        ]
      },
      then:[
        {
          function:"Place Market Order",
          exchange:"NSE",
          instrument:{name:"SBIN",type:"equity",ticker:"SBIN"},
          quantity:20
        }
      ]
    }
  },

  // 5. Keltner breakout
  {
    name:"Valid 5 — Keltner Breakout Long",
    author:"vader",
    strategy:{
      function:"ifthen",
      if:{
        function:"AND",
        args:[
          {
            function:">",
            args:[
              {
                function:"Get Candle",
                instrument:{name:"H",type:"equity",ticker:"H"},
                candletime:"1day",
                index:0,
                key:"close"
              },
              {
                function:"Keltner Channels",
                instrument:{name:"H",type:"equity",ticker:"H"},
                candletime:"1day",
                period:20,
                multiplier:1.5,
                key:"high"
              }
            ]
          },
          {
            function:">",
            args:[
              {
                function:"ADX",
                instrument:{name:"H",type:"equity",ticker:"H"},
                candletime:"1day",
                period:14
              },
              20
            ]
          }
        ]
      },
      then:[
        {
          function:"Place Market Order",
          exchange:"NSE",
          instrument:{name:"HDFCBANK",type:"equity",ticker:"HDFCBANK"},
          quantity:18
        }
      ]
    }
  },

  // 6. Multi-TF SMA + DMI
  {
    name:"Valid 6 — Multi-TF SMA Stack + DMI Entry",
    author:"vader",
    strategy:{
      function:"ifthen",
      if:{
        function:"AND",
        args:[
          {
            function:">",
            args:[
              {
                function:"SMA",
                instrument:{name:"A",type:"equity",ticker:"A"},
                candletime:"1day",
                period:20
              },
              {
                function:"SMA",
                instrument:{name:"A",type:"equity",ticker:"A"},
                candletime:"1day",
                period:50
              }
            ]
          },
          {
            function:">",
            args:[
              {
                function:"SMA",
                instrument:{name:"A",type:"equity",ticker:"A"},
                candletime:"1week",
                period:10
              },
              {
                function:"SMA",
                instrument:{name:"A",type:"equity",ticker:"A"},
                candletime:"1week",
                period:30
              }
            ]
          },
          {
            function:">",
            args:[
              {
                function:"DMI",
                instrument:{name:"A",type:"equity",ticker:"A"},
                candletime:"1day",
                period:14,
                key:"plus"
              },
              {
                function:"DMI",
                instrument:{name:"A",type:"equity",ticker:"A"},
                candletime:"1day",
                period:14,
                key:"minus"
              }
            ]
          }
        ]
      },
      then:[
        {
          function:"Place Market Order",
          exchange:"NSE",
          instrument:{name:"AXISBANK",type:"equity",ticker:"AXISBANK"},
          quantity:10
        }
      ]
    }
  },

  // 7. Pivot breakout + volume
  {
    name:"Valid 7 — Pivot Breakout + Volume Entry",
    author:"vader",
    strategy:{
      function:"ifthen",
      if:{
        function:"AND",
        args:[
          {
            function:">",
            args:[
              {
                function:"Get Candle",
                instrument:{name:"I",type:"equity",ticker:"I"},
                candletime:"1day",
                index:0,
                key:"high"
              },
              {
                function:"Pivot Points",
                instrument:{name:"I",type:"equity",ticker:"I"},
                candletime:"1day",
                period:1,
                key:"r2"
              }
            ]
          },
          {
            function:">",
            args:[
              {
                function:"Get Tic",
                instrument:{name:"I",type:"equity",ticker:"I"},
                index:0,
                key:"volume"
              },
              400000
            ]
          }
        ]
      },
      then:[
        {
          function:"Place Market Order",
          exchange:"NSE",
          instrument:{name:"ITC",type:"equity",ticker:"ITC"},
          quantity:50
        }
      ]
    }
  },

  // 8. MACD + RSI + ATR confluence
  {
    name:"Valid 8 — Triple Indicator Confluence Long",
    author:"vader",
    strategy:{
      function:"ifthen",
      if:{
        function:"AND",
        args:[
          {
            function:">",
            args:[
              {
                function:"MACD",
                instrument:{name:"U",type:"equity",ticker:"U"},
                candletime:"1day",
                fast:12,
                slow:26,
                signal:9,
                key:"hist"
              },
              0
            ]
          },
          {
            function:">",
            args:[
              65,
              {
                function:"RSI",
                instrument:{name:"U",type:"equity",ticker:"U"},
                candletime:"1day",
                period:14
              }
            ]
          },
          {
            function:">",
            args:[
              {
                function:"ATR",
                instrument:{name:"U",type:"equity",ticker:"U"},
                candletime:"1day",
                period:14
              },
              2
            ]
          }
        ]
      },
      then:[
        {
          function:"Place Market Order",
          exchange:"NSE",
          instrument:{name:"ULTRACEMCO",type:"equity",ticker:"ULTRACEMCO"},
          quantity:22
        }
      ]
    }
  },

  // 9. Trend → breakout → volume → ATR expansion
  {
    name:"Valid 9 — Deep Trend-Breakout-ATR Entry",
    author:"vader",
    strategy:{
      function:"ifthen",
      if:{
        function:"ifthen",
        if:{
          function:">",
          args:[
            {
              function:"Aroon",
              instrument:{name:"M",type:"equity",ticker:"M"},
              candletime:"1day",
              period:25,
              key:"up"
            },
            {
              function:"Aroon",
              instrument:{name:"M",type:"equity",ticker:"M"},
              candletime:"1day",
              period:25,
              key:"down"
            }
          ]
        },
        then:[
          {
            function:"ifthen",
            if:{
              function:">",
              args:[
                {
                  function:"Get Candle",
                  instrument:{name:"M",type:"equity",ticker:"M"},
                  candletime:"1day",
                  index:0,
                  key:"close"
                },
                {
                  function:"Donchian Channels",
                  instrument:{name:"M",type:"equity",ticker:"M"},
                  candletime:"1day",
                  period:20,
                  key:"high"
                }
              ]
            },
            then:[
              {
                function:"ifthen",
                if:{
                  function:">",
                  args:[
                    {
                      function:"Get Tic",
                      instrument:{name:"M",type:"equity",ticker:"M"},
                      index:0,
                      key:"volume"
                    },
                    300000
                  ]
                },
                then:[
                  {
                    function:">",
                    args:[
                      {
                        function:"ATR",
                        instrument:{name:"M",type:"equity",ticker:"M"},
                        candletime:"1day",
                        period:14
                      },
                      2
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      then:[
        {
          function:"Place Market Order",
          exchange:"NSE",
          instrument:{name:"MARUTI",type:"equity",ticker:"MARUTI"},
          quantity:40
        }
      ]
    }
  },

  // 10. Ultra deep nested entry
  {
    name:"Valid 10 — Ultra Deep Multi-Layer Entry",
    author:"vader",
    strategy:{
      function:"ifthen",
      if:{
        function:"ifthen",
        if:{
          function:">",
          args:[
            {
              function:"Ichimoku",
              instrument:{name:"R",type:"equity",ticker:"R"},
              candletime:"1day",
              tenkan:9,
              kijun:26,
              senkou_a:52,
              senkou_b:52,
              key:"senkou_a"
            },
            {
              function:"Ichimoku",
              instrument:{name:"R",type:"equity",ticker:"R"},
              candletime:"1day",
              tenkan:9,
              kijun:26,
              senkou_a:52,
              senkou_b:52,
              key:"senkou_b"
            }
          ]
        },
        then:[
          {
            function:"ifthen",
            if:{
              function:">",
              args:[
                {
                  function:"ADX",
                  instrument:{name:"R",type:"equity",ticker:"R"},
                  candletime:"1day",
                  period:14
                },
                25
              ]
            },
            then:[
              {
                function:"ifthen",
                if:{
                  function:">",
                  args:[
                    {
                      function:"MACD",
                      instrument:{name:"R",type:"equity",ticker:"R"},
                      candletime:"1day",
                      fast:12,
                      slow:26,
                      signal:9,
                      key:"macd"
                    },
                    {
                      function:"MACD",
                      instrument:{name:"R",type:"equity",ticker:"R"},
                      candletime:"1day",
                      fast:12,
                      slow:26,
                      signal:9,
                      key:"signal"
                    }
                  ]
                },
                then:[
                  {
                    function:"ifthen",
                    if:{
                      function:">",
                      args:[
                        {
                          function:"ATR",
                          instrument:{name:"R",type:"equity",ticker:"R"},
                          candletime:"1day",
                          period:14
                        },
                        2.5
                      ]
                    },
                    then:[
                      {
                        function:">",
                        args:[
                          70,
                          {
                            function:"RSI",
                            instrument:{name:"R",type:"equity",ticker:"R"},
                            candletime:"1day",
                            period:14
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      then:[
        {
          function:"Place Market Order",
          exchange:"NSE",
          instrument:{name:"RELIANCE",type:"equity",ticker:"RELIANCE"},
          quantity:35
        }
      ]
    }
  },

];

// ============================================================================
// INVALID STRATEGIES
// ============================================================================

const invalidStrategies = [

  // 1 — Unknown function
  {
    name:"Invalid 1 — Unknown Function",
    author:"vader",
    strategy:{
      function:"ifthen",
      if:{
        function:"SMMAAAA", // invalid function name
      },
      then:[1]
    }
  },

  // 2 — SMA missing period
  {
    name:"Invalid 2 — Missing SMA Period",
    author:"vader",
    strategy:{
      function:"ifthen",
      if:{
        function:"SMA",
        candletime:"1day"
        // missing instrument & period -> invalid
      },
      then:[1]
    }
  },

  // 3 — Candle wrong key
  {
    name:"Invalid 3 — Candle Output Wrong Enum",
    author:"vader",
    strategy:{
      function:"ifthen",
      if:{
        function:"Get Candle",
        instrument:{name:"X",type:"equity",ticker:"X"},
        candletime:"1day",
        index:0,
        key:"median" // invalid key
      },
      then:[1]
    }
  },

  // 4 — nums must be array
  {
    name:"Invalid 4 — nums Should Be Array",
    author:"vader",
    strategy:{
      function:"ifthen",
      if:{
        function:"+",
        args:{
          function:"RSI",
          instrument:{name:"X",type:"equity",ticker:"X"},
          candletime:"1day",
          period:14
        }
      },
      then:[1]
    }
  },

  // 5 — Invalid candletime
  {
    name:"Invalid 5 — Wrong candletime",
    author:"vader",
    strategy:{
      function:"ifthen",
      if:{
        function:"RSI",
        instrument:{name:"X",type:"equity",ticker:"X"},
        candletime:"10min", // invalid
        period:14
      },
      then:[1]
    }
  },

  // 6 — Market order missing instrument
  {
    name:"Invalid 6 — Market Order Missing Instrument",
    author:"vader",
    strategy:{
      function:"ifthen",
      if:1,
      then:[
        {
          function:"Place Market Order",
          exchange:"NSE",
          quantity:10
        }
      ]
    }
  },

  // 7 — quantity wrong type
  {
    name:"Invalid 7 — Quantity Wrong Type",
    author:"vader",
    strategy:{
      function:"ifthen",
      if:1,
      then:[
        {
          function:"Place Market Order",
          exchange:"NSE",
          instrument:{name:"INFY",type:"equity",ticker:"INFY"},
          quantity:"FIFTEEN" // invalid type
        }
      ]
    }
  },

  // 8 — limit order missing currency
  {
    name:"Invalid 8 — Limit Order Missing Currency",
    author:"vader",
    strategy:{
      function:"ifthen",
      if:1,
      then:[
        {
          function:"Place Limit Order",
          exchange:"NSE",
          instrument:{name:"TCS",type:"equity",ticker:"TCS"},
          quantity:10,
          limit_price:3500
          // missing currency -> invalid
        }
      ]
    }
  },

  // 9 — then must be array
  {
    name:"Invalid 9 — Invalid then Type",
    author:"vader",
    strategy:{
      function:"ifthen",
      if:1,
      then:"BUY NOW" // should be array
    }
  },

  // 10 — nested ifthen invalid (inner RSI missing required period -> invalid shape)
  {
    name:"Invalid 10 — Broken Nested Logic",
    author:"vader",
    strategy:{
      function:"ifthen",
      if:{
        function:"ifthen",
        if:{
          function:"RSI",
          instrument:{name:"X",type:"equity",ticker:"X"},
          candletime:"1day"
          // MISSING period -> this makes the inner RSI call invalid so the overall strategy fails
        },
        then:[ { function: "Place Market Order", exchange: "NSE", instrument:{name:"SBIN",type:"equity",ticker:"SBIN"}, quantity:5 } ]
      },
      then:[
        {
          function:"Place Market Order",
          exchange:"NSE",
          instrument:{name:"SBIN",type:"equity",ticker:"SBIN"},
          quantity:5
        }
      ]
    }
  }

];

// ============================================================================
// TEST RUNNER
// ============================================================================

console.log("============================================================");
console.log("VALID STRATEGIES");
console.log("============================================================");

validStrategies.forEach((test, i) => {
  const result = StrategySchema.safeParse(test);
  const name = `Valid Test ${i + 1}`;

  if (result.success) {
    console.log(`${name}: PASS`);
  } else {
    console.log(`${name}: FAIL`);
    console.log(result.error.format());
  }
});

console.log("\n============================================================");
console.log("INVALID STRATEGIES");
console.log("============================================================");

invalidStrategies.forEach((test, i) => {
  const result = StrategySchema.safeParse(test);
  const name = `Invalid Test ${i + 1}`;

  if (!result.success) {
    console.log(`${name}: PASS`);
  } else {
    console.log(`${name}: FAIL (should have failed but passed)`);
  }
});

console.log("\nAll tests complete.");
