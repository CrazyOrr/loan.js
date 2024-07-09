const { EvenTotalLoan, Frequency, TermUnit } = require("@crazyorr/loan");

const loan = new EvenTotalLoan(
  10000, // 本金
  0.1, // 利率
  Frequency.YEARLY, // 利率类型(日/月/年)
  12, // 期限
  TermUnit.MONTH, // 期限单位(日/月/年)
  Frequency.MONTHLY // 还款频率(日/月/年)
);

const repayment = loan.calculateInterest();

console.log(repayment);
