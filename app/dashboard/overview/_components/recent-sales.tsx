import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        {/* <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar> */}
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">UI/UX Designer</p>
        </div>
        <div className="ml-auto font-medium">15</div>
      </div>



      <div className="flex items-center">
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Remote</p>
        </div>
        <div className="ml-auto font-medium">13</div>
      </div>
      <div className="flex items-center">
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Work From Office</p>
        </div>
        <div className="ml-auto font-medium">9</div>
      </div>
      <div className="flex items-center">
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Canberra</p>
        </div>
        <div className="ml-auto font-medium">7</div>
      </div>
    </div>
  );
}
