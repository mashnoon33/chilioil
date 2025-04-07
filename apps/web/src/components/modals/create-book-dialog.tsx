"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "../ui/input";

interface CreateBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBookDialog({  open, onOpenChange }: CreateBookDialogProps) {
  const [slug, setSlug] = useState("");
  const router = useRouter();
  const utils = api.useUtils();
  const { mutate: createBook, isPending } = api.book.create.useMutation({
    onSuccess: () => {
      toast.success("Book created successfully!");
      onOpenChange(false);
      router.push(`/admin/${slug}`);
      utils.book.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBook({ slug });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
     
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new book</DialogTitle>
            <DialogDescription>
              Create a new book to organize your recipes. The slug will be used in the URL.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="slug">Book Slug</label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-awesome-book"
                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                required
              />
              <p className="text-sm text-muted-foreground">
                Use lowercase letters, numbers, and hyphens only. No spaces allowed.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending || !slug}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Book"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}