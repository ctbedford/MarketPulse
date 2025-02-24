import React, { useState, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell, ComposedChart, Area } from 'recharts';
import { MessageSquare, Calendar, Filter, Download, Save, RefreshCcw, MapPin, ChevronDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

// Define proper types for our data structures
interface Campaign {
  id: number;
  name: string;
  retailer: string;
  brand: string;
  subBrand: string;
  vendor: string;
  mediaType: string;
  event: string;
  region: string;
  startDate: string;
  endDate: string;
  budget: number;
  impressions: number;
  cpm: number;
  roas: number;
  salesLift: number;
  incrementalSales: number;
  testStores: number;
  controlStores: number;
  conversion: number;
  engagementRate: number;
  audienceReach: number;
  costPerAcquisition: number;
  mediaChannel: string;
  tactics: string[];
  targetAudience: string;
  category: string;
}

interface WeekData {
  week: string;
  date: Date;
  endDate: Date;
  [key: string]: any; // Index signature for campaign names
}

interface RegionMetric {
  region: string;
  impressions: number;
  budget: number;
  sales: number;
  incrementalSales: number;
  roas: number;
  numCampaigns: number;
  topPerformer: string;
  engagement: number;
  costPerAcquisition: number;
  percentChange: number;
  audienceReach: number;
  salesLiftPercent: number;
}

// Enhanced sample data with more fields and diverse values to demonstrate all filtering capabilities
const campaignData: Campaign[] = [
  { id: 1, name: 'Summer Promo', retailer: 'Walmart', brand: 'Brand A', subBrand: 'Product Line 1', vendor: 'Vendor X', mediaType: 'Display', event: 'Summer', region: 'National', startDate: '2024-05-31', endDate: '2024-07-14', budget: 85000, impressions: 3200000, cpm: 26.56, roas: 4.2, salesLift: 15.3, incrementalSales: 357000, testStores: 450, controlStores: 432, conversion: 2.8, engagementRate: 3.2, audienceReach: 1.8, costPerAcquisition: 15.4, mediaChannel: 'Digital', tactics: ['Banner Ads', 'Rich Media'], targetAudience: 'Families', category: 'Food & Beverage' },
  
  { id: 2, name: 'Back to School', retailer: 'Target', brand: 'Brand B', subBrand: 'Product Line 2', vendor: 'Vendor Y', mediaType: 'Social', event: 'Back to School', region: 'Northeast', startDate: '2024-07-31', endDate: '2024-09-14', budget: 120000, impressions: 5100000, cpm: 23.53, roas: 3.8, salesLift: 12.7, incrementalSales: 456000, testStores: 380, controlStores: 375, conversion: 3.2, engagementRate: 4.7, audienceReach: 2.2, costPerAcquisition: 18.2, mediaChannel: 'Social Media', tactics: ['Instagram Stories', 'Facebook Feed'], targetAudience: 'Students', category: 'School Supplies' },
  
  { id: 3, name: 'Holiday Special', retailer: 'Walmart', brand: 'Brand A', subBrand: 'Product Line 3', vendor: 'Vendor Z', mediaType: 'Video', event: 'Holiday', region: 'National', startDate: '2024-11-14', endDate: '2024-12-30', budget: 180000, impressions: 7800000, cpm: 23.08, roas: 5.2, salesLift: 24.5, incrementalSales: 936000, testStores: 520, controlStores: 505, conversion: 4.1, engagementRate: 5.3, audienceReach: 3.5, costPerAcquisition: 12.7, mediaChannel: 'Video', tactics: ['Connected TV', 'YouTube'], targetAudience: 'Gift Givers', category: 'Gifts & Seasonal' },
  
  { id: 4, name: 'Spring Event', retailer: 'Target', brand: 'Brand C', subBrand: 'Product Line 4', vendor: 'Vendor X', mediaType: 'Display', event: 'Spring', region: 'Midwest', startDate: '2024-02-29', endDate: '2024-04-14', budget: 75000, impressions: 2800000, cpm: 26.79, roas: 3.5, salesLift: 10.2, incrementalSales: 262500, testStores: 320, controlStores: 315, conversion: 2.6, engagementRate: 3.0, audienceReach: 1.5, costPerAcquisition: 19.1, mediaChannel: 'Digital', tactics: ['Native Ads', 'Interstitials'], targetAudience: 'DIY Enthusiasts', category: 'Home & Garden' },
  
  { id: 5, name: 'Easter Promo', retailer: 'Kroger', brand: 'Brand B', subBrand: 'Product Line 2', vendor: 'Vendor Y', mediaType: 'Search', event: 'Easter', region: 'South', startDate: '2024-03-14', endDate: '2024-04-09', budget: 65000, impressions: 2200000, cpm: 29.55, roas: 3.1, salesLift: 8.5, incrementalSales: 201500, testStores: 280, controlStores: 272, conversion: 5.2, engagementRate: 1.8, audienceReach: 0.9, costPerAcquisition: 14.6, mediaChannel: 'Search', tactics: ['Google Ads', 'Bing Ads'], targetAudience: 'Parents', category: 'Candy & Sweets' },
  
  { id: 6, name: 'New Year Kickoff', retailer: 'Walmart', brand: 'Brand A', subBrand: 'Product Line 1', vendor: 'Vendor Z', mediaType: 'Social', event: 'New Year', region: 'West', startDate: '2024-01-05', endDate: '2024-02-15', budget: 95000, impressions: 4100000, cpm: 23.17, roas: 4.5, salesLift: 16.2, incrementalSales: 427500, testStores: 410, controlStores: 405, conversion: 3.5, engagementRate: 4.9, audienceReach: 2.4, costPerAcquisition: 13.2, mediaChannel: 'Social Media', tactics: ['Pinterest', 'TikTok'], targetAudience: 'Health Enthusiasts', category: 'Health & Wellness' },
  
  { id: 7, name: 'Labor Day', retailer: 'Target', brand: 'Brand C', subBrand: 'Product Line 4', vendor: 'Vendor X', mediaType: 'Video', event: 'Labor Day', region: 'Northeast', startDate: '2024-08-15', endDate: '2024-09-10', budget: 70000, impressions: 2900000, cpm: 24.14, roas: 3.6, salesLift: 11.5, incrementalSales: 252000, testStores: 340, controlStores: 332, conversion: 2.9, engagementRate: 3.8, audienceReach: 1.7, costPerAcquisition: 17.8, mediaChannel: 'Video', tactics: ['Pre-roll', 'Mid-roll'], targetAudience: 'Value Shoppers', category: 'Home Goods' },
  
  { id: 8, name: 'Thanksgiving', retailer: 'Kroger', brand: 'Brand B', subBrand: 'Product Line 3', vendor: 'Vendor Y', mediaType: 'Display', event: 'Thanksgiving', region: 'Midwest', startDate: '2024-11-10', endDate: '2024-11-30', budget: 105000, impressions: 4500000, cpm: 23.33, roas: 4.7, salesLift: 18.3, incrementalSales: 493500, testStores: 390, controlStores: 384, conversion: 3.7, engagementRate: 2.9, audienceReach: 2.6, costPerAcquisition: 16.3, mediaChannel: 'Digital', tactics: ['Programmatic', 'HTML5 Banners'], targetAudience: 'Home Cooks', category: 'Food & Beverage' },
  
  { id: 9, name: 'Black Friday', retailer: 'Best Buy', brand: 'Brand D', subBrand: 'Product Line 5', vendor: 'Vendor W', mediaType: 'Social', event: 'Holiday', region: 'National', startDate: '2024-11-20', endDate: '2024-11-30', budget: 175000, impressions: 8200000, cpm: 21.34, roas: 6.1, salesLift: 32.7, incrementalSales: 1067500, testStores: 580, controlStores: 572, conversion: 5.8, engagementRate: 6.2, audienceReach: 4.1, costPerAcquisition: 10.5, mediaChannel: 'Social Media', tactics: ['Facebook Carousel', 'Instagram Collection'], targetAudience: 'Tech Enthusiasts', category: 'Electronics' },
  
  { id: 10, name: 'Mothers Day', retailer: 'Macy\'s', brand: 'Brand E', subBrand: 'Product Line 7', vendor: 'Vendor X', mediaType: 'Email', event: 'Spring', region: 'South', startDate: '2024-04-25', endDate: '2024-05-15', budget: 55000, impressions: 1800000, cpm: 30.56, roas: 4.3, salesLift: 13.8, incrementalSales: 236500, testStores: 240, controlStores: 235, conversion: 4.7, engagementRate: 3.6, audienceReach: 1.2, costPerAcquisition: 15.9, mediaChannel: 'Email', tactics: ['Newsletter', 'Triggered Emails'], targetAudience: 'Women 25-45', category: 'Beauty & Personal Care' },
  
  { id: 11, name: 'Back to College', retailer: 'Amazon', brand: 'Brand F', subBrand: 'Product Line 8', vendor: 'Vendor Z', mediaType: 'Display', event: 'Back to School', region: 'West', startDate: '2024-08-01', endDate: '2024-08-31', budget: 125000, impressions: 5500000, cpm: 22.73, roas: 3.9, salesLift: 14.2, incrementalSales: 487500, testStores: 0, controlStores: 0, conversion: 3.6, engagementRate: 2.8, audienceReach: 2.9, costPerAcquisition: 18.7, mediaChannel: 'Digital', tactics: ['Amazon DSP', 'Sponsored Products'], targetAudience: 'College Students', category: 'Electronics' },
  
  { id: 12, name: 'Prime Day', retailer: 'Amazon', brand: 'Brand D', subBrand: 'Product Line 6', vendor: 'Vendor W', mediaType: 'Search', event: 'Summer', region: 'National', startDate: '2024-07-10', endDate: '2024-07-17', budget: 150000, impressions: 6800000, cpm: 22.06, roas: 5.8, salesLift: 28.9, incrementalSales: 870000, testStores: 0, controlStores: 0, conversion: 6.3, engagementRate: 2.5, audienceReach: 3.8, costPerAcquisition: 11.8, mediaChannel: 'Search', tactics: ['Amazon PPC', 'Google Shopping'], targetAudience: 'Prime Members', category: 'Multiple' },
  
  { id: 13, name: 'Memorial Day Sale', retailer: 'Home Depot', brand: 'Brand G', subBrand: 'Product Line 9', vendor: 'Vendor V', mediaType: 'Video', event: 'Summer', region: 'Southeast', startDate: '2024-05-20', endDate: '2024-05-31', budget: 82000, impressions: 3700000, cpm: 22.16, roas: 4.4, salesLift: 16.8, incrementalSales: 360800, testStores: 420, controlStores: 415, conversion: 3.3, engagementRate: 4.1, audienceReach: 2.1, costPerAcquisition: 16.7, mediaChannel: 'Video', tactics: ['YouTube TrueView', 'OTT'], targetAudience: 'Homeowners', category: 'Home Improvement' },
  
  { id: 14, name: 'Back to Sports', retailer: 'Dick\'s Sporting', brand: 'Brand H', subBrand: 'Product Line 10', vendor: 'Vendor U', mediaType: 'Social', event: 'Back to School', region: 'Northeast', startDate: '2024-08-10', endDate: '2024-09-15', budget: 68000, impressions: 2950000, cpm: 23.05, roas: 3.7, salesLift: 12.4, incrementalSales: 251600, testStores: 290, controlStores: 285, conversion: 3.1, engagementRate: 5.2, audienceReach: 1.6, costPerAcquisition: 17.5, mediaChannel: 'Social Media', tactics: ['Facebook Lead Gen', 'Twitter Ads'], targetAudience: 'Athletes & Parents', category: 'Sporting Goods' },
  
  { id: 15, name: 'Halloween', retailer: 'Target', brand: 'Brand I', subBrand: 'Product Line 11', vendor: 'Vendor T', mediaType: 'Display', event: 'Holiday', region: 'Midwest', startDate: '2024-10-01', endDate: '2024-10-31', budget: 90000, impressions: 3900000, cpm: 23.08, roas: 4.1, salesLift: 15.7, incrementalSales: 369000, testStores: 350, controlStores: 345, conversion: 3.4, engagementRate: 3.3, audienceReach: 2.3, costPerAcquisition: 16.1, mediaChannel: 'Digital', tactics: ['Interactive Banners', 'Page Takeovers'], targetAudience: 'Parents & Children', category: 'Seasonal & Costumes' }
];

// Enhanced time series data with proper week dates and campaign values
const generateTimeSeriesData = (): WeekData[] => {
  // Generate weeks from Jan to Dec 2024
  const weeks: WeekData[] = [];
  const startDate = new Date('2024-01-01');
  for (let i = 0; i < 52; i++) {
    const weekStartDate = new Date(startDate);
    weekStartDate.setDate(startDate.getDate() + (i * 7));
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6);
    
    const weekLabel = `W${i+1}: ${weekStartDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}`;
    
    const weekData: WeekData = {
      week: weekLabel,
      date: weekStartDate,
      endDate: weekEndDate
    };
    
    // Initialize all campaigns to 0
    campaignData.forEach(campaign => {
      weekData[campaign.name] = 0;
    });
    
    weeks.push(weekData);
  }
  
  // Add campaign data to each week
  campaignData.forEach(campaign => {
    const campaignStart = new Date(campaign.startDate);
    const campaignEnd = new Date(campaign.endDate);
    
    // Calculate weekly values based on campaign duration
    const durationInDays = (campaignEnd.getTime() - campaignStart.getTime()) / (1000 * 60 * 60 * 24);
    const weeksActive = Math.ceil(durationInDays / 7);
    const weeklyValue = campaign.incrementalSales / weeksActive;
    
    weeks.forEach(week => {
      if (week.date >= campaignStart && week.date <= campaignEnd) {
        week[campaign.name] = Math.round(weeklyValue / 1000); // Convert to $K
      }
    });
  });
  
  return weeks;
};

