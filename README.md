Interest calculation for loans.

## Usage
```javascript
const {LumpSumLoan, EvenTotalLoan, EvenPrincipalLoan, InterestOnlyOnInstallmentLoan, Frequency, TermUnit} = require('../dist');

let loan;

// 到期还本付息贷款
loan = new LumpSumLoan(
    10000, // 本金
    0.1, // 利率
    Frequency.YEARLY, // 利率类型(日/月/年)
    12, // 期限
    TermUnit.MONTH // 期限单位(日/月/年)
);

// 等额本息贷款
loan = new EvenTotalLoan(
    10000, // 本金
    0.1, // 利率
    Frequency.YEARLY, // 利率类型(日/月/年)
    12, // 期限
    TermUnit.MONTH, // 期限单位(日/月/年)
    Frequency.MONTHLY // 还款频率(日/月/年)
);

// 等额本金贷款
loan = new EvenPrincipalLoan(
    10000, // 本金
    0.1, // 利率
    Frequency.YEARLY, // 利率类型(日/月/年)
    12, // 期限
    TermUnit.MONTH, // 期限单位(日/月/年)
    Frequency.MONTHLY // 还款频率(日/月/年)
);

// 先息后本(按期付息)贷款
loan = new InterestOnlyOnInstallmentLoan(
    10000, // 本金
    0.1, // 利率
    Frequency.YEARLY, // 利率类型(日/月/年)
    12, // 期限
    TermUnit.MONTH, // 期限单位(日/月/年)
    Frequency.MONTHLY // 还款频率(日/月/年)
);

// 计算利息
let repayments = loan.calculateInterest();
```

## Installation
```
$ npm install @crazyorr/loan
```

## Author
- [CrazyOrr](https://github.com/CrazyOrr)

## License
This project is licensed under the [ISC License](./LICENSE)
