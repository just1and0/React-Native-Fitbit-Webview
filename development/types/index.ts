import * as React from 'react';

export interface FitbitContextProps {
  authenticateUserFitbitAccount: () => void;
  closeModal: () => void;
  usersFitBitAuthCredentials?: usersFitBitAuthCredentialsProps;
}

export type usersFitBitAuthCredentialsProps = {
  access_token: string;
  expires_in: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  user_id: string;

}

export interface FitbitProviderProps {
  configs: configsProps;
  children: React.ReactNode;
}

export type configsProps = {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  FITBIT_MODAL_CONTROLS?: FITBIT_MODAL_CONTROLS_PROPS
}

export type FITBIT_MODAL_CONTROLS_PROPS = {
  themeColor?: string
}

export type responseType = {
  access_token: string;
  refresh_token: string;
  scope: string;
  user_id: string;
  expires_in: string;
  token_type: string
}

export type VitalDataProps = {
  identifier: string;
  latestValue: string;
  name: string;
  recordDuration: string;
  status: boolean;
  unit: string;
  metaData?: any;
}

export type SleepDataProps = VitalDataProps & {
  sleepValue: boolean;
  extra?: any;
}
