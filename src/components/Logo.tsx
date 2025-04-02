import { CircleDollarSign } from "lucide-react";
import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <CircleDollarSign className="h-6 w-6 text-primary" />
      <span className="text-xl font-bold">CurrencyWatch IA</span>
    </div>
  );
};

export default Logo;
