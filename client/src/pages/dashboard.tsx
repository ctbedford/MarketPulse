import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MessageSquare } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Sample data imported from the provided code
const campaignData = [
  { id: 1, name: 'Summer Promo', retailer: 'Walmart', brand: 'Brand A', startDate: '2024-06-01', endDate: '2024-07-15', budget: 85000, impressions: 3200000, cpm: 26.56, roas: 4.2, salesLift: 15.3, incrementalSales: 357000, testStores: 450 },
  { id: 2, name: 'Back to School', retailer: 'Target', brand: 'Brand B', startDate: '2024-08-01', endDate: '2024-09-15', budget: 120000, impressions: 5100000, cpm: 23.53, roas: 3.8, salesLift: 12.7, incrementalSales: 456000, testStores: 380 },
  { id: 3, name: 'Holiday Special', retailer: 'Walmart', brand: 'Brand A', startDate: '2024-11-15', endDate: '2024-12-31', budget: 180000, impressions: 7800000, cpm: 23.08, roas: 5.2, salesLift: 24.5, incrementalSales: 936000, testStores: 520 },
  { id: 4, name: 'Spring Event', retailer: 'Target', brand: 'Brand C', startDate: '2024-03-01', endDate: '2024-04-15', budget: 75000, impressions: 2800000, cpm: 26.79, roas: 3.5, salesLift: 10.2, incrementalSales: 262500, testStores: 320 },
  { id: 5, name: 'Easter Promo', retailer: 'Kroger', brand: 'Brand B', startDate: '2024-03-15', endDate: '2024-04-10', budget: 65000, impressions: 2200000, cpm: 29.55, roas: 3.1, salesLift: 8.5, incrementalSales: 201500, testStores: 280 }
];

const timeSeriesData = [
  { week: 'Week 1', 'Summer Promo': 25000, 'Back to School': 0, 'Holiday Special': 0, 'Spring Event': 21000, 'Easter Promo': 18000 },
  { week: 'Week 2', 'Summer Promo': 32000, 'Back to School': 0, 'Holiday Special': 0, 'Spring Event': 25000, 'Easter Promo': 22000 },
  { week: 'Week 3', 'Summer Promo': 38000, 'Back to School': 0, 'Holiday Special': 0, 'Spring Event': 28000, 'Easter Promo': 27000 },
  { week: 'Week 4', 'Summer Promo': 42000, 'Back to School': 0, 'Holiday Special': 0, 'Spring Event': 31000, 'Easter Promo': 29000 },
  { week: 'Week 5', 'Summer Promo': 45000, 'Back to School': 0, 'Holiday Special': 0, 'Spring Event': 35000, 'Easter Promo': 0 }
];

const regionMetrics = [
  { region: 'Northeast', impressions: 5.2, budget: 110, sales: 3.8, incrementalSales: 4.1, roas: 3.7 },
  { region: 'Midwest', impressions: 8.1, budget: 180, sales: 6.9, incrementalSales: 7.2, roas: 4.0 },
  { region: 'South', impressions: 11.5, budget: 260, sales: 13.7, incrementalSales: 12.8, roas: 4.9 },
  { region: 'West', impressions: 10.8, budget: 210, sales: 11.5, incrementalSales: 11.0, roas: 5.2 }
];

const regionColors = {
  'Northeast': '#003f5c',
  'Midwest': '#7a5195', 
  'South': '#ef5675',
  'West': '#ffa600'
};

