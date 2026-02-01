---
title: "Mastering Google Apps Script: Free Automation in Google Workspace"
---
In this article, I discuss Mastering Google Apps Script: Free Automation in Google Workspace

TLDR;
Google Apps Script is a serverless service by Google that facilitates automation of workflows in Google suite
It uses Javascript and the scripts can be run using triggers
It is limited by various factors such as lack of a package manager and execution time limits
Apps Script projects can be Bound Scripts, directly linked to a specific Google file, or Standalone Scripts, existing independently in Google Drive, with each type suited for different purposes
For practical usage without the theory, you can skip right onto the case study.
Table Of Contents
Introduction
Sample Use Cases
Triggers
Core Services
Bound vs Stand Alone Scripts
Handling Environment Variables
Project Management
Limitations
Case Study
Conclusion
Introduction
I was looking for a way to automate some processes in Google Workspace and thought this was a good use case to try out n8n or Zapier. However, I took a step back and wondered if there was a free solution within the Google suite. That’s how I stumbled upon Google Apps Script and decided to explore it. In this article, I go through the main features, limitations and use cases of Google Apps Script then I demonstrate using sample code how one would go about automating a certain monthly financial process.

What is Google Apps Script?
Google Apps Script is a cloud-based scripting platform based on JavaScript that lets you automate, integrate, and extend Google Workspace applications. It's "serverless," meaning you don't need to worry about hosting or infrastructure. Google handles it all. This makes it incredibly accessible.

Sample Use Cases
The big 3 use cases for Google Apps Script are:

Automation: The most common use. Automate repetitive tasks like sending templated emails, generating reports in Sheets from data, or organizing files in Drive.
Integration: Connect different Google services. For example, automatically create a Calendar event from a Google Form submission, or log Gmail attachments into a Google Sheet.
Customization: Extend the user interface of Google Workspace. You can create custom menus, dialogs, and sidebars in Sheets, Docs, and Forms to build custom workflows for users.
The above offer endless possibilities in both business and personal areas. A few of the ones that I thought of were:

Automatically saving email attachments to a folder and alerting the user, as well as updating a spreadsheet
Making daily API calls to a weather site to see if there is a torrential rain warning or cyclone and alerting the user via an email if there is
Creating custom menu in google sheets where a single click generates a report and sends it to clients in a customized mail merge kind of way
Google form validation
Automatically add invites from a certain email address into my calendar
Triggers
Triggers are what make your scripts run automatically in response to specific events.
Types of triggers:

Simple Triggers: Easy-to-use, built-in functions like onOpen() (runs when a document is opened) and onEdit() (runs when a cell is edited).
Installable Triggers: More powerful and flexible. These can be time-driven (e.g., run a script every morning at 9 AM) or event-driven (e.g., run a script when a Google Form is submitted). In order to automate your scripts, you will need to add a new trigger from the menu bar found on the left as can be seen below.
Once you go to that page, on the bottom right, you will see a button to add a trigger. Clicking that button opens the modal below.

The trigger can be time driven or calendar driven. The time driven option gives the following categories for timers:

Specific date and time
Minutes timer
Hours timer
Day timer
Week timer
Month timer
These timers allow you to now select how often the script should run, e.g., every 5 minutes for the minutes timer or Every Monday for the week timer.

Pitfalls to Watch Out For
Time-driven triggers can fail silently if the script takes too long or errors out.
Installable triggers require authorization—if not granted properly, they won’t run.
Google may throttle or delay time-based executions under heavy load or policy violations.
Always monitor the Executions panel for logs and failures.
Core Services
These are the built-in libraries that allow your script to interact with Google services. You don't need to import anything; they are just available. However, you may need to enable them or add them to your project.
Key services include:

SpreadsheetApp: For reading, writing, and formatting data in Google Sheets.
GmailApp: For reading, searching, and sending emails.
DocumentApp: For creating and editing Google Docs.
DriveApp: For managing files and folders in Google Drive.
UrlFetchApp: For connecting to external, third-party APIs on the internet.
Bound Vs Stand Alone Scripts
Bound Scripts: These are linked directly to a specific Google Sheet, Doc, or Form. They are best for scripts that are only meant to work with that one file.
Standalone Scripts: These exist as their own independent files in Google Drive. They are better for general-purpose scripts or for building web apps and add-ons.
Deployment Considerations
Bound Scripts are easier to deploy for quick file-specific automations.
Standalone Scripts are necessary for publishing web apps, libraries, or add-ons, and for handling broader integrations across multiple services and files.
Handling Environment variables
When working with sensitive data such as API keys or tokens, never hardcode credentials directly into your code. Doing so risks exposing them—especially if your script is shared or published as a web app. Instead, use the PropertiesService to securely store and access secrets.

