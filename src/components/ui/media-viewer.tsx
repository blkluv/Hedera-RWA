import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface MediaItem {
  type: "image" | "document";
  cid: string;
  title?: string;
}

interface MediaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  items: MediaItem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export function MediaViewer({
  isOpen,
  onClose,
  items,
  currentIndex,
  onNavigate,
}: MediaViewerProps) {
  const currentItem = items[currentIndex];
  const canNavigatePrev = currentIndex > 0;
  const canNavigateNext = currentIndex < items.length - 1;

  const NavigationButton = ({
    direction,
    onClick,
    enabled,
  }: {
    direction: "left" | "right";
    onClick: () => void;
    enabled: boolean;
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all",
        direction === "left" ? "left-4" : "right-4",
        !enabled && "opacity-50 cursor-not-allowed"
      )}
      disabled={!enabled}
    >
      {direction === "left" ? (
        <ChevronLeft className="w-6 h-6" />
      ) : (
        <ChevronRight className="w-6 h-6" />
      )}
    </button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black/95">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all z-50"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative w-full h-full flex items-center justify-center">
          {items.length > 1 && (
            <>
              <NavigationButton
                direction="left"
                onClick={() => canNavigatePrev && onNavigate(currentIndex - 1)}
                enabled={canNavigatePrev}
              />
              <NavigationButton
                direction="right"
                onClick={() => canNavigateNext && onNavigate(currentIndex + 1)}
                enabled={canNavigateNext}
              />
            </>
          )}

          <div className="w-full h-full flex items-center justify-center p-8">
            {currentItem.type === "image" ? (
              <img
                src={`https://ipfs.io/ipfs/${currentItem.cid}`}
                alt={currentItem.title || "Asset image"}
                className="max-w-full max-h-full object-contain select-none"
                onContextMenu={(e) => e.preventDefault()}
                style={{ pointerEvents: "none" }}
              />
            ) : (
              <iframe
                src={`https://ipfs.io/ipfs/${currentItem.cid}`}
                className="w-full h-full border-0"
                title={currentItem.title || "Document viewer"}
                sandbox="allow-same-origin allow-scripts"
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
