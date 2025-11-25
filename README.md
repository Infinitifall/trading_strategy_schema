# Trading Strategy Schema

A trading strategy DSL and transpiler. Use at your own discretion!


## DSL

A [Zod schema](https://zod.dev/) is used to define the DSL.


|Design|Philosophy|
|------|----------|
|Everything is an expression|-|
|Expressions evaluate to an atomic type|Chaining functions together is trivial. Superior control flow [1](https://clojure.org/guides/learn/flow).|
|`number` is the only atomic type|The C programming language|
|Uniform interface: `{"function": ... }`|Easy to parse. Easy to remember. Easy to read and to write. Eliminates the need to build an AST [1](https://web.archive.org/web/20130202074222/https://blogs.oracle.com/blue/entry/homoiconic_languages).|
|Abundant choice of trading indicators|Give users all the choices they care about! This doesn't interfere with the simplicity our DSL!|


```bash
# install
npm install

# validate test strategies
npm run test
```


Here's what an example strategy looks like:

```json
{
  "name": "Valid 1 — RSI + ATR WRB Buy",
  "author": "vader",
  "strategy": {
    "function": "ifthen",
    "if": {
      "function": "AND",
      "args": [
        {
          "function": ">",
          "args": [
            30,
            {
              "function": "RSI",
              "instrument": {
                "name": "R",
                "type": "equity",
                "ticker": "R"
              },
              "candletime": "1day",
              "period": 14
            }
          ]
        },
        {
          "function": ">",
          "args": [
            {
              "function": "-",
              "args": [
                {
                  "function": "Get Candle",
                  "instrument": {
                    "name": "R",
                    "type": "equity",
                    "ticker": "R"
                  },
                  "candletime": "1day",
                  "index": 0,
                  "key": "high"
                },
                {
                  "function": "Get Candle",
                  "instrument": {
                    "name": "R",
                    "type": "equity",
                    "ticker": "R"
                  },
                  "candletime": "1day",
                  "index": 0,
                  "key": "low"
                }
              ]
            },
            {
              "function": "ATR",
              "instrument": {
                "name": "R",
                "type": "equity",
                "ticker": "R"
              },
              "candletime": "1day",
              "period": 14
            }
          ]
        }
      ]
    },
    "then": [
      {
        "function": "Place Market Order",
        "exchange": "NSE",
        "instrument": {
          "name": "RELIANCE",
          "type": "equity",
          "ticker": "RELIANCE"
        },
        "quantity": 12
      }
    ]
  }
}
```


## Transpiler (JSON to Python)

A transpiler to convert a trading strategy to a `Strategy` Python class, compatible with [backtrader](https://github.com/mementum/backtrader).

```bash
# install
python3 -m venv my-venv
pip install -r requirements.txt

# run
python3 transpiler/transpiler.py
```
