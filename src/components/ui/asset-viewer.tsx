import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface Asset {
  type: "image" | "document";
  url: string;
  title: string;
}

interface AssetViewerProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
}

export const AssetViewer: React.FC<AssetViewerProps> = ({
  isOpen,
  onClose,
  assets,
  currentIndex,
  onNext,
  onPrevious,
}) => {
  const currentAsset = assets[currentIndex];
  const hasMultipleAssets = assets.length > 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] p-0">
        <div className="relative w-full h-full min-h-[500px] bg-black/95">
          <Button
            variant="ghost"
            className="absolute right-2 top-2 text-white z-50"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {hasMultipleAssets && (
            <>
              <Button
                variant="ghost"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white z-40"
                onClick={onPrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white z-40"
                onClick={onNext}
                disabled={currentIndex === assets.length - 1}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          <div className="w-full h-full flex items-center justify-center p-4">
            {currentAsset.type === "image" ? (
              <img
                src={currentAsset.url}
                alt={currentAsset.title}
                className="max-w-full max-h-[80vh] object-contain select-none"
                onContextMenu={(e) => e.preventDefault()}
                style={{ pointerEvents: "none" }}
              />
            ) : (
              <iframe
                src={currentAsset.url}
                title={currentAsset.title}
                className="w-full h-[80vh] bg-white"
                sandbox="allow-same-origin allow-scripts"
              />
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">
            {currentAsset.title}{" "}
            {hasMultipleAssets && `(${currentIndex + 1}/${assets.length})`}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
