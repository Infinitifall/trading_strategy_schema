# Trading Strategy Schema

A trading strategy DSL and transpiler, for use with [backtrader](https://github.com/mementum/backtrader). Use at your own discretion.

## Strategy DSL

We use a [Zod](https://zod.dev/) schema to define our trading strategy DSL.

|Design choice|Philosophy|
|-------------|---------|
|S-expression-like|Eliminates the need to build an AST during transpilation [\[1\]](https://web.archive.org/web/20130202074222/https://blogs.oracle.com/blue/entry/homoiconic_languages)|
|Atoms are numbers|The C programming language|
|Functions return numbers|Chaining functions together is trivial|
|Huge list of indicators|Give users all the choices they care about [\[2\]](https://www.joelonsoftware.com/2000/04/12/choices/)|
|Aggressive minimalism|All else being equal, less code is easier to reason about|


```bash
# install
npm install

# validate test strategies
npm run test
```


An example strategy:

```json
{
  "name": "Valid 2 — ADX/DMI/SMA Trend Long",
  "author": "vader",
  "strategy": {
    "function": "ifthen",
    "if": {
      "function": "AND",
      "args": [
        {
          "function": ">",
          "args": [
            {
              "function": "ADX",
              "instrument": {
                "name": "I",
                "type": "equity",
                "ticker": "I"
              },
              "candletime": "1day",
              "period": 14
            },
            20
          ]
        },
        {
          "function": ">",
          "args": [
            {
              "function": "DMI",
              "instrument": {
                "name": "I",
                "type": "equity",
                "ticker": "I"
              },
              "candletime": "1day",
              "period": 14,
              "key": "plus"
            },
            {
              "function": "DMI",
              "instrument": {
                "name": "I",
                "type": "equity",
                "ticker": "I"
              },
              "candletime": "1day",
              "period": 14,
              "key": "minus"
            }
          ]
        },
        {
          "function": ">",
          "args": [
            {
              "function": "Get Candle",
              "instrument": {
                "name": "I",
                "type": "equity",
                "ticker": "I"
              },
              "candletime": "1day",
              "index": 0,
              "key": "close"
            },
            {
              "function": "SMA",
              "instrument": {
                "name": "I",
                "type": "equity",
                "ticker": "I"
              },
              "candletime": "1day",
              "period": 50
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
          "name": "INFY",
          "type": "equity",
          "ticker": "INFY"
        },
        "quantity": 10
      }
    ]
  }
}
```

## Transpiler

A transpiler in Python to convert a trading strategy in JSON format to a `Strategy` class compatible with [backtrader](https://github.com/mementum/backtrader).

```bash
# install
python3 -m venv my-venv
pip install -r requirements.txt

# run
python3 transpiler/transpiler.py
```
