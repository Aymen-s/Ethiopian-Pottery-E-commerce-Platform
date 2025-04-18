const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id:
    "AXqlUJ6HHVYhEljEMU6T1c2a9SS69ye5riNn7D84Z2Z9_2zC9c7fpMu-wuWd5cE5deywZG0vUtkFrcAU",
  client_secret:
    "EGD0EOXShwGV44ciFWaZT2wdEp2H6S8bM8Aln0pShoqk0hM849uB-yki7l6tE5xGecAWDa-NhfmrBtzm",
});

module.exports = paypal;
