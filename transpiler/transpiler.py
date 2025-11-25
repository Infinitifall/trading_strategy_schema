import json
from functools import reduce
from typing import Callable

import backtrader as bt


class Context:
    def __init__(self):

        # TODO: connect all of these to backtrader
        self.feeds = {}       # Dict[(instrument_ticker, candletime)  : feed]
        self.indicators = {}  # Dict[(indicator_name, args...) : indicator]  (args might be period, smoothness, ...)
        self.broker = None    # Broker class

        self.user_capital  = []  # 0 => current, -1, -2, ... => historical
        self.user_position = []  # 0 => current, -1, -2, ... => historical
        self.environment   = {}  # map symbols to expressions


    # return feed if already added
    # feed_key uniquely identifies an indicator (for example, index doesn't matter)
    def resolve_feed(self, d: dict):
        feed_key = json.dumps({k: v for k, v in d.items() if k not in ["index", "key"]})
        if feed_key not in self.feeds:
            self.feeds[feed_key] = None  # TODO: Depends on how we'll add/stream feed data, DB, microservice, etc
        return self.feeds[feed_key]


    # return indicator if already added, else add indicator
    # indicator_key uniquely identifies an indicator (for example, index doesn't matter)
    def resolve_indicator(self, d: dict, indicator):
        indicator_key = json.dumps({k: v for k, v in d.items() if k not in ["index"]})
        if indicator_key not in self.indicators:
            self.indicators[indicator_key] = indicator
        index = d['index']  # DSL is identical to backtrader, index : 0 => current, -1, -2, ... => historical
        return self.indicators[indicator_key][index]


