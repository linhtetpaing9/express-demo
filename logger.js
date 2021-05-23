
function logger(req, res, next){
  const pathName = req._parsedOriginalUrl.pathname
  console.log(`Request to the ${pathName} `);
  next();
}

module.exports = logger