This approach:

Keeps your credentials separate from your code logic.
Prevents accidental leaks in version control or shared scripts.
Makes it easier to manage and rotate secrets without editing source files. ## Step 1: Store the Secret Create a separate function to set your secret. You only need to run this function once manually from the script editor to save the key.
function storeApiKey() {
  // Get the script private properties store
  const scriptProperties = PropertiesService.getScriptProperties();

  // Set a key-value pair for your secret
  scriptProperties.setProperty('MY_API_KEY', 'your-secret-api-key-goes-here');

  Logger.log("API Key has been stored securely.");
}
Step 2: Retrieve the Secret in Your Code
In your main functions, you can then retrieve the key without ever exposing it in the script itself.

function makeApiCall() {
  // Get the script properties store
  const scriptProperties = PropertiesService.getScriptProperties();

  // Retrieve the stored secret by its key
  const apiKey = scriptProperties.getProperty('MY_API_KEY');

  // Now you can use the apiKey variable in your API call
  const url = `https://api.example.com/data?key=${apiKey}`;
  const response = UrlFetchApp.fetch(url);

  Logger.log(response.getContentText());
}
This method ensures your sensitive information is kept separate from your code, which is essential for security.

Project management
One Apps script project can have multiple files which can be triggered separately but cannot have different declarations of variable names.
All script files (.gs) within a single Apps Script project are executed in one shared global scope. Think of it as Google taking all your separate files, concatenating them into one large file behind the scenes, and then running it.
This is why you can't redeclare a variable with const or let in another file—from the engine's perspective, you're trying to declare the same variable twice in the same script. This global nature is also what makes calling functions between files so seamless.

Considerations for Splitting a Project into Multiple Files
Splitting your code is purely for organization and readability. It has no effect on how the code runs. Here are a few things to consider before you do it:

Logical Separation: Group related functions into the same file. For example, have one file for all functions that interact with Google Sheets (sheets.gs), another for Gmail logic (gmail.gs), and a main file for the primary workflow (main.gs).
Configuration: Keep global constants and configuration settings (like spreadsheet IDs, email addresses, or API keys stored in Properties Service) in a dedicated file (e.g., config.gs). This makes them easy to find and update.
Maintainability: For large projects, splitting the code makes it much easier to navigate, debug, and for other people to understand. A single 1,000-line file is much harder to work with than five 200-line files with clear purposes.
One Project vs. Multiple Projects
The decision to keep code in one project or split it into different projects depends on the tasks you are automating.
Keep it in one project if:

The scripts are part of a single, cohesive workflow (e.g., reading from a Sheet, processing the data, and sending an email).
The functions in different files need to call each other or share global variables.
The entire workflow can operate under a single set of permissions (e.g., the whole project needs access to both Sheets and Gmail).
Split it into multiple projects if:

The automations are completely unrelated (e.g., one script organizes your Drive, and another sends you a daily weather report).
The automations require different security permissions. Separating them ensures one script doesn't have access to services it doesn't need (e.g., one script only needs access to a specific Sheet, while another needs access to your entire Calendar).
They run on completely independent triggers and have no logical connection. ## How Different Files Interact Because all files share the same global environment, calling a function from another file is effortless. You just call it directly by name as if it were in the same file.
Limitations
1. Cannot Decrypt Password-Protected Files
A script can see a password-protected file in Google Drive, but it cannot open or read its contents. The Apps Script environment has no built-in mechanism to supply a password to decrypt a file, which is why a more capable environment like a Python script or Google Cloud Function is required for this task.

2. Limited Native File Processing
Apps Script cannot natively parse complex file formats like PDFs or Excel spreadsheets to extract data directly. While it can convert some files to Google Workspace formats (e.g., PDF to Google Doc), it doesn't offer granular control to read the raw data or structure from the original file itself.

3. Execution Time Limits
Scripts have a maximum execution time. For most standard Google accounts (including Gmail and Google Workspace), this limit is 6 minutes per run. For long-running tasks like processing hundreds of files or spreadsheet rows, your script may time out before it can finish.

