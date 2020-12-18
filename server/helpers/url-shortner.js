const BitlyClient = require('bitly').BitlyClient;


const shortenUrl = async(url) => {
    try {
        const bitly = new BitlyClient(process.env.BITLY_API_KEY);
        const shortUrl = await bitly.shorten(url);
        return shortUrl.link;
    } catch(ex) {
          console.log(ex);
    }
  
  }

  module.exports = {
    shortenUrl

  }