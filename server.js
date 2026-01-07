require('dotenv').config();  // Load environment variables from .env file
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 3000;
const axios = require('axios');
const multer = require('multer');
const cron = require('node-cron');
const Brevo = require('@getbrevo/brevo');
const { parseStringPromise } = require("xml2js");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

 ///// tHIS NGROK HAS BEEN ADDED FOR TESTING PURPOSES FOR THE COMPANIES HOUSE API AS IT REQUIRES A FULL URL and NOT JUST LOCALHOST. This NGROK tool should expose the localhost to a public facing url


// const ngrok = require('ngrok');

// (async function() {
//   const url = await ngrok.connect(3000);
//   console.log(`ngrok tunnel running at: ${url}`);
// })();


 ///// END OF NGROK FUNCTIONALITY, SPECIFICALLY ADDED FOR TESTING PURPOSES FOR THE CMPANIES HOUSE API.
 

// s3 bucketeer code //
const { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner'); // Include the pre-signed URL generator
const fs = require('fs');

const uploadDir = path.join(__dirname, 'uploads');

// Ensure 'uploads/' directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✅ Created uploads directory.');
} else {
    console.log('✅ Uploads directory already exists.');
}

// Initialize the S3 client
const s3Client = new S3Client({
  region: 'eu-west-1',
  credentials: {
    accessKeyId:  'AKIAVZH4SBSYYGQ4BAAO',
    secretAccessKey: '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',
  },
});

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err.stack || err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("🚨 Unhandled Rejection at:", promise, "reason:", reason);
});


const phpExpress = require('php-express')({
  binPath: 'php' // Adjust this path if PHP is not globally accessible
});

//// testing decryption methods /////
// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// const fetch = require('node-fetch');

// fetch('http://localhost:8001/decryption.php?data=NGhVVks3cG4wMFhMdVdEek83QndHc3E2UFJnaXMwV3NnaDZvMGg1QTkwaz0=')
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.error('Fetch error:', error));


// async function decryptWithPHP(encryptedString) {
//   const url = `http://localhost:8001/decryption.php?data=${encodeURIComponent(encryptedString)}`;
//   try {
//       console.log(`Attempting to fetch from URL: ${url}`);
//       const response = await fetch(url);

//       if (!response.ok) {
//           console.error('HTTP Error:', response.status, response.statusText);
//           throw new Error('Failed to connect to PHP service');
//       }

//       const data = await response.json();
//       console.log('Received response from PHP service:', data);
//       return data.decrypted;
//   } catch (error) {
//       console.error('Decryption Error:', error);
//       return 'Decryption failed';
//   }
// }

app.get('/fetch-file', async (req, res) => {
  const { fileUrl } = req.query;

  if (!fileUrl) {
      return res.status(400).json({ error: "File URL is required" });
  }

  try {
      // Fetch the file from Bucketeer
      const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });

      // Extract the file name from the URL
      const fileName = fileUrl.split('/').pop().split('?')[0];

      // ✅ Allow CORS for all origins
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

      // ✅ Set appropriate headers for file download
      res.setHeader("Content-Type", response.headers["content-type"]);
      res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);

      // ✅ Send the file back to the frontend
      res.send(response.data);
  } catch (error) {
      console.error("Error fetching file:", error.message);
      res.status(500).json({ error: "Unable to fetch the file" });
  }
});


///// AUTOGURU - NEW VEHICLE LOOKUP SERVICE 30/10/25 //////

// ==== Auto Guru OAuth2 token cache ====
const {
  AUTOGURU_CLIENT_ID,
  AUTOGURU_CLIENT_SECRET,
  AUTOGURU_AUTH_URL,
  AUTOGURU_API_BASE
} = process.env;

if (!AUTOGURU_CLIENT_ID || !AUTOGURU_CLIENT_SECRET) {
  console.error('Auto Guru creds missing: check .env (AUTOGURU_CLIENT_ID / AUTOGURU_CLIENT_SECRET).');
}
let agToken = null;
let agTokenExp = 0; // epoch ms

async function getAutoGuruAccessToken() {
  const now = Date.now();
  if (agToken && now < agTokenExp - 60_000) return agToken;

  const form = new URLSearchParams();
  form.append('client_id', "265");
  form.append('client_secret', "x6bh$dussI2K&WrxHDOmL@RPAZcJ5p8VUuIf#sNG");
  form.append('grant_type', 'password'); // as per their guide

  try {
    const resp = await axios.post(
      AUTOGURU_AUTH_URL || 'https://auth.autoguruservices.com/token',
      form.toString(),
      { headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 10000 }
    );
    agToken = resp.data.access_token;
    const expiresInSec = Number(resp.data.expires_in || 14400);
    agTokenExp = Date.now() + expiresInSec * 1000;
    return agToken;
  } catch (e) {
    const body = e.response?.data;
    console.error('Auto Guru token error:', e.response?.status, body || e.message);

    // Optional quick retry with client_credentials if their tenant is set up that way.
    if (body?.error === 'unsupported_grant_type' || body?.error_description?.includes('grant')) {
      const alt = new URLSearchParams();
      alt.append('client_id', "265");
      alt.append('client_secret', "x6bh$dussI2K&WrxHDOmL@RPAZcJ5p8VUuIf#sNG");
      alt.append('grant_type', 'client_credentials');
      const resp2 = await axios.post(
        AUTOGURU_AUTH_URL || 'https://auth.autoguruservices.com/token',
        alt.toString(),
        { headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 10000 }
      );
      agToken = resp2.data.access_token;
      const expiresInSec = Number(resp2.data.expires_in || 3600);
      agTokenExp = Date.now() + expiresInSec * 1000;
      return agToken;
    }

    throw e;
  }
}



///// END OF ///// AUTOGURU - NEW VEHICLE LOOKUP SERVICE 30/10/25 //////



// Test the decryption function
// const encryptedString = 'NGhVVks3cG4wMFhMdVdEek83QndHc3E2UFJnaXMwV3NnaDZvMGg1QTkwaz0='; // Replace with your encrypted data
// decryptWithPHP(encryptedString)
//     .then(decryptedData => console.log('Decrypted Data:', decryptedData))
//     .catch(error => console.error('Error:', error));


// Route to decrypt data using the PHP decryption service
app.get('/decrypt-data', async (req, res) => {
  const { encrypted } = req.query;

  if (!encrypted) {
      return res.status(400).json({ error: 'Encrypted data is required' });
  }

  // const url = `http://localhost:8000/decryption.php?data=${encodeURIComponent(encrypted)}`;
  const url = `http://localhost:8001/decryption.php?data=${encodeURIComponent(encryptedString)}`;


  try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.decrypted) {
          res.json({ decrypted: data.decrypted });
      } else {
          res.status(500).json({ error: 'Failed to decrypt data' });
      }
  } catch (error) {
      console.error('Decryption fetch error:', error);
      res.status(500).json({ error: 'Error connecting to PHP decryption service' });
  }
});



// const crypto = require('crypto');

// function app_crypt(string, action = 'd') {
//   const secret_key = 'GabrielliBarryEncodedDataforGDPRNewRule12345!';
//   const secret_iv = 'WA-NewDATAEncodeSchemeCode123!@#';