const timeSeriesData = generateTimeSeriesData();

// Enhanced regional data with more metrics
const regionMetrics: RegionMetric[] = [
  { region: 'Northeast', impressions: 5.2, budget: 110, sales: 6.1, incrementalSales: 4.1, roas: 3.7, numCampaigns: 5, topPerformer: 'Back to School', engagement: 4.3, costPerAcquisition: 16.8, percentChange: 12.4, audienceReach: 2.2, salesLiftPercent: 15.7 },
  { region: 'Midwest', impressions: 8.1, budget: 180, sales: 6.9, incrementalSales: 7.2, roas: 4.0, numCampaigns: 6, topPerformer: 'Thanksgiving', engagement: 3.8, costPerAcquisition: 17.2, percentChange: 9.8, audienceReach: 2.5, salesLiftPercent: 13.8 },
  { region: 'South', impressions: 11.5, budget: 260, sales: 13.7, incrementalSales: 12.8, roas: 4.9, numCampaigns: 4, topPerformer: 'Easter Promo', engagement: 4.1, costPerAcquisition: 14.9, percentChange: 21.3, audienceReach: 3.1, salesLiftPercent: 18.9 },
  { region: 'West', impressions: 10.8, budget: 210, sales: 11.5, incrementalSales: 11.0, roas: 5.2, numCampaigns: 3, topPerformer: 'New Year Kickoff', engagement: 4.7, costPerAcquisition: 15.1, percentChange: 17.6, audienceReach: 2.8, salesLiftPercent: 16.2 },
  { region: 'Southeast', impressions: 7.6, budget: 145, sales: 8.4, incrementalSales: 6.8, roas: 4.3, numCampaigns: 4, topPerformer: 'Memorial Day Sale', engagement: 4.0, costPerAcquisition: 16.2, percentChange: 14.5, audienceReach: 2.4, salesLiftPercent: 14.8 }, 
  { region: 'National', impressions: 24.3, budget: 520, sales: 35.6, incrementalSales: 42.3, roas: 5.6, numCampaigns: 7, topPerformer: 'Black Friday', engagement: 5.2, costPerAcquisition: 11.2, percentChange: 28.9, audienceReach: 3.8, salesLiftPercent: 26.4 }
];

// Regional heat map data with enhanced values
const heatMapData = [
  { name: 'Northeast', value: 3.7, impressions: 5.2, budget: 110, sales: 6.1, incrementalSales: 4.1, engagement: 4.3, cpa: 16.8, salesLiftPercent: 15.7 },
  { name: 'Midwest', value: 4.0, impressions: 8.1, budget: 180, sales: 6.9, incrementalSales: 7.2, engagement: 3.8, cpa: 17.2, salesLiftPercent: 13.8 },
  { name: 'South', value: 4.9, impressions: 11.5, budget: 260, sales: 13.7, incrementalSales: 12.8, engagement: 4.1, cpa: 14.9, salesLiftPercent: 18.9 },
  { name: 'West', value: 5.2, impressions: 10.8, budget: 210, sales: 11.5, incrementalSales: 11.0, engagement: 4.7, cpa: 15.1, salesLiftPercent: 16.2 },
  { name: 'Southeast', value: 4.3, impressions: 7.6, budget: 145, sales: 8.4, incrementalSales: 6.8, engagement: 4.0, cpa: 16.2, salesLiftPercent: 14.8 },
  { name: 'National', value: 5.6, impressions: 24.3, budget: 520, sales: 35.6, incrementalSales: 42.3, engagement: 5.2, cpa: 11.2, salesLiftPercent: 26.4 }
];

const regionColors: Record<string, string> = {
  'Northeast': '#003f5c',
  'Midwest': '#7a5195', 
  'South': '#ef5675',
  'West': '#ffa600',
  'Southeast': '#58508d',
  'National': '#bc5090'
};

// Define heatmap colors based on performance
const getHeatmapColor = (value: number) => {
  if (value >= 5.0) return '#1a9850'; // High performance - green
  if (value >= 4.5) return '#66bd63'; // Very good performance - lighter green
  if (value >= 4.0) return '#a6d96a'; // Good performance - light green
  if (value >= 3.5) return '#d9ef8b'; // Average performance - yellow-green
  if (value >= 3.0) return '#fee08b'; // Below average - yellow
  if (value >= 2.5) return '#fdae61'; // Poor performance - light orange
  if (value >= 2.0) return '#f46d43'; // Very poor performance - orange
  return '#d73027'; // Extremely poor performance - red
};

