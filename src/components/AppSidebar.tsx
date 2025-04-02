import React from "react";
import { Home, LineChart, Search, Star, Globe, BrainCircuit, ArrowLeftRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "./Logo";
import { Link } from "react-router-dom";

// Menu items with proper routes
const items = [
  {
    title: "Painel",
    url: "/",
    icon: Home,
  },
  {
    title: "Conversor de Moedas",
    url: "/currency-converter",
    icon: ArrowLeftRight,
  },
  {
    title: "Análise de Mercado",
    url: "/market-analysis",
    icon: LineChart,
  },
  {
    title: "Mapa Global",
    url: "/global-map",
    icon: Globe,
  },
  {
    title: "Previsões IA",
    url: "/ai-predictions",
    icon: BrainCircuit,
  },
  {
    title: "Busca",
    url: "/search",
    icon: Search,
  },
  {
    title: "Favoritos",
    url: "/favorites",
    icon: Star,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <div className="p-4">
        <Logo />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
