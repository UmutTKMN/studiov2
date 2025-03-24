// Ortak yardımcı fonksiyonlar
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("tr-TR");
};

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

module.exports = {
  formatDate,
  validateEmail,
};
