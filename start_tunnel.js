const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8080;
const PUBLIC_DIR = path.resolve(__dirname);
const HUB_DIR = path.resolve(__dirname, '..');
const URL_FILE = 'C:/Users/sande/Desktop/DEELBARE_LINK_VOOR_WHATSAPP.txt';

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.xml': 'application/xml',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf'
};

// 1. HTTP server
const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];
    let filePath;

    if (reqUrl === '/hub' || reqUrl === '/hub/') {
        filePath = path.join(HUB_DIR, 'index.html');
    } else {
        if (reqUrl === '/') reqUrl = '/index.html';
        const safePath = path.normalize(decodeURIComponent(reqUrl)).replace(/^(\.\.[\/\\])+/, '');
        filePath = path.join(PUBLIC_DIR, safePath);
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
        });
        fs.createReadStream(filePath).pipe(res);
    });
});

let isShuttingDown = false;

function startSshTunnel() {
    if (isShuttingDown) return;

    console.log(`[${new Date().toLocaleTimeString()}] Tunnel verbinden via SSH (localhost.run)...`);

    const ssh = spawn('ssh', [
        '-o', 'StrictHostKeyChecking=no',
        '-o', 'ServerAliveInterval=15',
        '-o', 'ServerAliveCountMax=4',
        '-o', 'ExitOnForwardFailure=yes',
        '-R', `80:127.0.0.1:${PORT}`,
        'nokey@localhost.run'
    ]);

    let publicUrl = null;

    ssh.stdout.on('data', (data) => {
        const text = data.toString();
        const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.(lhr\.life|lhr\.rocks)/);
        if (match && !publicUrl) {
            publicUrl = match[0];
            console.log('\n=============================================================');
            console.log('>>> JOUW TIJDELIJKE PUBLIEKE LINK IS LIVE:');
            console.log('>>> ' + publicUrl);
            console.log('=============================================================\n');

            const info = `=============================================================
JOUW TIJDELIJKE PUBLIEKE LINK VOOR WHATSAPP:
${publicUrl}
=============================================================

Deze link is direct klikbaar op mobiel, tablet en pc wereldwijd!
Zolang dit proces draait, kan iedereen het complete prototype van
Kampeerverblijfpark Veronique bekijken zonder wachtwoord of IP-verificatie.

Laatste update: ${new Date().toLocaleString('nl-BE')}
`;
            fs.writeFileSync(URL_FILE, info, 'utf8');
            fs.writeFileSync(path.join(PUBLIC_DIR, 'LIVE_LINK.txt'), info, 'utf8');
        }
    });

    ssh.stderr.on('data', () => {});

    ssh.on('close', (code) => {
        console.log(`[${new Date().toLocaleTimeString()}] SSH tunnel verbinding verbroken (code: ${code}). Automatisch herverbinden binnen 3 seconden...`);
        if (!isShuttingDown) {
            setTimeout(startSshTunnel, 3000);
        }
    });
}

server.listen(PORT, '127.0.0.1', () => {
    console.log(`Webserver draait lokaal op http://127.0.0.1:${PORT}/`);
    startSshTunnel();
});

process.on('SIGINT', () => { isShuttingDown = true; process.exit(0); });
process.on('SIGTERM', () => { isShuttingDown = true; process.exit(0); });
