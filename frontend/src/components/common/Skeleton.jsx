export function Skeleton({ className }) {
    return (
        <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
    );
}

export function RestaurantSkeleton() {
    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden flex flex-col h-full shadow-sm">
            <Skeleton className="h-64 w-full rounded-none" />
            <div className="p-9 space-y-5">
                <Skeleton className="h-5 w-20 rounded-lg" />
                <Skeleton className="h-10 w-3/4 rounded-xl" />
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-5/6 rounded-lg" />
                <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                    <Skeleton className="h-5 w-24 rounded-lg" />
                    <Skeleton className="h-5 w-16 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

export function FoodSkeleton() {
    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden flex flex-col h-full shadow-sm">
            <Skeleton className="h-56 w-full rounded-none" />
            <div className="p-9 space-y-5">
                <Skeleton className="h-4 w-14 rounded-lg" />
                <Skeleton className="h-8 w-3/4 rounded-xl" />
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
        </div>
    );
}
