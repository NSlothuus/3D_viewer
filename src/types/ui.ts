export interface PanelProps {
  isVisible: boolean;
  onToggle: () => void;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
}

export interface ToolbarAction {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
  disabled?: boolean;
  tooltip?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  onClick?: () => void;
  submenu?: MenuItem[];
  separator?: boolean;
  disabled?: boolean;
}

export interface FileImportOptions {
  acceptedFormats: string[];
  maxFileSize: number;
  multiple: boolean;
}

export interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

export interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  disabled?: boolean;
  label?: string;
}

export interface Vector3InputProps {
  value: [number, number, number];
  onChange: (value: [number, number, number]) => void;
  labels?: [string, string, string];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  label?: string;
}

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  disabled?: boolean;
  placeholder?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
}

export interface NotificationProps {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
  onClose: () => void;
}