// Define all the filters with expanded options
const retailers = ['All', 'Walmart', 'Target', 'Kroger', 'Amazon', 'Best Buy', 'Macy\'s', 'Home Depot', 'Dick\'s Sporting'];
const brands = ['All', 'Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E', 'Brand F', 'Brand G', 'Brand H', 'Brand I'];
const subBrands = ['All', 'Product Line 1', 'Product Line 2', 'Product Line 3', 'Product Line 4', 'Product Line 5', 'Product Line 6', 'Product Line 7', 'Product Line 8', 'Product Line 9', 'Product Line 10', 'Product Line 11'];
const vendors = ['All', 'Vendor X', 'Vendor Y', 'Vendor Z', 'Vendor W', 'Vendor V', 'Vendor U', 'Vendor T'];
const mediaTypes = ['All', 'Display', 'Social', 'Video', 'Search', 'Email'];
const mediaChannels = ['All', 'Digital', 'Social Media', 'Video', 'Search', 'Email'];
const events = ['All', 'Summer', 'Back to School', 'Holiday', 'Spring', 'Easter', 'New Year', 'Labor Day', 'Thanksgiving', 'Black Friday', 'Cyber Monday', 'Valentine\'s Day', 'Memorial Day', 'Fourth of July'];
const regions = ['All', 'National', 'Northeast', 'Midwest', 'South', 'West', 'Southeast'];
const categories = ['All', 'Food & Beverage', 'School Supplies', 'Gifts & Seasonal', 'Home & Garden', 'Candy & Sweets', 'Health & Wellness', 'Home Goods', 'Electronics', 'Beauty & Personal Care', 'Home Improvement', 'Sporting Goods', 'Seasonal & Costumes', 'Jewelry & Gifts', 'Tools & Electronics', 'Multiple'];
const targetAudiences = ['All', 'Families', 'Students', 'Gift Givers', 'DIY Enthusiasts', 'Parents', 'Health Enthusiasts', 'Value Shoppers', 'Home Cooks', 'Tech Enthusiasts', 'Women 25-45', 'College Students', 'Prime Members', 'Homeowners', 'Athletes & Parents', 'Parents & Children', 'Online Shoppers', 'Couples & Gift Buyers', 'Party Planners', 'Men & Graduates', 'Tax Refund Recipients'];
const tactics = ['All', 'Banner Ads', 'Rich Media', 'Instagram Stories', 'Facebook Feed', 'Connected TV', 'YouTube', 'Native Ads', 'Interstitials', 'Google Ads', 'Bing Ads', 'Pinterest', 'TikTok', 'Pre-roll', 'Mid-roll', 'Programmatic', 'HTML5 Banners', 'Facebook Carousel', 'Instagram Collection', 'Newsletter', 'Triggered Emails', 'Amazon DSP', 'Sponsored Products', 'Amazon PPC', 'Google Shopping', 'YouTube TrueView', 'OTT', 'Facebook Lead Gen', 'Twitter Ads', 'Interactive Banners', 'Page Takeovers', 'Abandoned Cart', 'Flash Sales', 'Instagram Shop', 'Pinterest Promoted', 'In-stream Video', 'Social Video', 'Local Inventory Ads', 'Text Ads', 'Remarketing', 'Display Network'];

// Advanced metrics for visualization
const metrics = [
  { id: 'roas', name: 'ROAS', description: 'Return on Ad Spend', format: 'x', category: 'Performance' },
  { id: 'salesLift', name: 'Sales Lift %', description: 'Percentage increase in sales', format: '%', category: 'Performance' },
  { id: 'incrementalSales', name: 'Incremental $', description: 'Additional sales generated', format: 'K', category: 'Performance' },
  { id: 'impressions', name: 'Impressions', description: 'Number of ad views', format: 'M', category: 'Reach' },
  { id: 'budget', name: 'Budget', description: 'Campaign budget', format: 'K', category: 'Investment' },
  { id: 'cpm', name: 'CPM', description: 'Cost per thousand impressions', format: '$', category: 'Efficiency' },
  { id: 'conversion', name: 'Conversion Rate', description: 'Percentage of conversions', format: '%', category: 'Performance' },
  { id: 'engagementRate', name: 'Engagement Rate', description: 'User interaction with content', format: '%', category: 'Engagement' },
  { id: 'audienceReach', name: 'Audience Reach', description: 'Percentage of target audience reached', format: 'M', category: 'Reach' },
  { id: 'costPerAcquisition', name: 'Cost Per Acquisition', description: 'Cost to acquire a customer', format: '$', category: 'Efficiency' },
  { id: 'testControlRatio', name: 'Test/Control Ratio', description: 'Ratio of test to control stores', format: 'ratio', category: 'Methodology' }
];

// Organized metric categories for easier selection
const metricCategories = [
  { id: 'performance', name: 'Performance Metrics', metrics: ['roas', 'salesLift', 'incrementalSales', 'conversion'] },
  { id: 'investment', name: 'Investment Metrics', metrics: ['budget', 'cpm', 'costPerAcquisition'] },
  { id: 'reach', name: 'Reach & Engagement', metrics: ['impressions', 'audienceReach', 'engagementRate'] },
  { id: 'methodology', name: 'Methodology', metrics: ['testControlRatio'] }
];

// Type for bar chart data
interface BarChartDataItem {
  name: string;
  value: number;
  color?: string;
}

// Claude API connection details
const CLAUDE_API_ENDPOINT = "glama_eyJhcGlLZXkiOiJiMDZiNTZhNS0zNTJjLTQ1NWUtOWI0Zi0wOWZhZDE3NmRiZmQifQ";

