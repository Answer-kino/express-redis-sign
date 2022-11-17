export interface IUserAuth {
  adminIdx?: number;
  userIdx?: number;
  userAuthority: string;
}

export interface IDigitCode {
  status: boolean;
  digitCode: number;
}

export interface IRctInfo {
  idx: number;
  type: string;
}
