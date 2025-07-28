export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ActionItem {
  id: string;
  description: string;
  assignedTo: string;
  status: "open" | "in_progress" | "done";
  dueDate: string;
}

export interface Feedback {
  userId: string;
  rating: number;
  comments?: string;
  createdAt: string;
}

export interface GrowthSession {
  id: string;
  topic: string;
  presenterId: string;
  scheduledTime: string;
  notes?: string;
  actionItems: ActionItem[];
  feedback: Feedback[];
  createdAt: string;
  updatedAt: string;
  presenter: User;
}

export interface SessionDetails extends GrowthSession {
  expanded?: boolean;
  detailsLoaded?: boolean;
  actionItems: ActionItem[];
}

export interface SessionFormData {
  topic: string;
  presenterId: string;
  scheduledTime: string;
  notes: string;
}

export interface ActionItemFormData {
  description: string;
  assignedTo: string;
  status: "open" | "in_progress" | "done";
  dueDate: string;
}

export const statusColors = {
  open: "default" as const,
  in_progress: "warning" as const,
  done: "success" as const,
};

export const statusLabels = {
  open: "Open",
  in_progress: "In Progress",
  done: "Done",
};