const Dashboard = () => {
  // State for all filters
  const [selectedRetailer, setSelectedRetailer] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedSubBrand, setSelectedSubBrand] = useState('All');
  const [selectedVendor, setSelectedVendor] = useState('All');
  const [selectedMediaType, setSelectedMediaType] = useState('All');
  const [selectedMediaChannel, setSelectedMediaChannel] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTargetAudience, setSelectedTargetAudience] = useState('All');
  const [selectedTactic, setSelectedTactic] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-12-31' });
  const [performanceThreshold, setPerformanceThreshold] = useState([0, 6]);
  
  // Campaign selection state - for global campaign selection
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<number[]>([]);
  const [manualCampaignSelection, setManualCampaignSelection] = useState(false);
  const [showGlobalCampaignSelector, setShowGlobalCampaignSelector] = useState(false);
  
  // Visualization states
  const [selectedMetric, setSelectedMetric] = useState('roas');
  const [selectedMetricCategory, setSelectedMetricCategory] = useState('performance');
  
  // AI widget state
  const [showAiWidget, setShowAiWidget] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  
  // Visualization options
  const [barSortBy, setBarSortBy] = useState('value'); // 'value', 'name', 'date'
  const [timeSeriesMetric, setTimeSeriesMetric] = useState('incrementalSales');
  const [highlightOverlaps, setHighlightOverlaps] = useState(true);
  const [heatmapMetric, setHeatmapMetric] = useState('roas');
  const [comparisonView, setComparisonView] = useState(false);
  
  // Component-level campaign selection for Performance Over Time
  const [selectedTimeSeriesCampaigns, setSelectedTimeSeriesCampaigns] = useState<number[]>([]);
  const [timeSeriesDateRange, setTimeSeriesDateRange] = useState({ start: '2024-01-01', end: '2024-12-31' });
  const [showCampaignSelector, setShowCampaignSelector] = useState(false);
  
  // Additional component-level filters for other dashboard sections
  const [selectedBarChartCampaigns, setSelectedBarChartCampaigns] = useState<number[]>([]);
  const [showBarChartCampaignSelector, setShowBarChartCampaignSelector] = useState(false);
  
  const [selectedRegionalCampaigns, setSelectedRegionalCampaigns] = useState<number[]>([]);
  const [showRegionalCampaignSelector, setShowRegionalCampaignSelector] = useState(false);
  
  const [selectedDetailsCampaigns, setSelectedDetailsCampaigns] = useState<number[]>([]);
  const [showDetailsCampaignSelector, setShowDetailsCampaignSelector] = useState(false);
  
  const { toast } = useToast();

  // Filter campaigns based on all selected criteria
  const filteredCampaigns = campaignData.filter(campaign => {
    if (selectedRetailer !== 'All' && campaign.retailer !== selectedRetailer) return false;
    if (selectedBrand !== 'All' && campaign.brand !== selectedBrand) return false;
    if (selectedSubBrand !== 'All' && campaign.subBrand !== selectedSubBrand) return false;
    if (selectedVendor !== 'All' && campaign.vendor !== selectedVendor) return false;
    if (selectedMediaType !== 'All' && campaign.mediaType !== selectedMediaType) return false;
    if (selectedMediaChannel !== 'All' && campaign.mediaChannel !== selectedMediaChannel) return false;
    if (selectedEvent !== 'All' && campaign.event !== selectedEvent) return false;
    if (selectedRegion !== 'All' && campaign.region !== selectedRegion) return false;
    if (selectedCategory !== 'All' && campaign.category !== selectedCategory) return false;
    if (selectedTargetAudience !== 'All' && campaign.targetAudience !== selectedTargetAudience) return false;
    if (selectedTactic !== 'All' && !campaign.tactics.includes(selectedTactic)) return false;
    
    // Date range filtering
    const campaignStart = new Date(campaign.startDate);
    const campaignEnd = new Date(campaign.endDate);
    const filterStart = new Date(dateRange.start);
    const filterEnd = new Date(dateRange.end);
    
    // Check if campaign overlaps with filter date range
    return (campaignStart <= filterEnd && campaignEnd >= filterStart);
  });
  
  // Apply manual campaign selection if enabled
  const filteredBySelectionCampaigns = manualCampaignSelection && selectedCampaignIds.length > 0
    ? filteredCampaigns.filter(campaign => selectedCampaignIds.includes(campaign.id))
    : filteredCampaigns;
  
  // Filter campaigns by performance threshold
  const performanceFilteredCampaigns = filteredBySelectionCampaigns.filter(campaign => {
    let value;
    switch (selectedMetric) {
      case 'roas':
        value = campaign.roas;
        break;
      case 'salesLift':
        value = campaign.salesLift;
        break;
      case 'incrementalSales':
        value = campaign.incrementalSales / 1000;
        break;
      case 'impressions':
        value = campaign.impressions / 1000000;
        break;
      case 'budget':
        value = campaign.budget / 1000;
        break;
      case 'cpm':
        value = campaign.cpm;
        break;
      case 'conversion':
        value = campaign.conversion;
        break;
      case 'engagementRate':
        value = campaign.engagementRate;
        break;
      case 'audienceReach':
        value = campaign.audienceReach;
        break;
      case 'costPerAcquisition':
        value = campaign.costPerAcquisition;
        break;
      case 'testControlRatio':
        value = campaign.testStores / campaign.controlStores;
        break;
      default:
        value = 0;
    }
    return value >= performanceThreshold[0] && value <= performanceThreshold[1];
  });

  // Handle exports
  const handleExport = (type: string) => {
    toast({
      title: "Export Started",
      description: `Exporting dashboard as ${type}...`,
    });
  };

  // Get metric display info
  const getMetricInfo = (metricId: string) => {
    return metrics.find(m => m.id === metricId) || { 
      id: metricId, 
      name: metricId, 
      description: '', 
      format: '', 
      category: 'Other' 
    };
  };

  // Generate bar chart data with proper typing
  const getBarChartData = (): BarChartDataItem[] => {
    // Apply component-level filtering for bar chart if enabled
    const barChartFilteredCampaigns = selectedBarChartCampaigns.length > 0
      ? performanceFilteredCampaigns.filter(campaign => selectedBarChartCampaigns.includes(campaign.id))
      : performanceFilteredCampaigns;
      
    return barChartFilteredCampaigns.map(campaign => {
      let value = 0;
      
      switch (selectedMetric) {
        case 'roas':
          value = campaign.roas;
          break;
        case 'salesLift':
          value = campaign.salesLift;
          break;
        case 'incrementalSales':
          value = campaign.incrementalSales / 1000;
          break;
        case 'impressions':
          value = campaign.impressions / 1000000;
          break;
        case 'budget':
          value = campaign.budget / 1000;
          break;
        case 'cpm':
          value = campaign.cpm;
          break;
        case 'conversion':
          value = campaign.conversion;
          break;
        case 'engagementRate':
          value = campaign.engagementRate;
          break;
        case 'audienceReach':
          value = campaign.audienceReach;
          break;
        case 'costPerAcquisition':
          value = campaign.costPerAcquisition;
          break;
        case 'testControlRatio':
          value = campaign.testStores / campaign.controlStores;
          break;
        default:
          value = 0;
      }
      
      return {
        name: campaign.name,
        value,
        color: `hsl(${(campaignData.findIndex(c => c.id === campaign.id) * 25) % 360}, 70%, 50%)`
      };
    }).sort((a, b) => {
      if (barSortBy === 'value') {
        return b.value - a.value;
      } else if (barSortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (barSortBy === 'date') {
        const campaignA = campaignData.find(c => c.name === a.name);
        const campaignB = campaignData.find(c => c.name === b.name);
        if (campaignA && campaignB) {
          return new Date(campaignA.startDate).getTime() - new Date(campaignB.startDate).getTime();
        }
      }
      // Default sort
      return b.value - a.value;
    });
  };

  // Generate Y-axis label based on selected metric
  const getYAxisLabel = () => {
    const metricInfo = getMetricInfo(selectedMetric);
    switch (metricInfo.format) {
      case 'x':
        return `${metricInfo.name} (x)`;
      case '%':
        return `${metricInfo.name} (%)`;
      case 'K':
        return `${metricInfo.name} ($K)`;
      case 'M':
        return `${metricInfo.name} (M)`;
      case '$':
        return `${metricInfo.name} ($)`;
      case 'ratio':
        return `${metricInfo.name}`;
      default:
        return metricInfo.name;
    }
  };
  
  // Format metric value for display
  const formatMetricValue = (value: number, metricId: string) => {
    const metricInfo = getMetricInfo(metricId);
    switch (metricInfo.format) {
      case 'x':
        return `${value.toFixed(1)}x`;
      case '%':
        return `${value.toFixed(1)}%`;
      case 'K':
        return `$${value.toFixed(0)}K`;
      case 'M':
        return `${value.toFixed(1)}M`;
      case '$':
        return `$${value.toFixed(2)}`;
      default:
        return value.toFixed(1);
    }
  };
  
  // Get filtered data for regional heatmap
  const getFilteredRegionData = () => {
    // If there are specific regional campaigns selected, calculate region data based on those campaigns
    if (selectedRegionalCampaigns.length > 0) {
      const filteredCampaigns = performanceFilteredCampaigns.filter(
        campaign => selectedRegionalCampaigns.includes(campaign.id)
      );
      
      // Only show regions that have at least one campaign
      const regionsWithCampaigns = new Set(filteredCampaigns.map(c => c.region));
      
      return regionMetrics.filter(region => 
        selectedRegion === 'All' 
          ? regionsWithCampaigns.has(region.region)
          : region.region === selectedRegion
      );
    }
    
    // Default filtering based on selected region
    if (selectedRegion !== 'All') {
      return regionMetrics.filter(r => r.region === selectedRegion);
    }
    
    return regionMetrics;
  };
  
  // Identify overlapping campaigns in the current filters
  const getOverlappingCampaigns = () => {
    // Group campaigns by date ranges to find overlaps
    const dateRanges: {start: Date, end: Date, campaigns: Campaign[]}[] = [];
    
    performanceFilteredCampaigns.forEach(campaign => {
      const start = new Date(campaign.startDate);
      const end = new Date(campaign.endDate);
      
      // Check if this campaign overlaps with any existing ranges
      let foundOverlap = false;
      for (let range of dateRanges) {
        if (start <= range.end && end >= range.start) {
          // There's an overlap, add this campaign to the range
          range.campaigns.push(campaign);
          // Extend the range if needed
          if (start < range.start) range.start = start;
          if (end > range.end) range.end = end;
          foundOverlap = true;
          break;
        }
      }
      
      // If no overlap found, create a new range
      if (!foundOverlap) {
        dateRanges.push({
          start,
          end,
          campaigns: [campaign]
        });
      }
    });
    
    // Filter only ranges with 2+ campaigns (actual overlaps)
    return dateRanges.filter(range => range.campaigns.length > 1);
  };
  
  // Handle AI query submission
  const handleAiQuerySubmit = async () => {
    setIsGeneratingInsights(true);
    try {
      // In a real implementation, this would call the Claude API
      // For demo purposes, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get information about the top performing campaign
      const topCampaign = performanceFilteredCampaigns.length > 0 ? 
        [...performanceFilteredCampaigns].sort((a, b) => {
          if (selectedMetric === 'roas') return b.roas - a.roas;
          if (selectedMetric === 'salesLift') return b.salesLift - a.salesLift;
          if (selectedMetric === 'incrementalSales') return b.incrementalSales - a.incrementalSales;
          return 0;
        })[0] : null;
      
      // Get information about overlapping campaigns
      const overlaps = getOverlappingCampaigns();
      
      // Get information about regional performance
      const topRegion = regionMetrics.sort((a, b) => b.roas - a.roas)[0];
      
      // Create a contextual response based on the current dashboard state and user query
      let response = '';

      if (aiQuery) {
        if (aiQuery.toLowerCase().includes('top') || aiQuery.toLowerCase().includes('best')) {
          response = `Based on your query about top performers:\n\n`;
          
          if (topCampaign) {
            response += `The top performing campaign by ${getMetricInfo(selectedMetric).name} is **${topCampaign.name}** with ${formatMetricValue(topCampaign[selectedMetric as keyof Campaign] as number, selectedMetric)}.\n\n`;
            response += `This ${topCampaign.mediaType} campaign for ${topCampaign.retailer} ran from ${new Date(topCampaign.startDate).toLocaleDateString()} to ${new Date(topCampaign.endDate).toLocaleDateString()} targeting ${topCampaign.targetAudience}.\n\n`;
            response += `Other notable metrics for this campaign include:\n`;
            response += `- ROAS: ${topCampaign.roas.toFixed(1)}x\n`;
            response += `- Sales Lift: ${topCampaign.salesLift.toFixed(1)}%\n`;
            response += `- Incremental Sales: $${(topCampaign.incrementalSales / 1000).toFixed(0)}K\n`;
            response += `- Engagement Rate: ${topCampaign.engagementRate.toFixed(1)}%\n`;
          } else {
            response += `No campaigns match your current filter criteria.`;
          }
        } else if (aiQuery.toLowerCase().includes('compare') || aiQuery.toLowerCase().includes('comparison')) {
          response = `Comparison of current campaigns:\n\n`;
          
          if (performanceFilteredCampaigns.length >= 2) {
            const campaignsByRetailer = performanceFilteredCampaigns.reduce((acc, campaign) => {
              if (!acc[campaign.retailer]) acc[campaign.retailer] = [];
              acc[campaign.retailer].push(campaign);
              return acc;
            }, {} as Record<string, Campaign[]>);
            
            response += `You're currently viewing ${performanceFilteredCampaigns.length} campaigns across ${Object.keys(campaignsByRetailer).length} retailers.\n\n`;
            
            // Compare retailers
            response += `**Retailer Comparison**\n`;
            Object.entries(campaignsByRetailer).forEach(([retailer, campaigns]) => {
              const avgRoas = campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length;
              response += `- **${retailer}**: ${campaigns.length} campaigns, Avg ROAS: **${avgRoas.toFixed(2)}x**\n`;
            });
            
            // Compare media types
            response += `\n**Media Type Comparison**\n`;
            const mediaTypePerf = performanceFilteredCampaigns.reduce((acc, campaign) => {
              if (!acc[campaign.mediaType]) {
                acc[campaign.mediaType] = {count: 0, roas: 0};
              }
              acc[campaign.mediaType].count++;
              acc[campaign.mediaType].roas += campaign.roas;
              return acc;
            }, {} as Record<string, {count: number, roas: number}>);
            
            Object.entries(mediaTypePerf).forEach(([type, data]) => {
              response += `- **${type}**: Avg ROAS: **${(data.roas / data.count).toFixed(2)}x**\n`;
            });
          } else {
            response += `Not enough campaigns to provide a meaningful comparison. Please adjust your filters to include more campaigns.`;
          }
        } else if (aiQuery.toLowerCase().includes('region') || aiQuery.toLowerCase().includes('geographic')) {
          response = `Regional performance insights:\n\n`;
          
          const filteredRegions = getFilteredRegionData();
          if (filteredRegions.length > 0) {
            response += `**Top Performing Regions by ROAS**\n`;
            const sortedRegions = [...filteredRegions].sort((a, b) => b.roas - a.roas);
            sortedRegions.forEach((region, idx) => {
              response += `${idx+1}. **${region.region}**: ROAS ${region.roas.toFixed(1)}x, Sales Lift: ${region.salesLiftPercent.toFixed(1)}%, Incremental Sales: $${region.incrementalSales.toFixed(1)}M\n`;
            });
            
            response += `\nThe strongest campaign performance is in ${topRegion.region} with ${topRegion.topPerformer} being the standout campaign.\n\n`;
            
            if (sortedRegions.length > 1) {
              const diff = ((sortedRegions[0].roas - sortedRegions[sortedRegions.length-1].roas) / sortedRegions[sortedRegions.length-1].roas * 100).toFixed(0);
              response += `There's a ${diff}% difference in ROAS between the highest and lowest performing regions.`;
            }
          } else {
            response += `No regional data matches your current filter criteria.`;
          }
        } else if (aiQuery.toLowerCase().includes('overlap') || aiQuery.toLowerCase().includes('attribution')) {
          response = `Campaign overlap analysis:\n\n`;
          
          if (overlaps.length > 0) {
            response += `I've identified ${overlaps.length} periods with overlapping campaigns in your current view:\n\n`;
            
            overlaps.forEach((overlap, idx) => {
              response += `**Overlap Period ${idx+1}**: ${overlap.start.toLocaleDateString()} to ${overlap.end.toLocaleDateString()}\n`;
              response += `Campaigns: ${overlap.campaigns.map(c => c.name).join(', ')}\n`;
              response += `Number of campaigns: ${overlap.campaigns.length}\n`;
              response += `Total budget during overlap: $${overlap.campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}\n\n`;
            });
            
            response += `**Warning**: Campaign overlaps may affect attribution accuracy. Consider this when interpreting incremental sales during these periods.`;
          } else {
            response += `No campaign overlaps detected in your current filtered view.`;
          }
        } else {
          response = `Dashboard Analysis based on your question:\n\n`;
          
          // Create a general response about the current dashboard state
          if (performanceFilteredCampaigns.length > 0) {
            const metricInfo = getMetricInfo(selectedMetric);
            const topValue = selectedMetric === 'roas' ? topCampaign?.roas : 
                             selectedMetric === 'salesLift' ? topCampaign?.salesLift : 
                             selectedMetric === 'incrementalSales' ? (topCampaign?.incrementalSales ? topCampaign.incrementalSales / 1000 : 0) : 0;
            
            response += `You're currently viewing ${performanceFilteredCampaigns.length} campaigns with ${getMetricInfo(selectedMetric).name} ranging from ${performanceThreshold[0]} to ${performanceThreshold[1]}.\n\n`;
            
            if (topCampaign) {
              response += `The top performer is **${topCampaign.name}** with ${formatMetricValue(topValue as number, selectedMetric)}.\n\n`;
            }
            
            if (overlaps.length > 0) {
              response += `There are ${overlaps.length} periods with overlapping campaigns, which may impact attribution.\n\n`;
            }
            
            response += `Your query about "${aiQuery}" appears to relate to the ${metricInfo.name.toLowerCase()} performance across these campaigns. Based on the data, `;
            
            if (selectedRetailer !== 'All') {
              response += `${selectedRetailer} campaigns show an average ROAS of ${(performanceFilteredCampaigns.reduce((sum, c) => sum + c.roas, 0) / performanceFilteredCampaigns.length).toFixed(1)}x.\n\n`;
            } else {
              response += `campaigns are performing differently across retailers and media types.\n\n`;
            }
            
            response += `If you'd like more specific insights, try asking about "top performers", "regional performance", "campaign overlaps", or "comparisons".`;
          } else {
            response += `No campaigns match your current filter criteria. Please adjust your filters to see more data.`;
          }
        }
      } else {
        // Generate a general summary
        response = `# Multi-Campaign Dashboard Summary\n\n`;
        
        if (performanceFilteredCampaigns.length > 0) {
          response += `## Performance Overview\n`;
          response += `You're currently viewing ${performanceFilteredCampaigns.length} campaigns out of ${campaignData.length} total campaigns.\n\n`;
          
          if (topCampaign) {
            response += `## Top Performer\n`;
            response += `**${topCampaign.name}** (${topCampaign.retailer}) leads with ROAS of **${topCampaign.roas.toFixed(1)}x** and incremental sales of $${topCampaign.incrementalSales.toFixed(0)}K.\n\n`;
          }
          
          response += `## Regional Performance\n`;
          response += `The **${topRegion.region}** region shows the strongest overall performance with a ROAS of **${topRegion.roas.toFixed(1)}x**.\n\n`;
          
          response += `## Campaign Timing\n`;
          if (overlaps.length > 0) {
            response += `There are ${overlaps.length} periods with overlapping campaigns which may affect individual campaign attribution. The most significant overlap occurs during the holiday period with ${overlaps[0].campaigns.length} concurrent campaigns.\n\n`;
          } else {
            response += `Campaigns are well-distributed throughout the year with minimal overlap.\n\n`;
          }
          
          // Add retailer and media type summaries
          const retailerData = performanceFilteredCampaigns.reduce((acc, campaign) => {
            if (!acc[campaign.retailer]) acc[campaign.retailer] = { count: 0, roas: 0 };
            acc[campaign.retailer].count++;
            acc[campaign.retailer].roas += campaign.roas;
            return acc;
          }, {} as Record<string, {count: number, roas: number}>);
          
          response += `## Retailer Performance\n`;
          Object.entries(retailerData).sort((a, b) => (b[1].roas / b[1].count) - (a[1].roas / a[1].count)).slice(0, 3).forEach(([retailer, data]) => {
            response += `- **${retailer}**: Avg ROAS ${(data.roas / data.count).toFixed(1)}x (${data.count} campaigns)\n`;
          });
        } else {
          response += `No campaigns match your current filter criteria. Please adjust your filters to see more data.`;
        }
      }
      
      setAiResponse(response);
    } catch (error) {
      setAiResponse("I encountered an error generating insights. Please try again.");
    } finally {
      setIsGeneratingInsights(false);
    }
  };
  
  // Generate automatic insights
  const generateAutomaticInsights = async () => {
    setIsGeneratingInsights(true);
    
    try {
      // This would be where we call the Claude API with the CLAUDE_API_ENDPOINT
      // For demo purposes, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const topCampaign = performanceFilteredCampaigns.sort((a, b) => b.roas - a.roas)[0];
      const worstCampaign = performanceFilteredCampaigns.sort((a, b) => a.roas - b.roas)[0];
      const topRegion = regionMetrics.sort((a, b) => b.roas - a.roas)[0];
      const overlaps = getOverlappingCampaigns();
      
      // Count campaigns by retailer, media type, etc.
      const campaignsByRetailer = performanceFilteredCampaigns.reduce((acc, campaign) => {
        if (!acc[campaign.retailer]) acc[campaign.retailer] = [];
        acc[campaign.retailer].push(campaign);
        return acc;
      }, {} as Record<string, Campaign[]>);
      
      const campaignsByMediaType = performanceFilteredCampaigns.reduce((acc, campaign) => {
        if (!acc[campaign.mediaType]) acc[campaign.mediaType] = [];
        acc[campaign.mediaType].push(campaign);
        return acc;
      }, {} as Record<string, Campaign[]>);
      
      // Calculate average metrics
      const avgRoas = performanceFilteredCampaigns.reduce((sum, c) => sum + c.roas, 0) / performanceFilteredCampaigns.length || 0;
      const avgSalesLift = performanceFilteredCampaigns.reduce((sum, c) => sum + c.salesLift, 0) / performanceFilteredCampaigns.length || 0;
      const totalIncrementalSales = performanceFilteredCampaigns.reduce((sum, c) => sum + c.incrementalSales, 0) / 1000 || 0;
      const totalBudget = performanceFilteredCampaigns.reduce((sum, c) => sum + c.budget, 0) / 1000 || 0;

      const response = `# Multi-Campaign Dashboard Insights

## Performance Summary (${performanceFilteredCampaigns.length} campaigns)
- Average ROAS: **${avgRoas.toFixed(1)}x**
- Average Sales Lift: **${avgSalesLift.toFixed(1)}%**
- Total Incremental Sales: **$${totalIncrementalSales.toLocaleString()}K**
- Total Budget: **$${totalBudget.toLocaleString()}K**

## Top & Bottom Performers
${topCampaign ? `- **${topCampaign.name}** (${topCampaign.retailer}) leads with ROAS of **${topCampaign.roas.toFixed(1)}x** and sales lift of **${topCampaign.salesLift.toFixed(1)}%**.` : ''}
${worstCampaign && worstCampaign !== topCampaign ? `- **${worstCampaign.name}** (${worstCampaign.retailer}) shows the lowest ROAS at **${worstCampaign.roas.toFixed(1)}x**.` : ''}

## Retailer Performance
${Object.entries(campaignsByRetailer).map(([retailer, campaigns]) => {
  const retailerAvgRoas = campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length;
  return `- **${retailer}**: ${campaigns.length} campaigns, Avg ROAS: **${retailerAvgRoas.toFixed(1)}x**`;
}).join('\n')}

## Media Type Effectiveness
${Object.entries(campaignsByMediaType).map(([mediaType, campaigns]) => {
  const mtAvgRoas = campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length;
  const mtAvgEngagement = campaigns.reduce((sum, c) => sum + c.engagementRate, 0) / campaigns.length;
  return `- **${mediaType}**: Avg ROAS: **${mtAvgRoas.toFixed(1)}x**, Engagement: **${mtAvgEngagement.toFixed(1)}%**`;
}).join('\n')}

## Campaign Overlap Analysis
${overlaps.length > 0 ? 
  `Detected ${overlaps.length} periods with overlapping campaigns. The most significant period has ${overlaps[0].campaigns.length} concurrent campaigns.` : 
  'No significant campaign overlaps detected in the current view.'}

## Regional Performance
- **${topRegion.region}** shows the strongest overall performance with ROAS of **${topRegion.roas.toFixed(1)}x**.
- The top campaign in this region is **${topRegion.topPerformer}**.

## Recommendations
1. ${topCampaign ? `Consider expanding strategies similar to **${topCampaign.name}** to other retailers or regions.` : ''}
2. ${worstCampaign && worstCampaign !== topCampaign ? `Evaluate the audience targeting and creative approach for **${worstCampaign.name}** to improve performance.` : ''}
3. ${Object.keys(campaignsByMediaType).length > 1 ? `**${Object.entries(campaignsByMediaType).sort((a, b) => {
  const aAvgRoas = a[1].reduce((sum, c) => sum + c.roas, 0) / a[1].length;
  const bAvgRoas = b[1].reduce((sum, c) => sum + c.roas, 0) / b[1].length;
  return bAvgRoas - aAvgRoas;
})[0][0]}** is your most effective media type - consider allocating more budget to these channels.` : ''}
4. ${overlaps.length > 0 ? 'Consider staggering campaign timing to reduce overlaps and improve attribution accuracy.' : ''}`;
      
      setAiResponse(response);
    } catch (error) {
      setAiResponse("I encountered an error generating insights. Please try again.");
    } finally {
      setIsGeneratingInsights(false);
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedRetailer('All');
    setSelectedBrand('All'); 
    setSelectedSubBrand('All');
    setSelectedVendor('All');
    setSelectedMediaType('All');
    setSelectedMediaChannel('All');
    setSelectedEvent('All');
    setSelectedRegion('All');
    setSelectedCategory('All');
    setSelectedTargetAudience('All');
    setSelectedTactic('All');
    setDateRange({ start: '2024-01-01', end: '2024-12-31' });
    setPerformanceThreshold([0, 6]);
    toast({
      title: "Filters Reset",
      description: "All dashboard filters have been reset to default values."
    });
  };

  // Reset component filters
  const resetComponentFilters = () => {
    setSelectedBarChartCampaigns([]);
    setSelectedTimeSeriesCampaigns([]);
    setSelectedRegionalCampaigns([]);
    setSelectedDetailsCampaigns([]);
    
    toast({
      title: "Component Filters Reset",
      description: "All component-specific filters have been reset."
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-[1800px] mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Campaign Analytics Dashboard</h1>
          
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Advanced Filters
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter Campaigns</h4>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="retailers">
                      <AccordionTrigger>Retailers</AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-2">
                          {retailers.map(retailer => (
                            <div key={retailer} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`retailer-${retailer}`} 
                                checked={selectedRetailer === retailer}
                                onCheckedChange={() => setSelectedRetailer(retailer)}
                              />
                              <label
                                htmlFor={`retailer-${retailer}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {retailer}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="brands">
                      <AccordionTrigger>Brands & Sub-Brands</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Brand</label>
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
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Sub-Brand</label>
                            <Select value={selectedSubBrand} onValueChange={setSelectedSubBrand}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Sub-Brand" />
                              </SelectTrigger>
                              <SelectContent>
                                {subBrands.map(subBrand => (
                                  <SelectItem key={subBrand} value={subBrand}>{subBrand}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="media">
                      <AccordionTrigger>Media & Tactics</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Media Type</label>
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
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Media Channel</label>
                            <Select value={selectedMediaChannel} onValueChange={setSelectedMediaChannel}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Channel" />
                              </SelectTrigger>
                              <SelectContent>
                                {mediaChannels.map(channel => (
                                  <SelectItem key={channel} value={channel}>{channel}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Tactics</label>
                            <Select value={selectedTactic} onValueChange={setSelectedTactic}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Tactic" />
                              </SelectTrigger>
                              <SelectContent>
                                {tactics.map(tactic => (
                                  <SelectItem key={tactic} value={tactic}>{tactic}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="date">
                      <AccordionTrigger>Date & Event</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-sm font-medium">Start Date</label>
                              <Input 
                                type="date" 
                                value={dateRange.start}
                                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">End Date</label>
                              <Input 
                                type="date" 
                                value={dateRange.end}
                                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Event/Holiday</label>
                            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Event" />
                              </SelectTrigger>
                              <SelectContent>
                                {events.map(event => (
                                  <SelectItem key={event} value={event}>{event}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="targeting">
                      <AccordionTrigger>Targeting & Categories</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Target Audience</label>
                            <Select value={selectedTargetAudience} onValueChange={setSelectedTargetAudience}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Audience" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[200px]">
                                {targetAudiences.map(audience => (
                                  <SelectItem key={audience} value={audience}>{audience}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Category</label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[200px]">
                                {categories.map(category => (
                                  <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Region</label>
                            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Region" />
                              </SelectTrigger>
                              <SelectContent>
                                {regions.map(region => (
                                  <SelectItem key={region} value={region}>{region}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="performance">
                      <AccordionTrigger>Performance Range</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between">
                              <label className="text-sm font-medium">
                                {getMetricInfo(selectedMetric).name} Range: {performanceThreshold[0]} - {performanceThreshold[1]}
                              </label>
                            </div>
                            <Slider 
                              defaultValue={[0, 6]} 
                              max={10} 
                              step={0.1}
                              value={performanceThreshold}
                              onValueChange={setPerformanceThreshold}
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      <RefreshCcw className="mr-2 h-3 w-3" />
                      Reset All
                    </Button>
                    <Button size="sm">Apply Filters</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" disabled>
                  <span className="font-medium text-xs opacity-50">Select a Metric</span>
                </SelectItem>
                {metricCategories.map(category => (
                  <React.Fragment key={category.id}>
                    <SelectItem value={category.id} disabled>
                      <span className="font-medium text-xs opacity-50">{category.name}</span>
                    </SelectItem>
                    {category.metrics.map(m => {
                      const metricInfo = metrics.find(metric => metric.id === m);
                      return metricInfo ? (
                        <SelectItem key={metricInfo.id} value={metricInfo.id}>
                          {metricInfo.name}
                        </SelectItem>
                      ) : null;
                    })}
                  </React.Fragment>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setShowAiWidget(!showAiWidget)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              {showAiWidget ? 'Hide AI Assistant' : 'Show AI Assistant'}
            </Button>
          </div>
        </div>
        
        {/* Active filters display */}
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedRetailer !== 'All' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Retailer: {selectedRetailer}
            </Badge>
          )}
          {selectedBrand !== 'All' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Brand: {selectedBrand}
            </Badge>
          )}
          {selectedSubBrand !== 'All' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Sub-Brand: {selectedSubBrand}
            </Badge>
          )}
          {selectedMediaType !== 'All' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Media: {selectedMediaType}
            </Badge>
          )}
          {selectedEvent !== 'All' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Event: {selectedEvent}
            </Badge>
          )}
          {selectedRegion !== 'All' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Region: {selectedRegion}
            </Badge>
          )}
          {selectedCategory !== 'All' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {selectedCategory}
            </Badge>
          )}
          {selectedTargetAudience !== 'All' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Audience: {selectedTargetAudience}
            </Badge>
          )}
          {dateRange.start !== '2024-01-01' || dateRange.end !== '2024-12-31' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Date: {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="col-span-1 lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Campaign Performance - {getMetricInfo(selectedMetric).name}</CardTitle>
                <CardDescription>
                  Comparing {selectedBarChartCampaigns.length > 0 ? selectedBarChartCampaigns.length : performanceFilteredCampaigns.length} campaigns by {getMetricInfo(selectedMetric).description.toLowerCase()}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Select value={barSortBy} onValueChange={setBarSortBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="value">Sort by Value</SelectItem>
                    <SelectItem value="name">Sort by Name</SelectItem>
                    <SelectItem value="date">Sort by Date</SelectItem>
                  </SelectContent>
                </Select>
                
                <Popover open={showBarChartCampaignSelector} onOpenChange={setShowBarChartCampaignSelector}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Filter className="h-3.5 w-3.5" />
                      Campaigns
                      <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                        {selectedBarChartCampaigns.length || performanceFilteredCampaigns.length}
                      </Badge>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="end">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-sm">Select Campaigns to Display</h4>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs"
                              onClick={() => setSelectedBarChartCampaigns([])}
                            >
                              Clear
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs"
                              onClick={() => setSelectedBarChartCampaigns(performanceFilteredCampaigns.map(c => c.id))}
                            >
                              Select All
                            </Button>
                          </div>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto pr-1 space-y-1">
                          {performanceFilteredCampaigns.map(campaign => (
                            <div key={campaign.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`bar-campaign-${campaign.id}`} 
                                checked={selectedBarChartCampaigns.includes(campaign.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedBarChartCampaigns(prev => [...prev, campaign.id]);
                                  } else {
                                    setSelectedBarChartCampaigns(prev => prev.filter(id => id !== campaign.id));
                                  }
                                }}
                              />
                              <label
                                htmlFor={`bar-campaign-${campaign.id}`}
                                className="text-sm truncate leading-tight"
                                style={{
                                  color: `hsl(${(campaignData.findIndex(c => c.id === campaign.id) * 25) % 360}, 70%, 50%)`
                                }}
                              >
                                {campaign.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button size="sm" onClick={() => setShowBarChartCampaignSelector(false)}>
                          Apply
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={getBarChartData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 100 }} // Increased bottom margin for labels
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-35} 
                      textAnchor="end" 
                      height={100} // Increased height for labels
                      tick={{ fontSize: 12 }} // Increased font size
                      interval={0} // Show all labels
                    />
                    <YAxis 
                      label={{ 
                        value: getYAxisLabel(), 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle', fontSize: 13 } // Improved label styling
                      }} 
                      tick={{ fontSize: 12 }} // Increased font size
                    />
                    <Tooltip 
                      formatter={(value: any, name: any) => [
                        `${value} ${selectedMetric === 'roas' ? 'x' : 
                          selectedMetric === 'salesLift' ? '%' : 
                          selectedMetric === 'incrementalSales' ? 'K' : ''}`,
                        selectedMetric
                      ]}
                      contentStyle={{ fontSize: '13px' }} // Larger tooltip text
                    />
                    <Bar dataKey="value" maxBarSize={50}> {/* Limit bar width for better spacing */}
                      {getBarChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Performance Over Time</CardTitle>
                <CardDescription>
                  Weekly campaign performance trends
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={timeSeriesMetric} onValueChange={setTimeSeriesMetric}>
                  <SelectTrigger className="w-[170px]">
                    <SelectValue placeholder="Select Metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incrementalSales">Incremental Sales</SelectItem>
                    <SelectItem value="roas">ROAS</SelectItem>
                    <SelectItem value="impressions">Impressions</SelectItem>
                    <SelectItem value="engagementRate">Engagement Rate</SelectItem>
                    <SelectItem value="salesLift">Sales Lift</SelectItem>
                  </SelectContent>
                </Select>
                <Popover open={showCampaignSelector} onOpenChange={setShowCampaignSelector}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Filter className="h-3.5 w-3.5" />
                      Campaigns
                      <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                        {selectedTimeSeriesCampaigns.length || performanceFilteredCampaigns.length}
                      </Badge>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="end">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Campaign Display Options</h4>
                        <div className="flex flex-col gap-2 mt-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Date Range</span>
                            <div className="flex gap-1">
                              <Input 
                                type="date" 
                                className="w-[120px] h-8"
                                value={timeSeriesDateRange.start}
                                onChange={(e) => setTimeSeriesDateRange(prev => ({...prev, start: e.target.value}))}
                              />
                              <span className="text-sm self-center">-</span>
                              <Input 
                                type="date" 
                                className="w-[120px] h-8"
                                value={timeSeriesDateRange.end}
                                onChange={(e) => setTimeSeriesDateRange(prev => ({...prev, end: e.target.value}))}
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="highlight-overlaps" 
                              checked={highlightOverlaps}
                              onCheckedChange={(checked) => setHighlightOverlaps(checked as boolean)}
                            />
                            <label
                              htmlFor="highlight-overlaps"
                              className="text-sm leading-none"
                            >
                              Show Campaign Overlaps
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-sm">Select Campaigns to Display</h4>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs"
                              onClick={() => setSelectedTimeSeriesCampaigns([])}
                            >
                              Clear
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs"
                              onClick={() => setSelectedTimeSeriesCampaigns(performanceFilteredCampaigns.map(c => c.id))}
                            >
                              Select All
                            </Button>
                          </div>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto pr-1 space-y-1">
                          {performanceFilteredCampaigns.map(campaign => (
                            <div key={campaign.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`ts-campaign-${campaign.id}`} 
                                checked={selectedTimeSeriesCampaigns.includes(campaign.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedTimeSeriesCampaigns(prev => [...prev, campaign.id]);
                                  } else {
                                    setSelectedTimeSeriesCampaigns(prev => prev.filter(id => id !== campaign.id));
                                  }
                                }}
                              />
                              <label
                                htmlFor={`ts-campaign-${campaign.id}`}
                                className="text-sm truncate leading-tight"
                                style={{
                                  color: `hsl(${(campaignData.findIndex(c => c.id === campaign.id) * 25) % 360}, 70%, 50%)`
                                }}
                              >
                                {campaign.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button size="sm" onClick={() => setShowCampaignSelector(false)}>
                          Apply
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart 
                    data={timeSeriesData.filter(item => {
                      const itemDate = new Date(item.date);
                      const startDate = new Date(timeSeriesDateRange.start);
                      const endDate = new Date(timeSeriesDateRange.end);
                      return itemDate >= startDate && itemDate <= endDate;
                    })}
                    margin={{ top: 20, right: 30, bottom: 100, left: 30 }} // Increased margins for better spacing
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="week" 
                      interval={5} // Show fewer x-axis labels
                      angle={-35} 
                      textAnchor="end" 
                      height={100} // Increased height for labels
                      tick={{ fontSize: 12 }} // Increased font size
                    />
                    <YAxis 
                      label={{ 
                        value: getYAxisLabel(), 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle', fontSize: 13 } // Improved label styling
                      }}
                      tick={{ fontSize: 12 }} // Increased font size
                    />
                    <Tooltip 
                      formatter={(value: any, name: any) => {
                        if (name === 'Total' || name === 'Overlap') return [value, name];
                        return [formatMetricValue(value, timeSeriesMetric), name];
                      }}
                      labelFormatter={(label) => `Week: ${label}`}
                      contentStyle={{ fontSize: '13px' }} // Larger tooltip text
                    />
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} // Better legend styling
                    />

                    {/* Area for showing total value across all campaigns */}
                    <Area 
                      type="monotone" 
                      dataKey="Total" 
                      fill="rgba(200, 200, 200, 0.2)" 
                      stroke="rgba(130, 130, 130, 0.8)" 
                      activeDot={false}
                    />
                    
                    {/* Lines for each individual campaign */}
                    {performanceFilteredCampaigns
                      .filter(campaign => 
                        // If there are selected campaigns, only show those. Otherwise, show all
                        selectedTimeSeriesCampaigns.length === 0 || 
                        selectedTimeSeriesCampaigns.includes(campaign.id)
                      )
                      .map((campaign, index) => {
                        // Make sure the key exists in the timeSeriesData
                        const keyExists = timeSeriesData.some(item => campaign.name in item);
                        if (!keyExists) return null;
                        
                        return (
                          <Line
                            key={campaign.name}
                            type="monotone"
                            dataKey={campaign.name}
                            stroke={`hsl(${(campaignData.findIndex(c => c.id === campaign.id) * 25) % 360}, 70%, 50%)`}
                            strokeWidth={2.5} // Thicker lines for visibility
                            dot={false}
                            activeDot={{ r: 6 }}
                          />
                        );
                      })}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              {highlightOverlaps && (
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-100 mr-2"></div>
                  <span>Highlighted areas indicate campaign overlaps</span>
                </div>
              )}
              {selectedTimeSeriesCampaigns.length > 0 && (
                <div className="flex items-center ml-auto">
                  <span>Showing {selectedTimeSeriesCampaigns.length} of {performanceFilteredCampaigns.length} campaigns</span>
                </div>
              )}
            </CardFooter>
          </Card>

          <Tabs defaultValue={showAiWidget ? "ai" : "regional"} className="col-span-1">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="regional">
                <MapPin className="mr-2 h-4 w-4" />
                Regional
              </TabsTrigger>
              <TabsTrigger value="ai">
                <MessageSquare className="mr-2 h-4 w-4" />
                AI Insights
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="regional" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Performance</CardTitle>
                  <CardDescription>
                    Performance metrics by geographic region
                  </CardDescription>
                  <div className="flex justify-between items-center mt-2">
                    <Select 
                      value={heatmapMetric} 
                      onValueChange={setHeatmapMetric}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Select Metric" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="roas">ROAS</SelectItem>
                        <SelectItem value="incrementalSales">Incremental Sales</SelectItem>
                        <SelectItem value="budget">Budget</SelectItem>
                        <SelectItem value="impressions">Impressions</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Popover open={showRegionalCampaignSelector} onOpenChange={setShowRegionalCampaignSelector}>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Filter className="h-3.5 w-3.5" />
                          Campaigns
                          <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                            {selectedRegionalCampaigns.length || performanceFilteredCampaigns.length}
                          </Badge>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4" align="end">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium text-sm">Select Campaigns to Display</h4>
                              <div className="flex gap-1">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-7 text-xs"
                                  onClick={() => setSelectedRegionalCampaigns([])}
                                >
                                  Clear
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-7 text-xs"
                                  onClick={() => setSelectedRegionalCampaigns(performanceFilteredCampaigns.map(c => c.id))}
                                >
                                  Select All
                                </Button>
                              </div>
                            </div>
                            <div className="max-h-[200px] overflow-y-auto pr-1 space-y-1">
                              {performanceFilteredCampaigns.map(campaign => (
                                <div key={campaign.id} className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`region-campaign-${campaign.id}`} 
                                    checked={selectedRegionalCampaigns.includes(campaign.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedRegionalCampaigns(prev => [...prev, campaign.id]);
                                      } else {
                                        setSelectedRegionalCampaigns(prev => prev.filter(id => id !== campaign.id));
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`region-campaign-${campaign.id}`}
                                    className="text-sm truncate leading-tight"
                                    style={{
                                      color: `hsl(${(campaignData.findIndex(c => c.id === campaign.id) * 25) % 360}, 70%, 50%)`
                                    }}
                                  >
                                    {campaign.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex justify-end">
                            <Button size="sm" onClick={() => setShowRegionalCampaignSelector(false)}>
                              Apply
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {regionMetrics.map(region => {
                      // Get value based on selected heatmap metric
                      let metricValue;
                      let metricLabel;
                      switch (heatmapMetric) {
                        case 'roas':
                          metricValue = region.roas;
                          metricLabel = 'x';
                          break;
                        case 'incrementalSales':
                          metricValue = region.incrementalSales;
                          metricLabel = 'M';
                          break;
                        case 'budget':
                          metricValue = region.budget;
                          metricLabel = 'K';
                          break;
                        case 'impressions':
                          metricValue = region.impressions;
                          metricLabel = 'M';
                          break;
                        default:
                          metricValue = region.roas;
                          metricLabel = 'x';
                      }
                      
                      const intensity = heatmapMetric === 'roas' 
                        ? (metricValue / 6) * 100 // Scale ROAS up to 6x to get intensity percentage
                        : (metricValue / Math.max(...regionMetrics.map(r => {
                            if (heatmapMetric === 'incrementalSales') return r.incrementalSales;
                            if (heatmapMetric === 'budget') return r.budget;
                            return 0;
                          }))) * 100;
                      
                      return (
                        <div
                          key={region.region}
                          className="p-5 rounded-lg" // Increased padding
                          style={{ 
                            backgroundColor: `${regionColors[region.region]}${Math.round(Math.min(intensity, 100) * 0.25)}`,
                            borderLeft: `6px solid ${regionColors[region.region]}` // Thicker border
                          }}
                        >
                          <h3 className="font-bold text-xl mb-2">{region.region}</h3> {/* Larger region name */}
                          <div className="mt-3 space-y-2"> {/* Added more vertical spacing */}
                            <div className="flex justify-between">
                              <span className="text-base text-muted-foreground font-medium">{heatmapMetric}</span> {/* Larger label text */}
                              <span className="font-semibold text-lg">{metricValue}{metricLabel}</span> {/* Larger value text */}
                            </div>
                            <div className="flex justify-between">
                              <span className="text-base text-muted-foreground font-medium">Inc. Sales</span> {/* Larger label text */}
                              <span className="font-semibold text-lg">${region.incrementalSales}M</span> {/* Larger value text */}
                            </div>
                          </div>
                          <Progress className="mt-4 h-2.5" value={Math.min(intensity, 100)} /> {/* Taller progress bar */}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ai" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>AI Assistant</CardTitle>
                  <CardDescription>
                    Get insights about your campaign data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-muted/50 p-4">
                      {isGeneratingInsights ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                          <p className="text-sm text-muted-foreground">Analyzing campaign data...</p>
                        </div>
                      ) : aiResponse ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <div className="whitespace-pre-line">{aiResponse}</div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                          <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
                          <h3 className="font-medium text-center">No insights generated</h3>
                          <p className="text-sm text-muted-foreground text-center">
                            Click "Generate Insights" to analyze the current dashboard view
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Input
                        placeholder="Ask a question about your campaign data..."
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" onClick={handleAiQuerySubmit} disabled={isGeneratingInsights}>
                          Ask Question
                        </Button>
                        <Button onClick={generateAutomaticInsights} disabled={isGeneratingInsights}>
                          Generate Insights
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
                  AI assistant provides descriptive insights based on visible data. No predictive analysis.
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="col-span-1 lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Campaign Details</CardTitle>
                <CardDescription>
                  Detailed metrics for all campaigns ({selectedDetailsCampaigns.length > 0 ? selectedDetailsCampaigns.length : performanceFilteredCampaigns.length} shown)
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Popover open={showDetailsCampaignSelector} onOpenChange={setShowDetailsCampaignSelector}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Filter className="h-3.5 w-3.5" />
                      Filter Campaigns
                      <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                        {selectedDetailsCampaigns.length || performanceFilteredCampaigns.length}
                      </Badge>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="end">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-sm">Select Campaigns to Display</h4>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs"
                              onClick={() => setSelectedDetailsCampaigns([])}
                            >
                              Clear
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs"
                              onClick={() => setSelectedDetailsCampaigns(performanceFilteredCampaigns.map(c => c.id))}
                            >
                              Select All
                            </Button>
                          </div>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto pr-1 space-y-1">
                          {performanceFilteredCampaigns.map(campaign => (
                            <div key={campaign.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`details-campaign-${campaign.id}`} 
                                checked={selectedDetailsCampaigns.includes(campaign.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedDetailsCampaigns(prev => [...prev, campaign.id]);
                                  } else {
                                    setSelectedDetailsCampaigns(prev => prev.filter(id => id !== campaign.id));
                                  }
                                }}
                              />
                              <label
                                htmlFor={`details-campaign-${campaign.id}`}
                                className="text-sm truncate leading-tight"
                                style={{
                                  color: `hsl(${(campaignData.findIndex(c => c.id === campaign.id) * 25) % 360}, 70%, 50%)`
                                }}
                              >
                                {campaign.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button size="sm" onClick={() => setShowDetailsCampaignSelector(false)}>
                          Apply
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
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
                    {performanceFilteredCampaigns.length > 0 ? (
                      // Apply component-level filtering for details table if enabled
                      (selectedDetailsCampaigns.length > 0 
                        ? performanceFilteredCampaigns.filter(campaign => selectedDetailsCampaigns.includes(campaign.id))
                        : performanceFilteredCampaigns
                      ).map(campaign => (
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10} className="p-4 text-center text-muted-foreground">
                          No campaigns match the current filter criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap justify-between gap-2 mt-4">
          <Button variant="outline" onClick={resetComponentFilters}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reset Component Filters
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('Excel')}>
              <Download className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
            <Button variant="outline" onClick={() => handleExport('PDF')}>
              <Download className="mr-2 h-4 w-4" />
              Export to PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport('Dashboard')}>
              <Save className="mr-2 h-4 w-4" />
              Save Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
