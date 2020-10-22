import { IllegalArgumentException } from "./error";

/**
 * 贷款
 */
export abstract class Loan {
    /**
     * 构造贷款
     * @param principalAmount 本金金额
     * @param rate 利率
     * @param rateType 利率类型(日/月/年)
     * @param term 期限
     * @param termUnit 期限单位(日/月/年)
     */
    protected constructor(protected principalAmount: number,
                          protected rate: number,
                          protected rateType: Frequency,
                          protected term: number,
                          protected termUnit: TermUnit
    ) {
        if (!Loan.validatePrincipalAmount(principalAmount)) {
            throw new IllegalArgumentException("Principal sum must > 0");
        }
        if (!Loan.validateRate(rate)) {
            throw new IllegalArgumentException("Rate of return must > 0");
        }
        if (!Loan.validateTerm(term)) {
            throw new IllegalArgumentException("Term must > 0");
        }
    }

    /**
     * 计算利息
     */
    abstract calculateInterest(): Repayment;

    /**
     * 验证本金金额
     */
    static validatePrincipalAmount(principalAmount: number) {
        return principalAmount > 0;
    }

    /**
     * 验证利率
     */
    static validateRate(rate: number) {
        return rate > 0;
    }

    /**
     * 验证期限
     */
    static validateTerm(term: number) {
        return term > 0;
    }
}

// noinspection JSUnusedGlobalSymbols
/**
 * 到期还本付息贷款
 */
export class LumpSumLoan extends Loan {
    /**
     * 构造到期还本付息贷款
     * @param principalAmount 本金金额
     * @param rate 利率
     * @param rateType 利率类型(日/月/年)
     * @param term 期限
     * @param termUnit 期限单位(日/月/年)
     */
    constructor(principalAmount: number,
                rate: number,
                rateType: Frequency,
                term: number,
                termUnit: TermUnit) {
        super(principalAmount, rate, rateType, term, termUnit);
    }

    calculateInterest(): Repayment {
        let convertToRateType;
        switch (this.termUnit) {
            case TermUnit.DAY:
                convertToRateType = Frequency.DAILY;
                break;
            case TermUnit.MONTH:
                convertToRateType = Frequency.MONTHLY;
                break;
            case TermUnit.YEAR:
            default:
                convertToRateType = Frequency.YEARLY;
                break;
        }
        let interestAmount = this.principalAmount * convertRate(this.rate, this.rateType, convertToRateType) * this.term;
        return new Repayment(this.principalAmount, interestAmount);
    }
}

/**
 * 分期贷款
 */
abstract class InstallmentLoan extends Loan {
    /**
     * 构造分期贷款
     * @param principalAmount 本金金额
     * @param rate 利率
     * @param rateType 利率类型(日/月/年)
     * @param term 期限
     * @param termUnit 期限单位(日/月/年)
     * @param repaymentFrequency 还款频率(日/月/年)
     */
    protected constructor(
        principalAmount: number,
        rate: number,
        rateType: Frequency,
        term: number,
        termUnit: TermUnit,
        private repaymentFrequency: Frequency
    ) {
        super(principalAmount, rate, rateType, term, termUnit);

        // if (!repaymentFrequency.isTermUnitSupported(termUnit)) {
        //     switch (repaymentFrequency) {
        //         case Frequency.YEARLY:
        //             throw new IllegalArgumentException("Please use year as unit on yearly paid loan");
        //         case Frequency.MONTHLY:
        //             throw new IllegalArgumentException("Please use year/month as unit on monthly paid loan");
        //     }
        // }
        if (repaymentFrequency === Frequency.DAILY) {
            throw new IllegalArgumentException("Daily payment frequency is not supported for installment loan")
        }

        if (this.installmentNumber() <= 0) {
            throw new IllegalArgumentException("Number of installments must > 0")
        }
    }

    /**
     * 分期期数
     */
    protected installmentNumber(): number {
        let number;
        switch (this.repaymentFrequency) {
            case Frequency.MONTHLY:
                number = convertTermUnit(this.term, this.termUnit, TermUnit.MONTH);
                break;
            case Frequency.YEARLY:
                number = convertTermUnit(this.term, this.termUnit, TermUnit.YEAR);
                break;
        }
        return number;
    }

    /**
     * 分期每期利率
     */
    protected installmentInterestRate(): number {
        return convertRate(this.rate, this.rateType, this.repaymentFrequency);
    }
}

