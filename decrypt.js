const CryptoJS = require('crypto-js');

// ============================================
// YAHAN APNI VALUES DAALO
// ============================================
const vStamp = 115308;  // ← PoW solve karke mila number (Network tab se)
const jsChal = "66647e7c23b6c11ba52194a6ac3ca1d2";  // ← _pw_sec_chk cookie
const encPayload = "ugYu7gtm4hVsTgNTxrSCpw60qVCQf42MrbT6YC6N9B/OzK/B8+Myk6theLpmo+n7kF1VtLDRbHsTW3Q2TFmDZONnAAJW7zukJxNQtrf6lCSrT/NBVl8gnHYur9Cgyqapk4FPPBPBur5RA6mBNtaEJw6EI5ClURIrLYm0sy0FWY4Xb/2sNN9ubWjKmo8N8JUK6akoVivlBbk1ryal4FMVeFl2pt7JlQlwyT2n9Y4fc4uryWnWr3Pi5DaFzAhaZOS9EqAq8uhcsrppoUc6nRGA08zNP3f8c3fNkA8mfeAtz28eYsDnWhJ9NBnUezlQ3KV74j58XM7n8+cmxsuKvSK43vrB3XbljggSx27Wsg5dU/qO1tqptGOwwnppmJH3oFhb";

// ============================================
// DECRYPTION FUNCTION
// ============================================
async function decryptPayload(encPayload, vStamp, jsChal) {
    // CryptoJS load karo (agar nahi hai toh)
    if (typeof CryptoJS === 'undefined') {
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    try {
        // Step 1: Key derive karo
        const respKey = CryptoJS.SHA256(vStamp.toString() + jsChal + "pw_secure_resp");
        console.log('🔑 Key (SHA256):', respKey.toString());

        // Step 2: IV derive karo
        const respIvHex = CryptoJS.MD5(jsChal + vStamp.toString() + "pw_secure_iv").toString(CryptoJS.enc.Hex);
        const respIv = CryptoJS.enc.Hex.parse(respIvHex);
        console.log('🔑 IV (MD5):', respIvHex);

        // Step 3: AES decrypt
        const decrypted = CryptoJS.AES.decrypt(encPayload, respKey, {
            iv: respIv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

        if (!plaintext) {
            throw new Error('Decryption returned empty string. Wrong vStamp or jsChal?');
        }

        console.log('✅ DECRYPTED SUCCESSFULLY!');
        const config = JSON.parse(plaintext);
        console.log('📋 Config:', config);
        console.log('🎬 Video URL:', config.video_url);
        console.log('🔐 License URL:', config.license_url);
        console.log('🎫 License Token:', config.license_token);

        return config;

    } catch (err) {
        console.error('❌ Decryption failed:', err.message);
        return null;
    }
}

// ============================================
// RUN
// ============================================
(async () => {
    console.log('🚀 Starting decryption...\n');
    const config = await decryptPayload(encPayload, vStamp, jsChal);

    if (config && config.video_url) {
        console.log('\n🎉 Video URL ready!');
        console.log(config.video_url);

        // Copy to clipboard
        navigator.clipboard.writeText(config.video_url).then(() => {
            console.log('📋 Video URL copied to clipboard!');
        });

        // Optional: Auto-play in video element
        const videoEl = document.querySelector('video');
        if (videoEl && config.video_url.includes('.m3u8') && typeof Hls !== 'undefined') {
            const hls = new Hls();
            hls.loadSource(config.video_url);
            hls.attachMedia(videoEl);
            console.log('🎬 Video loaded in player');
        }
    }
})();