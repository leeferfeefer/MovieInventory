import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import morgan from 'morgan';
import https from 'https';
import fs from 'fs';
import { getLocalIpAddress } from './utilities/getLocalIpAddress';

dotenv.config();
const API_HOST = process.env.API_HOST;

const app = express();
const PORT = 3000;

// For mockoon
const agent = new https.Agent({
    ca: fs.readFileSync('./rootCA.pem'),
});

// Middleware
// Temporary CORS configuration for debugging
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

app.use(morgan('tiny'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.get('/api/movie_info', async (req, res) => {
    console.log('Received request for /api/movie_info with query:', req.query);

    const { upc } = req.query;
    if (!upc) {
        return res.status(400).json({ error: 'UPC is required' });
    }

    try {
        const response = await fetch(`https://${API_HOST}/prod/trial/lookup?upc=${upc}`, { agent });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching movie info:', error);
        res.status(500).json({ error: 'Failed to fetch movie information' });
    }
});

const options = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt'),
};

const localIp = getLocalIpAddress();
https.createServer(options, app).listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
    if (localIp) {
        console.log(`Server is also accessible on https://${localIp}:${PORT}`);
    }
});

// For self signed cert generation:
// openssl req -nodes -new -x509 -keyout server.key -out server.cert -days 365

// Create CA cert:

/*
openssl genrsa -out rootCA.key 2048

openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 3650 \
  -out rootCA.pem \
  -subj "/C=US/ST=Local/L=Dev/O=LocalDevCA/CN=LocalDevCA"


  creates root CA key and pem

  Add the root CA to macOS Keychain and trust it

  Double-click rootCA.pem

It opens Keychain Access

Install it into System or Login keychain

Find the certificate → double-click it

Expand Trust

Set When using this certificate: → Always Trust

Close the window (enter your password)


Create an OpenSSL config file (server.ext):


authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
IP.1 = <local IP address>
DNS.1 = localhost


Then run:

openssl genrsa -out server.key 2048

openssl req -new -key server.key -out server.csr \
  -subj "/C=US/ST=Local/L=Dev/O=LocalServer/CN=192.168.86.26"

openssl x509 -req -in server.csr -CA rootCA.pem -CAkey rootCA.key \
  -CAcreateserial -out server.crt -days 825 -sha256 \
  -extfile server.ext


  This produces:

server.key – your server private key

server.crt – certificate signed by your trusted CA
*/
