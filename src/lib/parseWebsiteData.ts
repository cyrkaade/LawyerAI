// // lib/parseWebsiteData.ts
// import cheerio from 'cheerio';

// interface LawData {
//   title: string;
//   content: string;
// }

// export function parseWebsiteData(websiteData: string): LawData[] {
//   const $ = cheerio.load(websiteData);

//   // Select all anchor elements within the specified path
//   const lawLinks = $('html > body > div#content > table > tbody > tr > td > a');

//   const lawsData: LawData[] = [];

//   // Iterate through each law link
//   for (let index = 0; index < lawLinks.length; index++) {
//     const lawLinkElement = lawLinks[index];
//     const lawUrl = $(lawLinkElement).attr('href');

//     // Fetch the content of each law URL
//     const lawPageContent = await fetchLawPageContent(lawUrl);

//     // Parse law page content
//     const lawData = parseLawPageContent(lawPageContent);

//     lawsData.push(lawData);
//   }

//   return lawsData;
// }
