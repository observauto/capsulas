import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Gift, Trophy, X, CheckCircle2 } from 'lucide-react';
import { Prize } from './types';

interface RedeemModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedPrize: Prize | null;
    validationCode: string;
    userPoints: number;
    onConfirm: () => void;
    onCancel: () => void;
}

export const RedeemModal: React.FC<RedeemModalProps> = ({
    open,
    onOpenChange,
    selectedPrize,
    validationCode,
    userPoints,
    onConfirm,
    onCancel
}) => {
    if (!selectedPrize) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto p-4 mx-auto rounded-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Gift className="h-6 w-6 text-primary" />
                        Confirmar Canje
                    </DialogTitle>
                    <DialogDescription>
                        Estás a punto de canjear tu premio
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-start gap-4">
                        <img
                            src={selectedPrize.image}
                            alt={selectedPrize.name}
                            className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                            <h4 className="font-semibold">{selectedPrize.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                                {selectedPrize.description}
                            </p>
                            <div className="flex items-center gap-1 text-primary font-bold mt-2">
                                <Trophy className="h-4 w-4" />
                                <span>{selectedPrize.points} puntos</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
                        <p className="text-sm font-medium mb-2">Tu código de validación será:</p>
                        <p className="text-2xl font-mono font-bold text-center py-2 bg-background rounded">
                            {validationCode}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                            Llama al <strong>01-800-OBSERVA</strong> con este código para reclamar tu premio
                        </p>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                        <p className="text-xs text-center">
                            Se descontarán <strong>{selectedPrize.points} puntos</strong> de tu saldo actual ({userPoints} pts)
                        </p>
                    </div>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="flex-1"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="flex-1 bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white"
                    >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Confirmar Canje
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
