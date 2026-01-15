"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  /** The trigger element that opens the dialog (optional for controlled dialogs) */
  trigger?: React.ReactNode;
  /** Title of the confirmation dialog */
  title: string;
  /** Description text explaining the action */
  description: string;
  /** Label for the cancel button */
  cancelLabel?: string;
  /** Label for the confirm button */
  confirmLabel?: string;
  /** Variant for the confirm button */
  confirmVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  /** Custom className for the confirm button */
  confirmClassName?: string;
  /** For form-based deletion: the form action function */
  formAction?: (formData: FormData) => void | Promise<void>;
  /** For form-based deletion: hidden input fields */
  hiddenInputs?: Array<{ name: string; value: string }>;
  /** For function-based deletion: callback when confirmed */
  onConfirm?: () => void | Promise<void>;
  /** Whether the action is pending/loading */
  isPending?: boolean;
  /** Size of the confirm button */
  confirmButtonSize?: "default" | "sm" | "lg" | "icon";
  /** Size of the cancel button */
  cancelButtonSize?: "default" | "sm" | "lg" | "icon";
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Reusable confirmation dialog component for deletion and other destructive actions.
 * Supports both form-based (server actions) and function-based (onClick handlers) patterns.
 */
export function ConfirmDialog({
  trigger,
  title,
  description,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  confirmVariant = "destructive",
  confirmClassName = "bg-red-500 text-white hover:bg-red-400",
  formAction,
  hiddenInputs = [],
  onConfirm,
  isPending = false,
  confirmButtonSize = "default",
  cancelButtonSize,
  open,
  onOpenChange,
}: ConfirmDialogProps) {
  // Validate that either formAction or onConfirm is provided, but not both
  if (!formAction && !onConfirm) {
    throw new Error(
      "ConfirmDialog: Either 'formAction' or 'onConfirm' must be provided"
    );
  }
  if (formAction && onConfirm) {
    throw new Error(
      "ConfirmDialog: Cannot use both 'formAction' and 'onConfirm'. Use one or the other."
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <AlertDialogTrigger asChild disabled={isPending}>
          {trigger}
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              size={cancelButtonSize || confirmButtonSize}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {cancelLabel}
            </Button>
          </AlertDialogCancel>
          {formAction ? (
            <form action={formAction} className="w-full sm:w-auto">
              {hiddenInputs.map((input, index) => (
                <input
                  key={index}
                  type="hidden"
                  name={input.name}
                  value={input.value}
                />
              ))}
              <AlertDialogAction asChild>
                <Button
                  type="submit"
                  variant={confirmVariant}
                  size={confirmButtonSize}
                  className={`w-full sm:w-auto ${confirmClassName}`}
                  disabled={isPending}
                >
                  {isPending ? "Processing..." : confirmLabel}
                </Button>
              </AlertDialogAction>
            </form>
          ) : (
            <AlertDialogAction asChild>
              <Button
                variant={confirmVariant}
                size={confirmButtonSize}
                className={`w-full sm:w-auto ${confirmClassName}`}
                onClick={onConfirm}
                disabled={isPending}
              >
                {isPending ? "Processing..." : confirmLabel}
              </Button>
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