FUNCTION_MAP: dict[str, Callable[[Context, dict], int]] = {

    # --- User Data ----------------
    "Get User Capital":  lambda ctx, d: ctx.user_capital[d["index"]],
    "Get User Position": lambda ctx, d: ctx.user_position[d["index"]][d["key"]],

    # --- Price Data ----------------
    "Get Candle": lambda ctx, d: ctx.resolve_feed(d)[d["key"]],
    "Get Tic": lambda ctx, d: 0,  # TODO: implement Get Tic

    # --- Market Data ----------------
    "Get Order Book": lambda ctx, d: 0,  # TODO: implement Order Book
    "Place Market Order": lambda ctx, d: ctx.broker.buy(
        data = ctx.resolve_feed(d),
        size = d["quantity"]
    ) if d["quantity"] > 0 else ctx.broker.sell(
        data = ctx.resolve_feed(d),
        size = -d["quantity"]  # TODO: double negatives?
    ),
    "Place Limit Order": lambda ctx, d: ctx.broker.buy(
        data = ctx.resolve_feed(d),
        size = d["quantity"],
        price = d["limit_price"],
        exectype = bt.Order.Limit
    ) if d["quantity"] > 0 else ctx.broker.sell(
        data = ctx.resolve_feed(d),
        size = -d["quantity"],  # TODO: double negatives?
        price = d["limit_price"],
        exectype = bt.Order.Limit
    ),

    # --- Arithmetic and Logic ----------------
    "+":   lambda ctx, d: sum(d["args"]),
    "-":   lambda ctx, d: (d["args"][0] - sum(d["args"][1:])) if len(d["args"])>1 else -d["args"][0],
    "*":   lambda ctx, d: reduce(lambda a,b: a*b,  d["args"], 1),
    "/":   lambda ctx, d: reduce(lambda a,b: a/b,  d["args"]),
    "^":   lambda ctx, d: d["args"][0] ** d["args"][1],
    "ABS": lambda ctx, d: abs(d["args"][0]),
    "MIN": lambda ctx, d: min(d["args"]),
    "MAX": lambda ctx, d: max(d["args"]),
    "AND": lambda ctx, d: all(d["args"]),
    "OR":  lambda ctx, d: any(d["args"]),
    "NOT": lambda ctx, d: not d["args"][0],
    ">":   lambda ctx, d: d["args"][0] > d["args"][1],  # TODO: comparators should be multi-arity
    "<":   lambda ctx, d: d["args"][0] < d["args"][1],
    "<=":  lambda ctx, d: d["args"][0] <= d["args"][1],
    ">=":  lambda ctx, d: d["args"][0] >= d["args"][1],
    "==":  lambda ctx, d: d["args"][0] == d["args"][1],
    "!=":  lambda ctx, d: d["args"][0] != d["args"][1],

    # --- Moving Averages ----------------
    "SMA": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.SMA(
            ctx.resolve_feed(d),
            period = int(d["period"])
        )
    ),
    "EMA": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.EMA(
            ctx.resolve_feed(d),
            period = int(d["period"])
        )
    ),
    "WMA": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.WMA(
            ctx.resolve_feed(d),
            period = int(d["period"])
        )
    ),
    "HMA": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.HMA(
            ctx.resolve_feed(d),
            period = int(d["period"])
        )
    ),
    "SMMA": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.SmoothedMovingAverage(
            ctx.resolve_feed(d),
            period = int(d["period"])
        )
    ),
    "TRIMA": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.TRIMA(
            ctx.resolve_feed(d),
            period = int(d["period"])
        )
    ),
    "DEMA": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.DEMA(
            ctx.resolve_feed(d),
            period = int(d["fast"])  # backtrader ignores slow
        )
    ),
    "TEMA": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.TEMA(
            ctx.resolve_feed(d),
            period = int(d["fast"])  # backtrader ignores slow
        )
    ),
    "KAMA": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.KAMA(
            ctx.resolve_feed(d),
            period = int(d["period"])
        )
    ),

    # --- Trend Strength -----------------
    "ADX": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.ADX(
            ctx.resolve_feed(d),
            period = int(d["period"])
        )
    ),
    "ADXR": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.ADXR(
            ctx.resolve_feed(d),
            period = int(d["period"])
        )
    ),
    "DMI": lambda ctx, d: (
        ctx.resolve_indicator(
            d,
            bt.ind.PlusDI(
                ctx.resolve_feed(d),
                period=int(d["period"])
            )
        )
        if d["key"] == "plus"
        else ctx.resolve_indicator(
            d,
            bt.ind.MinusDI(
                ctx.resolve_feed(d),
                period=int(d["period"])
            )
        )
    ),
    "Aroon": lambda ctx, d: (
        ctx.resolve_indicator(
            d,
            bt.ind.AroonUp(
                ctx.resolve_feed(d),
                period=int(d["period"])
            )
        )
        if d["key"] == "up"
        else ctx.resolve_indicator(
            d,
            bt.ind.AroonDown(
                ctx.resolve_feed(d),
                period=int(d["period"])
            )
        )
    ),
    "Parabolic SAR": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.ParabolicSAR(
            ctx.resolve_feed(d),
            af = float(d["step"]),
            afmax = float(d["max_step"])
        )
    ),

    # --- Ichimoku -----------------------
    "Ichimoku": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.Ichimoku(
            ctx.resolve_feed(d),
            tenkan=int(d["tenkan"]),
            kijun=int(d["kijun"]),
            senkou=int(d["senkou_a"])
        )
    ),

    # --- Momentum -----------------------
    "RSI": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.RSI(
            ctx.resolve_feed(d),
            period = int(d["period"])
        )
    ),
    "Stochastic": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.Stochastic(
            ctx.resolve_feed(d),
            period=int(d["k_period"]),
            period_dfast=int(d["d_period"]),
        )
    ),
    "Stochastic RSI": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.StochRSI(
            ctx.resolve_feed(d),
            period=int(d["k_period"]),
            period_dfast=int(d["d_period"])
        )
    ),
    "CCI": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.CCI(
            ctx.resolve_feed(d),
            period=int(d["period"])
        )
    ),
    "ROC": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.ROC(
            ctx.resolve_feed(d),
            period=int(d["period"])
        )
    ),
    "Williams %R": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.WilliamsR(
            ctx.resolve_feed(d),
            period=int(d["period"])
        )
    ),
    "Ultimate Oscillator": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.UltimateOscillator(
            ctx.resolve_feed(d)
        )
    ),
    "TRIX": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.TRIX(
            ctx.resolve_feed(d),
            period=int(d["period"])
        )
    ),

    # --- MACD ---------------------------
    "MACD": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.MACD(
            ctx.resolve_feed(d),
            fastperiod=int(d["fast"]),
            slowperiod=int(d["slow"]),
            signalperiod=int(d["signal"])
        )
    ),

    # --- Volatility ---------------------
    "ATR": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.ATR(
            ctx.resolve_feed(d),
            period=int(d["period"])
        )
    ),
    "Bollinger Bands": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.BollingerBands(
            ctx.resolve_feed(d),
            period=int(d["period"]),
            devfactor=float(d["stddev"])
        )
    ),
    "Donchian Channels": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.DonchianChannels(
            ctx.resolve_feed(d),
            period=int(d["period"])
        )
    ),
    "Keltner Channels": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.KeltnerChannels(
            ctx.resolve_feed(d),
            period=int(d["period"]),
            mult=float(d["multiplier"])
        )
    ),

    # --- Volume -------------------------
    "OBV": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.OBV(
            ctx.resolve_feed(d)
        )
    ),
    "Chaikin Money Flow": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.ChaikinMoneyFlow(
            ctx.resolve_feed(d),
            period=int(d["period"])
        )
    ),
    "Accum/Dist Line": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.AccumulationDistribution(
            ctx.resolve_feed(d)
        )
    ),
    "Force Index": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.ForceIndex(
            ctx.resolve_feed(d),
            period=int(d["period"])
        )
    ),
    "Volume Oscillator": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.VolumeOscillator(
            ctx.resolve_feed(d)
        )
    ),

    # --- Misc ---------------------------
    "Pivot Points": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.PivotPoint(
            ctx.resolve_feed(d)
        )
    ),
    "Fair Value Gap": lambda ctx, d: 0,  # TODO: implement all of these
    "Put Call Ratio": lambda ctx, d: 0,
    "Open Interest": lambda ctx, d: 0,
    "VWAP": lambda ctx, d: ctx.resolve_indicator(
        d,
        bt.ind.VWAP(
            ctx.resolve_feed(d)
        )
    ),
}


def eval_expression(ctx: Context, expr: int | float | dict):
    if not isinstance(expr, dict):
        return expr

    match expr.get("function", ""):
        case "ifthen":
            # eval branch exprs, return eval of last expr
            condition = eval_expression(ctx, expr["if"])
            branch_exprs = expr["then"] if condition else expr.get("else", [])
            results = [eval_expression(ctx, each_expr) for each_expr in branch_exprs]
            return 0 if len(results) == 0 else results[-1]

        case "set":
            # store expr without eval (lazy), silent overwrite
            ctx.environment[expr["symbol"]] = expr["value"]
            return 1

        case "get":
            return eval_expression(ctx, ctx.environment.get(expr["symbol"], 0))

        case _:
            # recursively eval args (in place), return fn
            expr_fn = FUNCTION_MAP.get(expr["function"], lambda *args: 0)
            for key in expr:
                expr[key] = eval_expression(ctx, expr[key])
            return expr_fn(ctx, expr)
