export interface Theme {
  primaryColor: string;
  primaryPressed: string;
  primarySelected: string;
  backgroundColor: string;
  surfaceColor: string;
  backgroundPressed: string;
  backgroundSelected: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  dangerColor: string;
  borderColor: string;
  roundButtonSize: number;
}

export const theme: Theme = {
  primaryColor: "black",
  primaryPressed: "#333333",
  primarySelected: "#4b4b4b",
  backgroundColor: "white",
  surfaceColor: "#f1f3f6",
  backgroundPressed: "rgba(235, 235, 235, 1)",
  backgroundSelected: "rgba(225, 225, 225, 1)",
  primaryTextColor: "black",
  secondaryTextColor: "#868686",
  dangerColor: "#e52319",
  borderColor: "#e5ebe7",
  roundButtonSize: 44,
};
