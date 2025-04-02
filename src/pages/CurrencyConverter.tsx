import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const CurrencyConverter = () => {
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [result, setResult] = useState<number | null>(null);

  // Mock exchange rates for demonstration
  const exchangeRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    JPY: 151.67,
    CAD: 1.36,
    AUD: 1.52,
    CHF: 0.91,
    CNY: 7.25,
    INR: 83.45,
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    if (result) {
      // Recalculate after swap
      const amountNum = parseFloat(amount);
      if (!isNaN(amountNum)) {
        const newResult = convertCurrency(amountNum, toCurrency, fromCurrency);
        setResult(newResult);
      }
    }
  };

  const convertCurrency = (
    amount: number,
    from: string,
    to: string
  ): number => {
    const fromRate = exchangeRates[from as keyof typeof exchangeRates];
    const toRate = exchangeRates[to as keyof typeof exchangeRates];
    return (amount / fromRate) * toRate;
  };

  const handleConvert = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um número positivo válido",
        variant: "destructive",
      });
      return;
    }

    const convertedAmount = convertCurrency(
      amountNum,
      fromCurrency,
      toCurrency
    );
    setResult(convertedAmount);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold">Conversor de Moedas</h1>
            <p className="text-muted-foreground">
              Converta entre diferentes moedas com taxas em tempo real
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Converter Moeda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">De</label>
                    <Select
                      value={fromCurrency}
                      onValueChange={setFromCurrency}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a moeda" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(exchangeRates).map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-2">
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Valor"
                      />
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10 flex-shrink-0 mt-8"
                    onClick={handleSwap}
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </Button>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Para</label>
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a moeda" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(exchangeRates).map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {result !== null && (
                      <div className="p-2 bg-muted rounded-md mt-2 text-lg font-semibold">
                        {result.toFixed(4)} {toCurrency}
                      </div>
                    )}
                  </div>
                </div>

                <Button onClick={handleConvert} className="w-full">
                  <ArrowLeftRight className="mr-2 h-4 w-4" />
                  Converter
                </Button>

                <div className="text-xs text-muted-foreground text-center pt-4">
                  <p>As taxas de câmbio são apenas para fins de demonstração</p>
                  <p>Última atualização: 31 de março de 2025</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CurrencyConverter;
