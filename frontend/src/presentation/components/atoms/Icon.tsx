import { type SvgIconProps } from "@mui/material";
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  CloudUpload as CloudUploadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  MoreVert as MoreVertIcon,
  ChevronRight as ChevronRightIcon,
  ArrowBack as ArrowBackIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

type IconName =
  | "home"
  | "dashboard"
  | "settings"
  | "logout"
  | "upload"
  | "edit"
  | "delete"
  | "download"
  | "add"
  | "close"
  | "search"
  | "menu"
  | "moreVert"
  | "chevronRight"
  | "arrowBack"
  | "warning"
  | "info"
  | "error"
  | "checkCircle";

interface IconProps extends SvgIconProps {
  name: IconName;
}

const iconMap: Record<IconName, React.ElementType> = {
  home: HomeIcon,
  dashboard: DashboardIcon,
  settings: SettingsIcon,
  logout: LogoutIcon,
  upload: CloudUploadIcon,
  edit: EditIcon,
  delete: DeleteIcon,
  download: DownloadIcon,
  add: AddIcon,
  close: CloseIcon,
  search: SearchIcon,
  menu: MenuIcon,
  moreVert: MoreVertIcon,
  chevronRight: ChevronRightIcon,
  arrowBack: ArrowBackIcon,
  warning: WarningIcon,
  info: InfoIcon,
  error: ErrorIcon,
  checkCircle: CheckCircleIcon,
};

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent {...props} />;
};
