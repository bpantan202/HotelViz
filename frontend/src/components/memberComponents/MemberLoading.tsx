export default function MemberLoading() {
 return   (
    <div className="flex border border-gray-300 w-full min-w-[450px] h-[200px] rounded-xl bg-white shadow-md">
    <div className='ml-[30px] mr-[10px] my-[25px]'>
        <div className='w-[150px] h-[150px] rounded-full bg-gray-200 animate-pulse'></div>
    </div>

    <div className='m-8 w-full'>
        <div className='w-auto h-10 bg-gray-200 rounded animate-pulse'></div>
        <hr className='my-3'/>
        <div className='w-auto h-6 bg-gray-200 rounded animate-pulse'></div>
        <div className='mt-2 w-auto h-6 bg-gray-200 rounded animate-pulse'></div>
    </div>
    </div>
    )
}
