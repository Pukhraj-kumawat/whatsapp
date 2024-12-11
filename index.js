// const qrcode = require('qrcode-terminal');
// const fs = require('fs');
// const path = require('path');
// const { Client,MessageMedia } = require('whatsapp-web.js');

// // Create a new client instance
// const client = new Client();

// // Generate QR Code in terminal
// client.on('qr', (qr) => {
//     console.log('Scan the QR code below with your WhatsApp:');
//     qrcode.generate(qr, { small: true });
// });

// // Successfully connected to WhatsApp
// client.on('ready', () => {
//     console.log('WhatsApp Web client is ready!');
// });

// // Handle incoming messages (media included)
// client.on('message', async (message) => {
//     console.log(`Message from ${message.from}: ${message.body}`);

//     // Check if the message has media
//     if (message.hasMedia) {
//         const media = await message.downloadMedia();
//         if (media) {
        

//             // Define the folder where media will be saved
//             const mediaFolder = './downloads';
//             if (!fs.existsSync(mediaFolder)) {
//                 fs.mkdirSync(mediaFolder); // Create the folder if it doesn't exist
//             }

//             // Get the file extension from MIME type
//             const mimeToExt = {
//                 'image/jpeg': '.jpg',
//                 'image/png': '.png',
//                 'image/gif': '.gif',
//                 'video/mp4': '.mp4',
//                 'audio/mpeg': '.mp3',
//                 'application/pdf': '.pdf',
//                 // Add more MIME types as needed
//             };
//             const fileExtension = mimeToExt[media.mimetype] || '';

//             // Generate a unique filename with proper extension
//             const fileName = media.filename || `media_${Date.now()}${fileExtension}`;
//             const filePath = path.join(mediaFolder, fileName);

//             // Write the media data to the file
//             fs.writeFileSync(filePath, Buffer.from(media.data, 'base64'));
//             console.log(`Media saved to: ${filePath}`);
//         }
//     }

//     // Reply to 'ping' messages
//     if (message.body === 'ping' || message.body === 'Ping') {
//         client.sendMessage(message.from, 'pong');

//         // Create a MessageMedia object for the image
//         const imageUrl = 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
//         const image = await MessageMedia.fromUrl(imageUrl);
        
//         // Send the image with a caption
//         client.sendMessage(message.from, image, { caption: 'Here is your image!' });
//     }
// });

// // Start the client
// client.initialize();







