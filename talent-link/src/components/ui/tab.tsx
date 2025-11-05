import { useState, createContext, useContext } from "react";
import * as React from 'react'

interface TabProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsProps {
  children: React.ReactNode;
  defaultValue: string;
  className?: string;
}

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = (): TabsContextValue => {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("Tabs components must be used within <Tabs>");
  }
  return ctx;
};

export const Tabs = ({ children, defaultValue, className }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

Tabs.displayName = "Tabs";

export const TabsList = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const base = "grid grid-cols-3 gap-2 bg-gray-200 rounded-lg p-1 w-full";
  return <div className={`${base} ${className ?? ""}`}>{children}</div>;
};

TabsList.displayName = "TabsList";

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsTrigger = ({ value, children, className }: TabsTriggerProps) => {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = value === activeTab;
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`w-full py-2 px-4 font-semibold text-base rounded-md transition-colors ${
        isActive ? "bg-white text-black shadow" : "bg-gray-200 text-black hover:bg-gray-300"
      } ${className ?? ""}`}
    >
      {children}
    </button>
  );
};

TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = ({ value, children, className }: TabProps) => {
  const { activeTab } = useTabsContext();
  if (value !== activeTab) return null;
  return (
    <div className={className}>
      {children}
    </div>
  );
};

TabsContent.displayName = "TabsContent";
