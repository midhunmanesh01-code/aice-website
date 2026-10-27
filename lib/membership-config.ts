const configuredFee = Number(process.env.NEXT_PUBLIC_MEMBERSHIP_FEE);

export const MEMBERSHIP_FEE =
  Number.isFinite(configuredFee) && configuredFee > 0 ? configuredFee : 100;
