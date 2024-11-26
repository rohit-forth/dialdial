import { AreaGraph } from './area-graph';
import { BarGraph } from './bar-graph';
import { PieGraph } from './pie-graph';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import { RecentSales } from './recent-sales';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tracking } from './tracking-status';

export default function OverViewPage() {
  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hello, John 👋
          </h2>
          <h3>Today is Monday, 21 October, 2024</h3>
        </div>
     
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 xl:grid-cols-7">
              {/* Jobs graph - spans 4 columns */}
              <div className="col-span-4">
                <AreaGraph />
              </div>

              {/* Top keywords - spans 3 columns */}
              <Card className="col-span-4 md:col-span-3">
                <CardHeader className="p-4 border-b">
                  <CardTitle>Top keywords used</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <RecentSales />
                </CardContent>
              </Card>

              {/* Call tracking status - spans 3 columns */}
              <div className="col-span-3 md:col-span-3">
                <Tracking />
              </div>
              {/* <Card className="col-span-4 md:col-span-3">
                <div className="p-4">
                  <Tracking />
                </div>
              </Card> */}

              {/* Lead conversion rate - spans 4 columns */}
              <div className="col-span-4 md:col-span-3 lg:col-span-4">
                <BarGraph />
              </div>
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </PageContainer>
  );
}