4. Service Quotas and Rate Limits
To prevent abuse, Google imposes daily quotas and rate limits on the use of its services. For example, there are limits on how many emails GmailApp can send per day, how many API calls you can make, or how many triggers can run. For large-scale automations, you can hit these limits.

5. Sandboxed Environment and No Package Manager
Apps Script runs in a secure, sandboxed environment, which means:
You cannot use standard package managers like npm to import external JavaScript libraries.
You have no direct access to the server's file system or the ability to make arbitrary network connections.

6. Simple Trigger Restrictions
Simple triggers like onOpen(e) and onEdit(e) run in a restricted mode. They cannot access any service that requires user authorization. For example, an onEdit trigger cannot send an email or create a calendar event, which is a common source of confusion for new developers.

Case Study
The original idea I wanted to automate was that of investing. Every time I get my payslip, I usually save it to a certain folder and then calculate how much of a particular stock I can buy for that month then I go ahead and place the order via email. The below step-by-step guide will show you how to automate this entire workflow. Now, let’s get coding.

If you want to just straight into the code, find the repository here.

Step 1: Initial Setup (Do this first!)
Create a New Google Sheet. Name it "My Stock Portfolio".
Inside the sheet, create two tabs: Trading and Transactions.
Go to Extensions > Apps Script to open the script editor. This will create a new Apps Script project that is bound to your spreadsheet.
Get a Free API Key from Financial Modeling Prep. You'll need this for the stock price data.
Create a Google Drive Folder where your payslips and contract notes will be saved. Right-click the folder and get its ID from the URL.
Step 2: The Code (Create these files in your Apps Script project)
In the Apps Script editor, create the following files by clicking the + icon next to "Files". Copy and paste the code for each one.
Config.gs (Configuration)

// --- CONFIGURATION FILE ---
// Store all your personal settings here.


const CONFIG = {
 // --- Email Settings ---
 MY_EMAIL: "your_email@example.com", // Your primary email address
 BROKER_EMAIL: "broker@example.com",   // Your stockbrokers email address
  // --- Payslip Email Settings ---
 PAYSLIP_SENDER: "payslips@company.com",
 PAYSLIP_SUBJECT_CONTAINS: "Your Monthly Payslip",
  // --- Contract Note Email Settings ---
 CONTRACT_NOTE_SENDER: "contracts@broker.com",
 CONTRACT_NOTE_SUBJECT_CONTAINS: "Contract Note",


 // --- Drive Folder ---
 FINANCE_FOLDER_ID: "YOUR_GOOGLE_DRIVE_FOLDER_ID",


 // --- Financial Settings ---
 MONTHLY_SALARY: 10000,
 INVESTMENT_PERCENTAGE: 0.20, // 20%
 STOCK_TICKER: "AAPL",
 CDS_ACCOUNT: "CDS123456FI00"
};
Secrets.gs (API Key Management)

// --- API KEY MANAGEMENT ---
// Use this file to securely store and retrieve your API key.


/**
* Stores the API key in PropertiesService.
* Run this function ONCE MANUALLY from the editor after pasting your key.
*/
function storeApiKey() {
 const scriptProperties = PropertiesService.getScriptProperties();
 // !!! PASTE YOUR API KEY HERE !!!
 scriptProperties.setProperty('FINANCE_API_KEY', 'YOUR_FINANCIAL_MODELING_PREP_API_KEY');
 Logger.log("API Key has been stored securely.");
}


/**
* Retrieves the stored API key.
* @returns {string} The API key.
*/
function getApiKey() {
 const scriptProperties = PropertiesService.getScriptProperties();
 return scriptProperties.getProperty('FINANCE_API_KEY');
}
Main.gs (Triggers & Menus)

// --- MAIN SCRIPT FILE ---
// Contains the main triggers and UI functions.


/**
* Creates a custom menu in the spreadsheet when its opened.
*/
function onOpen() {
 SpreadsheetApp.getUi()
   .createMenu('Stock Trading')
   .addItem('📈 Place New Trade Order', 'showTradeDialog')
   .addToUi();
}


/**
* Main function to process incoming emails.
* Set up a time-driven trigger to run this every 5-10 minutes.
*/
function processAllEmails() {
 Logger.log("--- Starting email processing cycle ---");
 processPayslipEmails();
 processContractNoteEmails();
 Logger.log("--- Finished email processing cycle ---");
}
GmailProcessing.gs (Email Handling)

