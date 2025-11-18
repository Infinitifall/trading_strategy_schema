import { z } from "zod";

let ExpressionSchema: z.ZodType;
let FunctionCallSchema: z.ZodType;
let IfThenSchema: z.ZodType;

const AllFunctions = (() => {
  const CurrencySchema = z.enum(["INR"]);
  const AssetSchema = z.object({
    name: z.string(),
    type: z.enum(["equity", "options", "futures"]),
    ticker: z.string(),
  });
  const CandleTimeSchema = z.enum(["1min", "5min", "1hour", "1day", "1week"]);
  const ExchangeSchema = z.enum(["NSE", "BSE"]);

  const FunctionShapes = {
    // --- User data ------------------------------------------------------
    "Get Capital": {
      index: z.lazy(() => ExpressionSchema), // 0 => current, -1, -2, ... => historical
      key: z.enum(["quantity"]),
    },
    "Get Position": {
      index: z.lazy(() => ExpressionSchema),
      key: z.enum(["entry_price", "quantity"]),
    },

    // --- Market data ------------------------------------------------------
    "Get Order Book": {
      instrument: AssetSchema,
      side: z.enum(["bid", "offer"]),
      index: z.lazy(() => ExpressionSchema), // 0 => best, -1, -2, ... => worse
      key: z.enum(["price", "quantity"]),
    },
    "Get Candle": {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema), // 0 => current, -1, -2, ... => historical
      key: z.enum(["open", "high", "low", "close", "volume"]),
    },
    "Get Tic": {
      instrument: AssetSchema,
      index: z.lazy(() => ExpressionSchema),
      key: z.enum(["ltp", "volume"]),
    },

    // --- Orders -------------------------------------------------------------
    "Place Market Order": {
      exchange: ExchangeSchema,
      instrument: AssetSchema,
      quantity: z.lazy(() => ExpressionSchema), // 0< => buy, 0> => sell
    },
    "Place Limit Order": {
      exchange: ExchangeSchema,
      instrument: AssetSchema,
      quantity: z.lazy(() => ExpressionSchema), // 0< => buy, 0> => sell
      currency: CurrencySchema,
      limit_price: z.lazy(() => ExpressionSchema),
    },

    // --- Arithmetic and Logic ---------------------------------------------------------
    "+": { args: z.array(z.lazy(() => ExpressionSchema)) },
    "-": { args: z.array(z.lazy(() => ExpressionSchema)) },
    "*": { args: z.array(z.lazy(() => ExpressionSchema)) },
    "/": { args: z.array(z.lazy(() => ExpressionSchema)) },
    MIN: { args: z.array(z.lazy(() => ExpressionSchema)) },
    MAX: { args: z.array(z.lazy(() => ExpressionSchema)) },
    AND: { args: z.array(z.lazy(() => ExpressionSchema)) },
    OR: { args: z.array(z.lazy(() => ExpressionSchema)) },
    NOT: { args: z.array(z.lazy(() => ExpressionSchema)) },
    ">": { args: z.array(z.lazy(() => ExpressionSchema)) },
    "==": { args: z.array(z.lazy(() => ExpressionSchema)) },

    // --- Moving Averages ----------------------------------------------------
    SMA: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
    },
    EMA: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
      smoothing: z.lazy(() => ExpressionSchema),
    },
    WMA: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
    },
    HMA: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
    },
    SMMA: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
    },
    DEMA: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      fast: z.lazy(() => ExpressionSchema),
      slow: z.lazy(() => ExpressionSchema),
    },
    TEMA: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      fast: z.lazy(() => ExpressionSchema),
      slow: z.lazy(() => ExpressionSchema),
    },
    TRIMA: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
    },
    KAMA: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
    },

    // --- Trend strength -----------------------------------------------------
    ADX: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
    },
    ADXR: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
    },
    DMI: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
      key: z.enum(["plus", "minus"]),
    },
    Aroon: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
      key: z.enum(["up", "down"]),
    },
    "Parabolic SAR": {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      step: z.lazy(() => ExpressionSchema),
      max_step: z.lazy(() => ExpressionSchema),
    },
    Ichimoku: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      tenkan: z.lazy(() => ExpressionSchema),
      kijun: z.lazy(() => ExpressionSchema),
      senkou_a: z.lazy(() => ExpressionSchema),
      senkou_b: z.lazy(() => ExpressionSchema),
      key: z.enum(["tenkan", "kijun", "senkou_a", "senkou_b", "chikou"]),
    },

    // --- Momentum -----------------------------------------------------------
    RSI: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
    },
    Stochastic: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      k_period: z.lazy(() => ExpressionSchema),
      d_period: z.lazy(() => ExpressionSchema),
      key: z.enum(["k", "d"]),
    },
    "Stochastic RSI": {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      k_period: z.lazy(() => ExpressionSchema),
      d_period: z.lazy(() => ExpressionSchema),
      key: z.enum(["k", "d"]),
    },
    CCI: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
    },
    ROC: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
    },
    "Williams %R": {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
    },
    "Ultimate Oscillator": {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
    },
    TRIX: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
    },

    // --- MACD ---------------------------------------------------------------
    MACD: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      fast: z.lazy(() => ExpressionSchema),
      slow: z.lazy(() => ExpressionSchema),
      signal: z.lazy(() => ExpressionSchema),
      key: z.enum(["macd", "signal", "hist"]),
    },

    // --- Volatility ---------------------------------------------------------
    ATR: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
    },
    "Bollinger Bands": {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
      stddev: z.lazy(() => ExpressionSchema),
      key: z.enum(["high", "middle", "low"]),
    },

    "Donchian Channels": {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
      key: z.enum(["high", "low"]),
    },

    "Keltner Channels": {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
      multiplier: z.lazy(() => ExpressionSchema),
      key: z.enum(["high", "middle", "low"]),
    },

    // --- Volume -------------------------------------------------------------
    OBV: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema),
    },
    "Chaikin Money Flow": {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
    },
    "Accum/Dist Line": {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema),
    },
    "Force Index": {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
    },
    "Volume Oscillator": {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
    },

    // --- Market structure ---------------------------------------------------
    "Pivot Points": {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
      key: z.enum(["pp", "r1", "r2", "r3", "s1", "s2", "s3"]),
    },

    // --- Misc QOL functions ---------------------------------------------------
    "Fair Value Gap": {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema),
    },
    "Put Call Ratio": {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
    },
    "Open Interest": {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
      period: z.lazy(() => ExpressionSchema),
    },
    VWAP: {
      instrument: AssetSchema,
      candletime: CandleTimeSchema,
    },
  };

  return Object.entries(FunctionShapes).map(([function_name, function_shape]) =>
    z.object({
      function: z.literal(function_name),
      ...function_shape,
    }),
  );
})();

FunctionCallSchema = z.discriminatedUnion("function", AllFunctions as any);

IfThenSchema = z.lazy(() =>
  z.object({
    function: z.literal("ifthen"),
    if: ExpressionSchema,
    then: z.array(ExpressionSchema),
    else: z.array(ExpressionSchema).optional(),
  }),
);

ExpressionSchema = z.lazy(() =>
  z.union([z.number(), FunctionCallSchema, IfThenSchema]),
);

export const StrategySchema = z.object({
  name: z.string(),
  author: z.string(),
  strategy: IfThenSchema,
});

export type Strategy = z.infer<typeof StrategySchema>;
