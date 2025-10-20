import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed bottom-24 right-6 h-16 w-16 rounded-full shadow-2xl hover:scale-110 transition-transform duration-200 z-40"
    >
      <Plus className="h-8 w-8" strokeWidth={3} />
    </Button>
  );
}
