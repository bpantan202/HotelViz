import { RoomType } from "../../interface";

export default function RoomTypeInfo({
  roomType,
}: {
  roomType: RoomType[];
}) {
  return (
    <div className="">
      <table className="border-collapse border border-slate-400 w-full mt-5">
        <thead>
          <tr className="bg-sky-700">
            <th className="border border-slate-300 w-[70%] text-left pl-2 text-white font-normal">
              Room Type
            </th>
            <th className="border border-slate-300 w-[300%] text-white text-left pl-2 font-normal">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {roomType.map((RoomTypeProp) => (
            <tr>
              <td className="border border-slate-300 text-left p-2 font-normal">
                {RoomTypeProp.key}
              </td>
              <td className="border border-slate-300 text-left p-2 text-orange-500 font-normal">
                {RoomTypeProp.price} THB
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
