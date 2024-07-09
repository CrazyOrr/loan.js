# loan

A JavaScript library for interest calculation of loans.

## Installation

```
$ npm install @crazyorr/loan
```

## Usage

```javascript
import {
  EvenPrincipalLoan,
  EvenTotalLoan,
  Frequency,
  InterestOnlyOnInstallmentLoan,
  LumpSumLoan,
  TermUnit,
} from "@crazyorr/loan";
```

or

```javascript
const {
  LumpSumLoan,
  EvenTotalLoan,
  EvenPrincipalLoan,
  InterestOnlyOnInstallmentLoan,
  Frequency,
  TermUnit,
} = require("@crazyorr/loan");
```

then

```javascript
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
const repayment = loan.calculateInterest();
```

## Contributing

The starter contains the following scripts:

- `dev` - starts dev server
- `build` - generates the following bundles: CommonJS (`.js`) ESM (`.mjs`) and IIFE (`.iife.js`). The name of bundle is automatically taken from `package.json` name property
- `test` - starts vitest and runs all tests
- `test:coverage` - starts vitest and run all tests with code coverage report
- `lint:scripts` - lint `.ts` files with eslint
- `lint:styles` - lint `.css` and `.scss` files with stylelint
- `format:scripts` - format `.ts`, `.html` and `.json` files with prettier
- `format:styles` - format `.cs` and `.scss` files with stylelint
- `format` - format all with prettier and stylelint
- `prepare` - script for setting up husky pre-commit hook
- `uninstall-husky` - script for removing husky from repository

## License

This project is licensed under the [ISC License](./LICENSE)
