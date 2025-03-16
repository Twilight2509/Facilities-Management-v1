import AccountAnalysist from "./AccountAnalysist";
import AmountFacilitateAnalysist from "./AmountFacilitateAnalysist";
import AmountRoleAnalysist from "./AmountRoleAnalysist";
import BookingAnalysist from "./BookingAnalysist";
import TableVoted from "./TableVoted";

export default function Analysist() {
  return (
    <div className="mt-5 ml-2 mb-28">
      <div className="flex gap-2 mb-5">
        <AmountFacilitateAnalysist />
        <AmountRoleAnalysist />
      </div>
      <div>
        <BookingAnalysist />
        {/* <AccountAnalysist /> */}
      </div>
      <div className="mt-16 flex flex-col gap-16">
        <TableVoted />
      </div>
    </div>
  );
}
