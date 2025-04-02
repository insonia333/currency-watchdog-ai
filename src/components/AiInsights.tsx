import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";

interface Insight {
  title: string;
  content: string;
}

interface AiInsightsProps {
  insights: Insight[];
}

const AiInsights: React.FC<AiInsightsProps> = ({ insights }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          Insights de Moedas por IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="space-y-2">
            <h3 className="font-semibold">{insight.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{insight.content}</p>
          </div>
        ))}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-2 border-t">
        Análise gerada usando IA com base em dados recentes do mercado e notícias
      </CardFooter>
    </Card>
  );
};

export default AiInsights;
