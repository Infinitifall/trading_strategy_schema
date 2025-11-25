import { z } from "zod";

let ExpressionSchema: z.ZodType;
let FunctionCallSchema: z.ZodType;
let IfThenSchema: z.ZodType;

const AllFunctions = (() => {
  const CurrencySchema = z.enum(["INR"]);
  const ExchangeSchema = z.enum(["NSE", "BSE"]);
  const CandleTimeSchema = z.enum(["1min", "5min", "1hour", "1day", "1week"]);
  const InstrumentTypes = z.enum(["equity", "options", "futures"]);
  const InstrumentSchema = z.object({ name: z.string(), ticker: z.string(), type: InstrumentTypes });

  const FunctionShapes = {

    // --- User data ------------------------------------------------------
    "Get User Capital": {
      index: z.lazy(() => ExpressionSchema),  // 0 => current, -1, -2, ... => historical
    },
    "Get User Position": {
      index: z.lazy(() => ExpressionSchema),
      key: z.enum(["average_price", "quantity"]),
    },

    // --- Price data ------------------------------------------------------
    "Get Candle": {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema),  // 0 => current, -1, -2, ... => historical
      key: z.enum(["open", "high", "low", "close", "volume"]),
    },
    "Get Tic": {
      instrument: InstrumentSchema,
      index: z.lazy(() => ExpressionSchema),
      key: z.enum(["ltp", "volume"]),
    },

    // --- Market Data -------------------------------------------------------------
    "Get Order Book": {
      instrument: InstrumentSchema,
      side: z.enum(["bid", "offer"]),
      index: z.lazy(() => ExpressionSchema), // 0 => best, -1, -2, ... => worse
      key: z.enum(["price", "quantity"]),
    },
    "Place Market Order": {
      exchange: ExchangeSchema,
      instrument: InstrumentSchema,
      quantity: z.lazy(() => ExpressionSchema), // 0< => buy, 0> => sell
    },
    "Place Limit Order": {
      exchange: ExchangeSchema,
      instrument: InstrumentSchema,
      quantity: z.lazy(() => ExpressionSchema),
      currency: CurrencySchema,
      limit_price: z.lazy(() => ExpressionSchema),
    },

    // --- Arithmetic and Logic ---------------------------------------------------------
    "+":  { args: z.array(z.lazy(() => ExpressionSchema)) },
    "-":  { args: z.array(z.lazy(() => ExpressionSchema)) },
    "*":  { args: z.array(z.lazy(() => ExpressionSchema)) },
    "/":  { args: z.array(z.lazy(() => ExpressionSchema)) },
    "^":  { args: z.array(z.lazy(() => ExpressionSchema)).length(2) },
    ABS:  { args: z.array(z.lazy(() => ExpressionSchema)).length(1) },
    MIN:  { args: z.array(z.lazy(() => ExpressionSchema)) },  // False => 0, True => 1
    MAX:  { args: z.array(z.lazy(() => ExpressionSchema)) },
    AND:  { args: z.array(z.lazy(() => ExpressionSchema)) },
    OR:   { args: z.array(z.lazy(() => ExpressionSchema)) },
    NOT:  { args: z.array(z.lazy(() => ExpressionSchema)).length(1) },
    ">":  { args: z.array(z.lazy(() => ExpressionSchema)) },
    "<":  { args: z.array(z.lazy(() => ExpressionSchema)) },
    ">=": { args: z.array(z.lazy(() => ExpressionSchema)) },
    "<=": { args: z.array(z.lazy(() => ExpressionSchema)) },
    "==": { args: z.array(z.lazy(() => ExpressionSchema)) },
    "!=": { args: z.array(z.lazy(() => ExpressionSchema)) },

    // --- Set/Get Variables ---------------------------------------------------------
    "set": { symbol: z.string(), value: z.lazy(() => ExpressionSchema) },
    "get": { symbol: z.string() },

    // --- Moving Averages ----------------------------------------------------
    SMA: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),  // 0 => current, -1, -2, ... => historical
      period: z.lazy(() => ExpressionSchema),
    },
    EMA: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
      smoothing: z.lazy(() => ExpressionSchema),
    },
    WMA: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
    },
    HMA: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
    },
    SMMA: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
    },
    DEMA: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      fast: z.lazy(() => ExpressionSchema),
      slow: z.lazy(() => ExpressionSchema),
    },
    TEMA: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      fast: z.lazy(() => ExpressionSchema),
      slow: z.lazy(() => ExpressionSchema),
    },
    TRIMA: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
    },
    KAMA: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
    },

    // --- Trend strength -----------------------------------------------------
    ADX: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
    },
    ADXR: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
    },
    DMI: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
      key: z.enum(["plus", "minus"]),
    },
    Aroon: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
      key: z.enum(["up", "down"]),
    },
    "Parabolic SAR": {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      step: z.lazy(() => ExpressionSchema),
      max_step: z.lazy(() => ExpressionSchema),
    },
    Ichimoku: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      tenkan: z.lazy(() => ExpressionSchema),
      kijun: z.lazy(() => ExpressionSchema),
      senkou_a: z.lazy(() => ExpressionSchema),
      senkou_b: z.lazy(() => ExpressionSchema),
      key: z.enum(["tenkan", "kijun", "senkou_a", "senkou_b", "chikou"]),
    },

    // --- Momentum -----------------------------------------------------------
    RSI: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
    },
    Stochastic: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      k_period: z.lazy(() => ExpressionSchema),
      d_period: z.lazy(() => ExpressionSchema),
      key: z.enum(["k", "d"]),
    },
    "Stochastic RSI": {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      k_period: z.lazy(() => ExpressionSchema),
      d_period: z.lazy(() => ExpressionSchema),
      key: z.enum(["k", "d"]),
    },
    CCI: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
    },
    ROC: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
    },
    "Williams %R": {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
    },
    "Ultimate Oscillator": {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
    },
    TRIX: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
    },

    // --- MACD ---------------------------------------------------------------
    MACD: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      fast: z.lazy(() => ExpressionSchema),
      slow: z.lazy(() => ExpressionSchema),
      signal: z.lazy(() => ExpressionSchema),
      key: z.enum(["macd", "signal", "hist"]),
    },

    // --- Volatility ---------------------------------------------------------
    ATR: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
    },
    "Bollinger Bands": {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
      stddev: z.lazy(() => ExpressionSchema),
      key: z.enum(["high", "middle", "low"]),
    },

    "Donchian Channels": {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
      key: z.enum(["high", "low"]),
    },

    "Keltner Channels": {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
      multiplier: z.lazy(() => ExpressionSchema),
      key: z.enum(["high", "middle", "low"]),
    },

    // --- Volume -------------------------------------------------------------
    OBV: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
    },
    "Chaikin Money Flow": {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
    },
    "Accum/Dist Line": {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
    },
    "Force Index": {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
    },
    "Volume Oscillator": {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
    },

    // --- Misc ---------------------------------------------------
    "Pivot Points": {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
      key: z.enum(["pp", "r1", "r2", "r3", "s1", "s2", "s3"]),
    },
    "Fair Value Gap": {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
    },
    "Put Call Ratio": {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
    },
    "Open Interest": {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
      period: z.lazy(() => ExpressionSchema),
    },
    VWAP: {
      instrument: InstrumentSchema,
      candletime: CandleTimeSchema,
      index: z.lazy(() => ExpressionSchema).optional(),
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
