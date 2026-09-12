export interface Theme {
  primaryColor: string;
  primaryPressed: string;
  primarySelected: string;
  backgroundColor: string;
  backgroundPressed: string;
  backgroundSelected: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  dangerColor: string;
  borderColor: string;
}

export const theme: Theme = {
  primaryColor: "#000000",
  primaryPressed: "#333333",
  primarySelected: "#4b4b4b",
  backgroundColor: "#ffffff",
  backgroundPressed: "rgba(235, 235, 235, 1)",
  backgroundSelected: "rgba(225, 225, 225, 1)",
  primaryTextColor: "#000000",
  secondaryTextColor: "#8b9691",
  dangerColor: "#e52319",
  borderColor: "#e5ebe7"
};