import { Promotion } from "@/app/lib/models";

export default async function Promobar({
  promotion,
}: {
  promotion: Promotion;
}) {
  return (
    <div className="bg-gray-800 w-full ">
      {promotion?.active ? (
        <span className="text-white">{promotion?.description} </span>
      ) : (
        <></>
      )}
    </div>
  );
}
