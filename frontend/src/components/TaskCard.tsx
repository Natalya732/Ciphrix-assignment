import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { isAdmin } = useAuth();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    return status === "Completed"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
              task.status
            )}`}
          >
            {task.status}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {task.description}
        </p>
        <div className="flex items-center mt-3 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Created: {formatDate(task.createdAt)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-3">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(task)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        {isAdmin && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(task._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
