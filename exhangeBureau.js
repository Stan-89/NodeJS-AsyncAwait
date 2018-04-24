//Small script that uses http API to exchange some money

//We need axios for GET Requests to API
const axios = require('axios');

//Getting exchange rate GENERAL function
const getExchangeRate = async (from, to) => {
  //Try and catch because it could fail (connection or conversion)
  try
  {
    //Since an async, we can use await on the GET request
    const response = await axios.get(`http://api.fixer.io/latest?base=${from}`);
    const rate = response.data.rates[to];

    if(rate){
      return rate;
    }
    else{
      throw new Error();
    }
  }
  catch(e)
  {
    throw new Error(`Unable to perform the exchange rate from ${from} to ${to}!`, e);
  }
};

//Getting the list of countries
const getCountries = async (currencyCode) =>{
  try
  {
    //Get the response
    const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
    //Return an array of only the Names, not the object
    return response.data.map((country) => country.name);
  }
  catch(e)
  {
    throw new Error(`Unable to get list of countries that use ${currencyCode}`, e);
  }
}


//"Usual" way to do things (returning promises and chaining thens)
const convertCurrency = (from, to, amount) => {
  //Since we're working with many todos
  //AND because we want it to be in scope (otherwise if declared only in first then, not in scope for 2nd)
  //(recall Java var declarations)
  let countries;
  //Return a promise function (get countries, which is async with await and returns a result [but that is in a promise])
  return getCountries(to).then((tempCountries) => {
    //Assign our countries to the result so we can use it in the second then
    //Otherwise we'd have to modify exchangeRate to accept it and it wouldn't make sense
    //So just "hop" over thens with a bigger scope of a variable
    countries = tempCountries;
    //Get the exchange rate, which is also async and has await
    return getExchangeRate(from, to);
    //Finally, with the result
  }).then((rate) => {
    //Exchanged amount
    const exchangedAmount  = amount*rate;

    //Return the sult in a string
    return `${amount} ${from} is worth ${exchangedAmount} ${to}. ${to}
    can be used in the following countries: ${countries.join(', ')}`;
  });
};

//With async, same function
const convertCurrencyAlt = async (from, to, amount) => {
  //Countries and rates are async, so we use await
  const countries = await getCountries(to);
  const rate = await getExchangeRate(from, to);

  const exchangedAmount  = amount*rate;

  //Return the sult in a string
  return `${amount} ${from} is worth ${exchangedAmount} ${to}. ${to}
  can be used in the following countries: ${countries.join(', ')}`;

};


convertCurrencyAlt('BGN', 'CAD', 1680).then((status) => {
  console.log(status);
}).catch((e) => {
  console.log(e.message);
});