//   // Create key and IV as in PHP
//   const key = crypto.createHash('sha256').update(secret_key).digest();
//   const iv = crypto.createHash('sha256').update(secret_iv).digest().slice(0, 16);

//   let output;

//   if (action === 'd') {
//     try {
//       // Attempt to decode the encrypted string in case of double encoding
//       let encryptedData;
//       try {
//         encryptedData = Buffer.from(Buffer.from(string, 'base64').toString(), 'base64');
//       } catch (err) {
//         encryptedData = Buffer.from(string, 'base64');
//       }

//       const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
//       decipher.setAutoPadding(true); // Ensures padding is handled

//       // Perform the decryption
//       let decrypted = decipher.update(encryptedData);
//       decrypted = Buffer.concat([decrypted, decipher.final()]);
//       output = decrypted.toString();
      
//       console.log('Decrypted Data:', output);
//     } catch (error) {
//       console.error('Decryption error:', error.message);
//       return 'Decryption failed';
//     }
//   }

//   return output;
// }



// // Test route for decryption
// app.get('/decrypt', (req, res) => {
//   const encryptedString = '[VTS_]dWYvek52azhET28rOWVha1dPZHpRQT09';
//   const decrypted = app_crypt(encryptedString, 'd');
//   res.send(`Decrypted Data: ${decrypted || 'Decryption failed'}`);
// });



///// END OF TESTING DECRYPTION METHODS ////

///// test the SMS functionality - HEROKU - Blower.io SMS////


var request = require('request');

function sendText () {
  var countryCode = '+44',
      mobileNumber = '7584433817',
      message = `Hello Liam,\nYour MOT is due on 26/11/24 \nCall and Book now on 99999999999`;

  if (!process.env.BLOWERIO_URL) {
    console.error("BLOWERIO_URL is not defined in environment variables.");
    process.exit(1);  // Exit the application if API key is missing
  }

  request.post({
    headers: {
      'content-type' : 'application/x-www-form-urlencoded',
      'Accepts': 'application/json'
    },
    url:     process.env.BLOWERIO_URL + '/messages',
    form:    {
      to: countryCode + mobileNumber,
      message: message
    }
  }, function(error, response, body){
    if (!error && response.statusCode == 201)  {
      console.log('Message sent!');
    } else {
      var apiResult = JSON.parse(body);
      console.log('Error was: ' + apiResult.message);
    }
  });
}
// sendText()






///// END OF TEST THE SMS FUNCTIONALITY - HEROKU - Blower.io SMS

// Function to upload file to Bucketeer S3
const uploadFile = async (filePath, fileName) => {
  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: 'bucketeer-cdda425f-b90b-44bd-b711-5d96d47252e4',
    Key: fileName,
    Body: fileContent,
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(params));
    console.log(`File uploaded successfully. ${data}`);
    return data;  // Return the metadata (such as ETag) after the upload
  } catch (err) {
    console.error('Error', err);
    throw err;  // Re-throw the error to handle it in the route
  }
};

// Function to generate a pre-signed URL for viewing the uploaded file
const generatePresignedUrl = async (fileName) => {
  const params = {
    Bucket: 'bucketeer-cdda425f-b90b-44bd-b711-5d96d47252e4',
    Key: fileName,
  };

  try {
    // Generate a pre-signed URL valid for 60 minutes
    const url = await getSignedUrl(s3Client, new GetObjectCommand(params), { expiresIn: 3600 });
    return url;
  } catch (err) {
    console.error('Error generating pre-signed URL:', err);
    throw err;
  }
};

app.get('/get-presigned-url', async (req, res) => {
  const fileName = req.query.fileName;
  try {
    const url = await generatePresignedUrl(fileName);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: 'Error generating URL' });
  }
});

app.post('/upload', upload.single('file'), async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('Uploaded File:', req.file);
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // const filePath = req.file.path;
  const filePath = path.join(__dirname, 'uploads', req.file.filename);
  console.log(`✅ File received: ${filePath}`);
  const fileName = req.file.originalname;
  console.log('filePath', filePath)
  console.log('fileName', fileName)


  try {
    const result = await uploadFile(filePath, req.file.filename);// Result contains metadata like ETag
    console.log(`✅ File uploaded to S3: ${req.file.filename}`);
    // Generate the pre-signed URL for preview
    const previewUrl = await generatePresignedUrl(req.file.filename);
    console.log(`✅ Generated S3 URL: ${previewUrl}`);

    res.status(200).json({
      message: 'File uploaded successfully.',
      etag: result.ETag,
      fileName: req.file.filename,
      filePath: filePath,
      key: req.file.filename,
      previewUrl: previewUrl
    });

  } catch (err) {
    console.error('❌ Error uploading to S3:', err);
 
    res.status(500).json({ 
      error: "File upload failed.",
      details: err.message
    });
  } finally {
    setTimeout(() => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`❌ Failed to delete temp file: ${filePath}`, err);
        } else {
          console.log(`✅ Temp file deleted: ${filePath}`);
        }
      });
    }, 5000);  // Delays deletion by 5 seconds
  }
});


// Example usage
// const filePath = path.join(__dirname, 'example2.txt');
// uploadFile(filePath, 'example2.txt');

// Function to list files in the bucket
const listFiles = async () => {
  const params = {
    Bucket: 'bucketeer-cdda425f-b90b-44bd-b711-5d96d47252e4',
  };

  try {
    const data = await s3Client.send(new ListObjectsV2Command(params));
    if (data.Contents) {
      data.Contents.forEach((file) => {
        console.log('File obj', file)
        console.log(`File: ${file.Key}`);
      });
    } else {
      console.log('No files found');
    }
  } catch (err) {
    console.log('Error', err);
  }
};

// listFiles();

// Function to download/view file from Bucketeer (S3)
const downloadFile = async (fileKey, res) => {
  const params = {
    Bucket: 'bucketeer-cdda425f-b90b-44bd-b711-5d96d47252e4',
    Key: fileKey,
  };

  try {
    const data = await s3Client.send(new GetObjectCommand(params));
    
    // Pipe the file data to the response (for file download/view)
    data.Body.pipe(res);
    
  } catch (err) {
    console.error('Error downloading file:', err);
    res.status(500).send('Error downloading file');
  }
};

// Add route to download/view file
app.get('/files/download/:filename', async (req, res) => {
  const fileKey = req.params.filename;
  
  // Set the correct headers for file download/view
  res.attachment(fileKey); // Forces download; remove for inline view
  
  // Download the file from S3 and send it to the user
  await downloadFile(fileKey, res);
});

app.get('/files', async (req, res) => {
  const params = {
    Bucket: 'bucketeer-cdda425f-b90b-44bd-b711-5d96d47252e4',
  };

  try {
    const data = await s3Client.send(new ListObjectsV2Command(params));
    if (data.Contents) {
      const files = data.Contents.map(file => file.Key);

      // Send a simple HTML list with download links for each file
      const html = files.map(file => `<li><a href="/files/download/${file}">${file}</a></li>`).join('');
      res.send(`<ul>${html}</ul>`);
    } else {
      res.send('No files found');
    }
  } catch (err) {
    console.log('Error', err);
    res.status(500).send('Error listing files');
  }
});

