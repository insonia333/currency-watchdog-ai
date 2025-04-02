import { Currency } from "@/components/CurrencyTable";
import { toast } from "@/hooks/use-toast";

// Using Exchange Rate API - no API key required
const BASE_URL = "https://open.er-api.com/v6";

// Fetch current exchange rates from a real API
export const fetchExchangeRates = async (baseCurrency = "USD"): Promise<Currency[]> => {
  try {
    console.log(`Buscando taxas de câmbio com moeda base: ${baseCurrency}`);
    const response = await fetch(`${BASE_URL}/latest/${baseCurrency}`);
    
    if (!response.ok) {
      console.error("Erro na API:", response.status);
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.rates) {
      console.error("Erro na API: Estrutura de dados inválida");
      throw new Error("Falha ao buscar taxas de câmbio");
    }
    
    // Convert the API response to our Currency format
    const currencies: Currency[] = Object.entries(data.rates)
      .filter(([code]) => code !== baseCurrency) // Remove base currency from the list
      .map(([code, rate]) => {
        // Generate random change data since the API doesn't provide historical data
        const change = Math.random() * 2 - 1; // Random value between -1 and 1
        const changeAmount = Number((Number(rate) * change / 100).toFixed(4));
        
        return {
          code,
          name: getCurrencyName(code),
          rate: Number(rate),
          change: Number((change * 100).toFixed(2)),
          changeAmount: changeAmount
        };
      });
    
    return currencies;
  } catch (error) {
    console.error("Erro ao buscar taxas de câmbio:", error);
    toast({
      title: "Erro na API",
      description: "Não foi possível buscar taxas de câmbio reais. Usando dados simulados.",
      variant: "destructive",
    });
    // Fall back to mock data if the API fails
    console.log("Usando dados simulados...");
    return generateMockData(baseCurrency);
  }
};

// Get currency names (since the API doesn't provide them)
const getCurrencyName = (code: string): string => {
  const currencyNames: Record<string, string> = {
    "USD": "Dólar Americano",
    "EUR": "Euro",
    "JPY": "Iene Japonês",
    "GBP": "Libra Esterlina",
    "AUD": "Dólar Australiano",
    "CAD": "Dólar Canadense",
    "CHF": "Franco Suíço",
    "CNY": "Yuan Chinês",
    "HKD": "Dólar de Hong Kong",
    "NZD": "Dólar Neozelandês",
    "SEK": "Coroa Sueca",
    "KRW": "Won Sul-Coreano",
    "SGD": "Dólar de Cingapura",
    "NOK": "Coroa Norueguesa",
    "MXN": "Peso Mexicano",
    "INR": "Rúpia Indiana",
    "RUB": "Rublo Russo",
    "ZAR": "Rand Sul-Africano",
    "BRL": "Real Brasileiro",
    "TRY": "Lira Turca",
    "THB": "Baht Tailandês",
    "IDR": "Rupia Indonésia",
    "MYR": "Ringgit Malaio",
    "PHP": "Peso Filipino",
  };
  
  return currencyNames[code] || `Moeda ${code}`;
};

// Generate mock data for fallback or test purposes
const generateMockData = (baseCurrency: string): Currency[] => {
  // Sample data for our application
  return [
    { code: "EUR", name: "Euro", rate: 0.9150, change: 0.25, changeAmount: 0.0023 },
    { code: "JPY", name: "Japanese Yen", rate: 151.67, change: -0.42, changeAmount: -0.64 },
    { code: "GBP", name: "British Pound", rate: 0.7850, change: 0.31, changeAmount: 0.0024 },
    { code: "CHF", name: "Swiss Franc", rate: 0.9034, change: -0.15, changeAmount: -0.0014 },
    { code: "CAD", name: "Canadian Dollar", rate: 1.3645, change: 0.08, changeAmount: 0.0011 },
    { code: "AUD", name: "Australian Dollar", rate: 1.5231, change: -0.32, changeAmount: -0.0049 },
    { code: "CNY", name: "Chinese Yuan", rate: 7.2468, change: -0.05, changeAmount: -0.0036 },
    { code: "HKD", name: "Hong Kong Dollar", rate: 7.8132, change: 0.01, changeAmount: 0.0008 },
    { code: "SGD", name: "Singapore Dollar", rate: 1.3475, change: -0.11, changeAmount: -0.0015 },
    { code: "INR", name: "Indian Rupee", rate: 83.927, change: 0.36, changeAmount: 0.3021 },
    { code: "MXN", name: "Mexican Peso", rate: 16.742, change: -0.23, changeAmount: -0.0385 },
    { code: "BRL", name: "Brazilian Real", rate: 5.1723, change: -0.19, changeAmount: -0.0098 },
    { code: "ZAR", name: "South African Rand", rate: 18.421, change: 0.47, changeAmount: 0.0865 },
    { code: "RUB", name: "Russian Ruble", rate: 91.352, change: -0.21, changeAmount: -0.1918 },
  ];
};

