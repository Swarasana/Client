import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PWAUpdatePromptProps {
  isOpen: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
}

export const PWAUpdatePrompt: React.FC<PWAUpdatePromptProps> = ({
  isOpen,
  onUpdate,
  onDismiss,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onDismiss}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pembaruan Tersedia</DialogTitle>
          <DialogDescription>
            Versi baru aplikasi Swarasana telah tersedia. Muat ulang untuk mendapatkan fitur terbaru dan perbaikan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onDismiss}
            className="w-full sm:w-auto"
          >
            Nanti Saja
          </Button>
          <Button
            onClick={onUpdate}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            Muat Ulang
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};