// Function to delete a file from S3 using the S3 key (file name)
const deleteFile = async (fileKey) => {
  const params = {
    Bucket: 'bucketeer-cdda425f-b90b-44bd-b711-5d96d47252e4',  // Your bucket name
    Key: fileKey,  // The key (file name) of the file you want to delete
  };

  try {
    const data = await s3Client.send(new DeleteObjectCommand(params));
    console.log(`File deleted successfully: ${fileKey}`);
    return data;
  } catch (err) {
    console.error('Error deleting file:', err);
    throw err;
  }
};

// Add a route to handle the deletion of files
app.delete('/files/delete/:key', async (req, res) => {
  const fileKey = req.params.key;  // Get the file key (filename) from the request

  try {
    await deleteFile(fileKey);  // Invoke the deleteFile function
    res.status(200).send(`File with key ${fileKey} deleted successfully.`);
  } catch (err) {
    res.status(500).send(`Error deleting file: ${err.message}`);
  }
});



//// s3 bucketeers code end /////


// Middleware should be applied first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'Site')));

// Middleware to log all incoming requests and their responses
app.use((req, res, next) => {
  console.log(`➡️ Incoming Request: ${req.method} ${req.url}`);
  console.log("🔹 Request Body:", req.body);
  
  res.on("finish", () => {
    console.log(`⬅️ Response Sent: ${res.statusCode}`);
  });

  next();
});

// const { DeleteObjectCommand } = require("@aws-sdk/client-s3");

app.post('/api/mot-reconciliation/delete-file', async (req, res) => {
  try {
    const { key } = req.body;

    const command = new DeleteObjectCommand({
      Bucket: process.env.BUCKETEER_BUCKET_NAME,
      Key: key
    });
    await s3Client.send(command);
    res.send({ success: true });
  } catch (error) {
    console.error('Error deleting reconciliation file:', error);
    res.status(500).send({ success: false });
  }
});






//// nexmo sms service ////
// const Nexmo = require('nexmo');
// const nexmo = new Nexmo({
//   apiKey: 'YOUR_API_KEY',
//   apiSecret: 'YOUR_API_SECRET',
// });

// nexmo.message.sendSms('YourBrand', '1234567890', 'Your SMS message content', (err, responseData) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(responseData);
//   }
// });



////// end of nexmo sms service //////



//// OLD DB 29/04/25  - this was the blacktip shared instance /////
// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'uf63wl4z2daq9dbb.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
//   user: process.env.DB_USER || 'z3rc3i22ilpdtyh7',
//   password: process.env.DB_PASSWORD || 'kchjfuortpxwbiuc',
//   database: process.env.DB_NAME || 'rdb73dbfwzyz1yh5',
//     waitForConnections: true,
//     queueLimit: 0,
//     acquireTimeout: 10000,  
//     connectionLimit: 5
// });

///// END OF OLD DB 29/04/25 - this was the blacktip shared instance /////

//// NEW WhiteTip JAWSDB Instance - STARTING on the 29/04/25 /////
const pool = mysql.createPool({
  host: process.env.DB_HOST_WHITETIP || 'us3rzbv7qzsfq3ch.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
  user: process.env.DB_USER_WHITETIP || 'teuld0e6dnvrltf1',
  password: process.env.DB_PASSWORD_WHITETIP || 'mg1aqr1xk2lgzuks',
  database: process.env.DB_NAME_WHITETIP || 'rdb73dbfwzyz1yh5',
    waitForConnections: true,
    queueLimit: 0,
    acquireTimeout: 10000,  
    connectionLimit: 10,
     dateStrings: ['DATE'] // ✅ THIS FIXES YOUR DATE BUG
});
////// END OF WHITETip JAWSDB INSTANCE CONNECTION /////////////////////////////////////////////


// ============== AUTOMATED EMAIL REMINDERS (BREVO) ==============

// Initialize Brevo API
const emailApiInstance = new Brevo.TransactionalEmailsApi();
emailApiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

// Determine if this day should trigger an email
// Schedule: 30, 26, 23, then every 5 days (18, 13, 8), then daily from 3 days
function shouldSendReminder(daysUntil) {
  // First reminders
  if ([30, 26, 23].includes(daysUntil)) return true;
  // Every 5 days from 23 down to 3
  if ([18, 13, 8].includes(daysUntil)) return true;
  // Daily from 3 days
  if (daysUntil <= 3 && daysUntil >= 0) return true;
  return false;
}

// Check if escalation is needed (23 days or less = include all contacts)
function isEscalation(daysUntil) {
  return daysUntil <= 23;
}

// Get all email recipients for a garage
function getRecipients(garage, escalate) {
  const recipients = [];
  
  // Always include main contact
  if (garage.contact_email_garage && garage.contact_email_garage.trim()) {
    recipients.push({
      email: garage.contact_email_garage.trim(),
      name: garage.trading_name_garage || 'Team'
    });
  }
  
  // If escalation, include additional contacts
  if (escalate) {
    if (garage.invoice_contact_email_garage && garage.invoice_contact_email_garage.trim()) {
      recipients.push({
        email: garage.invoice_contact_email_garage.trim(),
        name: `${garage.trading_name_garage} - Invoice Contact`
      });
    }
    if (garage.aed_email_garage && garage.aed_email_garage.trim()) {
      recipients.push({
        email: garage.aed_email_garage.trim(),
        name: `${garage.trading_name_garage} - AED`
      });
    }
  }
  
  // Remove duplicates
  const uniqueEmails = [...new Map(recipients.map(r => [r.email.toLowerCase(), r])).values()];
  return uniqueEmails;
}

