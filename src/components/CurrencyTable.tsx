import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  ArrowDown, 
  ArrowUp, 
  ArrowUpDown, 
  Search,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface Currency {
  code: string;
  name: string;
  rate: number;
  change: number;
  changeAmount: number;
}

interface CurrencyTableProps {
  currencies: Currency[];
  baseCurrency: string;
}

type SortField = "code" | "name" | "rate" | "change";

const CurrencyTable: React.FC<CurrencyTableProps> = ({ currencies, baseCurrency }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("code");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleFavorite = (code: string) => {
    if (favorites.includes(code)) {
      setFavorites(favorites.filter(fav => fav !== code));
    } else {
      setFavorites([...favorites, code]);
    }
  };

  const sortedAndFilteredCurrencies = [...currencies]
    .filter(
      (currency) =>
        currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        currency.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === "code") {
        return sortDirection === "asc"
          ? a.code.localeCompare(b.code)
          : b.code.localeCompare(a.code);
      } else if (sortField === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === "rate") {
        return sortDirection === "asc" ? a.rate - b.rate : b.rate - a.rate;
      } else {
        return sortDirection === "asc" ? a.change - b.change : b.change - a.change;
      }
    });

  return (
    <div className="rounded-md border bg-card">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar moedas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <div className="relative overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[80px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium -ml-4"
                  onClick={() => handleSort("code")}
                >
                  Código
                  {sortField === "code" ? (
                    sortDirection === "asc" ? (
                      <ArrowUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-1 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium -ml-4"
                  onClick={() => handleSort("name")}
                >
                  Moeda
                  {sortField === "name" ? (
                    sortDirection === "asc" ? (
                      <ArrowUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-1 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium -ml-4"
                  onClick={() => handleSort("rate")}
                >
                  Taxa
                  {sortField === "rate" ? (
                    sortDirection === "asc" ? (
                      <ArrowUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-1 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium -ml-4"
                  onClick={() => handleSort("change")}
                >
                  Variação (24h)
                  {sortField === "change" ? (
                    sortDirection === "asc" ? (
                      <ArrowUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-1 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
                  )}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredCurrencies.map((currency) => (
              <TableRow key={currency.code}>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => toggleFavorite(currency.code)}
                    className="h-8 w-8"
                  >
                    <Star 
                      className={cn(
                        "h-4 w-4", 
                        favorites.includes(currency.code) 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "text-muted-foreground"
                      )} 
                    />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{currency.code}</TableCell>
                <TableCell>{currency.name}</TableCell>
                <TableCell className="text-right">
                  {currency.rate.toFixed(4)} {baseCurrency}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      "inline-flex items-center",
                      currency.change > 0
                        ? "text-finance-increase"
                        : currency.change < 0
                        ? "text-finance-decrease"
                        : "text-finance-neutral"
                    )}
                  >
                    {currency.change > 0 ? (
                      <ArrowUp className="mr-1 h-3 w-3" />
                    ) : currency.change < 0 ? (
                      <ArrowDown className="mr-1 h-3 w-3" />
                    ) : null}
                    {currency.change.toFixed(2)}%
                    <span className="text-muted-foreground ml-1">
                      ({currency.changeAmount > 0 ? "+" : ""}
                      {currency.changeAmount.toFixed(4)})
                    </span>
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CurrencyTable;
