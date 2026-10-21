/**
 * js/data/directoryData.js
 * Data store for Black-owned service providers within 25 miles of LSU.
 * 
 * BEGINNER GUIDE:
 * Storing data in its own file keeps your code organized. Later, when you add
 * search filters or category tabs, this is the data your app will display.
 */

export const DIRECTORY_METADATA = {
  region: "Greater Baton Rouge & LSU Vicinity",
  maxRadiusMiles: 25,
  categories: [
    "Legal & Professional Services",
    "Accounting & Tax Advisory",
    "Design, Tech & Digital Marketing",
    "Health, Wellness & Personal Care",
    "Events, Catering & Hospitality",
    "Trades, Automotive & Home Repair"
  ]
};

/**
 * Starter structure for business directory listings.
 * Feature development will populate and expand this list.
 */
export const SAMPLE_PROVIDERS = [
  {
    id: "sample-1",
    businessName: "Sample Service Provider",
    category: "Design, Tech & Digital Marketing",
    description: "Sample listing showing how business data will be structured.",
    distanceFromLSU: 2.4, // miles
    city: "Baton Rouge",
    state: "LA"
  }
];