// Send inspection reminder email
async function sendInspectionReminder(garage, daysUntil, escalate = false) {
  try {
    const recipients = getRecipients(garage, escalate);
    if (recipients.length === 0) {
      console.log(`⚠️ No valid email addresses for ${garage.trading_name_garage}`);
      return false;
    }

    const urgencyText = daysUntil <= 3 ? 'URGENT: ' : (escalate ? 'ESCALATION: ' : '');
    const urgencyColor = daysUntil <= 3 ? '#DC3545' : '#0068B5';
    
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { email: 'noreply@twilightpharmacy.co.uk', name: 'MOTCG' };
    sendSmtpEmail.to = recipients;
    sendSmtpEmail.subject = `${urgencyText}MOT Inspection Due in ${daysUntil} Day${daysUntil !== 1 ? 's' : ''} - Action Required`;
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: ${urgencyColor}; border-bottom: 2px solid ${urgencyColor}; padding-bottom: 10px;">
          ${urgencyText}Inspection Reminder
        </h2>
        <p>Dear ${garage.contact_forename_garage || 'Team'},</p>
        <p>This is a reminder that <strong>${garage.trading_name_garage}</strong> has an MOT inspection due in <strong>${daysUntil} day${daysUntil !== 1 ? 's' : ''}</strong>.</p>
        ${escalate ? '<p style="color: #DC3545; font-weight: bold;">⚠️ This is an escalated reminder - all contacts are being notified.</p>' : ''}
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Site Number:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${garage.vts_site_number_garage || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Due Date:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${garage.due_date || 'See system'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Reminder:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${garage.reminder_title || 'Inspection Due'}</td>
          </tr>
        </table>
        <p>Please ensure all documentation and equipment is ready for inspection.</p>
        <br>
        <p style="color: #666;">Regards,<br><strong>MOTCG Team</strong></p>
      </div>
    `;

    await emailApiInstance.sendTransacEmail(sendSmtpEmail);
    const recipientList = recipients.map(r => r.email).join(', ');
    console.log(`✅ Reminder sent to ${garage.trading_name_garage} (${recipientList})${escalate ? ' [ESCALATED]' : ''}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send to ${garage.trading_name_garage}:`, error.message);
    return false;
  }
}

// Run the inspection reminder job
async function runInspectionReminderJob() {
  console.log('🔍 Running inspection reminder check...', new Date().toISOString());
  
  try {
    const [reminders] = await pool.promise().query(`
      SELECT 
        g.*,
        r.due_date,
        r.title as reminder_title,
        DATEDIFF(r.due_date, CURDATE()) as days_until_due
      FROM data_launch_garage_records g
      JOIN data_launch_garage_reminders r ON g.id = r.garage_id
      WHERE r.due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 31 DAY)
        AND (g.data_launch_marked_for_deletion IS NULL OR g.data_launch_marked_for_deletion != 1)
        AND (r.data_launch_marked_for_deletion IS NULL OR r.data_launch_marked_for_deletion != 1)
        AND g.contact_email_garage IS NOT NULL
        AND g.contact_email_garage != ''
    `);
    
    console.log(`📋 Found ${reminders.length} upcoming reminders`);
    
    let sentCount = 0;
    for (const garage of reminders) {
      const daysUntil = garage.days_until_due;
      
      // Check if we should send on this day
      if (shouldSendReminder(daysUntil)) {
        const escalate = isEscalation(daysUntil);
        const sent = await sendInspectionReminder(garage, daysUntil, escalate);
        if (sent) sentCount++;
        
        // Rate limiting - wait 500ms between emails
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`📧 Sent ${sentCount} reminder emails`);
    return { found: reminders.length, sent: sentCount };
  } catch (error) {
    console.error('❌ Inspection reminder job failed:', error);
    return { error: error.message };
  }
}

// Schedule: Run at 9:00 AM every day
cron.schedule('0 9 * * *', () => {
  console.log('⏰ Scheduled inspection reminder job starting...');
  runInspectionReminderJob();
});
console.log('⏰ Inspection reminder cron job scheduled for 9:00 AM daily');

// ============== END AUTOMATED EMAIL REMINDERS ==============


// Function to check if a table is allowed
const allowedTables = ['testing_station', 'data_launch_garage_records', 'tester_garages', 'data_launch_tester_records', 'data_launch_notes', 'data_launch_mot_equipment', 'data_launch_images', 'data_launch_mot_calibration', 'data_launch_mot_site_audits', 'data_launch_qc_checkers_for_car', 'data_launch_garage_bookings', 'data_launch_defect_reports', 'data_launch_mot_bay_cleaning_log', 'data_launch_tester_training_records', 'data_launch_qc_checkers_for_bike', 'data_launch_users', 'data_launch_garage_reminders', 'data_launch_mot_reconciliations', 'data_launch_special_notices', 'data_launch_special_notices_acknowledgements', 'data_launch_bays', 'data_launch_tqis', 'data_launch_ae_users_accessible_garages']; // Add more tables as needed

function isTableAllowed(table) {
  return allowedTables.includes(table);
}

// ============== TEST ENDPOINT FOR EMAIL REMINDERS ==============
app.get('/api/test-inspection-emails', async (req, res) => {
  console.log('🧪 Manual inspection email test triggered');
  const result = await runInspectionReminderJob();
  res.json({ 
    message: 'Inspection reminder job completed', 
    result,
    timestamp: new Date().toISOString()
  });
});
// ============== END TEST ENDPOINT ==============

// app.get('/api/testing_station/search', (req, res) => {
//     const vtsSiteNumber = req.query.vts_site_number;

//     if (!vtsSiteNumber) {
//         return res.status(400).json({ error: 'Missing vts_site_number' });
//     }

//     const query = `SELECT * FROM testing_station WHERE vts_site_number = ? LIMIT 50`;

//     pool.query(query, [vtsSiteNumber], (err, results) => {
//         if (err) {
//             console.error("Error querying testing station:", err);
//             return res.status(500).json({ error: 'Database error' });
//         }
//         res.json(results);
//     });
// });

app.get('/api/testing_station/search', (req, res) => {
    const vtsSiteNumber = req.query.vts_site_number;

    if (!vtsSiteNumber || vtsSiteNumber.trim().length < 2) {
        return res.status(400).json({ error: 'Please enter at least 2 characters' });
    }

    const query = `SELECT * FROM testing_station WHERE vts_site_number LIKE ? LIMIT 50`;

    pool.query(query, [`%${vtsSiteNumber}%`], (err, results) => {
        if (err) {
            console.error("Error querying testing station:", err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});


app.get('/api/testing_station/check-vts/:vtsNumber', async (req, res) => {
  const vtsNumber = req.params.vtsNumber;
  const excludeId = req.query.excludeId;

  try {
    let query = 'SELECT * FROM testing_station WHERE vts_site_number = ?';
    let values = [vtsNumber];

    if (excludeId) {
      query += ' AND id != ?';
      values.push(parseInt(excludeId));
    }

    const [rows] = await pool.promise().query(query, values);

    if (rows.length > 0) {
      return res.json({ exists: true, records: rows });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/api/login/data', (req, res) => {
  const username = req.query.username
  const password = req.query.password
  const id = req.query.id
  let query;
  let params;

  if (username && password) {
    query = `SELECT * FROM data_launch_users WHERE username = ? AND password = ?`;
    params = [username, password];
  }
  else if (id) {
    query = `SELECT * FROM data_launch_users WHERE id = ?`;
    params = [id]
  }
  if (query.includes("WHERE")) {
    query = query.replace(
      "ORDER BY",
      "AND (data_launch_marked_for_deletion IS NULL OR data_launch_marked_for_deletion <> 1)"
    );
  }

  pool.getConnection((err, connection) => {
    if (err) {
        console.error("⚠️ Error getting database connection:", err);
        return res.status(500).json({ error: "Database connection error" });
    }

    connection.query(query, params, (error, results) => {
        connection.release(); // Release the connection back to the pool

        if (error) {
            console.error("❌ Query failed:", error);
            return res.status(500).json({ error });
        }
        if (results.length >= 1) {
          // dataLaunchUser = results[0]
          console.log('dataLaunchUser', results[0])
        }
        res.json(results);
    });
  });
})

app.get('/api/:table/data', (req, res) => {
  const { table } = req.params;
  const id = parseInt(req.query.id, 10);
  const garageId = parseInt(req.query.garage_id, 10);
  const testerId = parseInt(req.query.tester_id, 10);
  const imagesAssociatedRecordId = parseInt(req.query.record_id, 10)
  const username = req.query.username
  const password = req.query.password
  const recordId = parseInt(req.query.record_id)
  const limit = parseInt(req.query.limit, 10) || 50; // Default to 50 records
  const offset = parseInt(req.query.offset, 10) || 0; // Default to starting at record 0
  const specialNoticeId = parseInt(req.query.special_notice_id) || null
  const userId = parseInt(req.query.user_id) || null
  const recordType = req.query.record_type
  const createDate = req.query.create_date
  const loggedInUserId = req.query.logged_in_user_id
  const aeLogin = req.query.ae_login
  const multipleIds = req.query.ids
  console.log('multiple IDS are ', multipleIds, 'ae Login is ',  aeLogin, 'table is ', table)
  if (!isTableAllowed(table)) {
      return res.status(400).json({ error: 'Table not allowed' });
  }

  let query;
  let params;

  if (garageId && recordId && recordType) {
    query = `SELECT * FROM ?? WHERE garage_id = ? AND record_id = ? AND record_type = ? ORDER BY id DESC LIMIT ? OFFSET ?`;
    params = [table, garageId, recordId, recordType, limit, offset];
  }
  else if (garageId && recordId) {
    query = `SELECT * FROM ?? WHERE garage_id = ? AND record_id = ? ORDER BY id DESC LIMIT ? OFFSET ?`;
    params = [table, garageId, recordId, limit, offset];
  }
  else if (garageId) {
    query = `SELECT * FROM ?? WHERE garage_id = ? ORDER BY id DESC LIMIT ? OFFSET ?`;
    params = [table, garageId, limit, offset];
}
  else if (testerId && imagesAssociatedRecordId) {
    query = `SELECT * FROM ?? WHERE tester_id = ? AND record_id = ? ORDER BY id DESC LIMIT ? OFFSET ?`;
    params = [table, testerId, imagesAssociatedRecordId, limit, offset];
  }
  else if (testerId && recordId) {
    query = `SELECT * FROM ?? WHERE tester_id = ? AND record_id = ? ORDER BY id DESC LIMIT ? OFFSET ?`;
    params = [table, testerId, recordId, limit, offset];
  }
  else if (testerId) {
    query = `SELECT * FROM ?? WHERE tester_id = ? ORDER BY id DESC LIMIT ? OFFSET ?`;
    params = [table, testerId, limit, offset];
  } 
  // else if (req.query.ids) {  // Ensure IDs exist in the query
  //   let ids = req.query.ids;
    
  //   if (typeof ids === 'string') {
  //       ids = ids.split(',').map(id => parseInt(id.trim(), 10));  // Convert to array
  //   }

  //   query = `SELECT * FROM ?? WHERE id IN (?) ORDER BY id DESC`;
  //   params = [table, ids];
  // }

  else if (userId && table === 'data_launch_ae_users_accessible_garages') {
    query = `SELECT * FROM ?? WHERE user_id = ? LIMIT ? OFFSET ?`;
    params = [table, userId, limit, offset];
  }

  else if (req.query.ids) {
    let ids = req.query.ids;

    if (typeof ids === 'string') {
        ids = ids.split(',').map(id => parseInt(id.trim(), 10));
    }

    const placeholders = ids.map(() => '?').join(', ');
    query = `SELECT * FROM ?? WHERE id IN (${placeholders}) ORDER BY id DESC`;
    console.log('this appears to only be running for ', table)
    params = [table, ...ids];
  }
  else if (id) {
      query = `SELECT * FROM ?? WHERE id = ? ORDER BY id DESC LIMIT ? OFFSET ?`;
      params = [table, id, limit, offset];
  }
  else if (imagesAssociatedRecordId) {
    query = `SELECT * FROM ?? WHERE record_id = ? ORDER BY id DESC LIMIT ? OFFSET ?`;
    params = [table, imagesAssociatedRecordId, limit, offset];
  }
  else if (username && password) {
    query = `SELECT * FROM ?? WHERE username = ? AND password = ? ORDER BY id DESC LIMIT ? OFFSET ?`;
    params = [table, username, password, limit, offset];
  } 
  else if (username) {
    query = `SELECT * FROM ?? WHERE username = ? ORDER BY id DESC LIMIT ? OFFSET ?`;
    params = [table, username, limit, offset];
  }
  else if (specialNoticeId && userId) {
    query = `SELECT * FROM ?? WHERE special_notice_id = ? AND user_id = ? ORDER BY user_id DESC LIMIT ? OFFSET ?`;
    params = [table, specialNoticeId, userId, limit, offset];
  }
  else if (createDate) {
    query = `SELECT * FROM ?? WHERE create_date > ? ORDER BY id DESC LIMIT ? OFFSET ?`;
    params = [table, createDate, limit, offset];
  }
  else if (multipleIds === '' && aeLogin && table === 'data_launch_garage_records') {
      return res.json([]);
  }
  else if (multipleIds && aeLogin && table === 'data_launch_garage_records') {
    const ids = typeof multipleIds === 'string' ? multipleIds.split(',').map(id => parseInt(id)) : multipleIds;
    const placeholders = ids.map(() => '?').join(', ');
    query = `SELECT * FROM ?? WHERE id IN (${placeholders}) ORDER BY id DESC`;
    params = [table, ...ids];
  }
  else if (aeLogin) {
      query = `SELECT * FROM ?? WHERE ae_login = ? ORDER BY id DESC LIMIT ? OFFSET ?`;
      params = [table, aeLogin, limit, offset];
  }
  else {
      query = `SELECT * FROM ?? ORDER BY id DESC LIMIT ? OFFSET ?`;
      params = [table, limit, offset];
  }

  console.log('The query is ', query)
  console.log('params are ', params);

  // connection.query(query, params, (error, results) => {
  //     if (error) {
  //         return res.status(500).json({ error });
  //     }
  //     res.json(results);
  // });

  // Add deletion filter to exclude records marked for deletion
  if (query.includes("WHERE")) {
    query = query.replace(
      "ORDER BY",
      "AND (data_launch_marked_for_deletion IS NULL OR data_launch_marked_for_deletion <> 1) ORDER BY"
    );
  } else {
    query = query.replace(
      "FROM ??",
      "FROM ?? WHERE (data_launch_marked_for_deletion IS NULL OR data_launch_marked_for_deletion <> 1)"
    );
  }


  pool.getConnection((err, connection) => {
    if (err) {
        console.error("⚠️ Error getting database connection:", err);
        return res.status(500).json({ error: "Database connection error" });
    }

    connection.query(query, params, (error, results) => {
        connection.release(); // Release the connection back to the pool

        if (error) {
            console.error("❌ Query failed:", error);
            return res.status(500).json({ error });
        }
        // if (dataLaunchUser && typeof dataLaunchUser.full_user !== 'undefined' && dataLaunchUser.full_user === 0) {
        //   if (table === 'data_launch_garage_records') {
        //     for (let i = 0; i < results.length; i++) {
        //       if (results[i].id === parseInt(dataLaunchUser.garage_id)) {
        //           return res.json([results[i]])
        //       }
        //     }
        //   }
        //   if (table === 'data_launch_tester_records') {
        //     let arr = []
        //     for (let i = 0; i < results.length; i++) {
        //         arr.push(
        //           {
        //             first_name: results[i].first_name,
        //             last_name: results[i].last_name,
        //             user_id: results[i].user_id,
        //             id: results[i].id
        //           }
        //         )
        //     }
        //     return res.json(arr)
        //   }
        //   else {
        //     return res.json(results);
        //   }
        // }
        // else {
        //   return res.json(results);
        // }

        if (loggedInUserId) {
         
          console.log('reaching here for ', query)
        connection.query('SELECT * FROM data_launch_users WHERE id = ?', [loggedInUserId], (userErr, userResults) => {
          if (userErr || userResults.length === 0) {
            return res.status(403).json({ error: 'User not found' });
          }

          const dataLaunchUser = userResults[0];

          // if (dataLaunchUser.full_user === 0) {
          if (dataLaunchUser.full_user === 0 && !dataLaunchUser.ae_login) {
            if (table === 'data_launch_garage_records') {
              const matched = results.find(r => r.id === parseInt(dataLaunchUser.garage_id));
              return res.json(matched ? [matched] : []);
            }

            if (table === 'data_launch_tester_records') {
              const arr = results.map(r => ({
                id: r.id,
                user_id: r.user_id,
                first_name: r.first_name,
                last_name: r.last_name
              }));
              return res.json(arr);
            }
          }

          return res.json(results);
        });
      }
      else if (!loggedInUserId && table === 'data_launch_users') {
        console.log('reaching here 2 for ', query)
        return res.json(results)
      }

    });
  });  
});


app.post('/api/:table/data', (req, res) => {
  const { table } = req.params;
  const newRecord = req.body;

  if (!isTableAllowed(table)) {
      return res.status(400).json({ error: 'Table not allowed' });
  }

  const columns = Object.keys(newRecord).join(',');
  const values = Object.values(newRecord);
  const placeholders = values.map(() => '?').join(',');

  if (table === 'datalaunchimages' && newRecord.image_data) {
      const base64Data = newRecord.image_data;

      // Clean Base64 string by removing the prefix
      const cleanedBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');

      // Convert cleaned Base64 to binary buffer
      const bufferData = Buffer.from(cleanedBase64, 'base64');

      // Replace image_data with the binary buffer
      newRecord.image_data = bufferData;

      // Log buffer details for debugging
      console.log("Storing Buffer Data Size:", bufferData.length);
  }

  pool.getConnection((err, connection) => {
    if (err) {
        console.error("⚠️ Error getting database connection:", err);
        return res.status(500).json({ error: "Database connection error" });
    }

    connection.query(`INSERT INTO ?? (${columns}) VALUES (${placeholders})`,
      [table, ...values], (error, results) => {
        connection.release(); // Release the connection back to the pool

        if (error) {
            console.error('Database Insert Error:', error);
            console.error("❌ Query failed:", error);
            return res.status(500).json({ error: 'Database Insert Failed', details: error.message });
        }
        res.json({ id: results.insertId, ...newRecord });
    });
});
});

////// DVSA MOT HISTORY API ////

// ==== DVSA MOT History API (server-side adapter) ====
// Env vars (set in .env, see step 3)
const {
  DVSA_CLIENT_ID,
  DVSA_CLIENT_SECRET,
  DVSA_TENANT_ID,             // e.g. a455b827-244f-4c97-b5b4-ce5d13b4d00c
  DVSA_SCOPE,                 // default below
  DVSA_API_KEY,
  DVSA_API_BASE               // default below
} = process.env;

const DVSA_SCOPE_DEFAULT = 'https://tapi.dvsa.gov.uk/.default';
const DVSA_BASE_DEFAULT  = 'https://history.mot.api.gov.uk';

// in-memory token cache
let dvsaToken = null;
let dvsaTokenExp = 0; // epoch ms

async function getDvsaAccessToken() {
  const now = Date.now();
  if (dvsaToken && now < dvsaTokenExp - 60_000) {
    return dvsaToken;
  }

  const tokenUrl = `https://login.microsoftonline.com/${DVSA_TENANT_ID}/oauth2/v2.0/token`;
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', DVSA_CLIENT_ID);
  params.append('client_secret', DVSA_CLIENT_SECRET);
  params.append('scope', DVSA_SCOPE || DVSA_SCOPE_DEFAULT);

  const resp = await axios.post(tokenUrl, params, {
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    timeout: 10000
  });

  dvsaToken = resp.data.access_token;
  const expiresInSec = Number(resp.data.expires_in || 3600);
  dvsaTokenExp = Date.now() + expiresInSec * 1000;
  return dvsaToken;
}

// Handles: 
//  - Array of vehicles (old /mot-tests?registration=...)
//  - Single vehicle object (new /registration/{VRM})
//  - { vehicles: [...] } wrapper (just in case)
function extractExpiryFromVehiclesPayload(payload) {
  let vehicles = [];

  if (Array.isArray(payload)) {
    vehicles = payload;
  } else if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.vehicles)) {
      vehicles = payload.vehicles;
    } else if (payload.registration) {
      vehicles = [payload];
    }
  }

  if (!vehicles.length) return null;

  const v = vehicles[0];

  // Some responses include vehicle-level expiry; keep as fallback
  const vehicleLevelExpiry =
    v.motExpiryDate || v.motExpiry || v.motExpiryDateUtc || null;

  // Test arrays differ across versions; handle common variants
  const tests = Array.isArray(v.motTests)
    ? v.motTests.slice()
    : Array.isArray(v.motTest)
    ? v.motTest.slice()
    : [];

  if (!tests.length) {
    return {
      registration: v.registration || v.vrm || null,
      make: v.make || null,
      model: v.model || null,
      expiryDate: vehicleLevelExpiry,
      lastTestResult: null,
      lastCompletedDate: null
    };
  }

  // Normalise fields and choose latest (prefer a PASS)
  const norm = t => ({
    result: String(t.testResult || t.result || '').toUpperCase(),
    completed: t.completedDate || t.completed || t.date || null,
    expiry: t.expiryDate || t.expiry || null
  });

  tests.sort((a, b) => new Date(norm(b).completed || 0) - new Date(norm(a).completed || 0));
  const latestPass = tests.find(t => norm(t).result === 'PASSED') || tests[0];
  const n = norm(latestPass);

  return {
    registration: v.registration || v.vrm || null,
    make: v.make || null,
    model: v.model || null,
    expiryDate: n.expiry || vehicleLevelExpiry || null,
    lastTestResult: n.result || null,
    lastCompletedDate: n.completed || null
  };
}




