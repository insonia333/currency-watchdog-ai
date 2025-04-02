import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CurrencyCard from "@/components/CurrencyCard";
import CurrencyChart from "@/components/CurrencyChart";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import CurrencyTable, { Currency } from "@/components/CurrencyTable";
import AiInsights from "@/components/AiInsights";
import CurrencyMap from "@/components/CurrencyMap";
import { ArrowRightLeft, Calendar, RefreshCw, TrendingDown, TrendingUp } from "lucide-react";
import { fetchAiInsights, fetchExchangeRates, fetchHistoricalData } from "@/services/currencyService";

const Index = () => {
  const baseCurrency = "USD";
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [topCurrencies, setTopCurrencies] = useState<Currency[]>([]);
  const [historicalData, setHistoricalData] = useState<Record<string, any>>({});
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch currency data
        const currencyData = await fetchExchangeRates(baseCurrency);
        setCurrencies(currencyData);
        
        // Set top currencies
        setTopCurrencies(currencyData.slice(0, 4));
        
        // Fetch historical data for main currencies
        const historicalDataMap: Record<string, any> = {};
        for (const currency of ['EUR', 'GBP', 'JPY']) {
          const data = await fetchHistoricalData(currency, baseCurrency, 30);
          historicalDataMap[currency] = data;
        }
        setHistoricalData(historicalDataMap);
        
        // Fetch AI insights
        const insightsData = await fetchAiInsights();
        setInsights(insightsData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const currencyData = await fetchExchangeRates(baseCurrency);
      setCurrencies(currencyData);
      setTopCurrencies(currencyData.slice(0, 4));
    } finally {
      setLoading(false);
    }
  };

  // Determine trend for charts
  const getTrend = (data: any[]) => {
    if (!data || data.length < 2) return "neutral";
    const start = data[0].value;
    const end = data[data.length - 1].value;
    return end > start ? "up" : end < start ? "down" : "neutral";
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Currency Watchdog AI</h1>
              <p className="text-muted-foreground">
                Monitoramento de moedas em tempo real com insights baseados em IA
              </p>
            </div>
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar Dados
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {loading ? (
              // Show skeleton cards when loading
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="h-6 bg-muted rounded animate-pulse w-1/3"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-muted rounded animate-pulse w-1/2 mb-2"></div>
                      <div className="h-8 bg-muted rounded animate-pulse w-2/3"></div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              // Show real data when loaded
              topCurrencies.map((currency) => (
                <CurrencyCard
                  key={currency.code}
                  code={currency.code}
                  name={currency.name}
                  rate={currency.rate}
                  change={currency.change}
                  baseCode={baseCurrency}
                />
              ))
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="col-span-1 lg:col-span-2 space-y-6">
              <Tabs defaultValue="30d" className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Tendências de Moedas</h2>
                  <TabsList>
                    <TabsTrigger value="7d" className="text-xs">7D</TabsTrigger>
                    <TabsTrigger value="30d" className="text-xs">30D</TabsTrigger>
                    <TabsTrigger value="90d" className="text-xs">90D</TabsTrigger>
                    <TabsTrigger value="1y" className="text-xs">1A</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="30d" className="mt-0 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                    {loading ? (
                      // Chart skeletons
                      Array(2).fill(0).map((_, i) => (
                        <Card key={i}>
                          <CardHeader>
                            <div className="h-6 bg-muted rounded animate-pulse w-1/3"></div>
                          </CardHeader>
                          <CardContent>
                            <div className="h-[300px] bg-muted/50 rounded animate-pulse"></div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      // Real charts
                      Object.entries(historicalData).slice(0, 2).map(([code, data]) => (
                        <CurrencyChart
                          key={code}
                          title={`Taxa de Câmbio ${code}/${baseCurrency}`}
                          data={data as any}
                          currencyCode={code}
                          baseCurrency={baseCurrency}
                          trend={getTrend(data as any)}
                          period="Últimos 30 Dias"
                        />
                      ))
                    )}
                  </div>
                </TabsContent>
                
                {/* Placeholders for other time periods */}
                <TabsContent value="7d">
                  <Card>
                    <CardContent className="pt-6 flex items-center justify-center h-[300px] text-muted-foreground">
                      <div className="text-center">
                        <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm font-medium">Visualização de 7 dias em breve</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="90d">
                  <Card>
                    <CardContent className="pt-6 flex items-center justify-center h-[300px] text-muted-foreground">
                      <div className="text-center">
                        <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm font-medium">Visualização de 90 dias em breve</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="1y">
                  <Card>
                    <CardContent className="pt-6 flex items-center justify-center h-[300px] text-muted-foreground">
                      <div className="text-center">
                        <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm font-medium">Visualização de 1 ano em breve</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">All Currencies</h2>
                  <Button variant="outline" size="sm">
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    Convert
                  </Button>
                </div>
                {loading ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="h-10 bg-muted rounded animate-pulse w-full"></div>
                        {Array(5).fill(0).map((_, i) => (
                          <div key={i} className="h-12 bg-muted/60 rounded animate-pulse w-full"></div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <CurrencyTable currencies={currencies} baseCurrency={baseCurrency} />
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <AiInsights 
                insights={loading ? [] : insights}
              />
              <CurrencyMap />
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Market Signals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center p-3 rounded-lg bg-green-500/10 text-green-600">
                    <TrendingUp className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">EUR/USD bullish pattern</p>
                      <p className="text-xs text-muted-foreground mt-1">Breaking above 1.09 resistance</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 rounded-lg bg-red-500/10 text-red-600">
                    <TrendingDown className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">JPY weakening trend</p>
                      <p className="text-xs text-muted-foreground mt-1">Approaching 152 against USD</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