// noinspection JSUnusedGlobalSymbols
/**
 * 等额本息贷款
 */
export class EvenTotalLoan extends InstallmentLoan {
    /**
     * 构造等额本息贷款
     * @param principalAmount 本金金额
     * @param rate 利率
     * @param rateType 利率类型(日/月/年)
     * @param term 期限
     * @param termUnit 期限单位(日/月/年)
     * @param repaymentFrequency 还款频率(日/月/年)
     */
    constructor(
        principalAmount: number,
        rate: number,
        rateType: Frequency,
        term: number,
        termUnit: TermUnit,
        repaymentFrequency: Frequency
    ) {
        super(principalAmount, rate, rateType, term, termUnit, repaymentFrequency);
    }

    calculateInterest(): Repayment {
        const installmentRate = this.installmentInterestRate();
        const installmentNumber = this.installmentNumber();
        const intermediate = Math.pow(1 + installmentRate, installmentNumber);
        const installmentSum = this.principalAmount * installmentRate * intermediate / (intermediate - 1);
        let residualPrincipal = this.principalAmount;
        let installmentRepayments: Repayment[] = [];
        for (let i = 0; i < installmentNumber; i++) {
            const installmentInterest = residualPrincipal * installmentRate;
            const installmentPrincipal = installmentSum - installmentInterest;
            installmentRepayments.push(new Repayment(installmentPrincipal, installmentInterest));
            residualPrincipal -= installmentPrincipal;
        }
        return new InstallmentLoanRepayment(installmentRepayments);
    }
}

// noinspection JSUnusedGlobalSymbols
/**
 * 等额本金贷款
 */
export class EvenPrincipalLoan extends InstallmentLoan {
    /**
     * 构造等额本金贷款
     * @param principalAmount 本金金额
     * @param rate 利率
     * @param rateType 利率类型(日/月/年)
     * @param term 期限
     * @param termUnit 期限单位(日/月/年)
     * @param repaymentFrequency 还款频率(日/月/年)
     */
    constructor(
        principalAmount: number,
        rate: number,
        rateType: Frequency,
        term: number,
        termUnit: TermUnit,
        repaymentFrequency: Frequency
    ) {
        super(principalAmount, rate, rateType, term, termUnit, repaymentFrequency);
    }

    calculateInterest(): Repayment {
        const installmentRate = this.installmentInterestRate();
        const installmentNumber = this.installmentNumber();
        const installmentPrincipal = this.principalAmount / installmentNumber;
        let residualPrincipal = this.principalAmount;
        let installmentRepayments: Repayment[] = [];
        for (let i = 0; i < installmentNumber; i++) {
            const installmentInterest = residualPrincipal * installmentRate;
            installmentRepayments.push(new Repayment(installmentPrincipal, installmentInterest));
            residualPrincipal -= installmentPrincipal;
        }
        return new InstallmentLoanRepayment(installmentRepayments);
    }
}

// noinspection JSUnusedGlobalSymbols
/**
 * 先息后本(按期付息)贷款
 */
export class InterestOnlyOnInstallmentLoan extends InstallmentLoan {
    /**
     * 构造先息后本(按期付息)贷款
     * @param principalAmount 本金金额
     * @param rate 利率
     * @param rateType 利率类型(日/月/年)
     * @param term 期限
     * @param termUnit 期限单位(日/月/年)
     * @param repaymentFrequency 还款频率(日/月/年)
     */
    constructor(
        principalAmount: number,
        rate: number,
        rateType: Frequency,
        term: number,
        termUnit: TermUnit,
        repaymentFrequency: Frequency
    ) {
        super(principalAmount, rate, rateType, term, termUnit, repaymentFrequency);
    }

    calculateInterest(): Repayment {
        const installmentRate = this.installmentInterestRate();
        const installmentNumber = this.installmentNumber();
        const installmentInterest = this.principalAmount * installmentRate;

        let installmentRepayments: Repayment[] = [];
        for (let i = 0; i < installmentNumber; i++) {
            installmentRepayments.push(new Repayment(
                i < installmentNumber - 1 ? 0 : this.principalAmount, // 最后一期才还本金
                installmentInterest));
        }
        return new InstallmentLoanRepayment(installmentRepayments);
    }
}

/**
 * 1年12个月
 */
