import { IconType } from "react-icons";

export function getNavigationByRole(
  navigationItems: {
    name: string;
    to: string;
    icon: IconType;
  }[],
  role: string
) {
  switch (role) {
    case "ADMIN":
      return navigationItems;
    case "MANAGER":
      return navigationItems; 
    case "SALES":
      return navigationItems.filter(({ name }) =>
        ["Overview", "Sales", "Stocklist", "Products"].includes(name)
      );
    case "STOCKCLERK":
      return navigationItems.filter(({ name }) =>
        ["Overview", "Products", "Stocklist"].includes(name)
      );
    default:
      return navigationItems.filter(({ name }) =>
        ["Overview", "Products", "Sales", "Stocklist"].includes(name)
      );
  }
}
