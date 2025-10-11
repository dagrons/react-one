import { PersonaTag } from "@/data/userProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Sparkle } from "lucide-react";

interface PersonaTagCloudProps {
    categories: PersonaTag[];
    className?: string;
}

const PersonaTagCloud = ({ categories, className }: PersonaTagCloudProps) => {
    return (
        <Card className={cn("border-slate-800/60 bg-slate-950/90 text-slate-100", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div>
                    <CardTitle className="text-lg font-semibold text-white">画像标签矩阵</CardTitle>
                    <p className="text-xs text-slate-400">
                        自动挖掘的画像标签，依据强度值排列，可快速把握用户行为特点
                    </p>
                </div>
                <Sparkle className="h-5 w-5 text-sky-400" />
            </CardHeader>
            <CardContent className="space-y-4">
                {categories.map((category) => (
                    <div key={category.category} className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4">
                        <p className="text-sm font-semibold text-white">{category.category}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {category.tags.map((tag) => (
                                <span
                                    key={tag.label}
                                    className={cn(
                                        "relative flex flex-col rounded-xl border px-4 py-3 text-left text-sm transition",
                                        "border-slate-700/60 bg-slate-950/60 hover:border-sky-500/60 hover:bg-slate-900/60"
                                    )}
                                >
                                    <span className="font-semibold text-slate-100">{tag.label}</span>
                                    <span className="text-xs text-slate-400">{tag.description}</span>
                                    <IntensityBar intensity={tag.intensity} />
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

const IntensityBar = ({ intensity }: { intensity: number }) => {
    const percent = Math.round(intensity * 100);
    return (
        <div className="mt-3 h-1.5 w-40 overflow-hidden rounded-full bg-slate-800">
            <div
                className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500"
                style={{ width: `${percent}%` }}
            />
        </div>
    );
};

export default PersonaTagCloud;
