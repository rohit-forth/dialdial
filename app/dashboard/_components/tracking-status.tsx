import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Tracking() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="space-y-0 py-5 sm:flex-row">
                <CardTitle>Call tracking status</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <div className="space-y-8 pb-4">
                    <div className="flex justify-between border py-3 px-4 rounded-lg items-center">
                        <span><Icons.CallIcon1 /></span>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm grey font-medium leading-none">Completed</p>
                            <p className="ml-auto  text-2xl font-semibold">57</p>
                        </div>
                    </div>
                    <div className="flex justify-between border py-3 px-4 rounded-lg items-center">
                        <span><Icons.CallIcon2 /></span>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm  grey font-medium leading-none">Voicemail</p>
                            <p className="ml-auto text-2xl font-semibold">24</p>
                        </div>
                    </div>
                    <div className="flex justify-between border py-3 px-4 rounded-lg items-center">
                        <span><Icons.CallIcon3 /></span>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm grey font-medium leading-none">No answer</p>
                            <p className="ml-auto text-2xl font-semibold">12</p>
                        </div>
                    </div>


                </div>
            </CardContent>

        </Card >
    );
}
