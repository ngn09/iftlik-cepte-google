
import * as React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MediaViewerDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    mediaUrls: string[];
    startIndex?: number;
}

const MediaViewerDialog = ({ isOpen, onOpenChange, mediaUrls, startIndex = 0 }: MediaViewerDialogProps) => {
    const [currentIndex, setCurrentIndex] = React.useState(startIndex);

    React.useEffect(() => {
        if (isOpen) {
            setCurrentIndex(startIndex);
        }
    }, [isOpen, startIndex]);

    if (!mediaUrls || mediaUrls.length === 0) {
        return null;
    }

    const currentUrl = mediaUrls[currentIndex];
    const isVideo = currentUrl && /\.(mp4|webm|ogg)$/i.test(currentUrl);

    const goToPrevious = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? mediaUrls.length - 1 : prevIndex - 1));
    };

    const goToNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prevIndex) => (prevIndex === mediaUrls.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-0 bg-transparent border-0 shadow-none">
                <div className="relative">
                    {isVideo ? (
                        <video controls autoPlay src={currentUrl} className="w-full max-h-[80vh] object-contain rounded-lg" />
                    ) : (
                        <img src={currentUrl} alt="Health record media" className="w-full max-h-[80vh] object-contain rounded-lg" />
                    )}

                    {mediaUrls.length > 1 && (
                        <>
                            <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full" onClick={goToPrevious}>
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full" onClick={goToNext}>
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MediaViewerDialog;