app.get('/api/mot/expiry', async (req, res) => {
  try {
    // 1) Normalise VRM
    const raw = String(req.query.registration || '').trim();
    const vrm = raw.replace(/\s+/g, '').toUpperCase();
    if (!vrm) return res.status(400).json({ error: 'registration (VRM) is required' });

    // 2) Auth + base
    const token = await getDvsaAccessToken();
    const base = (process.env.DVSA_API_BASE || 'https://history.mot.api.gov.uk').replace(/\/+$/, '');

    // 3) Call the NEW endpoint: /v1/trade/vehicles/registration/{VRM}
    const url = `${base}/v1/trade/vehicles/registration/${encodeURIComponent(vrm)}`;
    const r = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-API-Key': process.env.DVSA_API_KEY,
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    const result = extractExpiryFromVehiclesPayload(r.data);
    if (!result) return res.status(404).json({ error: 'No MOT data found' });
    res.json(result);

  } catch (err) {
    // Optional: try legacy query shape on the new host as a fallback:
    //   GET .../v1/trade/vehicles/mot-tests?vrm=RO06XXN
    try {
      if (err.response?.data?.errorCode === 'MOTH-BR-01') {
        const token = await getDvsaAccessToken();
        const base = (process.env.DVSA_API_BASE || 'https://history.mot.api.gov.uk').replace(/\/+$/, '');
        const vrm = String(req.query.registration || '').trim().replace(/\s+/g, '').toUpperCase();
        const url2 = `${base}/v1/trade/vehicles/mot-tests`;
        const r2 = await axios.get(url2, {
          params: { vrm },
          headers: {
            Authorization: `Bearer ${token}`,
            'X-API-Key': process.env.DVSA_API_KEY,
            'Accept': 'application/json'
          },
          timeout: 10000
        });
        const result2 = extractExpiryFromVehiclesPayload(r2.data);
        if (result2) return res.json(result2);
      }
    } catch (e2) {
      // fall through to error below with original err
    }

    const status = err.response?.status || 500;
    const data = err.response?.data;
    console.error('DVSA MOT error:', status, data || err.message);
    res.status(status).json({
      error: 'Failed to fetch MOT expiry',
      details: typeof data === 'object' ? data : String(data || err.message)
    });
  }
});