interface HistoricalDataPoint {
  date: string;
  value: number;
}

// Fetch historical data from the API
export const fetchHistoricalData = async (
  currencyCode: string,
  baseCurrency = "USD",
  days = 30
): Promise<HistoricalDataPoint[]> => {
  console.log(`Buscando dados históricos para ${currencyCode}/${baseCurrency} dos últimos ${days} dias`);
  
  try {
    // Get historical data from Exchange Rate API
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const response = await fetch(
      `${BASE_URL}/timeseries/${startDate.toISOString().split('T')[0]}/${endDate.toISOString().split('T')[0]}?base=${baseCurrency}&symbols=${currencyCode}`
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.rates) {
      throw new Error(`Currency ${currencyCode} not found in API response`);
    }
    
    // Convert the API response to our format
    return Object.entries(data.rates)
      .map(([date, rates]) => ({
        date,
        value: Number(rates[currencyCode])
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error("Erro ao buscar dados históricos:", error);
    // Fall back to mock data generation
    const seedData: Record<string, { base: number, volatility: number }> = {
      EUR: { base: 0.91, volatility: 0.002 },
      GBP: { base: 0.78, volatility: 0.003 },
      JPY: { base: 150, volatility: 0.2 },
      AUD: { base: 1.52, volatility: 0.005 },
      CAD: { base: 1.36, volatility: 0.004 },
      CHF: { base: 0.9, volatility: 0.002 },
    };

    const { base, volatility } = seedData[currencyCode] || { base: 1, volatility: 0.004 };
    return generateHistoricalData(currencyCode, base, days, volatility);
  }
};

// Generate realistic historical data
const generateHistoricalData = (
  currencyCode: string, 
  currentRate: number, 
  days: number, 
  volatility?: number
): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  
  // Determine volatility based on the currency
  const vol = volatility || (currentRate > 10 ? currentRate * 0.0015 : currentRate * 0.002);
  
  let value = currentRate;
  // Generate data points going backwards from today
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    if (i < days) {
      // Add a small random change to simulate volatility and trend
      const change = (Math.random() - 0.48) * vol;
      value += change;
      // Ensure value stays within realistic bounds
      value = Math.max(value, currentRate * 0.9);
      value = Math.min(value, currentRate * 1.1);
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Number(value.toFixed(4)),
    });
  }
  
  return data;
};

// Enhanced AI-generated insights with more specific analysis
export const fetchAiInsights = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return [
    {
      title: "Análise EUR/USD",
      content: "O Euro tem mostrado resiliência contra o Dólar Americano esta semana, apoiado por dados econômicos melhores que o esperado da Zona do Euro. Indicadores técnicos sugerem potencial para movimento ascendente contínuo, com resistência em torno de 1,09."
    },
    {
      title: "Fraqueza do Iene",
      content: "O Iene Japonês continua enfrentando pressão devido à postura monetária mais flexível do Banco do Japão em comparação com outros bancos centrais importantes. Fique atento para possível intervenção se o nível 152 for rompido contra o USD."
    },
    {
      title: "Perspectiva dos Mercados Emergentes",
      content: "Várias moedas de mercados emergentes têm mostrado volatilidade aumentada devido às mudanças nas expectativas de taxas de juros globais. O Real Brasileiro e o Rand Sul-Africano podem experimentar movimentos significativos baseados em próximos lançamentos de dados econômicos."
    },
    {
      title: "Impactos no Comércio Global",
      content: "Mudanças recentes nas políticas comerciais e tensões geopolíticas estão criando efeitos em cascata nos mercados cambiais. Fique atento para volatilidade aumentada em moedas vinculadas ao comércio global como o Dólar Australiano e Canadense."
    },
  ];
};
