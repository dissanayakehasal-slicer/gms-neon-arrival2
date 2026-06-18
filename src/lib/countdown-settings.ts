export type CountdownSettings = {
  enabled: boolean;
  endsAt: string;
  redirectUrl: string;
};

export const DEFAULT_COUNTDOWN_SETTINGS: CountdownSettings = {
  enabled: false,
  endsAt: "",
  redirectUrl: "",
};

export const COUNTDOWN_API_PATH = "/api/countdown";
export const COUNTDOWN_ADMIN_PASSWORD = "gen-zcience321";