// GET /api/mot/vehicle?registration=AB12CDE
app.get('/api/mot/vehicle', async (req, res) => {
  try {
    const vrm = String(req.query.registration || '').replace(/\s+/g, '').toUpperCase();
    if (!/^[A-Z0-9]{1,8}$/.test(vrm)) return res.status(400).json({ error: 'Invalid UK VRM format' });

    const token = await getDvsaAccessToken(); // you already have this
    const base = (process.env.DVSA_API_BASE || 'https://history.mot.api.gov.uk').replace(/\/+$/, '');

    // Single-vehicle lookup (object payload)
    const url = `${base}/v1/trade/vehicles/registration/${encodeURIComponent(vrm)}`;
    const r = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-API-Key': process.env.DVSA_API_KEY,
        Accept: 'application/json'
      },
      timeout: 10000
    });

    // Payload can be an object or array; normalise
    const v = Array.isArray(r.data) ? r.data[0] : r.data;

    const meta = {
      registration: v.registration || v.vrm || vrm,
      make: v.make ?? null,
      model: v.model ?? null,
      fuelType: v.fuelType ?? null,
      primaryColour: v.primaryColour ?? v.colour ?? null,
      secondaryColour: v.secondaryColour ?? null,
      // DVSA docs use engineSize in bulk; older docs mention cylinder capacity
      engineSizeCc: v.engineSize ?? v.cylinderCapacity ?? v.cc ?? null,
      firstUsedDate: v.firstUsedDate ?? v.registrationDate ?? null,
      manufactureDate: v.manufactureDate ?? null
    };

    if (!meta.make && !meta.model && !meta.primaryColour && !meta.engineSizeCc) {
      return res.status(404).json({ error: 'No vehicle metadata found for this VRM' });
    }

    res.json(v);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data;
    console.error('DVSA vehicle meta error:', status, data || err.message);
    res.status(status).json({
      error: 'Failed to fetch vehicle metadata',
      details: typeof data === 'object' ? data : String(data || err.message)
    });
  }
});



