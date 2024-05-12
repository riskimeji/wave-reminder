const axios = require('axios');

let addresses = [
  '0xfec21536e99538e75466deed819b3929bbcf672de986f89489ba24e90659c34e',
  'next address',
];

async function getTimeLeft(address) {
  try {
    const response = await axios.post(
      'https://fullnode.mainnet.sui.io/',
      {
        jsonrpc: '2.0',
        id: 76,
        method: 'suix_getDynamicFieldObject',
        params: [
          '0x4846a1f1030deffd9dea59016402d832588cf7e0c27b9e4c1a63d2b5e152873a',
          {
            type: 'address',
            value: address,
          },
        ],
      },
      {
        headers: {
          Accept: '*/*',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
          'Client-Sdk-Type': 'typescript',
          'Client-Sdk-Version': '0.51.0',
          'Client-Target-Api-Version': '1.21.0',
          'Content-Length': '239',
          'Content-Type': 'application/json',
          Origin: 'https://walletapp.waveonsui.com',
          Priority: 'u=1, i',
          Referer: 'https://walletapp.waveonsui.com/',
          'Sec-Ch-Ua':
            '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        },
      }
    );
    const lastClaimTimestamp = parseInt(
      response.data.result.data.content.fields.last_claim
    );

    const nextClaimTime = new Date(lastClaimTimestamp + 2 * 60 * 60 * 1000);
    const timeDifference = nextClaimTime - new Date();
    return timeDifference;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getLastClaim(address) {
  try {
    const timeLeft = await getTimeLeft(address);
    if (timeLeft !== null) {
      const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutesLeft = Math.floor(
        (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
      );
      const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);
      console.log(
        `Time left for address  \n ${address}: \n ${hoursLeft} jam, ${minutesLeft} menit, ${secondsLeft} detik \n ===================== \n`
      );
      return timeLeft;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getAllClaims() {
  let shortestTimeLeft = Number.MAX_SAFE_INTEGER;
  let addressWithShortestTimeLeft = '';

  for (let i = 0; i < addresses.length; i++) {
    console.log(`Getting claim for address ${i + 1}`);
    const timeLeft = await getLastClaim(addresses[i]);
    await delay(2000);
    if (timeLeft !== null && timeLeft < shortestTimeLeft) {
      shortestTimeLeft = timeLeft;
      addressWithShortestTimeLeft = addresses[i];
    }
  }

  if (addressWithShortestTimeLeft !== '') {
    const hoursLeft = Math.floor(shortestTimeLeft / (1000 * 60 * 60));
    const minutesLeft = Math.floor(
      (shortestTimeLeft % (1000 * 60 * 60)) / (1000 * 60)
    );
    const secondsLeft = Math.floor((shortestTimeLeft % (1000 * 60)) / 1000);
    console.log(
      `\x1b[32mAddress ${
        addresses.indexOf(addressWithShortestTimeLeft) + 1
      } has the shortest time left: ${hoursLeft} jam, ${minutesLeft} menit, ${secondsLeft} detik\x1b[0m\n\n`
    );
  }

  setTimeout(getAllClaims, 5000);
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

getAllClaims();
