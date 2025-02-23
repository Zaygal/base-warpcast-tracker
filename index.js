const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

// Hardcode your Alchemy API key (we’ll move to Vercel env vars later)
const ALCHEMY_API_KEY = 'rbcVOYSvz8d2SEhzDkOXUPC2RRfARfCq';

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/activity', async (req, res) => {
  const userAddress = req.body.untrustedData?.verified_addresses?.[0] || '0xdefault';
  const fid = req.body.untrustedData?.fid || 1;

  try {
    // Fetch real Base onchain data (transactions)
    const baseResponse = await fetch(
      `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}?module=account&action=txlist&address=${userAddress}&startblock=0&endblock=99999999&sort=desc`
    );
    const baseData = await baseResponse.json();
    const txCount = baseData.result ? baseData.result.length : 0;

    // Fetch real Base NFT activity (mints/transfers)
    const nftResponse = await fetch(
      `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}?module=account&action=tokennfttx&address=${userAddress}&startblock=0&endblock=99999999&sort=desc`
    );
    const nftData = await nftResponse.json();
    const nftCount = nftData.result ? nftData.result.length : 0;

    // Dummy data for Warpcast activities (casts and likes)
    const castCount = Math.floor(Math.random() * 50); // Warpcast casts
    const likeCount = Math.floor(Math.random() * 30); // Warpcast likes

    // Total Warpcast engagement
    const warpcastEngagement = castCount + likeCount;

    // Unique Feature 1: Activity Aura
    const totalActivity = txCount + nftCount + warpcastEngagement;
    let aura = 'Green (Super Active)';
    if (totalActivity < 20) aura = 'Red (Chillin’)';
    else if (totalActivity < 40) aura = 'Yellow (Steady Vibes)';

    // Unique Feature 2: Bragging Rights NFT eligibility
    const nftEligible = totalActivity >= 50 ? 'Yes! Mint your NFT!' : 'Not yet—keep going!';

    // Dynamic image URL with real Base and dummy Warpcast stats
    const imageUrl = `https://via.placeholder.com/600x400.png?text=Stats:+${txCount}+Tx,+${
      nftCount}+NFTs,+${warpcastEngagement}+Engage+%7C+Aura:+${aura.split(' ')[0]}+%7C+NFT:+${nftEligible.split(' ')[0]}`;

    res.send(`
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${imageUrl}" />
      <meta property="fc:frame:button:1" content="Refresh Stats" />
      <meta property="fc:frame:button:1:action" content="post" />
      <meta property="fc:frame:button:1:target" content="https://base-warpcast-tracker-ujz9.vercel.app/activity" />
      <meta property="fc:frame:button:2" content="Mint NFT" />
      <meta property="fc:frame:button:2:action" content="link" />
      <meta property="fc:frame:button:2:target" content="https://zora.co/collect/base:0xefe882518ba86946ae7a5ae286a6e70659056f91/1?referrer=0x5aa6653004a6147e358306e7214ffacba3c92d5e" />
      <meta property="fc:frame:button:3" content="Challenge Friends" />
      <meta property="fc:frame:button:3:action" content="post" />
      <meta property="fc:frame:button:3:target" content="https://base-warpcast-tracker-ujz9.vercel.app/challenge" />
    `);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.send(`
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="https://via.placeholder.com/600x400.png?text=Error+Loading+Stats" />
      <meta property="fc:frame:button:1" content="Try Again" />
      <meta property="fc:frame:button:1:action" content="post" />
      <meta property="fc:frame:button:1:target" content="https://base-warpcast-tracker-ujz9.vercel.app/activity" />
    `);
  }
});

app.post('/challenge', (req, res) => {
  const imageUrl = 'https://via.placeholder.com/600x400.png?text=Challenge+Issued!+Beat+My+Stats!';
  res.send(`
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imageUrl}" />
    <meta property="fc:frame:button:1" content="Take the Challenge" />
    <meta property="fc:frame:button:1:action" content="post" />
    <meta property="fc:frame:button:1:target" content="https://base-warpcast-tracker-ujz9.vercel.app/activity" />
  `);
});

app.listen(3000);
