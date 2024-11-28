import React from 'react';
import {Switch} from '@/components/ui/switch';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageContainer from '@/components/layout/page-container';

const SettingsPage = () => {
  return (
    <PageContainer scrollable>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <p className="heading mb-4 text-xl sm:text-2xl">Settings</p>
        
        <div className="mx-auto py-4">
          {/* Main grid - responsive for mobile, tablet, and desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* User Management */}
            <section className="bg-background p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg font-medium mb-4">User Management</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="user-list" className="mb-2 block">User List</Label>
                  <Button variant="outline" className="w-full">
                    View User List
                  </Button>
                </div>
                <div>
                  <Label htmlFor="add-user" className="mb-2 block">Add User</Label>
                  <Input id="add-user" placeholder="Enter new user details" />
                </div>
              </div>
            </section>

            {/* Call & Chat Settings */}
            <section className="bg-background p-4 sm:p-6 rounded-lg border">
              <h2 className="text-lg font-medium mb-4">Call & Chat Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-call-distribution" className="flex-grow">
                    Automatic Call Distribution
                  </Label>
                  <Switch id="auto-call-distribution" />
                </div>
                <div>
                  <Label htmlFor="call-escalation" className="mb-2 block">Call Escalation</Label>
                  <Textarea 
                    id="call-escalation" 
                    placeholder="Configure call escalation rules"
                    className="min-h-[100px]" 
                  />
                </div>
                <div>
                  <Label htmlFor="automated-responses" className="mb-2 block">Automated Responses</Label>
                  <Button variant="outline" className="w-full">
                    Manage Automated Responses
                  </Button>
                </div>
                <div>
                  <Label htmlFor="chat-routing" className="mb-2 block">Chat Routing</Label>
                  <Textarea 
                    id="chat-routing" 
                    placeholder="Configure chat routing rules"
                    className="min-h-[100px]" 
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Integrations - Full width on all screens */}
          <section className="mt-6 sm:mt-8 bg-background p-4 sm:p-6 rounded-lg border">
            <h2 className="text-lg font-medium mb-4">Integrations</h2>
            <div className="grid gap-4 sm:gap-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="crm-integration" className="flex-grow">CRM Integration</Label>
                <Switch id="crm-integration" />
              </div>
              <div className="sm:max-w-md">
                <Label htmlFor="messaging-platforms" className="mb-2 block">Messaging Platforms</Label>
                <Button variant="outline" className="w-full">
                  Manage Messaging Integrations
                </Button>
              </div>
            </div>
          </section>

          {/* Preferences - Responsive grid for form elements */}
          <section className="mt-6 sm:mt-8 bg-background p-4 sm:p-6 rounded-lg border">
            <h2 className="text-lg font-medium mb-4">Preferences</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="alert-thresholds" className="mb-2 block">Alert Thresholds</Label>
                <Textarea 
                  id="alert-thresholds" 
                  placeholder="Configure alert thresholds"
                  className="min-h-[100px]" 
                />
              </div>
              
              {/* Notification Channels - Grid layout for tablet */}
              <div className="space-y-4">
                <Label className="block">Notification Channels</Label>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3  rounded-lg">
                    <Label htmlFor="email-notifications">Email</Label>
                    <Switch id="email-notifications" />
                  </div>
                  <div className="flex items-center justify-between p-3  rounded-lg">
                    <Label htmlFor="mobile-notifications">Mobile Push</Label>
                    <Switch id="mobile-notifications" />
                  </div>
                </div>
              </div>

              {/* Branding & Styling - Responsive grid */}
              <div className="space-y-4">
                <Label className="block">Branding & Styling</Label>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo-upload" className="block">Logo</Label>
                    <Input 
                      type="file" 
                      id="logo-upload"
                      className="file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm " 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color-palette" className="block">Color Palette</Label>
                    <Input 
                      type="color" 
                      id="color-palette" 
                      className="h-10 w-full" 
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="chat-widget" className="mb-2 block">Chat Widget Customization</Label>
                    <Button variant="outline" className="w-full">
                      Customize Chat Widget
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-8 flex justify-end">
            <Button variant="default" className="w-full sm:w-auto bg-dynamic text-white">Save Changes</Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <SettingsPage />
    </DashboardLayout>
  );
}