// --- EMAIL PROCESSING LOGIC ---


/**
* Processes payslip emails, saves the attachment, and sends a notification.
*/
function processPayslipEmails() {
 const query = `from:"${CONFIG.PAYSLIP_SENDER}" subject:("${CONFIG.PAYSLIP_SUBJECT_CONTAINS}") is:unread`;
 Logger.log(`Searching for payslips with query: "${query}"`);


 const threads = GmailApp.search(query);
 if (threads.length === 0) return;


 for (const thread of threads) {
   const message = thread.getMessages()[0]; // Process first message
   if (message.isUnread()) {
     // 1. Save attachment
     const attachment = message.getAttachments()[0];
     if (attachment && attachment.getContentType() === 'application/pdf') {
       const folder = DriveApp.getFolderById(CONFIG.FINANCE_FOLDER_ID);
       folder.createFile(attachment.copyBlob());
       Logger.log(`Saved payslip: ${attachment.getName()}`);
     }

     // 2. Get stock price and calculate investment
     const stockData = getStockPrice(CONFIG.STOCK_TICKER);
     let investmentInfo = "Could not retrieve stock price at this time.";
     if (stockData) {
       const investmentAmount = CONFIG.MONTHLY_SALARY * CONFIG.INVESTMENT_PERCENTAGE;
       const sharesToBuy = Math.floor(investmentAmount / stockData.price);
       investmentInfo = `The current price of ${CONFIG.STOCK_TICKER} is $${stockData.price.toFixed(2)}.
With 20% of your salary ($${investmentAmount.toFixed(2)}), you could buy approximately ${sharesToBuy} shares.`;
     }


     // 3. Send notification email
     const subject = "✅ Your Payslip Has Been Processed";
     const body = `Hello,\n\nYour payslip has been saved to Google Drive.\n\n${investmentInfo}\n\nThank you.`;
     GmailApp.sendEmail(CONFIG.MY_EMAIL, subject, body);

     // 4. Mark as read and check the box in the sheet
     thread.markRead();
     updateMonthlyChecklist();
   }
 }
}


/**
* Processes contract note emails.
*/
function processContractNoteEmails() {
 const query = `from:"${CONFIG.CONTRACT_NOTE_SENDER}" subject:("${CONFIG.CONTRACT_NOTE_SUBJECT_CONTAINS}") is:unread`;
 Logger.log(`Searching for contract notes with query: "${query}"`);
  const threads = GmailApp.search(query);
 if (threads.length === 0) return;


 for (const thread of threads) {
    const message = thread.getMessages()[0];
    if (message.isUnread()) {
       const attachment = message.getAttachments()[0];
       if (attachment) {
          const folder = DriveApp.getFolderById(CONFIG.FINANCE_FOLDER_ID);
          folder.createFile(attachment.copyBlob());
          Logger.log(`Saved contract note: ${attachment.getName()}`);
       }

       // As we cannot parse the PDF, we notify the user to update the sheet.
       const subject = "📝 Action Required: Log Your Recent Trade";
       const body = `Hello,\n\nA new contract note has been saved to your Drive.\n\nPlease open your 'My Stock Portfolio' spreadsheet and log the details of this transaction in the 'Transactions' tab.\n\nThank you.`;
       GmailApp.sendEmail(CONFIG.MY_EMAIL, subject, body);

       thread.markRead();
    }
 }
}


/**
* Finds the current month/year row in the 'Trading' sheet and checks the box.
*/
function updateMonthlyChecklist() {
 const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Trading");
 const data = sheet.getDataRange().getValues();
 const now = new Date();
 const monthYear = Utilities.formatDate(now, Session.getScriptTimeZone(), "MMMM yyyy");


 for (let i = 1; i < data.length; i++) {
   if (data[i][0] === monthYear) {
     sheet.getRange(i + 1, 2).check(); // Check the box in column B
     break;
   }
 }
}
StockTrading.gs (UI & Trading Logic)

// --- STOCK TRADING UI AND LOGIC ---


/**
* Shows the custom HTML dialog for placing a trade.
*/
function showTradeDialog() {
 const html = HtmlService.createHtmlOutputFromFile('Dialog.html')
     .setWidth(400)
     .setHeight(450);
 SpreadsheetApp.getUi().showModalDialog(html, 'Place a Stock Trade Order');
}