const Dashboard = () => {
  const [selectedRetailer, setSelectedRetailer] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedMediaType, setSelectedMediaType] = useState('All');
  const [selectedMetric, setSelectedMetric] = useState('ROAS');
  const [showAiWidget, setShowAiWidget] = useState(false);
  const { toast } = useToast();

  const retailers = ['All', 'Walmart', 'Target', 'Kroger'];
  const brands = ['All', 'Brand A', 'Brand B', 'Brand C'];
  const mediaTypes = ['All', 'Display', 'Social', 'Video', 'Search'];
  const metrics = ['ROAS', 'Sales Lift %', 'Incremental $', 'Impressions', 'Budget'];

  const filteredCampaigns = campaignData.filter(campaign => {
    if (selectedRetailer !== 'All' && campaign.retailer !== selectedRetailer) return false;
    if (selectedBrand !== 'All' && campaign.brand !== selectedBrand) return false;
    return true;
  });

  const handleExport = (type: string) => {
    toast({
      title: "Export Started",
      description: `Exporting dashboard as ${type}...`,
    });
  };

  const getBarChartData = () => {
    return filteredCampaigns.map(campaign => {
      const data = { name: campaign.name };
      switch (selectedMetric) {
        case 'ROAS':
          data.value = campaign.roas;
          break;
        case 'Sales Lift %':
          data.value = campaign.salesLift;
          break;
        case 'Incremental $':
          data.value = campaign.incrementalSales / 1000;
          break;
        case 'Impressions':
          data.value = campaign.impressions / 1000000;
          break;
        case 'Budget':
          data.value = campaign.budget / 1000;
          break;
        default:
          data.value = 0;
      }
      return data;
    });
  };

  const getYAxisLabel = () => {
    switch (selectedMetric) {
      case 'ROAS':
        return 'ROAS (x)';
      case 'Sales Lift %':
        return 'Sales Lift (%)';
      case 'Incremental $':
        return 'Incremental Sales ($K)';
      case 'Impressions':
        return 'Impressions (M)';
      case 'Budget':
        return 'Budget ($K)';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Campaign Analytics Dashboard</h1>
          
          <div className="flex gap-4 items-center">
            <div className="grid grid-cols-4 gap-4">
              <Select value={selectedRetailer} onValueChange={setSelectedRetailer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Retailer" />
                </SelectTrigger>
                <SelectContent>
                  {retailers.map(retailer => (
                    <SelectItem key={retailer} value={retailer}>{retailer}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedMediaType} onValueChange={setSelectedMediaType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Media Type" />
                </SelectTrigger>
                <SelectContent>
                  {mediaTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Metric" />
                </SelectTrigger>
                <SelectContent>
                  {metrics.map(metric => (
                    <SelectItem key={metric} value={metric}>{metric}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className="ml-4"
              onClick={() => setShowAiWidget(!showAiWidget)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              {showAiWidget ? 'Hide AI Assistant' : 'Show AI Assistant'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Campaign Performance - {selectedMetric}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getBarChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis label={{ value: getYAxisLabel(), angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis label={{ value: 'Sales ($K)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    {Object.keys(timeSeriesData[0])
                      .filter(key => key !== 'week' && timeSeriesData.some(item => item[key] > 0))
                      .map((key, index) => (
                        <Line
                          key={key}
                          type="monotone"
                          dataKey={key}
                          stroke={`hsl(${index * 45}, 70%, 50%)`}
                          strokeWidth={2}
                        />
                      ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{showAiWidget ? 'AI Assistant' : 'Regional Performance'}</CardTitle>
            </CardHeader>
            <CardContent>
              {showAiWidget ? (
                <div className="h-[400px] bg-muted/10 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Campaign Insights</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Based on the current view, the Holiday Special campaign shows the strongest performance with a ROAS of 5.2x and the highest incremental sales of $936K. The West region leads in ROAS at 5.2x while the South shows the highest total sales.
                  </p>
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Ask a question about the data..."
                      className="w-full p-2 rounded-md border"
                    />
                    <Button className="w-full mt-2">
                      Generate Insights
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {regionMetrics.map(region => (
                    <div
                      key={region.region}
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: `${regionColors[region.region]}15` }}
                    >
                      <h3 className="font-bold text-lg">{region.region}</h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">ROAS</span>
                          <span className="font-medium">{region.roas}x</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Inc. Sales</span>
                          <span className="font-medium">${region.incrementalSales}M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Budget</span>
                          <span className="font-medium">${region.budget}K</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Campaign</th>
                      <th className="text-left p-2">Retailer</th>
                      <th className="text-left p-2">Brand</th>
                      <th className="text-left p-2">Dates</th>
                      <th className="text-right p-2">Budget</th>
                      <th className="text-right p-2">Impressions</th>
                      <th className="text-right p-2">CPM</th>
                      <th className="text-right p-2">ROAS</th>
                      <th className="text-right p-2">Sales Lift</th>
                      <th className="text-right p-2">Incremental $</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCampaigns.map(campaign => (
                      <tr key={campaign.id} className="border-b">
                        <td className="p-2">{campaign.name}</td>
                        <td className="p-2">{campaign.retailer}</td>
                        <td className="p-2">{campaign.brand}</td>
                        <td className="p-2">
                          {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                        </td>
                        <td className="p-2 text-right">${campaign.budget.toLocaleString()}</td>
                        <td className="p-2 text-right">{(campaign.impressions / 1000000).toFixed(1)}M</td>
                        <td className="p-2 text-right">${campaign.cpm.toFixed(2)}</td>
                        <td className="p-2 text-right">{campaign.roas.toFixed(1)}x</td>
                        <td className="p-2 text-right">{campaign.salesLift.toFixed(1)}%</td>
                        <td className="p-2 text-right">${(campaign.incrementalSales / 1000).toFixed(0)}K</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={() => handleExport('Excel')}>
            Export to Excel
          </Button>
          <Button variant="outline" onClick={() => handleExport('PDF')}>
            Export to PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport('Dashboard')}>
            Save Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
