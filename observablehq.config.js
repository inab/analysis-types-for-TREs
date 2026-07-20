export default {
  // The app’s title; used in the sidebar and webpage titles.
  title: "Federated analysis for researchers",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  // pages: [
  //   {
  //     name: "Examples",
  //     pages: [
  //       {name: "Dashboard", path: "/example-dashboard"},
  //       {name: "Report", path: "/example-report"}
  //     ]
  //   }
  // ],
  pages: [
    {
      name: "Concepts",
      path: "/concepts",
      pages: [
        {name: "Isolated analysis", path: "/concepts/designing-isolated-analysis"},
        {name: "Get analyses by requirements", path: "/concepts/analysis-breakdown"},
        {name: "Categorisation of analysis methods", path: "/concepts/Categorisation"},
      ],
      collapsible: true
    },
    {
      name: "Five Safes TES",
      path: "/five-safes-tes",
      pages: [
        {name: "Submitting to Five Safes TES", path: "/five-safes-tes/submitting-to-5s-tes"},
        {name: "Five Safes TES executors", path: "/five-safes-tes/executors"},
        {name: "Collecting results", path: "/five-safes-tes/collecting-results"},
        {name: "Five Safes TES messages", path: "/five-safes-tes/5s-tes-messages"}
      ],
      collapsible: true
    },
    {
      name: "Examples in Five Safes TES",
      path: "/examples-in-five-safes-tes",
      pages: [
        {name: "Discovery", path: "/examples-in-five-safes-tes/discovery"},
        {name: "Contingency tables", path: "/examples-in-five-safes-tes/contingency-tables"},
        {name: "Descriptive statistics", path: "/examples-in-five-safes-tes/descriptive-statistics"},
      ],
      collapsible: true
    },
    // {name: "RO-crates", path: "/ro-crates"},
    // {name: "WfExS", path: "/wfexs"}
  ],

  // Content to add to the head of the page, e.g. for a favicon:
  head: `
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossorigin="anonymous">
  `,

  // The path to the source root.
  root: "src",

  // Some additional configuration options and their defaults:
  theme: "air", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  footer: `
  <div style="display:grid; grid-template-columns: 30% 30% 30%">
    <div>
      <img src="EOSC-ENTRUST LOGO_Horizontal.png" alt="EOSC-ENTRUST logo">
    </div>
    <div>
      <img src="Nottingham_Blue_single_colour_logo_SCREEN.png" alt="University of Nottingham logo">
    </div>
    <div>
      <img src="primary.svg" alt="Federated research logo">
    </div>
  </div>
  `, // what to show in the footer (HTML)
  // sidebar: true, // whether to show the sidebar
  // toc: true, // whether to show the table of contents
  pager: false, // whether to show previous & next links in the footer
  // output: "dist", // path to the output root for build
  search: true, // activate search
  // linkify: true, // convert URLs in Markdown to links
  // typographer: false, // smart quotes and other typographic improvements
  // preserveExtension: false, // drop .html from URLs
  // preserveIndex: false, // drop /index from URLs
};
