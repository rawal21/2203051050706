const generateShortcode = () => {
  return Math.random().toString(36).substring(2, 8); 
};

const isValidShortcode = (code) => /^[a-zA-Z0-9]{4,12}$/.test(code);

module.exports = { generateShortcode, isValidShortcode };