/**
* Fetches the current stock price to populate the dialog.
* This function is called from the client-side HTML.
*/
function getLiveStockPrice() {
 return getStockPrice(CONFIG.STOCK_TICKER);
}


/**
* Processes the trade order submitted from the dialog.
* @param {object} orderDetails An object from the dialog form.
*/
function placeTradeOrder(orderDetails) {
 const { tradeDirection, quantity, price } = orderDetails;
  const subject = `Trade Order: ${tradeDirection.toUpperCase()} ${quantity} ${CONFIG.STOCK_TICKER} @ ${price}`;
 const body = `
   Hello,


   Please execute the following trade order for my account (${CONFIG.CDS_ACCOUNT}):


   ----------------------------------
   Security Name:    ${CONFIG.STOCK_TICKER}
   Trade Direction:  ${tradeDirection}
   Number of Shares: ${quantity} Shares
   Price:            Market or MUR ${price}
   Validity:         Maximum 30 days
   ----------------------------------


   Thank you.
 `;


 try {
   // Send email to the broker and BCC self.
   GmailApp.sendEmail(CONFIG.BROKER_EMAIL, subject, body, {
     bcc: CONFIG.MY_EMAIL
   });

   // Log the transaction to the 'Transactions' sheet
   const transactionsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Transactions");
   transactionsSheet.appendRow([new Date(), CONFIG.STOCK_TICKER, tradeDirection.toUpperCase(), quantity, price, "PLACED"]);

   return "✅ Success! Your trade order has been emailed to the broker and logged.";
 } catch (e) {
   Logger.log(`Failed to send trade email: ${e}`);
   return `❌ Error: Could not send the trade order. Please check the logs.`;
 }
}
APIs.gs (External API Calls)

// --- EXTERNAL API CALLS ---


/**
* Fetches the latest stock price from Financial Modeling Prep.
* @param {string} ticker The stock symbol (e.g., "AAPL").
* @returns {object|null} An object with price and volume, or null on error.
*/
function getStockPrice(ticker) {
 const apiKey = getApiKey();
 if (!apiKey) {
   Logger.log("API Key not found. Please run storeApiKey() first.");
   return null;
 }
  const url = `https://financialmodelingprep.com/api/v3/quote-short/${ticker}?apikey=${apiKey}`;
  try {
   const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
   const responseCode = response.getResponseCode();
   const content = response.getContentText();


   if (responseCode === 200) {
     const data = JSON.parse(content);
     if (data && data.length > 0) {
       return { price: data[0].price, volume: data[0].volume };
     }
   }
   Logger.log(`API Error: Response code ${responseCode}. Content: ${content}`);
   return null;
 } catch (e) {
   Logger.log(`Failed to fetch stock price: ${e}`);
   return null;
 }
}
Dialog.html (Custom UI)

<!DOCTYPE html>
<html>
 <head>
   <base target="_top">
   <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
   <style>
     body { padding: 20px; font-family: sans-serif; }
     .loader {
       border: 4px solid #f3f3f3;
       border-radius: 50%;
       border-top: 4px solid #3498db;
       width: 20px;
       height: 20px;
       animation: spin 2s linear infinite;
       display: inline-block;
     }
     @keyframes spin {
       0% { transform: rotate(0deg); }
       100% { transform: rotate(360deg); }
     }
     #status { margin-top: 15px; font-weight: bold; }
   </style>
 </head>
 <body>
   <h4>Place Trade Order</h4>
   <p>Place a buy or sell order for <strong>AAPL</strong>.</p>

   <form id="tradeForm">
     <div class="form-group">
       <label for="tradeDirection">Action</label>
       <select class="form-control" id="tradeDirection" name="tradeDirection">
         <option value="Buy">Buy</option>
         <option value="Sell">Sell</option>
       </select>
     </div>


     <div class="form-group">
       <label for="quantity">Quantity (Number of Shares)</label>
       <input type="number" class="form-control" id="quantity" name="quantity" required>
     </div>


     <div class="form-group">
       <label for="price">Price (USD)</label>
       <div class="input-group">
         <input type="number" step="0.01" class="form-control" id="price" name="price" required>
         <div class="input-group-append">
           <button class="btn btn-outline-secondary" type="button" id="fetchPriceBtn">Get Live Price</button>
         </div>
       </div>
       <small id="priceLoader" style="display:none;">Fetching... <div class="loader"></div></small>
     </div>


     <button type="submit" class="btn btn-primary btn-block" id="submitBtn">Place Order</button>
   </form>


   <div id="status" class="alert" role="alert" style="display:none;"></div>


   <script>
     // Fetch live price when button is clicked
     document.getElementById("fetchPriceBtn").addEventListener("click", () => {
       document.getElementById("priceLoader").style.display = "block";
       google.script.run
         .withSuccessHandler(priceData => {
           document.getElementById("priceLoader").style.display = "none";
           if (priceData) {
             document.getElementById("price").value = priceData.price.toFixed(2);
           } else {
             alert("Could not fetch live price.");
           }
         })
         .getLiveStockPrice();
     });


     // Handle form submission
     document.getElementById("tradeForm").addEventListener("submit", function(e) {
       e.preventDefault();
       document.getElementById("submitBtn").disabled = true;
       document.getElementById("status").style.display = "block";
       document.getElementById("status").className = "alert alert-info";
       document.getElementById("status").innerText = "Placing order...";


       google.script.run
         .withSuccessHandler(response => {
           document.getElementById("status").innerText = response;
           if (response.includes("Success")) {
             document.getElementById("status").className = "alert alert-success";
             setTimeout(google.script.host.close, 3000); // Close dialog on success
           } else {
             document.getElementById("status").className = "alert alert-danger";
             document.getElementById("submitBtn").disabled = false;
           }
         })
         .placeTradeOrder(this);
     });
   </script>
 </body>
