import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { TaskCard } from "@/components/TaskCard";
import { TaskDialog } from "@/components/TaskDialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { taskAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Plus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Task, TaskFormData } from "@/types";

export default function Dashboard() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const itemsPerPage = 9;

  useEffect(() => {
    fetchTasks();
  }, [currentPage, statusFilter]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await taskAPI.getTasks(
        currentPage,
        itemsPerPage,
        statusFilter
      );
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
      setTotalTasks(data.totalTasks);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await taskAPI.deleteTask(taskId);
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
      fetchTasks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleSubmitTask = async (formData: TaskFormData) => {
    setDialogLoading(true);
    try {
      if (selectedTask) {
        await taskAPI.updateTask(selectedTask._id, formData);
        toast({
          title: "Success",
          description: "Task updated successfully",
        });
      } else {
        await taskAPI.createTask(formData);
        toast({
          title: "Success",
          description: "Task created successfully",
        });
      }
      setDialogOpen(false);
      fetchTasks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save task",
        variant: "destructive",
      });
    } finally {
      setDialogLoading(false);
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold">My Tasks</h2>
            <p className="text-muted-foreground mt-1">
              {totalTasks} {totalTasks === 1 ? "task" : "tasks"} total
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleCreateTask} className="flex-1 sm:flex-none">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Task Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first task
            </p>
            <Button onClick={handleCreateTask}>
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Task Dialog */}
      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={selectedTask}
        onSubmit={handleSubmitTask}
        loading={dialogLoading}
      />
    </div>
  );
}
