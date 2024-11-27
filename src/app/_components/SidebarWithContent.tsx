'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Link,
  CalendarDays,
  Wifi,
  MapPin,
  Phone,
  Mail,
  FileText,
  User,
  Menu,
  X
} from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader,
  SheetTitle,
  SheetTrigger 
} from "@/components/ui/sheet";

// Import your QR form components
import URLQRForm from './QR/URLQRForm';
import VCardQRForm from './QR/VCardQRForm';
import CalendarQRForm from './QR/CalenderQRForm';
import WiFiQRForm from './QR/WiFiQRForm';
// Import other form components as they're created
// import VCardQRForm from './VCardQRForm';
// import CalendarQRForm from './CalendarQRForm';
// etc.

const menuItems = [
  { id: 'url', icon: Link, label: 'URL' },
  { id: 'vcard', icon: User, label: 'vCard' },
  { id: 'calendar', icon: CalendarDays, label: 'Calendar' },
  { id: 'wifi', icon: Wifi, label: 'WiFi' },
  { id: 'location', icon: MapPin, label: 'Location' },
  { id: 'phone', icon: Phone, label: 'Phone' },
  { id: 'email', icon: Mail, label: 'Email' },
  { id: 'text', icon: FileText, label: 'Text' }
];

// Component to render the appropriate form based on activeItem
const QRFormSelector = ({ activeItem }:{activeItem:string}) => {
  switch (activeItem) {
    case 'url':
      return <URLQRForm />;
    case 'vcard':
      return <VCardQRForm />;
    case 'calendar':
      return <CalendarQRForm />;
    case 'wifi':
      return <WiFiQRForm />;
    case 'location':
      return <div className="text-center text-gray-500">Location QR form coming soon...</div>;
    case 'phone':
      return <div className="text-center text-gray-500">Phone QR form coming soon...</div>;
    case 'email':
      return <div className="text-center text-gray-500">Email QR form coming soon...</div>;
    case 'text':
      return <div className="text-center text-gray-500">Text QR form coming soon...</div>;
    default:
      return <URLQRForm />;
  }
};

export const SidebarWithContent = () => {
  const [activeItem, setActiveItem] = useState('url');
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <ScrollArea className="h-full py-6">
      <div className="px-3 space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeItem === item.id ? "secondary" : "ghost"}
            className="w-full justify-start gap-2 px-3 hover:bg-accent hover:text-accent-foreground"
            onClick={() => {
              setActiveItem(item.id);
              setIsOpen(false);
            }}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );

  return (
    <div className="flex min-h-screen relative">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 border-r">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">QR Code Generator</h2>
        </div>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>QR Code Generator</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">
            Generate {activeItem.charAt(0).toUpperCase() + activeItem.slice(1)} QR Code
          </h2>
          <QRFormSelector activeItem={activeItem} />
        </div>
      </div>
    </div>
  );
};

export default SidebarWithContent;