import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from "@/components/ui/textarea";
import QRCodeGenerator from './QRCodeGenerator';

interface CalendarFormData {
  title: string;
  description: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
}

const CalendarQRForm = () => {
  const [formData, setFormData] = useState<CalendarFormData>({
    title: '',
    description: '',
    location: '',
    startDateTime: '',
    endDateTime: ''
  });
  const [showQR, setShowQR] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return '';
    // Convert to format: YYYYMMDDTHHMMSSZ
    const dt = new Date(dateTimeStr);
    return dt.toISOString()
      .replace(/[-:]/g, '')  // Remove dashes and colons
      .replace(/\.\d{3}/, '') // Remove milliseconds
  };

  const handleSubmit = () => {
    setShowQR(true);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Event Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Event Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Event Title"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Event Description"
              rows={3}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Event Location"
            />
          </div>

          {/* Date & Time Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDateTime" className="text-sm font-medium">
                Start Date & Time
              </label>
              <Input
                id="startDateTime"
                name="startDateTime"
                type="datetime-local"
                value={formData.startDateTime}
                onChange={handleInputChange}
                className="flex-1"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="endDateTime" className="text-sm font-medium">
                End Date & Time
              </label>
              <Input
                id="endDateTime"
                name="endDateTime"
                type="datetime-local"
                value={formData.endDateTime}
                onChange={handleInputChange}
                className="flex-1"
              />
            </div>
          </div>

          <Button 
            className="w-full bg-black hover:bg-gray-800 text-white"
            onClick={handleSubmit}
          >
            Generate QR Code
          </Button>

          {/* QR Code Display */}
          {showQR && formData.title && formData.startDateTime && (
            <div className="mt-6">
              <QRCodeGenerator 
                data={{
                  summary: formData.title,
                  startDate: formatDateTime(formData.startDateTime),
                  endDate: formatDateTime(formData.endDateTime),
                  location: formData.location,
                  description: formData.description
                }}
                type="calendar"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarQRForm;