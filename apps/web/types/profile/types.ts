export interface ProfileData {
  full_name: string;
  phone: string;
  home_port: string;
  vessel_name: string;
  vessel_type: string;
  registration_id: string;
}

export const DEFAULT_PROFILE: ProfileData = {
  full_name: "Tanveer Singh",
  phone: "+91 98460 12345",
  home_port: "Kochi, Kerala",
  vessel_name: "",
  vessel_type: "Mechanized Boat",
  registration_id: "",
};
