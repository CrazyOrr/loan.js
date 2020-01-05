const {LumpSumLoan, EvenTotalLoan, EvenPrincipalLoan, InterestOnlyOnInstallmentLoan, Frequency, TermUnit} = require('../dist');

// let loan = new LumpSumLoan(10000, 0.1, Frequency.YEARLY, 6, TermUnit.MONTH);
// let loan = new EvenTotalLoan(10000, 0.1, Frequency.YEARLY, 12, TermUnit.MONTH, Frequency.MONTHLY);
// let loan = new EvenPrincipalLoan(10000, 0.1, Frequency.YEARLY, 12, TermUnit.MONTH, Frequency.MONTHLY);
let loan = new InterestOnlyOnInstallmentLoan(10000, 0.1, Frequency.YEARLY, 12, TermUnit.MONTH, Frequency.MONTHLY);
console.log("result: ", loan.calculateInterest());