</html>
Step 3: How to Set It All Up
Update Config.gs: Fill in all your personal details in the Config.gs file.
Store Your API Key: In Secrets.gs, paste your API key from Financial Modeling Prep. Then, from the script editor, select the storeApiKey function from the dropdown menu and click Run. You only need to do this once.
Set Up Triggers:
In the script editor, go to the Triggers tab (clock icon).
Click + Add Trigger.
Choose function to run: processAllEmails.
Select event source: Time-driven.
Select type: Minutes timer.
Select interval: Every 10 minutes.
Click Save. You will be asked to authorize the script.
Prepare Your Trading Sheet: In the Trading tab of your spreadsheet, set up two columns:
Column A: Month (e.g., "August 2025", "September 2025")
Column B: Payslip Received (Format this column as checkboxes via Insert > Checkbox)
Prepare Your Transactions Sheet: In the Transactions tab, create these headers:Date, Ticker, Type, Quantity, Price, Status
Reload the Spreadsheet: Refresh your Google Sheet. You should now see a new "Stock Trading" menu at the top.
Step 4: Testing
Scenario 1: The Automated Payslip Workflow
This demonstrates the script's ability to react to incoming emails, save attachments, perform API calls, and update you.

How to Test / Stimulate It:
The script is looking for a new, unread email that matches the criteria in your Config.gs file.

If you receive your payslip in outlook like I do and are wondering how to set this up, create an outlook rule to always forward the email with your payslip to your personal gmail account.

To test this, you need to simulate receiving a payslip:

Important: For testing, temporarily change the PAYSLIP_SENDER in your Config.gs file to your own email address (e.g., const PAYSLIP_SENDER = "your_email@example.com";).
From that same email address, send a new email to yourself.
Subject Line: The subject must contain the phrase "Your Monthly Payslip".
Attachment: Attach any PDF file to the email.
Send the email. Once it arrives in your inbox, make sure it is marked as unread.
What the Script Does (The Demo):
Once you've sent the email, you can either wait for the 10-minute trigger to fire or manually run the processAllEmails function from the script editor to see the results immediately.
The script will find your unread "payslip" email.
It will save the PDF attachment to the Google Drive folder you specified.
It will make an API call to get the latest price for AAPL.
It will calculate how many shares you can buy with 20% of your $10,000 salary.
It will find the current month in your "Trading" sheet and check the box in the "Payslip Received" column.
Finally, it will mark the payslip email as read.
What You Receive / See:
You'll get a new email with the subject "✅ Your Payslip Has Been Processed" containing the stock price information.
The PDF attachment will appear in your designated Google Drive folder.
The checkbox for the current month in your "Trading" sheet will be checked.
Payslip saving email

Scenario 2: The Manual Stock Trading Workflow
This demonstrates the custom user interface you built into the spreadsheet for placing trades.

How to Test / Stimulate It:
This workflow is initiated manually by you.