export const MONTHS_IN_ONE_YEAR: number = 12;
/**
 * 1个月30天
 */
export const DAYS_IN_ONE_MONTH: number = 30;
/**
 * 1年360天
 */
export const DAYS_IN_ONE_YEAR: number = MONTHS_IN_ONE_YEAR * DAYS_IN_ONE_MONTH;

/**
 * 根据频率转换利率
 * @param rate 利率
 * @param from 转换前的频率
 * @param to 转换后的频率
 */
export function convertRate(rate: number, from: Frequency, to: Frequency) {
    let converted = rate;
    switch (from) {
        case Frequency.DAILY:
            switch (to) {
                case Frequency.MONTHLY:
                    converted = rate * DAYS_IN_ONE_MONTH;
                    break;
                case Frequency.YEARLY:
                    converted = rate * DAYS_IN_ONE_YEAR;
                    break;
            }
            break;
        case Frequency.MONTHLY:
            switch (to) {
                case Frequency.DAILY:
                    converted = rate / DAYS_IN_ONE_MONTH;
                    break;
                case Frequency.YEARLY:
                    converted = rate * MONTHS_IN_ONE_YEAR;
                    break;
            }
            break;
        case Frequency.YEARLY:
            switch (to) {
                case Frequency.DAILY:
                    converted = rate / DAYS_IN_ONE_YEAR;
                    break;
                case Frequency.MONTHLY:
                    converted = rate / MONTHS_IN_ONE_YEAR;
                    break;
            }
            break;
    }
    return converted;
}

/**
 * 根据单位转换期限
 * @param num 数量
 * @param from 转换前的期限单位
 * @param to 转换后的期限单位
 */
export function convertTermUnit(num: number, from: TermUnit, to: TermUnit): number {
    let converted = num;
    switch (from) {
        case TermUnit.DAY:
            switch (to) {
                case TermUnit.MONTH:
                    converted = num / DAYS_IN_ONE_MONTH;
                    break;
                case TermUnit.YEAR:
                    converted = num / DAYS_IN_ONE_YEAR;
                    break;
            }
            break;
        case TermUnit.MONTH:
            switch (to) {
                case TermUnit.DAY:
                    converted = num * DAYS_IN_ONE_MONTH;
                    break;
                case TermUnit.YEAR:
                    converted = num / MONTHS_IN_ONE_YEAR;
                    break;
            }
            break;
        case TermUnit.YEAR:
            switch (to) {
                case TermUnit.DAY:
                    converted = num * DAYS_IN_ONE_YEAR;
                    break;
                case TermUnit.MONTH:
                    converted = num * MONTHS_IN_ONE_YEAR;
                    break;
            }
            break;
    }
    return converted;
}

/**
 * 频率
 */
export enum Frequency {
    /**
     * 天
     */
    DAILY,
    /**
     * 月
     */
    MONTHLY,
    /**
     * 年
     */
    YEARLY,
}

/**
 * 期限单位
 */
export enum TermUnit {
    /**
     * 天
     */
    DAY,
    /**
     * 月
     */
    MONTH,
    /**
     * 年
     */
    YEAR,
}

/**
 * 还款
 */
export class Repayment {
    /**
     * 构造还款
     * @param principal 本金金额
     * @param interest 利息金额
     */
    constructor(
        public principal: number = 0,
        public interest: number = 0
    ) {
    }

    /**
     * 本息总额
     */
    sum(): number {
        return this.principal + this.interest;
    }
}

/**
 * 分期贷款还款
 */
export class InstallmentLoanRepayment extends Repayment {
    /**
     * 构造分期贷款还款
     * @param installmentRepayments 分期还款
     * @param principal 本金金额
     * @param interest 利息金额
     */
    constructor(
        public installmentRepayments: Repayment[],
        principal?: number,
        interest?: number
    ) {
        super(principal, interest);
        // 如果未传入principal/interest，则通过分期还款累计计算
        let p, i;
        if (principal === undefined) {
            p = 0;
        }
        if (interest === undefined) {
            i = 0;
        }
        for (let repayment of installmentRepayments) {
            if (p !== undefined) {
                p += repayment.principal;
            }
            if (i !== undefined) {
                i += repayment.interest;
            }
        }
        if (p !== undefined) {
            this.principal = p;
        }
        if (i !== undefined) {
            this.interest = i;
        }
    }
}
