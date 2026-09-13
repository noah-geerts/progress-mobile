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
}

export const theme: Theme = {
  primaryColor: "black",
  primaryPressed: "#333333",
  primarySelected: "#4b4b4b",
  backgroundColor: "white",
  surfaceColor: "#f2f2f2",
  backgroundPressed: "rgba(235, 235, 235, 1)",
  backgroundSelected: "rgba(225, 225, 225, 1)",
  primaryTextColor: "black",
  secondaryTextColor: "#8b9691",
  dangerColor: "#e52319",
  borderColor: "#e5ebe7"
};