Open your "My Stock Portfolio" Google Sheet.
A new menu item named "Stock Trading" should appear at the top.
Google sheet menu with the custom menu item Stock trading

Click on Stock Trading > 📈 Place New Trade Order.
Stock Trading modal in google sheet

What the Script Does (The Demo):
A custom dialog box titled "Place a Stock Trade Order" will appear.
You can click the "Get Live Price" button to have the script fetch and populate the current AAPL stock price.
Fill out the form: choose Buy or Sell, and enter a Quantity.
Click the "Place Order" button.
The script will compose an email with all the trade details and send it to your broker's email address.
It will BCC you on that email.
It will add a new row to your "Transactions" sheet to log that the order has been placed.
What You Receive / See:
A confirmation message will appear in the dialog box.
Stock Trading modal in google sheet showing order has been placed

You will receive a BCC'd copy of the order email in your inbox.
Email placing the buy order

A new row will be added to the "Transactions" sheet.
Google sheet with updated details on the buy order

Scenario 3: The Automated Contract Note Workflow
This demonstrates how the script handles incoming trade confirmations.

How to Test / Stimulate It:
Similar to the payslip, you need to simulate receiving a contract note:

Change the CONTRACT_NOTE_SENDER in your Config.gs file to your own email address for the test.
Send a new email to yourself.
Subject Line: The subject must contain the phrase "Contract Note".
Attachment: Attach any PDF file.
Send the email and ensure it's unread.
What the Script Does (The Demo):
When the processAllEmails function runs, it will:

Find your unread "Contract Note" email.
Save the PDF attachment to your Google Drive folder.
Because the script cannot read the PDF's contents, it will send you a notification email.
It will mark the contract note email as read.
What You Receive / See:
You'll get a new email with the subject "📝 Action Required: Log Your Recent Trade", prompting you to manually update your "Transactions" sheet with the final details from the PDF.
Contract note saving confirmation email

The contract note PDF will be saved in your Google Drive folder.
Step 5: GitHub Integration with clasp
*Feel free to skip this step if you are not technical.
clasp is a command-line tool that lets you manage your Apps Script projects locally and push/pull them to/from GitHub.

Install Node.js: If you don't have it, install Node.js from nodejs.org.

Install clasp: Open your terminal or command prompt and run:

npm install -g @google/clasp
Login to Google:

clasp login
This will open a browser window for you to authorize clasp.
Enable the Apps Script API: Go to the Apps Script API page and turn it on.
Clone Your Project:
In your Apps Script editor, go to Project Settings (gear icon) and copy the Script ID.
In your terminal, navigate to your desired folder (e.g., cd Documents/GitHub) and run:

clasp clone "YOUR_SCRIPT_ID_HERE"
This will download all your .gs and .html files into a new folder.
Work with GitHub: You can now treat this folder as a standard Git repository.

cd your-project-name
git init
git add .
git commit -m "Initial commit of finance automation script"
# Add your remote and push to GitHub
Pushing Changes Back to Apps Script: After making changes locally, just run clasp push.
This setup provides a powerful, automated workflow for managing your finances, all orchestrated from within your Google Workspace.

Step 6 (Bonus): Visualization using Looker Studio
You can also take your stock tracking to the next level by building a portfolio dashboard using Looker Studio, with the “My Stock Portfolio” Google Sheet as the data source. This dashboard can display key metrics such as total value bought and sold over time, monthly performance, and even stock-specific trends. By connecting your sheet directly to Looker Studio and visualizing your data through bar charts, line graphs, or scorecards, you gain a real-time, interactive view of your portfolio’s evolution. It’s a great way to stay informed and make data-driven investment decisions.

The Apps script, however, cannot automate the making of the charts and so you will need to add, format and align them manually.

Investment portfolio dashboard on looker studio

Conclusion
And there you have it! A simple project based introduction to Google Apps Script.

We’ve covered how to set up triggers, interact with Gmail, parse attachments, and store secrets securely—while also touching on important limitations. The biggest takeaway? You don’t need external tools to start automating tasks right inside your Google Workspace—Apps Script gives you a surprisingly powerful head start.
I am curious what you choose to automate first. Let me know in the comments. Also, let me know if I should deploy the automated stock ordering custom menu as a google sheet add on. It’s definitely a time saver for me.

I will get to n8n and Zapier in due time but for now, Google Apps Script serves me well. Till next time, have fun.