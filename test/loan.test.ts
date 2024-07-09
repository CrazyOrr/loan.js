import { describe, expect, it } from "vitest";
import {
  EvenPrincipalLoan,
  EvenTotalLoan,
  Frequency,
  InstallmentLoanRepayment,
  InterestOnlyOnInstallmentLoan,
  Loan,
  LumpSumLoan,
  Repayment,
  TermUnit,
  convertRate,
  convertTermUnit,
} from "../src/loan";

describe("Loan", () => {
  describe("validatePrincipalAmount", () => {
    it.each([
      [-1, false],
      [0, false],
    ])("given an invalid number returns false", (number, expected) => {
      expect(Loan.validatePrincipalAmount(number)).toBe(expected);
    });
    it("given an valid number returns true", () => {
      expect(Loan.validatePrincipalAmount(100)).toBe(true);
    });
  });

  describe("validateRate", () => {
    it.each([
      [-0.1, false],
      [0, false],
    ])("given an invalid number returns false", (number, expected) => {
      expect(Loan.validateRate(number)).toBe(expected);
    });
    it("given an valid number returns true", () => {
      expect(Loan.validateRate(0.1)).toBe(true);
    });
  });

  describe("validateTerm", () => {
    it.each([
      [-1, false],
      [0, false],
    ])("given an invalid number returns false", (number, expected) => {
      expect(Loan.validateTerm(number)).toBe(expected);
    });
    it("given an valid number returns true", () => {
      expect(Loan.validateTerm(10)).toBe(true);
    });
  });
});

describe.each([["LumpSumLoan", LumpSumLoan]])("%s", (_, constructor) => {
  it("constructed with an invalid principal amount throws error", () => {
    expect(
      () => new constructor(0, 0.1, Frequency.YEARLY, 1, TermUnit.YEAR)
    ).toThrowError("Principal sum must > 0");
  });
  it("constructed with an invalid rate throws error", () => {
    expect(
      () => new constructor(100, 0, Frequency.YEARLY, 1, TermUnit.YEAR)
    ).toThrowError("Rate of return must > 0");
  });
  it("constructed with an invalid term throws error", () => {
    expect(
      () => new constructor(100, 0.1, Frequency.YEARLY, 0, TermUnit.YEAR)
    ).toThrowError("Term must > 0");
  });
  it.each([
    [Frequency.DAILY, TermUnit.DAY],
    [Frequency.DAILY, TermUnit.MONTH],
    [Frequency.DAILY, TermUnit.YEAR],
    [Frequency.MONTHLY, TermUnit.DAY],
    [Frequency.MONTHLY, TermUnit.MONTH],
    [Frequency.MONTHLY, TermUnit.YEAR],
    [Frequency.YEARLY, TermUnit.DAY],
    [Frequency.YEARLY, TermUnit.MONTH],
    [Frequency.YEARLY, TermUnit.YEAR],
  ])(
    "calculateInterest with rate type of %s and term unit of %s",
    (rateType, termUnit) => {
      expect(
        new constructor(100, 0.1, rateType, 1, termUnit).calculateInterest()
      ).toMatchSnapshot();
    }
  );
});

describe.each([
  ["EvenTotalLoan", EvenTotalLoan],
  ["EvenPrincipalLoan", EvenPrincipalLoan],
  ["InterestOnlyOnInstallmentLoan", InterestOnlyOnInstallmentLoan],
])("%s", (_, constructor) => {
  it("constructed with an invalid principal amount throws error", () => {
    expect(
      () =>
        new constructor(
          0,
          0.1,
          Frequency.YEARLY,
          1,
          TermUnit.YEAR,
          Frequency.MONTHLY
        )
    ).toThrowError("Principal sum must > 0");
  });
  it("constructed with an invalid rate throws error", () => {
    expect(
      () =>
        new constructor(
          100,
          0,
          Frequency.YEARLY,
          1,
          TermUnit.YEAR,
          Frequency.MONTHLY
        )
    ).toThrowError("Rate of return must > 0");
  });
  it("constructed with an invalid term throws error", () => {
    expect(
      () =>
        new constructor(
          100,
          0.1,
          Frequency.YEARLY,
          0,
          TermUnit.YEAR,
          Frequency.MONTHLY
        )
    ).toThrowError("Term must > 0");
  });
  it("constructed with daily repayment frequency throws error", () => {
    expect(
      () =>
        new constructor(
          100,
          0.1,
          Frequency.YEARLY,
          1,
          TermUnit.YEAR,
          Frequency.DAILY
        )
    ).toThrowError(
      "Daily payment frequency is not supported for installment loan"
    );
  });
  it.each([
    [1, TermUnit.DAY, Frequency.MONTHLY],
    [1, TermUnit.DAY, Frequency.YEARLY],
    [1, TermUnit.MONTH, Frequency.YEARLY],
  ])(
    "constructed with incompatible term and repayment frequency throws error",
    (term, termUnit, repaymentFrequency) => {
      expect(
        () =>
          new constructor(
            100,
            0.1,
            Frequency.YEARLY,
            term,
            termUnit,
            repaymentFrequency
          )
      ).toThrowError("Number of installments must >= 1");
    }
  );
  it.each([
    [Frequency.MONTHLY, 360, TermUnit.DAY, Frequency.YEARLY],
    [Frequency.MONTHLY, 12, TermUnit.MONTH, Frequency.YEARLY],
    [Frequency.MONTHLY, 1, TermUnit.YEAR, Frequency.YEARLY],
    [Frequency.YEARLY, 360, TermUnit.DAY, Frequency.YEARLY],
    [Frequency.YEARLY, 12, TermUnit.MONTH, Frequency.YEARLY],
    [Frequency.YEARLY, 1, TermUnit.YEAR, Frequency.YEARLY],
  ])(
    "calculateInterest with rate type of %s, term of %i, term unit of %s, repayment frequency of %s",
    (rateType, term, termUnit, repaymentFrequency) => {
      expect(
        new constructor(
          100,
          0.1,
          rateType,
          term,
          termUnit,
          repaymentFrequency
        ).calculateInterest()
      ).toMatchSnapshot();
    }
  );
});

describe("convertRate", () => {
  it.each([
    [1, Frequency.DAILY, 30, Frequency.MONTHLY],
    [1, Frequency.DAILY, 360, Frequency.YEARLY],
    [1, Frequency.MONTHLY, 12, Frequency.YEARLY],
  ])("%i %s = %i %s", (fromRate, fromFrequency, toRate, toFrequency) => {
    expect(convertRate(fromRate, fromFrequency, toFrequency)).toBe(toRate);
  });
});

describe("convertTermUnit", () => {
  it.each([
    [1, TermUnit.YEAR, 12, TermUnit.MONTH],
    [1, TermUnit.MONTH, 30, TermUnit.DAY],
    [1, TermUnit.YEAR, 360, TermUnit.DAY],
  ])("%i %s = %i %s", (fromTerm, fromTermUnit, toTerm, toTermUnit) => {
    expect(convertTermUnit(fromTerm, fromTermUnit, toTermUnit)).toBe(toTerm);
  });
});

describe("Repayment", () => {
  it("sum = principal + interest", () => {
    expect(new Repayment(1, 2).sum()).toBe(3);
  });
});

describe("InstallmentLoanRepayment", () => {
  it("aggregate principal and interest from installments", () => {
    const repayment = new InstallmentLoanRepayment([
      new Repayment(1, 2),
      new Repayment(3, 4),
    ]);
    expect(repayment.principal).toBe(4);
    expect(repayment.interest).toBe(6);
  });
});