// ==== END DVSA MOT History API ====






//// END OF DVSA MOT HISTORY API /////



// PUT endpoint to update a record in a specific table
app.put('/api/:table/data/:id', (req, res) => {
  const { table, id } = req.params;
  const updatedData = req.body;
  
  if (!isTableAllowed(table)) {
    return res.status(400).json({ error: 'Table not allowed' });
  }
  
  const setClause = Object.keys(updatedData)
    .map(key => `${key} = ?`)
    .join(', ');
  const values = [...Object.values(updatedData), id];
  
  pool.getConnection((err, connection) => {
    if (err) {
        console.error("⚠️ Error getting database connection:", err);
        return res.status(500).json({ error: "Database connection error" });
    }

    connection.query(`UPDATE ?? SET ${setClause} WHERE id = ?`,
    [table, ...values], (error, results) => {
        connection.release(); // Release the connection back to the pool

        if (error) {
            console.error("❌ Query failed:", error);
            return res.status(500).json({ error });
        }
        res.json({ affectedRows: results.affectedRows, ...updatedData });
    });
});

});

// DELETE endpoint to remove a record from a specific table
app.delete('/api/:table/data/:id', (req, res) => {
  const { table, id } = req.params;
  
  if (!isTableAllowed(table)) {
    return res.status(400).json({ error: 'Table not allowed' });
  }
  
  pool.getConnection((err, connection) => {
    if (err) {
        console.error("⚠️ Error getting database connection:", err);
        return res.status(500).json({ error: "Database connection error" });
    }

    connection.query(
      `DELETE FROM ?? WHERE id = ?`,
      [table, id],
      (error, results) => {
        connection.release()
        if (error) {
          return res.status(500).json({ error });
        }
        res.json({ affectedRows: results.affectedRows });
      }
    );
});

});

// New API endpoint to count rows in a specific table
app.get('/api/:table/count', (req, res) => {
  const { table } = req.params;

  if (!isTableAllowed(table)) {
    return res.status(400).json({ error: 'Table not allowed' });
  }

  const query = `SELECT COUNT(*) as count FROM ??`;

  pool.getConnection((err, connection) => {
    if (err) {
        console.error("⚠️ Error getting database connection:", err);
        return res.status(500).json({ error: "Database connection error" });
    }
    connection.query(query, [table], (error, results) => {
      connection.release(); // Release the connection back to the pool
      if (error) {
        return res.status(500).json({ error });
      }
      res.json({ count: results[0].count });
    });
});


});


app.post('/api/accessible-garages/save', (req, res) => {
  const { user_id, garage_ids } = req.body;

  if (!user_id || !Array.isArray(garage_ids)) {
    return res.status(400).json({ error: 'Missing user_id or garage_ids' });
  }

  const connection = pool;

  // Remove existing mappings
  const deleteQuery = `DELETE FROM data_launch_ae_users_accessible_garages WHERE user_id = ?`;

  connection.query(deleteQuery, [user_id], (err) => {
    if (err) {
      console.error('❌ Error deleting old garage mappings:', err);
      return res.status(500).json({ error: 'Failed to delete old mappings' });
    }

    // Insert new mappings
    if (garage_ids.length === 0) return res.json({ message: 'No garages to save' });

    const insertQuery = `INSERT INTO data_launch_ae_users_accessible_garages (user_id, garage_id) VALUES ?`;
    const values = garage_ids.map(id => [user_id, id]);

    connection.query(insertQuery, [values], (err, result) => {
      if (err) {
        console.error('❌ Error inserting new garage mappings:', err);
        return res.status(500).json({ error: 'Failed to save mappings' });
      }

      res.json({ message: 'Accessible garages saved', inserted: result.affectedRows });
    });
  });
});

