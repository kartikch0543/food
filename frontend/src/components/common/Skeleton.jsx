export function Skeleton({ className }) {
    return (
        <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
    );
}

export function RestaurantSkeleton() {
    return (
        <div className="bg-white rounded-[2.5rem] border border-rose-50 overflow-hidden flex flex-col h-full">
            <Skeleton className="h-52 w-full rounded-none" />
            <div className="p-8 space-y-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="pt-4 border-t border-rose-50 flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                </div>
            </div>
        </div>
    );
}

export function FoodSkeleton() {
    return (
        <div className="bg-white rounded-[2.5rem] border border-rose-50 overflow-hidden flex flex-col h-full">
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="p-7 space-y-4">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full rounded-2xl" />
            </div>
        </div>
    );
}
