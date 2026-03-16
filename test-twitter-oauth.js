// Test Twitter OAuth signature generation
const crypto = require('crypto');

const config = {
  api_key: 'RiyJSOg1LxZ7WL2vjNslgT8Ho',
  api_secret: 'XxGEIYonjESLYTvj2K8lfhMhUxy2dVGzyKOA3LUy8WCrUjRmJA',
  access_token: '1892580529913880576-PHUXjozoaOxL9XpCQyckqy18ba76CA',
  access_token_secret: 'OauJuaJfsfMOBCNmJXe8zRT9VfcXPgEE3AbP33wYhpWU5'
};

function generateOAuthSignature(method, url, params, consumerSecret, tokenSecret) {
  // Sort parameters
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  console.log('\n=== Sorted Params ===');
  console.log(sortedParams);

  // Create signature base string
  const signatureBaseString = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(sortedParams)
  ].join('&');

  console.log('\n=== Signature Base String ===');
  console.log(signatureBaseString);

  // Create signing key
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;

  console.log('\n=== Signing Key ===');
  console.log(signingKey);

  // Generate signature
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(signatureBaseString)
    .digest('base64');

  console.log('\n=== OAuth Signature ===');
  console.log(signature);

  return signature;
}

function generateOAuthHeader(method, url, config, additionalParams = {}) {
  const oauthParams = {
    oauth_consumer_key: config.api_key,
    oauth_token: config.access_token,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: '1773672925', // Fixed timestamp for testing
    oauth_nonce: 'O1QafmvG8QbnYaC4QqfJ8E4cTzu0IIRv7pywbKkMM', // Fixed nonce for testing
    oauth_version: '1.0'
  };

  // Combine OAuth params with additional params for signature
  const allParams = { ...oauthParams, ...additionalParams };

  console.log('\n=== All Params for Signature ===');
  console.log(allParams);

  // Generate signature
  const signature = generateOAuthSignature(
    method,
    url,
    allParams,
    config.api_secret,
    config.access_token_secret
  );

  oauthParams.oauth_signature = signature;

  // Build authorization header
  const authHeader = 'OAuth ' + Object.keys(oauthParams)
    .sort()
    .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
    .join(', ');

  console.log('\n=== Authorization Header ===');
  console.log(authHeader);

  return authHeader;
}

// Test 1: Verify endpoint (GET, no params) - THIS WORKS
console.log('\n\n========================================');
console.log('TEST 1: VERIFY ENDPOINT (WORKS)');
console.log('========================================');
generateOAuthHeader(
  'GET',
  'https://api.twitter.com/1.1/account/verify_credentials.json',
  config
);

// Test 2: Post endpoint (POST, with status param) - THIS FAILS
console.log('\n\n========================================');
console.log('TEST 2: POST ENDPOINT (FAILS)');
console.log('========================================');
const testStatus = '🤖 Test tweet from CV Adapter Social Bot!\n\nThis is an automated test to verify the bot is working correctly.\n\nGenerated at: 16/03/2026, 14:55:25\n\n#CVAdapter #TestTweet';
generateOAuthHeader(
  'POST',
  'https://api.twitter.com/1.1/statuses/update.json',
  config,
  { status: testStatus }
);

// Test 3: Simple status without emojis/newlines
console.log('\n\n========================================');
console.log('TEST 3: SIMPLE STATUS (NO EMOJIS/NEWLINES)');
console.log('========================================');
generateOAuthHeader(
  'POST',
  'https://api.twitter.com/1.1/statuses/update.json',
  config,
  { status: 'Simple test tweet' }
);