app.get('/api/accessible-garages/:user_id', (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT garage_id FROM data_launch_ae_users_accessible_garages
    WHERE user_id = ?
  `;

  pool.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('❌ Error fetching accessible garages:', err);
      return res.status(500).json({ error: 'Failed to fetch accessible garages' });
    }

    const garageIds = results.map(r => r.garage_id);
    res.json({ garage_ids: garageIds });
  });
});



// New API endpoint to get the largest ID in a specific table
app.get('/api/:table/max-id', (req, res) => {
  const { table } = req.params;

  if (!isTableAllowed(table)) {
    return res.status(400).json({ error: 'Table not allowed' });
  }

  const query = `SELECT MAX(id) as maxId FROM ??`;

  pool.getConnection((err, connection) => {
    if (err) {
        console.error("⚠️ Error getting database connection:", err);
        return res.status(500).json({ error: "Database connection error" });
    }
    connection.query(query, [table], (error, results) => {
      connection.release(); // Release the connection back to the pool
      if (error) {
        return res.status(500).json({ error });
      }
      res.json({ maxId: results[0].maxId });
    });
});

  
});


//// fetchVehicleData for CarWebUK - OLD API - TO BE COMMENTED OUT SOON ONCE HAIDER CONFIRMS ALL GOOD  ///////
// async function fetchVehicleData(vrm) {
//   const url = `https://ws.carwebuk.com/carwebvrrb2bproxy/carwebvrrwebservice.asmx/strB2BGetVehicleByVRM?strUserName=VTSPro&strPassword=19351997&strClientRef=Test&strClientDescription=testing297&strKey1=vt02hs20&strVRM=${vrm}&strVersion=0.31.1`;
//   try {
//       console.log(`🌐 Fetching Vehicle Data from: ${url}`);
//       const response = await fetch(url);
//       if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
//       }

//       const xmlText = await response.text();
//       console.log("✅ Vehicle Data Fetched Successfully");
//       return await parseStringPromise(xmlText, { explicitArray: false });
//   } catch (error) {
//       console.error("Error fetching vehicle data:", error);
//       return { error: "Failed to fetch vehicle data" };
//   }
// }

////// END OF //// fetchVehicleData for CarWebUK - OLD API - commented out on 30/10/25 ///////


//// NEW fetchVehicleData for AUTOGURU API - TO BE UNCOMMENTED ONCE HAIDER GIVES THE THUMBS UP //////


async function fetchVehicleData(vrmRaw) {
  // normalise VRM
  const vrm = String(vrmRaw || '').replace(/\s+/g, '').toUpperCase();
  if (!vrm) return { error: 'VRM is required' };

  try {
    const token = await getAutoGuruAccessToken();
    const base = (AUTOGURU_API_BASE || 'https://api.autoguruservices.com/V2').replace(/\/+$/, '');
    const url  = `${base}/vehicle/${encodeURIComponent(vrm)}`;

    const r = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000
    });

    // Normalise keys so your UI doesn’t care about the provider
    const v = r.data?.vehicle || r.data || {};
    const normalized = {
      registration: v.registration || v.vrm || vrm,
      make: v.make ?? null,
      model: v.model ?? null,
      fuelType: v.fuelType ?? v.fuel ?? null,
      primaryColour: v.primaryColour ?? v.colour ?? null,
      engineSizeCc: v.engineSize ?? v.cylinderCapacity ?? v.cc ?? null,
      firstRegistered: v.firstRegistered ?? v.registrationDate ?? null,
      _raw: r.data // keep raw payload for future fields
    };

    return normalized;
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data;
    console.error('Auto Guru VRM error:', status, data || err.message);
    return {
      error: 'Failed to fetch vehicle metadata',
      status,
      details: typeof data === 'object' ? data : String(data || err.message)
    };
  }
}




//// END OF NEW FETCH VEHICLE DATA FNCTION FOR AUTOGURU API 30/10/25 ////





// API Route to fetch vehicle details
app.get("/api/vehicle/:vrm", async (req, res) => {
  const { vrm } = req.params;
  const vehicleData = await fetchVehicleData(vrm);
  res.json(vehicleData);
});


// Serve the home page for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Site', 'home.html'));
});

// Redirect /home to root URL without changing the URL displayed
app.get('/home', (req, res) => {
  res.redirect('/');
});

// Serve the index.html file for any other unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Site', 'home.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


app.post('/logout', (req, res) => {
  console.log("🔹 User requested logout");

  // ✅ Destroy session if applicable
  if (req.session) {
      req.session.destroy(err => {
          if (err) console.error("⚠️ Error destroying session:", err);
      });
  }
    pool.getConnection((err, connection) => {
      if (err) {
          console.error("⚠️ Error getting database connection:", err);
          return res.status(500).json({ error: "Database connection error" });
      }
      connection.query(query, [table], (error, results) => {
        connection.release(); // Release the connection back to the pool
        if (error) {
          return res.status(500).json({ error });
        }
        res.json({ maxId: results[0].maxId });
      });
  });

  // ✅ Forcefully clear authToken cookie
  res.cookie('authToken', '', {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: 'Strict',
      path: '/',
      expires: new Date(0) // Forces browser to delete immediately
  });

  console.log("✅ User logged out. Cookie cleared.");
  res.redirect('/');
});




app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // ✅ Use the same MySQL query structure as other functions
  pool.getConnection((err, connection) => {
      if (err) {
          console.error("⚠️ Error getting database connection:", err);
          return res.status(500).json({ message: "Database connection error" });
      }

      connection.query(
          'SELECT id FROM data_launch_users WHERE username = ? AND password = ?',
          [username, password],
          (error, results) => {
              connection.release(); // ✅ Always release the connection back to the pool

              if (error) {
                  console.error("❌ Login Query Failed:", error);
                  return res.status(500).json({ message: "Database query error" });
              }

              if (results.length === 0) {
                  return res.status(401).json({ message: "Invalid credentials" });
              }

              const userId = results[0].id;

              // ✅ Set a secure HttpOnly cookie
              res.cookie('authToken', userId, {
                  httpOnly: true,
                  secure: false, // Set to true if using HTTPS
                  sameSite: 'Strict',
                  path: '/'
              });

              console.log("✅ Login successful for user:", userId);
              res.status(200).json({ message: "Login successful" });
          }
      );
  });
});



//// to calculate how much bucketeer storage is currently being used

(async () => {
  const data = await s3Client.send(new ListObjectsV2Command({
    Bucket: process.env.BUCKETEER_BUCKET_NAME
  }));

  const totalBytes = data.Contents.reduce((sum, obj) => sum + obj.Size, 0);
  console.log(`Bucketeer Storage TOTAL USED SO FAR: ${(totalBytes / (1024*1024*1024)).toFixed(2)} GB`);
})();