//////////////////////////////////////
const express = require('express');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const { Client, MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');


// Initialize Express server
const app = express();
const port = 3000;

// Variable to store the generated QR code
let qrCodeHtml = '';

// Create a new client instance for WhatsApp Web
const client = new Client();

// Generate QR Code and store it as HTML
client.on('qr', (qr) => {
    console.log('Scan the QR code below with your WhatsApp:');
    qrcode.generate(qr, { small: true });

    // Convert QR code to an HTML-compatible image tag
    const qrImageTag = `<img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=200x200" alt="QR Code"/>`;
    qrCodeHtml = `<html>
                    <head>
                      <title>WhatsApp QR Code</title>
                    </head>
                    <body>
                      <h1>Scan the QR Code below:</h1>
                      ${qrImageTag}
                    </body>
                  </html>`;
});

// Successfully connected to WhatsApp
client.on('ready', () => {
    console.log('WhatsApp Web client is ready!');
    qrCodeHtml = '<html><body><h1>WhatsApp is ready. No QR code required.</h1></body></html>';
});

// Handle incoming messages (media included)
client.on('message', async (message) => {
    console.log(`Message from ${message.from}: ${message.body}`);


    try {
        const apiUrl = 'http://127.0.0.1:8000/webhook'; 
        const payload = { userNo: message.from,messageBody:message.body }; 
        const headers = { 
          'Content-Type': 'application/json',           
        };
  
        const res = await axios.post(apiUrl, payload, { headers });
        console.log('The response is',res)
    } catch (error) {
        console.error('Error sending message:', error);
      }


    // Check if the message has media
    // if (message.hasMedia) {
    //     const media = await message.downloadMedia();
    //     if (media) {
    //         // Define the folder where media will be saved
    //         const mediaFolder = './downloads';
    //         if (!fs.existsSync(mediaFolder)) {
    //             fs.mkdirSync(mediaFolder); // Create the folder if it doesn't exist
    //         }

    //         // Get the file extension from MIME type
    //         const mimeToExt = {
    //             'image/jpeg': '.jpg',
    //             'image/png': '.png',
    //             'image/gif': '.gif',
    //             'video/mp4': '.mp4',
    //             'audio/mpeg': '.mp3',
    //             'application/pdf': '.pdf',
    //             // Add more MIME types as needed
    //         };
    //         const fileExtension = mimeToExt[media.mimetype] || '';

    //         // Generate a unique filename with proper extension
    //         const fileName = media.filename || `media_${Date.now()}${fileExtension}`;
    //         const filePath = path.join(mediaFolder, fileName);

    //         // Write the media data to the file
    //         fs.writeFileSync(filePath, Buffer.from(media.data, 'base64'));
    //         console.log(`Media saved to: ${filePath}`);
    //     }
    // }

    // Reply to 'ping' messages
    // if (message.body === 'ping' || message.body === 'Ping') {
    //     client.sendMessage(message.from, 'pong');

    //     // Create a MessageMedia object for the image
    //     const imageUrl = 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
    //     const image = await MessageMedia.fromUrl(imageUrl);

    //     // Send the image with a caption
    //     client.sendMessage(message.from, image, { caption: 'Here is your image!' });
    // }
});

// Endpoint to serve the QR code as HTML
app.get('/scanqr', (req, res) => {
    res.send(qrCodeHtml);
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Initialize the WhatsApp Web client
client.initialize();

//////////////////////////


// const qrcode = require('qrcode');
// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

// const app = express();
// const port = 3000;

// // Create a new WhatsApp client with persistent session storage
// const client = new Client({
//     authStrategy: new LocalAuth({
//         dataPath: './auth', // Session storage path
//     }),
// });

// // Variable to store the QR code temporarily
// let qrCodeData = '';

// // Event: QR Code generation
// client.on('qr', (qr) => {
//     console.log('QR Code received, generate it via /qr endpoint');
//     qrCodeData = qr; // Save the QR code
// });

// // Event: Successfully authenticated and ready
// client.on('ready', () => {
//     console.log('WhatsApp Web client is ready!');
//     qrCodeData = ''; // Clear QR code after authentication
// });

// // Event: Receiving messages
// client.on('message', async (message) => {
//     console.log(`Message from ${message.from}: ${message.body}`);

//     // Reply to 'ping' messages
//     if (message.body.toLowerCase() === 'ping') {
//         client.sendMessage(message.from, 'pong');

//         // Example of sending an image
//         const imageUrl = 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
//         const image = await MessageMedia.fromUrl(imageUrl);
//         client.sendMessage(message.from, image, { caption: 'Here is your image!' });
//     }

//     // Handle incoming media
//     if (message.hasMedia) {
//         const media = await message.downloadMedia();
//         if (media) {
//             // Save media to a folder
//             const mediaFolder = './downloads';
//             if (!fs.existsSync(mediaFolder)) {
//                 fs.mkdirSync(mediaFolder);
//             }

//             const mimeToExt = {
//                 'image/jpeg': '.jpg',
//                 'image/png': '.png',
//                 'video/mp4': '.mp4',
//                 'audio/mpeg': '.mp3',
//                 'application/pdf': '.pdf',
//             };
//             const fileExtension = mimeToExt[media.mimetype] || '';
//             const fileName = media.filename || `media_${Date.now()}${fileExtension}`;
//             const filePath = path.join(mediaFolder, fileName);

//             fs.writeFileSync(filePath, Buffer.from(media.data, 'base64'));
//             console.log(`Media saved to: ${filePath}`);
//         }
//     }
// });

// // Serve QR Code via an API endpoint
// app.get('/qr', async (req, res) => {
//     if (!qrCodeData) {
//         return res.status(400).send({ error: 'QR code not available. Client might already be authenticated.' });
//     }

//     try {
//         const qrImage = await qrcode.toDataURL(qrCodeData);
//         res.send(`
//             <html>
//                 <body>
//                     <h1>Scan this QR Code with WhatsApp</h1>
//                     <img src="${qrImage}" alt="QR Code" />
//                 </body>
//             </html>
//         `);
//     } catch (err) {
//         res.status(500).send({ error: 'Error generating QR Code.' });
//     }
// });

// // API to send a message
// app.post('/send-message', express.json(), async (req, res) => {
//     const { number, message } = req.body;

//     if (!number || !message) {
//         return res.status(400).send({ error: 'Please provide a number and a message.' });
//     }

//     try {
//         const chatId = `${number}@c.us`; // Append WhatsApp ID format
//         await client.sendMessage(chatId, message);
//         res.send({ success: true, message: `Message sent to ${number}` });
//     } catch (err) {
//         res.status(500).send({ error: 'Error sending message.' });
//     }
// });

// // Start Express server
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });

// // Start WhatsApp client
// client.initialize();
